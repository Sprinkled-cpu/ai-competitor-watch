import asyncio
import sys
from pathlib import Path

# Add backend to sys.path
sys.path.insert(0, str(Path(__file__).parent))

from db import db_client
from agent.pipeline import pipeline_agent
from agent.classifier import StrategicClassifier
from agent.deduplicator import DeduplicationAndNoiseFilter

async def main():
    print("1. Testing DB initialization...")
    await db_client.connect()
    comps = await db_client.get_competitors()
    print(f"   Competitors: {len(comps)} (Active: {sum(1 for c in comps if c.get('active'))})")
    assert len(comps) >= 5, "Expected at least 5 competitors"

    updates = await db_client.get_updates()
    print(f"   Indexed updates: {len(updates)}")
    assert len(updates) > 0, "Expected updates to be populated"

    print("2. Testing Deduplicator & Noise Filter...")
    filter_engine = DeduplicationAndNoiseFilter()
    sample_raw = [
        {"title": "OpenAI announces Operator autonomous agent for web", "raw_summary": "OpenAI unveiled an experimental agent", "competitor_id": "comp-openai", "source": "TechCrunch"},
        {"title": "OpenAI announces Operator autonomous agent for web - VentureBeat", "raw_summary": "OpenAI unveiled an experimental agent for browsers", "competitor_id": "comp-openai", "source": "VentureBeat"},
        {"title": "Top 10 AI stocks to buy now - Motley Fool", "raw_summary": "Stock report for today", "competitor_id": "comp-openai", "source": "Motley Fool"},
    ]
    cleaned, dups_removed = filter_engine.process(sample_raw)
    print(f"   Raw inputs: {len(sample_raw)} -> Cleaned: {len(cleaned)}, Duplicates/Noise removed: {dups_removed}")
    assert len(cleaned) == 1, f"Expected 1 unique article, got {len(cleaned)}"
    assert dups_removed == 2, f"Expected 2 removed (1 noise + 1 dup), got {dups_removed}"

    print("3. Testing Strategic Classifier...")
    classifier = StrategicClassifier()
    enriched = classifier.classify_and_enrich(cleaned[0])
    print(f"   Detected category: {enriched['category']}, Impact score: {enriched['impact_score']}/10")
    print(f"   Strategic takeaway: {enriched['strategic_takeaway']}")
    assert enriched['category'] == "Product"

    print("4. Testing Executive Brief Generation...")
    brief = await db_client.get_latest_brief()
    assert brief is not None, "Expected latest brief"
    print(f"   Brief title: {brief['title']}")
    print(f"   Threat radar count: {len(brief.get('threat_radar', []))}")
    print(f"   Recommendations: {len(brief.get('strategic_recommendations', []))}")

    print("\n>>> ALL TESTS PASSED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    asyncio.run(main())
