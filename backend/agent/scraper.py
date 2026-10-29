import httpx
import feedparser
import urllib.parse
from datetime import datetime
from typing import List, Dict, Any, Optional
import re
import logging
from bs4 import BeautifulSoup
from config import USER_AGENT, REQUEST_TIMEOUT, MAX_ARTICLES_PER_COMPETITOR

logger = logging.getLogger("CompetitorWatch.Scraper")

class LiveUpdateScraper:
    def __init__(self):
        self.headers = {
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5"
        }

    async def fetch_competitor_news(self, competitor: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Fetch raw recent news updates for a given competitor using news RSS and search feeds."""
        name = competitor.get("name", "")
        keywords = competitor.get("keywords", [name])
        articles: List[Dict[str, Any]] = []

        # Build search query targeted for business & tech updates
        search_terms = " OR ".join([f'"{k}"' for k in keywords[:3]])
        query = f'({search_terms}) (AI OR launch OR model OR pricing OR partnership OR funding OR hire)'
        encoded_query = urllib.parse.quote(query)
        
        rss_url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"

        try:
            async with httpx.AsyncClient(timeout=REQUEST_TIMEOUT, follow_redirects=True) as client:
                resp = await client.get(rss_url, headers=self.headers)
                if resp.status_code == 200:
                    feed = feedparser.parse(resp.text)
                    for entry in feed.entries[:MAX_ARTICLES_PER_COMPETITOR]:
                        parsed = self._parse_feed_entry(entry, competitor)
                        if parsed:
                            articles.append(parsed)
        except Exception as e:
            logger.warning(f"Error fetching live RSS for {name}: {e}")

        return articles

    def _parse_feed_entry(self, entry: Any, competitor: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        try:
            title = entry.get("title", "").strip()
            if not title:
                return None

            # Split source from title if format is "Headline - Source Name"
            source = "Web News"
            if " - " in title:
                parts = title.rsplit(" - ", 1)
                title = parts[0].strip()
                source = parts[1].strip()
            elif hasattr(entry, "source") and hasattr(entry.source, "title"):
                source = entry.source.title

            link = entry.get("link", "")
            
            # Extract summary text from html snippet
            summary_html = entry.get("summary", "")
            summary = ""
            if summary_html:
                soup = BeautifulSoup(summary_html, "html.parser")
                summary = soup.get_text(separator=" ").strip()
            if not summary or len(summary) < 20:
                summary = title

            # Published date parsing
            pub_date = datetime.utcnow().isoformat()
            if hasattr(entry, "published_parsed") and entry.published_parsed:
                try:
                    pub_date = datetime(*entry.published_parsed[:6]).isoformat()
                except Exception:
                    pass

            return {
                "competitor_id": competitor.get("id"),
                "competitor_name": competitor.get("name"),
                "title": title,
                "url": link,
                "source": source,
                "published_at": pub_date,
                "raw_summary": summary
            }
        except Exception as ex:
            logger.debug(f"Failed to parse entry: {ex}")
            return None
