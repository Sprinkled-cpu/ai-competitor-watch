import re
from typing import Dict, Any, List, Tuple
from models import CategoryEnum, SentimentEnum

class StrategicClassifier:
    def __init__(self):
        # Category signature patterns
        self.category_patterns = {
            CategoryEnum.PRICING: [
                r"\b(pricing|price|subscription|cost|tier|plans|per-token|token price|free tier|discount|billing|slashes price|cuts price|rate hike|expensive)\b"
            ],
            CategoryEnum.HIRING: [
                r"\b(hires|hired|appoints|joins|departs|leaves|poaches|talent|executive|vp|ceo|cto|cfo|head of|leadership|board of directors|laid off|layoffs|fired)\b"
            ],
            CategoryEnum.PARTNERSHIP: [
                r"\b(partner|partners|partnership|deal|allies|alliance|collaborates|joint venture|signs with|powers|integration|teams up|supplies)\b"
            ],
            CategoryEnum.FUNDING: [
                r"\b(raises|raised|funding|valuation|series [a-z]|seed round|invests|investment|acquired|acquires|acquisition|merger|ipo|venture)\b"
            ],
            CategoryEnum.TECH: [
                r"\b(research|paper|benchmark|architecture|weights|dataset|open source|safety|latency|throughput|gpu cluster|infra|training run)\b"
            ],
            CategoryEnum.PRODUCT: [
                r"\b(launches|launch|unveils|releases|release|announces|feature|preview|beta|v\d+(\.\d+)?|model|agent|tool|app|desktop|api|rollout|update|capabilities)\b"
            ]
        }

        # Threat and Impact Indicators
        self.high_threat_words = [
            "disrupt", "autonomous agent", "slashes", "undercuts", "surpasses", "beats",
            "benchmark leader", "flagship", "killer", "revolutionary", "all-in-one",
            "open weights", "free", "poaches", "sweeping", "major overhaul"
        ]

    def classify_and_enrich(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Classifies the update, calculates impact score, and generates strategic takeaway."""
        text = f"{article.get('title', '')} {article.get('raw_summary', '')}".lower()

        category = self._detect_category(text)
        impact_score = self._calculate_impact(text, category)
        sentiment = self._detect_sentiment(text, impact_score)
        takeaway = self._generate_takeaway(article, category, impact_score)
        tags = self._extract_tags(text, category)

        article["category"] = category.value
        article["impact_score"] = impact_score
        article["sentiment"] = sentiment.value
        article["strategic_takeaway"] = takeaway
        article["tags"] = tags
        article["is_featured"] = impact_score >= 8

        return article

    def _detect_category(self, text: str) -> CategoryEnum:
        # Check specific categories first before general 'product'
        for cat in [CategoryEnum.PRICING, CategoryEnum.HIRING, CategoryEnum.PARTNERSHIP, CategoryEnum.FUNDING, CategoryEnum.TECH]:
            for pattern in self.category_patterns[cat]:
                if re.search(pattern, text):
                    return cat

        # Check product
        for pattern in self.category_patterns[CategoryEnum.PRODUCT]:
            if re.search(pattern, text):
                return CategoryEnum.PRODUCT

        return CategoryEnum.PRODUCT

    def _calculate_impact(self, text: str, category: CategoryEnum) -> int:
        score = 5 # baseline

        # Category weights
        if category in [CategoryEnum.PRODUCT, CategoryEnum.PRICING]:
            score += 2
        elif category in [CategoryEnum.FUNDING, CategoryEnum.PARTNERSHIP]:
            score += 1

        # High threat keywords
        threat_hits = sum(1 for w in self.high_threat_words if w in text)
        score += min(threat_hits, 3)

        # Scale limit 1-10
        return max(1, min(10, score))

    def _detect_sentiment(self, text: str, impact_score: int) -> SentimentEnum:
        if impact_score >= 8:
            return SentimentEnum.DISRUPTIVE

        negative_words = ["bug", "outage", "flaw", "lawsuit", "sued", "antitrust", "breach", "layoffs", "delay"]
        if any(w in text for w in negative_words):
            return SentimentEnum.NEGATIVE

        positive_words = ["accelerate", "expand", "soar", "gain", "breakthrough", "record", "growth"]
        if any(w in text for w in positive_words):
            return SentimentEnum.POSITIVE

        return SentimentEnum.NEUTRAL

    def _generate_takeaway(self, article: Dict[str, Any], category: CategoryEnum, impact: int) -> str:
        name = article.get("competitor_name", "Competitor")
        title = article.get("title", "")

        if category == CategoryEnum.PRODUCT:
            if impact >= 8:
                return f"High competitive urgency: {name} is attempting to redefine market benchmarks with this release."
            return f"Incremental feature addition by {name}; monitor user adoption and retention velocity."
        
        elif category == CategoryEnum.PRICING:
            return f"Direct margin pressure: {name} is leveraging pricing adjustments to gain market share or squeeze unit economics."
        
        elif category == CategoryEnum.HIRING:
            return f"Talent realignment: Key staffing shift at {name} signals evolving technical and strategic priorities."
        
        elif category == CategoryEnum.PARTNERSHIP:
            return f"Ecosystem expansion: {name} is embedding their stack deeper into enterprise enterprise channels."
        
        elif category == CategoryEnum.FUNDING:
            return f"Capital reinforcement: Gives {name} an extended runway to subsidize compute and aggressive go-to-market."
        
        elif category == CategoryEnum.TECH:
            return f"Underlying technical capability upgrade that may translate to downstream product advantages in 1-2 quarters."
        
        return f"Strategic move by {name} worth tracking in the upcoming intelligence cycle."

    def _extract_tags(self, text: str, category: CategoryEnum) -> List[str]:
        tags = [category.value]
        tag_keywords = {
            "Agent": ["agent", "autonomous", "operator", "composer"],
            "Reasoning": ["reasoning", "o1", "o3", "cot", "thinking"],
            "Multimodal": ["vision", "audio", "video", "multimodal", "image"],
            "Enterprise": ["enterprise", "b2b", "compliance", "security", "vpc"],
            "Open Source": ["open source", "open weight", "weights", "apache"],
            "Compute": ["gpu", "tpu", "cluster", "h100", "datacenter"]
        }
        for tag, kws in tag_keywords.items():
            if any(kw in text for kw in kws):
                tags.append(tag)
        return tags[:4]
