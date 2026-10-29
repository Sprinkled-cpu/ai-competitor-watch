import re
from typing import List, Dict, Any, Tuple
import hashlib
from config import DEDUPLICATION_SIMILARITY_THRESHOLD

class DeduplicationAndNoiseFilter:
    def __init__(self, threshold: float = DEDUPLICATION_SIMILARITY_THRESHOLD):
        self.threshold = threshold
        self.noise_keywords = [
            "stock price", "shares rise", "shares drop", "shares fall", "target price raised",
            "stock report", "zacks investment", "motley fool", "investorplace",
            "top 10 gifts", "buy or sell", "dividend yield", "nasdaq:", "nyse:",
            "price target", "technical analysis", "is it a buy?", "earnings preview",
            "crypto price", "meme coin", "horoscope", "lottery"
        ]
        self.stop_words = {
            "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with",
            "by", "from", "up", "about", "into", "over", "after", "is", "are", "was", "were",
            "be", "been", "being", "have", "has", "had", "do", "does", "did", "this", "that",
            "these", "those", "it", "its", "new", "how", "what", "why", "when", "where"
        }

    def is_noise(self, article: Dict[str, Any]) -> Tuple[bool, str]:
        title = article.get("title", "").lower()
        summary = article.get("raw_summary", "").lower()
        combined = f"{title} {summary}"

        # 1. Headline too short or meaningless
        if len(title.split()) < 4:
            return True, "Headline too short"

        # 2. Financial bot / ticker spam detection
        for kw in self.noise_keywords:
            if kw in combined:
                return True, f"Filtered financial/stock bot noise: '{kw}'"

        # 3. Listicles with minimal substance
        if re.search(r"^\d+\s+(best|top|ways|reasons|stocks)\b", title):
            return True, "Filtered generic listicle"

        return False, "Legitimate update"

    def _normalize_title(self, text: str) -> str:
        text = text.lower()
        # Remove publisher names commonly appended
        text = re.sub(r"\s*[-|–—]\s*([a-z0-9\s]+)$", "", text)
        # Remove punctuation
        text = re.sub(r"[^\w\s]", " ", text)
        return " ".join(text.split())

    def _get_tokens(self, text: str) -> set:
        normalized = self._normalize_title(text)
        words = [w for w in normalized.split() if w not in self.stop_words and len(w) > 2]
        return set(words)

    def _compute_jaccard_similarity(self, tokens_a: set, tokens_b: set) -> float:
        if not tokens_a or not tokens_b:
            return 0.0
        intersection = len(tokens_a.intersection(tokens_b))
        union = len(tokens_a.union(tokens_b))
        return intersection / union if union > 0 else 0.0

    def process(self, raw_articles: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], int]:
        """
        Removes noisy articles and consolidates duplicate stories across different media outlets.
        Returns (clean_articles, duplicates_removed_count).
        """
        valid_articles: List[Dict[str, Any]] = []
        noise_count = 0

        # Step 1: Filter noise
        for art in raw_articles:
            noise, reason = self.is_noise(art)
            if not noise:
                valid_articles.append(art)
            else:
                noise_count += 1

        # Step 2: Semantic cluster & deduplicate
        unique_stories: List[Dict[str, Any]] = []
        duplicates_removed = 0

        for art in valid_articles:
            art_tokens = self._get_tokens(art.get("title", ""))
            is_dup = False

            for existing in unique_stories:
                # Same competitor
                if existing.get("competitor_id") == art.get("competitor_id"):
                    existing_tokens = self._get_tokens(existing.get("title", ""))
                    sim = self._compute_jaccard_similarity(art_tokens, existing_tokens)
                    
                    if sim >= self.threshold:
                        is_dup = True
                        duplicates_removed += 1
                        existing["duplicate_count"] = existing.get("duplicate_count", 0) + 1
                        source = art.get("source", "Unknown")
                        if source not in existing.get("similar_sources", []):
                            existing.setdefault("similar_sources", []).append(source)
                        
                        # Keep richer summary if available
                        if len(art.get("raw_summary", "")) > len(existing.get("raw_summary", "")):
                            existing["raw_summary"] = art.get("raw_summary")
                        break

            if not is_dup:
                art["duplicate_count"] = 0
                art["similar_sources"] = [art.get("source", "Direct")]
                unique_stories.append(art)

        return unique_stories, duplicates_removed + noise_count
