import json
import logging
from typing import List, Optional, Dict, Any
from pathlib import Path
from datetime import datetime

from config import MONGO_URI, DB_NAME, LOCAL_DB_FILE
from agent.seed_data import DEFAULT_COMPETITORS, generate_seed_updates

logger = logging.getLogger("CompetitorWatch.DB")

class Storage:
    def __init__(self):
        self.use_mongo = False
        self.mongo_client = None
        self.db = None
        self._local_data: Dict[str, Any] = {
            "competitors": [],
            "updates": [],
            "briefs": []
        }

    async def connect(self):
        """Try connecting to MongoDB; if unavailable, fallback gracefully to persistent local JSON file."""
        try:
            from motor.motor_asyncio import AsyncIOMotorClient
            client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=1500)
            # Ping database
            await client.admin.command('ping')
            self.mongo_client = client
            self.db = client[DB_NAME]
            self.use_mongo = True
            logger.info(f"Connected successfully to MongoDB at {MONGO_URI} [{DB_NAME}]")
            await self._init_db()
        except Exception as e:
            self.use_mongo = False
            logger.warning(f"MongoDB not available ({e}). Using persistent local file storage: {LOCAL_DB_FILE}")
            self._load_local_data()
            await self._init_db()

    def _load_local_data(self):
        if LOCAL_DB_FILE.exists():
            try:
                with open(LOCAL_DB_FILE, "r", encoding="utf-8") as f:
                    self._local_data = json.load(f)
            except Exception as e:
                logger.error(f"Error loading local DB file: {e}")
                self._local_data = {"competitors": [], "updates": [], "briefs": []}
        else:
            self._save_local_data()

    def _save_local_data(self):
        try:
            with open(LOCAL_DB_FILE, "w", encoding="utf-8") as f:
                json.dump(self._local_data, f, indent=2, ensure_ascii=False)
        except Exception as e:
            logger.error(f"Error saving local DB file: {e}")

    async def _init_db(self):
        """Seed initial competitors & updates if empty."""
        competitors = await self.get_competitors()
        if not competitors:
            logger.info("Database empty: Seeding default AI competitors...")
            for comp in DEFAULT_COMPETITORS:
                await self.create_competitor(comp)
            
            logger.info("Seeding realistic intelligence updates...")
            seed_updates = generate_seed_updates()
            for upd in seed_updates:
                await self.save_update(upd)

    # Competitor operations
    async def get_competitors(self) -> List[Dict[str, Any]]:
        if self.use_mongo:
            cursor = self.db.competitors.find({}, {"_id": 0})
            return await cursor.to_list(length=100)
        return self._local_data.get("competitors", [])

    async def get_competitor(self, comp_id: str) -> Optional[Dict[str, Any]]:
        if self.use_mongo:
            return await self.db.competitors.find_one({"id": comp_id}, {"_id": 0})
        for c in self._local_data.get("competitors", []):
            if c["id"] == comp_id:
                return c
        return None

    async def create_competitor(self, data: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            await self.db.competitors.update_one({"id": data["id"]}, {"$set": data}, upsert=True)
            return data
        
        existing = [c for c in self._local_data["competitors"] if c["id"] == data["id"]]
        if existing:
            self._local_data["competitors"].remove(existing[0])
        self._local_data["competitors"].append(data)
        self._save_local_data()
        return data

    async def delete_competitor(self, comp_id: str) -> bool:
        if self.use_mongo:
            res = await self.db.competitors.delete_one({"id": comp_id})
            await self.db.updates.delete_many({"competitor_id": comp_id})
            return res.deleted_count > 0
        
        self._local_data["competitors"] = [c for c in self._local_data["competitors"] if c["id"] != comp_id]
        self._local_data["updates"] = [u for u in self._local_data["updates"] if u.get("competitor_id") != comp_id]
        self._save_local_data()
        return True

    # Updates operations
    async def get_updates(
        self,
        competitor_id: Optional[str] = None,
        category: Optional[str] = None,
        min_impact: int = 1,
        search: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        if self.use_mongo:
            query: Dict[str, Any] = {}
            if competitor_id:
                query["competitor_id"] = competitor_id
            if category and category.lower() != "all":
                query["category"] = category
            if min_impact > 1:
                query["impact_score"] = {"$gte": min_impact}
            if search:
                query["$or"] = [
                    {"title": {"$regex": search, "$options": "i"}},
                    {"raw_summary": {"$regex": search, "$options": "i"}},
                    {"competitor_name": {"$regex": search, "$options": "i"}}
                ]
            cursor = self.db.updates.find(query, {"_id": 0}).sort("published_at", -1).limit(limit)
            return await cursor.to_list(length=limit)
        
        results = self._local_data.get("updates", [])
        if competitor_id:
            results = [u for u in results if u.get("competitor_id") == competitor_id]
        if category and category.lower() != "all":
            results = [u for u in results if u.get("category") == category]
        if min_impact > 1:
            results = [u for u in results if u.get("impact_score", 1) >= min_impact]
        if search:
            s = search.lower()
            results = [
                u for u in results
                if s in u.get("title", "").lower() 
                or s in u.get("raw_summary", "").lower() 
                or s in u.get("competitor_name", "").lower()
            ]
        # Sort by published_at desc
        results.sort(key=lambda x: x.get("published_at", ""), reverse=True)
        return results[:limit]

    async def save_update(self, update: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            await self.db.updates.update_one({"id": update["id"]}, {"$set": update}, upsert=True)
            return update
        
        existing = [u for u in self._local_data["updates"] if u["id"] == update["id"]]
        if existing:
            self._local_data["updates"].remove(existing[0])
        self._local_data["updates"].append(update)
        self._save_local_data()
        return update

    # Briefs operations
    async def get_briefs(self, limit: int = 20) -> List[Dict[str, Any]]:
        if self.use_mongo:
            cursor = self.db.briefs.find({}, {"_id": 0}).sort("created_at", -1).limit(limit)
            return await cursor.to_list(length=limit)
        briefs = self._local_data.get("briefs", [])
        briefs.sort(key=lambda x: x.get("created_at", ""), reverse=True)
        return briefs[:limit]

    async def get_latest_brief(self) -> Optional[Dict[str, Any]]:
        briefs = await self.get_briefs(limit=1)
        return briefs[0] if briefs else None

    async def save_brief(self, brief: Dict[str, Any]) -> Dict[str, Any]:
        if self.use_mongo:
            await self.db.briefs.update_one({"id": brief["id"]}, {"$set": brief}, upsert=True)
            return brief
        self._local_data.setdefault("briefs", []).append(brief)
        self._save_local_data()
        return brief

    async def reset_to_preset(self, preset_competitors: List[Dict[str, Any]]):
        """Reset competitor list and repopulate."""
        if self.use_mongo:
            await self.db.competitors.delete_many({})
            await self.db.updates.delete_many({})
            for comp in preset_competitors:
                await self.create_competitor(comp)
        else:
            self._local_data["competitors"] = list(preset_competitors)
            self._local_data["updates"] = []
            self._save_local_data()

db_client = Storage()
