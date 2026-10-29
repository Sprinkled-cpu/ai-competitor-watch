from contextlib import asynccontextmanager
import asyncio
from fastapi import FastAPI, HTTPException, Query, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse, JSONResponse
from typing import Optional, List, Dict, Any
import logging

from models import Competitor, CompetitorUpdate, ExecutiveBrief, ScanStatus
from db import db_client
from agent.pipeline import pipeline_agent
from agent.seed_data import DEFAULT_COMPETITORS

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("CompetitorWatch.API")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Competitor Watch Storage...")
    await db_client.connect()
    yield
    logger.info("Shutting down Competitor Watch...")

app = FastAPI(
    title="AI Competitor Watch Agent API",
    description="Autonomous competitive intelligence agent that monitors, deduplicates, categorizes, and synthesizes competitor updates.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- Competitor Endpoints -----------------

@app.get("/api/competitors", response_model=List[Competitor])
async def list_competitors():
    return await db_client.get_competitors()

@app.post("/api/competitors", response_model=Competitor)
async def create_competitor(comp: Competitor):
    return await db_client.create_competitor(comp.model_dump())

@app.put("/api/competitors/{comp_id}", response_model=Competitor)
async def update_competitor(comp_id: str, comp_data: Dict[str, Any]):
    existing = await db_client.get_competitor(comp_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Competitor not found")
    existing.update(comp_data)
    return await db_client.create_competitor(existing)

@app.delete("/api/competitors/{comp_id}")
async def delete_competitor(comp_id: str):
    success = await db_client.delete_competitor(comp_id)
    if not success:
        raise HTTPException(status_code=404, detail="Competitor not found")
    return {"status": "deleted", "id": comp_id}

@app.get("/api/presets")
async def list_presets():
    from agent.seed_data import INDUSTRY_PRESETS
    return {k: {"name": v["name"], "description": v["description"], "count": len(v["competitors"])} for k, v in INDUSTRY_PRESETS.items()}

@app.post("/api/competitors/load-preset/{preset_key}")
async def load_industry_preset(preset_key: str):
    from agent.seed_data import INDUSTRY_PRESETS, generate_seed_updates
    if preset_key not in INDUSTRY_PRESETS:
        raise HTTPException(status_code=404, detail="Preset not found")
    
    preset = INDUSTRY_PRESETS[preset_key]
    await db_client.reset_to_preset(preset["competitors"])
    seed_upd = generate_seed_updates(preset_key)
    for u in seed_upd:
        await db_client.save_update(u)
    
    # Generate executive brief for this preset
    from agent.synthesizer import ExecutiveBriefSynthesizer
    brief = ExecutiveBriefSynthesizer().generate_brief(preset["competitors"], seed_upd)
    await db_client.save_brief(brief)

    return {"status": "loaded", "preset": preset["name"], "competitors_count": len(preset["competitors"])}

@app.post("/api/competitors/bulk")
async def bulk_add_competitors(payload: Dict[str, Any]):
    """Accepts any list of 5-10 company names from ANY industry and registers them for surveillance."""
    companies = payload.get("companies", [])
    if not companies:
        raise HTTPException(status_code=400, detail="No companies provided")
    
    import uuid
    new_comps = []
    for c in companies:
        c_name = c.strip() if isinstance(c, str) else c.get("name", "").strip()
        if not c_name:
            continue
        comp_obj = {
            "id": f"comp-{uuid.uuid4().hex[:8]}",
            "name": c_name,
            "domain": f"{c_name.lower().replace(' ', '')}.com",
            "description": f"Target monitored entity: {c_name}",
            "tags": ["Target Entity", "Custom Watchlist"],
            "keywords": [c_name],
            "active": True
        }
        await db_client.create_competitor(comp_obj)
        new_comps.append(comp_obj)
    
    return {"status": "created", "added_count": len(new_comps), "competitors": new_comps}

@app.post("/api/competitors/reset-preset")
async def reset_preset():
    from agent.seed_data import DEFAULT_COMPETITORS, generate_seed_updates
    await db_client.reset_to_preset(DEFAULT_COMPETITORS)
    seed_upd = generate_seed_updates("automotive")
    for u in seed_upd:
        await db_client.save_update(u)
    return {"status": "reset", "competitors_count": len(DEFAULT_COMPETITORS)}

# ----------------- Agent Scan & Pipeline -----------------

@app.post("/api/scan")
async def trigger_scan(background_tasks: BackgroundTasks):
    if pipeline_agent.status.is_running:
        return {"status": "in_progress", "message": "A scan is already underway."}
    
    background_tasks.add_task(pipeline_agent.run_scan)
    return {"status": "started", "message": "Intelligence scan initiated in background."}

@app.get("/api/scan/status", response_model=ScanStatus)
async def get_scan_status():
    return pipeline_agent.status

# ----------------- Updates Feed -----------------

@app.get("/api/updates", response_model=List[CompetitorUpdate])
async def list_updates(
    competitor_id: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    min_impact: int = Query(1, ge=1, le=10),
    search: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=200)
):
    return await db_client.get_updates(
        competitor_id=competitor_id,
        category=category,
        min_impact=min_impact,
        search=search,
        limit=limit
    )

@app.get("/api/categories")
async def get_categories():
    updates = await db_client.get_updates(limit=500)
    counts = {}
    for u in updates:
        cat = u.get("category", "Product")
        counts[cat] = counts.get(cat, 0) + 1
    return counts

# ----------------- Executive Briefs -----------------

@app.get("/api/briefs", response_model=List[ExecutiveBrief])
async def get_briefs():
    return await db_client.get_briefs()

@app.get("/api/briefs/latest")
async def get_latest_brief():
    brief = await db_client.get_latest_brief()
    if not brief:
        # Generate one automatically from current state
        competitors = await db_client.get_competitors()
        updates = await db_client.get_updates(limit=50)
        from agent.synthesizer import ExecutiveBriefSynthesizer
        brief = ExecutiveBriefSynthesizer().generate_brief(competitors, updates)
        await db_client.save_brief(brief)
    return brief

@app.post("/api/briefs/generate")
async def generate_brief_manually():
    competitors = await db_client.get_competitors()
    updates = await db_client.get_updates(limit=100)
    from agent.synthesizer import ExecutiveBriefSynthesizer
    brief = ExecutiveBriefSynthesizer().generate_brief(competitors, updates)
    await db_client.save_brief(brief)
    return brief

@app.get("/api/briefs/{brief_id}/export/markdown")
async def export_brief_markdown(brief_id: str):
    briefs = await db_client.get_briefs()
    target = next((b for b in briefs if b["id"] == brief_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="Brief not found")

    md = f"""# {target.get('title')}
**Generated at:** {target.get('created_at')}  
**Surveillance Scope:** {len(target.get('competitors_analyzed', []))} Competitors | {target.get('total_updates_analyzed', 0)} Updates Analyzed

---

## 1. Executive Summary
{target.get('executive_summary')}

---

## 2. Threat Radar & Competitive Velocity
| Competitor | Threat Level | Threat Score | Recent Velocity | Primary Focus | Key Threat Alert |
| :--- | :--- | :--- | :--- | :--- | :--- |
"""
    for r in target.get("threat_radar", []):
        md += f"| **{r.get('competitor_name')}** | {r.get('threat_level')} | {r.get('threat_score')}/10 | {r.get('recent_velocity')} signals | {r.get('primary_category')} | {r.get('key_threat_summary')} |\n"

    md += "\n---\n\n## 3. High-Priority Tactical Moves\n"
    for t in target.get("top_strategic_threats", []):
        md += f"""### [{t.get('category')}] {t.get('title')} ({t.get('competitor_name')})
- **Impact Rating:** {t.get('impact_score')}/10 | **Sentiment:** {t.get('sentiment')}
- **Source:** {t.get('source')} ({t.get('published_at')[:10]})
- **Summary:** {t.get('raw_summary')}
- **Strategic Significance:** {t.get('strategic_takeaway')}

"""

    md += "\n---\n\n## 4. Recommended Strategic Counter-Measures\n"
    for rec in target.get("strategic_recommendations", []):
        md += f"- **[{rec.get('pillar')}] ({rec.get('urgency')}):** {rec.get('action')}\n"

    return PlainTextResponse(content=md, media_type="text/markdown")

# ----------------- Analytics Overview -----------------

@app.get("/api/analytics")
async def get_analytics():
    competitors = await db_client.get_competitors()
    updates = await db_client.get_updates(limit=200)
    
    total_updates = len(updates)
    category_dist = {}
    sentiment_dist = {}
    high_impact_count = 0
    total_duplicates_filtered = sum(u.get("duplicate_count", 0) for u in updates)

    for u in updates:
        cat = u.get("category", "Product")
        category_dist[cat] = category_dist.get(cat, 0) + 1
        
        sent = u.get("sentiment", "Neutral")
        sentiment_dist[sent] = sentiment_dist.get(sent, 0) + 1
        
        if u.get("impact_score", 0) >= 8:
            high_impact_count += 1

    return {
        "total_competitors": len(competitors),
        "active_competitors": len([c for c in competitors if c.get("active", True)]),
        "total_updates": total_updates,
        "high_impact_signals": high_impact_count,
        "duplicates_suppressed": total_duplicates_filtered,
        "category_distribution": category_dist,
        "sentiment_distribution": sentiment_dist,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
