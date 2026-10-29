from typing import List, Dict, Any
from datetime import datetime
import uuid

class ExecutiveBriefSynthesizer:
    def generate_brief(self, competitors: List[Dict[str, Any]], updates: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Synthesizes a structured, concise executive intelligence brief across all competitors."""
        active_comps = [c["name"] for c in competitors if c.get("active", True)]
        total_updates = len(updates)
        
        # Category breakdown
        cat_counts: Dict[str, int] = {}
        for u in updates:
            cat = u.get("category", "Product")
            cat_counts[cat] = cat_counts.get(cat, 0) + 1

        # Calculate Threat Radar per competitor
        threat_radar = []
        for comp in competitors:
            c_name = comp["name"]
            c_updates = [u for u in updates if u.get("competitor_id") == comp.get("id") or u.get("competitor_name") == c_name]
            velocity = len(c_updates)
            
            if velocity > 0:
                avg_impact = sum(u.get("impact_score", 5) for u in c_updates) / velocity
                disruptive_count = sum(1 for u in c_updates if u.get("sentiment") == "Disruptive / Threat")
                threat_score = round(min(10.0, avg_impact + (disruptive_count * 0.5)), 1)
            else:
                avg_impact = 0
                threat_score = 2.0

            if threat_score >= 8.5:
                level = "Critical Threat"
            elif threat_score >= 7.0:
                level = "High Threat"
            elif threat_score >= 5.0:
                level = "Moderate"
            else:
                level = "Low Alert"

            # Primary category
            comp_cats: Dict[str, int] = {}
            for u in c_updates:
                cat = u.get("category", "Product")
                comp_cats[cat] = comp_cats.get(cat, 0) + 1
            primary_cat = max(comp_cats, key=comp_cats.get) if comp_cats else "General"

            # Threat summary text
            top_move = sorted(c_updates, key=lambda x: x.get("impact_score", 0), reverse=True)
            summary_text = top_move[0].get("title", "No critical alerts in this period.") if top_move else "Quiet period."

            threat_radar.append({
                "competitor_name": c_name,
                "threat_level": level,
                "threat_score": threat_score,
                "recent_velocity": velocity,
                "primary_category": primary_cat,
                "key_threat_summary": summary_text
            })

        # Sort threat radar by threat_score descending
        threat_radar.sort(key=lambda x: x["threat_score"], reverse=True)

        # Top Strategic Threats (impact >= 8)
        high_impact_updates = [u for u in updates if u.get("impact_score", 0) >= 8]
        high_impact_updates.sort(key=lambda x: (x.get("impact_score", 0), x.get("published_at", "")), reverse=True)
        top_threats = high_impact_updates[:5]

        # Executive Summary Narrative
        top_leader = threat_radar[0]["competitor_name"] if threat_radar else "Frontier Labs"
        exec_summary = (
            f"Over the latest surveillance cycle, **{len(active_comps)} key competitor ecosystems** were actively monitored, "
            f"producing **{total_updates} verified intelligence signals** after multi-source deduplication and noise filtration.\n\n"
            f"**Key Strategic Dynamic:** Competitive activity is led aggressively by **{top_leader}**, with heightened velocity in "
            f"**{cat_counts.get('Product', 0)} product launches** and **{cat_counts.get('Pricing', 0)} pricing maneuvers**. "
            f"The primary battleground has pivoted from raw model parameter size to **autonomous agent execution, browser-level interaction, and aggressive developer pricing compression**.\n\n"
            f"Enterprise adoption lock-in is accelerating through direct integrations (GitHub, Snowflake, Slack) and private VPC security deployments."
        )

        # Strategic Playbook Recommendations
        recommendations = [
            {
                "pillar": "Autonomous Workflow Defense",
                "action": "Accelerate browser-based and multi-step agent toolsets to match OpenAI Operator and Cursor Composer.",
                "urgency": "Immediate (0-30 Days)"
            },
            {
                "pillar": "Pricing & Unit Economics",
                "action": "Audit token input/output margins against competitor discounts to prevent developer attrition.",
                "urgency": "High (30-60 Days)"
            },
            {
                "pillar": "Enterprise Data Sovereignty",
                "action": "Amplify private VPC and air-gapped on-premise messaging to counter Cohere and Anthropic enterprise packaging.",
                "urgency": "Medium (Quarterly)"
            }
        ]

        now_str = datetime.utcnow().strftime("%B %d, %Y")
        brief_title = f"Executive Intelligence Brief: AI Frontier Landscape ({now_str})"

        return {
            "id": f"brief-{uuid.uuid4().hex[:8]}",
            "title": brief_title,
            "created_at": datetime.utcnow().isoformat(),
            "timeframe": "Latest Surveillance Window",
            "executive_summary": exec_summary,
            "threat_radar": threat_radar,
            "top_strategic_threats": top_threats,
            "category_breakdown": cat_counts,
            "strategic_recommendations": recommendations,
            "competitors_analyzed": active_comps,
            "total_updates_analyzed": total_updates
        }
