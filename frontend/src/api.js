import {
  INDUSTRY_DATA,
  FALLBACK_COMPETITORS,
  FALLBACK_UPDATES,
  FALLBACK_BRIEF,
  FALLBACK_ANALYTICS,
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (window.location.port === '5173' ? '' : 'http://localhost:8000');

// Local in-memory state for standalone Vercel preview fallback
let localCompetitors = [...FALLBACK_COMPETITORS];
let localUpdates = [...FALLBACK_UPDATES];

export async function fetchCompetitors() {
  try {
    const res = await fetch(`${API_BASE}/api/competitors`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  return localCompetitors;
}

export async function addCompetitor(data) {
  try {
    const res = await fetch(`${API_BASE}/api/competitors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  const newComp = { id: `comp-${Date.now()}`, ...data };
  localCompetitors.push(newComp);
  return newComp;
}

export async function deleteCompetitor(id) {
  try {
    const res = await fetch(`${API_BASE}/api/competitors/${id}`, {
      method: 'DELETE',
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback to local
  }
  localCompetitors = localCompetitors.filter((c) => c.id !== id);
  localUpdates = localUpdates.filter((u) => u.competitor_id !== id);
  return { status: 'deleted', id };
}

export async function loadIndustryPreset(presetKey) {
  try {
    const res = await fetch(`${API_BASE}/api/competitors/load-preset/${presetKey}`, {
      method: 'POST',
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const data = INDUSTRY_DATA[presetKey] || INDUSTRY_DATA.automotive;
  localCompetitors = [...data.competitors];
  localUpdates = [...data.updates];
  return { status: 'loaded', preset: data.name, competitors_count: localCompetitors.length };
}

export async function bulkAddCompetitors(companies) {
  try {
    const res = await fetch(`${API_BASE}/api/competitors/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies }),
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  const newComps = companies.map((name, i) => ({
    id: `comp-custom-${Date.now()}-${i}`,
    name,
    domain: `${name.toLowerCase().replace(/\s+/g, '')}.com`,
    description: `Target monitored entity: ${name}`,
    tags: ["Custom Entity", "Active Target"],
    active: true,
  }));
  localCompetitors = [...newComps];
  // Generate sample categorized updates for these custom companies
  localUpdates = newComps.flatMap((c) => [
    {
      id: `upd-${c.id}-1`,
      competitor_id: c.id,
      competitor_name: c.name,
      title: `${c.name} unveils major quarterly product line expansion & operational push`,
      url: `https://${c.domain}`,
      source: "Global Industry Wire",
      published_at: new Date().toISOString(),
      category: "Product",
      impact_score: 8,
      sentiment: "Positive",
      raw_summary: `${c.name} announced a comprehensive operational restructuring and new product rollout targeting cross-market consumer demand.`,
      strategic_takeaway: `Competitive escalation: ${c.name} is accelerating go-to-market cadence to seize category market share.`,
      tags: ["Expansion", "Product", "Strategy"],
      duplicate_count: 3,
      similar_sources: ["Industry Week", "MarketWatch", "Reuters"],
      is_featured: true,
    },
    {
      id: `upd-${c.id}-2`,
      competitor_id: c.id,
      competitor_name: c.name,
      title: `${c.name} slashes subscription and tier pricing in aggressive volume campaign`,
      url: `https://${c.domain}`,
      source: "Commercial Journal",
      published_at: new Date(Date.now() - 3600 * 1000 * 18).toISOString(),
      category: "Pricing",
      impact_score: 9,
      sentiment: "Disruptive / Threat",
      raw_summary: `In a direct bid to undercut rival offerings, ${c.name} introduced discounted pricing tiers across retail and commercial accounts.`,
      strategic_takeaway: `Margin pressure alert: Directly attacks pricing power of direct competitors in the same vertical.`,
      tags: ["Pricing", "Discounts", "Market Share"],
      duplicate_count: 2,
      similar_sources: ["Bloomberg", "Financial Times"],
      is_featured: true,
    }
  ]);
  return { status: 'created', added_count: newComps.length, competitors: newComps };
}

export async function resetPreset() {
  try {
    const res = await fetch(`${API_BASE}/api/competitors/reset-preset`, {
      method: 'POST',
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  localCompetitors = [...FALLBACK_COMPETITORS];
  localUpdates = [...FALLBACK_UPDATES];
  return { status: 'reset', count: localCompetitors.length };
}

export async function triggerScan() {
  try {
    const res = await fetch(`${API_BASE}/api/scan`, {
      method: 'POST',
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return { status: 'started', message: 'Simulated client sweep active' };
}

export async function getScanStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/scan/status`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return {
    is_running: false,
    progress: 100,
    current_step: 'Surveillance Active (Realtime)',
    logs: [
      { timestamp: '11:15:00', step: 'Ingestion', message: 'Surveillance telemetry active across 8 targets.', level: 'success' },
      { timestamp: '11:15:02', step: 'Deduplicator', message: 'Cleaned 28 syndicated duplicates across newsrooms.', level: 'info' },
      { timestamp: '11:15:04', step: 'Classifier', message: 'Categorized 12 moves into Product, Pricing & Deals.', level: 'success' },
    ],
    duplicates_removed: 28,
    updates_saved: localUpdates.length,
  };
}

export async function fetchUpdates({ competitor_id, category, min_impact = 1, search = '', limit = 100 } = {}) {
  try {
    const params = new URLSearchParams();
    if (competitor_id) params.append('competitor_id', competitor_id);
    if (category && category !== 'All') params.append('category', category);
    if (min_impact > 1) params.append('min_impact', min_impact.toString());
    if (search) params.append('search', search);
    params.append('limit', limit.toString());

    const res = await fetch(`${API_BASE}/api/updates?${params.toString()}`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  let results = [...localUpdates];
  if (competitor_id) {
    results = results.filter((u) => u.competitor_id === competitor_id);
  }
  if (category && category !== 'All') {
    results = results.filter((u) => u.category === category);
  }
  if (min_impact > 1) {
    results = results.filter((u) => u.impact_score >= min_impact);
  }
  if (search) {
    const s = search.toLowerCase();
    results = results.filter((u) =>
      u.title?.toLowerCase().includes(s) ||
      u.raw_summary?.toLowerCase().includes(s) ||
      u.competitor_name?.toLowerCase().includes(s)
    );
  }
  return results.slice(0, limit);
}

export async function fetchLatestBrief() {
  try {
    const res = await fetch(`${API_BASE}/api/briefs/latest`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }

  // Dynamically tailor the brief and threat radar to whichever competitors are currently loaded
  const threats = ["Critical", "High", "Medium", "Moderate"];
  const velocities = [9.4, 8.8, 8.1, 7.5, 9.1, 8.3, 7.9, 8.6];
  const focuses = [
    "Product & Distribution Expansion",
    "Aggressive Pricing Recalibration",
    "Strategic Channel Partnerships",
    "R&D & High-Value Talent Acquisition",
    "Global Market Entry & Moat Building"
  ];

  const radar = localCompetitors.map((c, i) => ({
    competitor_name: c.name,
    velocity_score: velocities[i % velocities.length],
    threat_level: threats[i % threats.length],
    primary_focus: focuses[i % focuses.length],
    key_signal: `${c.name} accelerates operational velocity with high-priority product updates.`,
  }));

  return {
    ...FALLBACK_BRIEF,
    id: `brief-${Date.now()}`,
    competitors_analyzed: localCompetitors.map((c) => c.name),
    total_updates_analyzed: localUpdates.length,
    threat_radar: radar.length > 0 ? radar : FALLBACK_BRIEF.threat_radar,
  };
}

export async function generateBrief() {
  try {
    const res = await fetch(`${API_BASE}/api/briefs/generate`, {
      method: 'POST',
      signal: AbortSignal.timeout(2500),
    });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return FALLBACK_BRIEF;
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(`${API_BASE}/api/analytics`, { signal: AbortSignal.timeout(2500) });
    if (res.ok) return await res.json();
  } catch {
    // Fallback
  }
  return {
    ...FALLBACK_ANALYTICS,
    total_competitors: localCompetitors.length,
    active_competitors: localCompetitors.filter((c) => c.active).length,
    total_updates: localUpdates.length,
  };
}

export function getExportMarkdownUrl(briefId) {
  return `${API_BASE}/api/briefs/${briefId}/export/markdown`;
}
