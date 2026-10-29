import re
from typing import Dict, Any, List, Tuple
from models import CategoryEnum, SentimentEnum

class StrategicClassifier:
    def __init__(self):
        # Universal cross-industry category signature patterns
        self.category_patterns = {
            CategoryEnum.PRICING: [
                r"\b(pricing|price|prices|subscription|cost|costs|tier|plans|discount|discounts|value meal|rate hike|expensive|cheap|fare|tariff|billing|fee|fees|margin|slashes price|cuts price|rebate)\b"
            ],
            CategoryEnum.HIRING: [
                r"\b(hires|hired|appoints|appointed|joins|joined|departs|departed|leaves|left|poaches|poached|talent|executive|vp|ceo|cto|cfo|coo|head of|leadership|board of directors|laid off|layoffs|fired|steps down|union|strike)\b"
            ],
            CategoryEnum.PARTNERSHIP: [
                r"\b(partner|partners|partnership|deal|allies|alliance|collaborates|joint venture|signs with|powers|integration|teams up|supplies|supplier|sponsorship|distribution|franchise|cobrand)\b"
            ],
            CategoryEnum.FUNDING: [
                r"\b(raises|raised|funding|valuation|series [a-z]|seed round|invests|investment|investments|acquired|acquires|acquisition|merger|ipo|venture|buyout|takeover|capital expenditure|factory expansion)\b"
            ],
            CategoryEnum.TECH: [
                r"\b(patent|patents|research|clinical trial|battery|drivetrain|architecture|r&d|lab|formula|recipe|automation|robotics|efficiency|safety testing|prototype|breakthrough)\b"
            ],
            CategoryEnum.PRODUCT: [
                r"\b(launches|launch|unveils|unveiled|releases|release|announces|announced|feature|features|model|vehicle|car|menu|drink|beverage|shoe|sneaker|collection|app|hardware|rollout|update|capabilities)\b"
            ]
        }

        # Universal High-Threat / Disruptive trigger words across all industries
        self.high_threat_words = [
            "disrupt", "undercuts", "slashes", "surpasses", "beats", "record",
            "flagship", "expansion", "poaches", "sweeping", "major overhaul",
            "first ever", "game changer", "breakthrough", "price war", "all-new"
        ]

    def classify_and_enrich(self, article: Dict[str, Any]) -> Dict[str, Any]:
        """Classifies the update across any industry, calculates impact score, and generates strategic takeaway."""
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
        # Check specific business actions first
        for cat in [CategoryEnum.PRICING, CategoryEnum.HIRING, CategoryEnum.PARTNERSHIP, CategoryEnum.FUNDING, CategoryEnum.TECH]:
            for pattern in self.category_patterns[cat]:
                if re.search(pattern, text):
                    return cat

        # Check product launches
        for pattern in self.category_patterns[CategoryEnum.PRODUCT]:
            if re.search(pattern, text):
                return CategoryEnum.PRODUCT

        return CategoryEnum.PRODUCT

    def _calculate_impact(self, text: str, category: CategoryEnum) -> int:
        score = 5 # baseline

        # Category impact weights
        if category in [CategoryEnum.PRODUCT, CategoryEnum.PRICING]:
            score += 2
        elif category in [CategoryEnum.FUNDING, CategoryEnum.PARTNERSHIP]:
            score += 1

        # Threat triggers
        threat_hits = sum(1 for w in self.high_threat_words if w in text)
        score += min(threat_hits, 3)

        # Bounds: 1-10
        return max(1, min(10, score))

    def _detect_sentiment(self, text: str, impact_score: int) -> SentimentEnum:
        if impact_score >= 8:
            return SentimentEnum.DISRUPTIVE

        negative_words = ["recall", "outage", "flaw", "lawsuit", "sued", "antitrust", "strike", "layoffs", "delay", "slump", "loss"]
        if any(w in text for w in negative_words):
            return SentimentEnum.NEGATIVE

        positive_words = ["surge", "record", "profit", "expansion", "growth", "soar", "gain", "breakthrough", "leader"]
        if any(w in text for w in positive_words):
            return SentimentEnum.POSITIVE

        return SentimentEnum.NEUTRAL

    def _generate_takeaway(self, article: Dict[str, Any], category: CategoryEnum, impact: int) -> str:
        name = article.get("competitor_name", "Target Competitor")

        if category == CategoryEnum.PRODUCT:
            if impact >= 8:
                return f"Market Share Attack: {name} is rolling out a flagship offering designed to aggressively capture consumer mindshare."
            return f"Portfolio Expansion: Incremental product rollout by {name}; track customer reception and shelf velocity."
        
        elif category == CategoryEnum.PRICING:
            return f"Margin & Volume Play: {name} is actively testing price elasticity, putting direct pricing pressure on category rivals."
        
        elif category == CategoryEnum.HIRING:
            return f"Operational Strategy Shift: Key executive movement at {name} signals an impending organizational or regional pivot."
        
        elif category == CategoryEnum.PARTNERSHIP:
            return f"Channel Moat Expansion: {name} is securing critical distribution or supplier channels to box out direct rivals."
        
        elif category == CategoryEnum.FUNDING:
            return f"Capital War Chest: Extends {name}'s balance sheet runway for aggressive regional or factory expansion."
        
        elif category == CategoryEnum.TECH:
            return f"R&D & Patent Advantage: Underlying technological or formulation upgrade that enhances efficiency and cost structure."
        
        return f"Strategic move by {name} worth tracking in the current competitive intelligence cycle."

    def _extract_tags(self, text: str, category: CategoryEnum) -> List[str]:
        tags = [category.value]
        tag_keywords = {
            "Expansion": ["expansion", "global", "stores", "regional", "factory"],
            "Digital": ["app", "digital", "online", "ecommerce", "software"],
            "Cost": ["discount", "price cut", "margin", "inflation", "cost"],
            "Executive": ["ceo", "coo", "vp", "leader", "board"],
            "Supply Chain": ["supply", "supplier", "logistics", "distribution", "inventory"],
            "Enterprise": ["enterprise", "b2b", "commercial", "contract"]
        }
        for tag, kws in tag_keywords.items():
            if any(kw in text for kw in kws):
                tags.append(tag)
        return tags[:4]
