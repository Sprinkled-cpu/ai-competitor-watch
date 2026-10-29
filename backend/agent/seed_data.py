from typing import List, Dict, Any
from datetime import datetime, timedelta

# Multi-Industry Presets (Automotive, Food & Beverage, Fintech, Retail, Tech)
INDUSTRY_PRESETS: Dict[str, Dict[str, Any]] = {
    "automotive": {
        "name": "Automotive & Electric Vehicles",
        "description": "Global automakers competing on EV range, pricing wars, autonomous driving, and battery tech.",
        "competitors": [
            {
                "id": "comp-auto-tesla",
                "name": "Tesla",
                "domain": "tesla.com",
                "description": "EV manufacturer and clean energy company leading in Full Self-Driving and supercharger networks.",
                "tags": ["Automotive", "EV", "FSD", "Energy"],
                "keywords": ["Tesla", "Elon Musk", "Cybertruck", "Model Y", "FSD"],
                "active": True
            },
            {
                "id": "comp-auto-byd",
                "name": "BYD",
                "domain": "byd.com",
                "description": "World's largest EV and battery maker, expanding aggressively across Europe, Southeast Asia, and LATAM.",
                "tags": ["Automotive", "Blade Battery", "Global EV", "Affordable EV"],
                "keywords": ["BYD", "Blade Battery", "Seal", "Dolphin", "Wang Chuanfu"],
                "active": True
            },
            {
                "id": "comp-auto-toyota",
                "name": "Toyota",
                "domain": "toyota-global.com",
                "description": "World's highest-volume vehicle producer, dominating hybrids and developing solid-state batteries.",
                "tags": ["Automotive", "Hybrids", "Solid-State Battery", "Global Volume"],
                "keywords": ["Toyota", "Prius", "RAV4", "Koji Sato", "Solid-State"],
                "active": True
            },
            {
                "id": "comp-auto-rivian",
                "name": "Rivian",
                "domain": "rivian.com",
                "description": "Electric adventure truck and commercial delivery van maker partnered with Amazon and Volkswagen.",
                "tags": ["Automotive", "EV Trucks", "Adventure", "Delivery Fleet"],
                "keywords": ["Rivian", "RJ Scaringe", "R1T", "R2", "EDV"],
                "active": True
            },
            {
                "id": "comp-auto-ford",
                "name": "Ford",
                "domain": "ford.com",
                "description": "Legacy American automaker scaling its Ford Pro commercial fleet and F-150 Lightning EV programs.",
                "tags": ["Automotive", "Commercial Fleet", "Trucks", "Hybrid"],
                "keywords": ["Ford", "Jim Farley", "F-150 Lightning", "Mustang Mach-E", "Ford Pro"],
                "active": True
            }
        ]
    },
    "food": {
        "name": "Food, Beverage & Fast Casual (QSR)",
        "description": "Top food & dining brands competing on value menus, digital apps, supply chain, and global franchising.",
        "competitors": [
            {
                "id": "comp-food-mcd",
                "name": "McDonald's",
                "domain": "mcdonalds.com",
                "description": "Global fast food titan famous for the Golden Arches, $5 meal deals, and CosMc's beverage spin-off.",
                "tags": ["QSR", "Fast Food", "Value Meal", "Digital App"],
                "keywords": ["McDonald's", "Chris Kempczinski", "Big Mac", "CosMc", "Value Meal"],
                "active": True
            },
            {
                "id": "comp-food-sbux",
                "name": "Starbucks",
                "domain": "starbucks.com",
                "description": "World's premier coffeehouse chain under Brian Niccol's 'Back to Starbucks' turnaround plan.",
                "tags": ["Beverage", "Coffee", "Retail", "Turnaround"],
                "keywords": ["Starbucks", "Brian Niccol", "Cold Brew", "Frappuccino", "Barista"],
                "active": True
            },
            {
                "id": "comp-food-chipotle",
                "name": "Chipotle",
                "domain": "chipotle.com",
                "description": "Fast casual Mexican grill pioneer known for food with integrity and automated digital makelines.",
                "tags": ["Fast Casual", "Fresh Ingredients", "Automation", "Digital Makeline"],
                "keywords": ["Chipotle", "Scott Boatwright", "Burrito Bowl", "Chipotlane"],
                "active": True
            },
            {
                "id": "comp-food-dominos",
                "name": "Domino's Pizza",
                "domain": "dominos.com",
                "description": "World's leading pizza delivery company with Uber Eats integration and automated supply chain dough hubs.",
                "tags": ["Pizza", "Delivery", "Uber Eats Partnership", "Digital Ordering"],
                "keywords": ["Domino's", "Russell Weiner", "Pizza Delivery", "Emergency Pizza"],
                "active": True
            },
            {
                "id": "comp-food-wendys",
                "name": "Wendy's",
                "domain": "wendys.com",
                "description": "Fresh never frozen hamburger chain competing on breakfast menus and AI drive-thru ordering.",
                "tags": ["QSR", "Burgers", "Breakfast", "Drive-Thru AI"],
                "keywords": ["Wendy's", "Kirk Tanner", "Baconator", "Frosty", "Drive-Thru"],
                "active": True
            }
        ]
    },
    "fintech": {
        "name": "Fintech & Modern Banking",
        "description": "Digital payment leaders, neobanks, and trading infrastructure platforms transforming commerce.",
        "competitors": [
            {
                "id": "comp-fin-stripe",
                "name": "Stripe",
                "domain": "stripe.com",
                "description": "Economic infrastructure for the internet, expanding into global tax, billing, and stablecoin payouts.",
                "tags": ["Fintech", "Payment Gateway", "Stablecoins", "B2B SaaS"],
                "keywords": ["Stripe", "Patrick Collison", "Stripe Billing", "Bridge Acquisition"],
                "active": True
            },
            {
                "id": "comp-fin-revolut",
                "name": "Revolut",
                "domain": "revolut.com",
                "description": "Global financial super-app with 45M+ users, offering multi-currency banking, crypto, and wealth.",
                "tags": ["Neobank", "Super App", "Global Banking", "Wealth"],
                "keywords": ["Revolut", "Nik Storonsky", "Banking License", "FX"],
                "active": True
            },
            {
                "id": "comp-fin-block",
                "name": "Block (Square)",
                "domain": "block.xyz",
                "description": "Jack Dorsey's commerce and payments ecosystem spanning Square merchant POS and Cash App peer-to-peer.",
                "tags": ["POS", "Cash App", "Merchant Services", "Bitcoin"],
                "keywords": ["Block", "Square", "Jack Dorsey", "Cash App", "POS terminal"],
                "active": True
            },
            {
                "id": "comp-fin-robinhood",
                "name": "Robinhood",
                "domain": "robinhood.com",
                "description": "Retail brokerage innovator expanding into credit cards, retirement match, and European crypto trading.",
                "tags": ["Brokerage", "Retail Trading", "Gold Card", "Crypto"],
                "keywords": ["Robinhood", "Vlad Tenev", "Robinhood Gold", "Options"],
                "active": True
            },
            {
                "id": "comp-fin-plaid",
                "name": "Plaid",
                "domain": "plaid.com",
                "description": "Financial data network connecting thousands of fintech applications directly with bank accounts.",
                "tags": ["Open Banking", "API", "Bank Linking", "Identity"],
                "keywords": ["Plaid", "Zach Perret", "Open Banking", "Plaid Transfer"],
                "active": True
            }
        ]
    },
    "retail": {
        "name": "Global Retail & E-Commerce",
        "description": "Omnichannel giants and e-commerce platforms competing on logistics, same-day delivery, and private labels.",
        "competitors": [
            {
                "id": "comp-ret-amazon",
                "name": "Amazon",
                "domain": "amazon.com",
                "description": "E-commerce and cloud infrastructure titan dominating Prime same-day delivery and marketplace ads.",
                "tags": ["E-Commerce", "Prime Logistics", "Marketplace", "Retail Media"],
                "keywords": ["Amazon", "Andy Jassy", "Prime Delivery", "Amazon Haul"],
                "active": True
            },
            {
                "id": "comp-ret-walmart",
                "name": "Walmart",
                "domain": "walmart.com",
                "description": "World's largest retailer by revenue, expanding automated fulfillment centers and Walmart+ subscriptions.",
                "tags": ["Big Box", "Grocery", "Omnichannel", "Walmart Plus"],
                "keywords": ["Walmart", "Doug McMillon", "Walmart+", "Curbside Pickup"],
                "active": True
            },
            {
                "id": "comp-ret-shopify",
                "name": "Shopify",
                "domain": "shopify.com",
                "description": "Commerce platform powering millions of independent merchant storefronts and Shop Pay checkouts.",
                "tags": ["Commerce Platform", "Shop Pay", "Merchant Services", "Enterprise"],
                "keywords": ["Shopify", "Tobi Lutke", "Shop Pay", "Commerce Components"],
                "active": True
            },
            {
                "id": "comp-ret-target",
                "name": "Target",
                "domain": "target.com",
                "description": "Discount department store chain known for curated designer collabs and Drive Up fulfillment.",
                "tags": ["Retail", "Drive Up", "Designer Collabs", "Circle 360"],
                "keywords": ["Target", "Brian Cornell", "Target Circle", "Drive Up"],
                "active": True
            },
            {
                "id": "comp-ret-costco",
                "name": "Costco",
                "domain": "costco.com",
                "description": "Membership warehouse club with industry-leading renewal rates, Kirkland Signature, and bulk buying.",
                "tags": ["Warehouse Club", "Membership", "Bulk Buying", "Kirkland Signature"],
                "keywords": ["Costco", "Ron Vachris", "Kirkland", "Membership Card"],
                "active": True
            }
        ]
    },
    "tech": {
        "name": "AI Frontier & Cloud Hyperscalers",
        "description": "Frontier AI research labs, developer IDEs, and hyperscale cloud infrastructure providers.",
        "competitors": [
            {
                "id": "comp-openai",
                "name": "OpenAI",
                "domain": "openai.com",
                "description": "Creator of ChatGPT, GPT-4o, and o-series reasoning models.",
                "tags": ["Frontier Models", "Consumer AI", "Enterprise API"],
                "keywords": ["OpenAI", "ChatGPT", "GPT-4o", "o1", "Operator"],
                "active": True
            },
            {
                "id": "comp-anthropic",
                "name": "Anthropic",
                "domain": "anthropic.com",
                "description": "AI safety research company behind Claude 3.5 Sonnet and Computer Use.",
                "tags": ["Safety Research", "Enterprise AI", "Coding Models"],
                "keywords": ["Anthropic", "Claude 3.5", "Sonnet", "Computer Use"],
                "active": True
            },
            {
                "id": "comp-cursor",
                "name": "Cursor",
                "domain": "cursor.com",
                "description": "Anysphere's AI-first code editor with tab autocomplete and agent composer.",
                "tags": ["Developer Tools", "AI IDE", "Agentic Coding"],
                "keywords": ["Cursor editor", "Anysphere", "Composer"],
                "active": True
            },
            {
                "id": "comp-perplexity",
                "name": "Perplexity",
                "domain": "perplexity.ai",
                "description": "Conversational AI search engine offering Pro Search and Spaces.",
                "tags": ["AI Search", "Publishing Deals", "Enterprise Search"],
                "keywords": ["Perplexity AI", "Perplexity Pro", "Sonar"],
                "active": True
            },
            {
                "id": "comp-deepmind",
                "name": "Google DeepMind",
                "domain": "deepmind.google",
                "description": "Unified research lab building Gemini 1.5, Project Astra, and AlphaFold.",
                "tags": ["Multimodal", "Science AI", "Autonomous Agents"],
                "keywords": ["Google DeepMind", "Gemini 1.5 Pro", "Project Astra"],
                "active": True
            }
        ]
    }
}

# Default initial competitors: Automotive & Mobility (demonstrates universal non-AI versatility immediately!)
DEFAULT_COMPETITORS: List[Dict[str, Any]] = INDUSTRY_PRESETS["automotive"]["competitors"]

def generate_seed_updates(preset_key: str = "automotive") -> List[Dict[str, Any]]:
    now = datetime.utcnow()
    
    if preset_key == "automotive":
        return [
            {
                "id": "upd-auto-tsla-1",
                "competitor_id": "comp-auto-tesla",
                "competitor_name": "Tesla",
                "title": "Tesla slashes Model Y lease rates by 20% and introduces 0% financing incentive",
                "url": "https://tesla.com/modely",
                "source": "Automotive News",
                "published_at": (now - timedelta(hours=14)).isoformat(),
                "category": "Pricing",
                "impact_score": 9,
                "sentiment": "Disruptive / Threat",
                "raw_summary": "In response to quarterly volume targets, Tesla introduced 0% APR financing on Model Y and Model 3 purchases across the US and China, undercutting legacy electric crossover monthly payments.",
                "strategic_takeaway": "Direct margin warfare: Forces BYD, Ford, and Rivian to either match aggressive loan subsidies or surrender retail showroom traffic.",
                "tags": ["Pricing War", "EV Financing", "Volume"],
                "duplicate_count": 4,
                "similar_sources": ["Reuters", "Bloomberg", "Electrek"],
                "is_featured": True
            },
            {
                "id": "upd-auto-byd-1",
                "competitor_id": "comp-auto-byd",
                "competitor_name": "BYD",
                "title": "BYD announces new $1.3B EV factory in Hungary to bypass European tariff barriers",
                "url": "https://byd.com/press",
                "source": "Financial Times",
                "published_at": (now - timedelta(days=1, hours=6)).isoformat(),
                "category": "Funding & M&A",
                "impact_score": 8,
                "sentiment": "Positive",
                "raw_summary": "BYD officially broke ground on its flagship European passenger vehicle assembly complex in Szeged, Hungary, aiming for an initial annual capacity of 150,000 units.",
                "strategic_takeaway": "Circumvents EU import duties and cements a localized manufacturing foothold inside the European single market.",
                "tags": ["Global Expansion", "Factory", "Europe"],
                "duplicate_count": 5,
                "similar_sources": ["Wall Street Journal", "CNBC", "Reuters"],
                "is_featured": True
            },
            {
                "id": "upd-auto-rivn-1",
                "competitor_id": "comp-auto-rivian",
                "competitor_name": "Rivian",
                "title": "Volkswagen and Rivian finalize $5.8B joint venture for next-gen software architecture",
                "url": "https://rivian.com/news",
                "source": "TechCrunch",
                "published_at": (now - timedelta(days=2)).isoformat(),
                "category": "Partnership",
                "impact_score": 9,
                "sentiment": "Disruptive / Threat",
                "raw_summary": "The Rivian-Volkswagen Group joint venture will co-develop zonal electrical architectures and centralized vehicle operating systems to be utilized in upcoming VW, Audi, Porsche, and Rivian R2 models.",
                "strategic_takeaway": "Provides Rivian with non-dilutive capital runway through profitability while solving Volkswagen's chronic software delays.",
                "tags": ["Joint Venture", "Software Architecture", "Capital Infusion"],
                "duplicate_count": 6,
                "similar_sources": ["The Verge", "Bloomberg", "Associated Press"],
                "is_featured": True
            },
            {
                "id": "upd-auto-toyt-1",
                "competitor_id": "comp-auto-toyota",
                "competitor_name": "Toyota",
                "title": "Toyota certifies solid-state battery manufacturing pilot with 750-mile range target",
                "url": "https://toyota-global.com",
                "source": "Nikkei Asia",
                "published_at": (now - timedelta(days=3)).isoformat(),
                "category": "Research & Tech",
                "impact_score": 8,
                "sentiment": "Positive",
                "raw_summary": "Toyota received Japanese government certification for mass production of next-generation solid-state batteries capable of 10-minute fast charging and 750 miles per charge by 2027.",
                "strategic_takeaway": "Threatens to leapfrog current lithium iron phosphate (LFP) chemistry advantages held by Chinese battery manufacturers.",
                "tags": ["Solid-State", "R&D", "Battery Tech"],
                "duplicate_count": 3,
                "similar_sources": ["Reuters", "Autocar"],
                "is_featured": False
            },
            {
                "id": "upd-auto-ford-1",
                "competitor_id": "comp-auto-ford",
                "competitor_name": "Ford",
                "title": "Ford recruits former Apple hardware engineering director to oversee skunkworks EV team",
                "url": "https://ford.com/media",
                "source": "Detroit Free Press",
                "published_at": (now - timedelta(days=4)).isoformat(),
                "category": "Hiring & Leadership",
                "impact_score": 7,
                "sentiment": "Neutral",
                "raw_summary": "Ford appointed veteran consumer hardware leadership to lead its California-based low-cost electric vehicle skunkworks platform, targeting a $25,000 retail price point.",
                "strategic_takeaway": "Signals urgency in neutralizing BYD and Tesla's sub-$30,000 platform advantages before they capture entry-level buyers.",
                "tags": ["Leadership", "Skunkworks", "Affordable EV"],
                "duplicate_count": 2,
                "similar_sources": ["Automotive News", "CNBC"],
                "is_featured": False
            }
        ]
    
    # Fallback to general seed updates
    return []
