import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

# Database
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "competitor_watch")
LOCAL_DB_FILE = DATA_DIR / "storage.json"

# Scan settings
MAX_ARTICLES_PER_COMPETITOR = int(os.getenv("MAX_ARTICLES_PER_COMPETITOR", "12"))
DEDUPLICATION_SIMILARITY_THRESHOLD = float(os.getenv("DEDUPLICATION_THRESHOLD", "0.62"))
REQUEST_TIMEOUT = 12.0
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 CompetitorWatchAgent/1.0"
