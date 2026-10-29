const API_BASE = import.meta.env.VITE_API_URL !== undefined 
  ? import.meta.env.VITE_API_URL 
  : (window.location.port === '5173' ? '' : 'http://localhost:8000');

export async function fetchCompetitors() {
  const res = await fetch(`${API_BASE}/api/competitors`);
  if (!res.ok) throw new Error('Failed to fetch competitors');
  return res.json();
}

export async function addCompetitor(data) {
  const res = await fetch(`${API_BASE}/api/competitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create competitor');
  return res.json();
}

export async function deleteCompetitor(id) {
  const res = await fetch(`${API_BASE}/api/competitors/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete competitor');
  return res.json();
}

export async function resetPreset() {
  const res = await fetch(`${API_BASE}/api/competitors/reset-preset`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to reset preset');
  return res.json();
}

export async function triggerScan() {
  const res = await fetch(`${API_BASE}/api/scan`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to trigger scan');
  return res.json();
}

export async function getScanStatus() {
  const res = await fetch(`${API_BASE}/api/scan/status`);
  if (!res.ok) throw new Error('Failed to get scan status');
  return res.json();
}

export async function fetchUpdates({ competitor_id, category, min_impact = 1, search = '', limit = 100 } = {}) {
  const params = new URLSearchParams();
  if (competitor_id) params.append('competitor_id', competitor_id);
  if (category && category !== 'All') params.append('category', category);
  if (min_impact > 1) params.append('min_impact', min_impact.toString());
  if (search) params.append('search', search);
  params.append('limit', limit.toString());

  const res = await fetch(`${API_BASE}/api/updates?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch updates');
  return res.json();
}

export async function fetchLatestBrief() {
  const res = await fetch(`${API_BASE}/api/briefs/latest`);
  if (!res.ok) throw new Error('Failed to fetch latest brief');
  return res.json();
}

export async function generateBrief() {
  const res = await fetch(`${API_BASE}/api/briefs/generate`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to generate brief');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/api/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export function getExportMarkdownUrl(briefId) {
  return `${API_BASE}/api/briefs/${briefId}/export/markdown`;
}
