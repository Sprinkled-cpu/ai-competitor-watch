import {
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
  return FALLBACK_BRIEF;
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
