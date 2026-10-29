from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid
from datetime import datetime

class CategoryEnum(str, Enum):
    PRODUCT = "Product"
    PRICING = "Pricing"
    HIRING = "Hiring & Leadership"
    PARTNERSHIP = "Partnership"
    FUNDING = "Funding & M&A"
    TECH = "Research & Tech"

class SentimentEnum(str, Enum):
    POSITIVE = "Positive"
    NEUTRAL = "Neutral"
    NEGATIVE = "Negative"
    DISRUPTIVE = "Disruptive / Threat"

class Competitor(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    domain: Optional[str] = None
    description: Optional[str] = None
    tags: List[str] = Field(default_factory=list)
    keywords: List[str] = Field(default_factory=list)
    logo_url: Optional[str] = None
    active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class CompetitorUpdate(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    competitor_id: str
    competitor_name: str
    title: str
    url: str
    source: str
    published_at: str
    category: CategoryEnum
    impact_score: int = Field(ge=1, le=10, description="1 to 10 strategic impact score")
    sentiment: SentimentEnum
    raw_summary: str
    strategic_takeaway: str
    tags: List[str] = Field(default_factory=list)
    dedupe_hash: Optional[str] = None
    duplicate_count: int = 0
    similar_sources: List[str] = Field(default_factory=list)
    is_featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class ScanLogEntry(BaseModel):
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().strftime("%H:%M:%S"))
    step: str
    message: str
    level: str = "info" # info, success, warning, error

class ScanStatus(BaseModel):
    is_running: bool = False
    progress: int = 0 # 0 - 100
    current_step: str = "Idle"
    current_competitor: Optional[str] = None
    logs: List[ScanLogEntry] = Field(default_factory=list)
    total_scanned: int = 0
    duplicates_removed: int = 0
    updates_saved: int = 0
    last_completed_at: Optional[str] = None

class ThreatRadarItem(BaseModel):
    competitor_name: str
    threat_level: str # Critical, High, Moderate, Low
    threat_score: float # 0 - 10
    recent_velocity: int # number of recent moves
    primary_category: str
    key_threat_summary: str

class ExecutiveBrief(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    timeframe: str = "Past 7-14 Days"
    executive_summary: str
    threat_radar: List[ThreatRadarItem] = Field(default_factory=list)
    top_strategic_threats: List[Dict[str, Any]] = Field(default_factory=list)
    category_breakdown: Dict[str, int] = Field(default_factory=dict)
    strategic_recommendations: List[Dict[str, str]] = Field(default_factory=list)
    competitors_analyzed: List[str] = Field(default_factory=list)
    total_updates_analyzed: int = 0

class CompetitorPreset(BaseModel):
    name: str
    description: str
    competitors: List[Dict[str, Any]]
