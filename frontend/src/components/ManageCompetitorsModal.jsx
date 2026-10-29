import React, { useState } from 'react';
import { X, Plus, Trash2, Globe, Tag, Sparkles, RotateCcw, Building2, Check } from 'lucide-react';

export default function ManageCompetitorsModal({
  isOpen,
  onClose,
  competitors,
  onAddCompetitor,
  onDeleteCompetitor,
  onResetPreset
}) {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    description: '',
    tags: '',
    keywords: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Company/Product name is required.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const tagsList = formData.tags
        ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : ['AI Target'];
      const keywordsList = formData.keywords
        ? formData.keywords.split(',').map((k) => k.trim()).filter(Boolean)
        : [formData.name.trim()];

      await onAddCompetitor({
        name: formData.name.trim(),
        domain: formData.domain.trim() || undefined,
        description: formData.description.trim() || undefined,
        tags: tagsList,
        keywords: keywordsList,
        active: true,
      });

      setFormData({ name: '', domain: '', description: '', tags: '', keywords: '' });
    } catch (err) {
      setError(err.message || 'Failed to add company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4" />
              <span>Surveillance Target Management</span>
            </div>
            <h3 className="text-xl font-bold text-slate-100">
              Tracked Competitors ({competitors.length}/10)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Quick Loader */}
        <div className="my-5 p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-semibold text-slate-300 block">Default Preset: AI Frontier Labs</span>
            <span className="text-[11px] text-slate-500">Reset to standard 8 frontier companies (OpenAI, Anthropic, Cursor, Perplexity, etc.)</span>
          </div>
          <button
            onClick={onResetPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-colors shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Default Preset</span>
          </button>
        </div>

        {/* Existing Competitors List */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
            Currently Monitored Companies:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-52 overflow-y-auto p-1">
            {competitors.map((comp) => (
              <div
                key={comp.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200 truncate">{comp.name}</span>
                    {comp.domain && (
                      <span className="text-[11px] font-mono text-slate-500 truncate">({comp.domain})</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {comp.tags?.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => onDeleteCompetitor(comp.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors shrink-0"
                  title="Remove target"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add New Competitor Form */}
        <form onSubmit={handleSubmit} className="pt-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-cyan-300">
            <Plus className="w-4 h-4" />
            <span>Add New Competitor Target (Target 5–10)</span>
          </div>

          {error && (
            <div className="p-3 text-xs rounded-lg bg-rose-950/60 text-rose-300 border border-rose-500/50">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Company / Product Name *</label>
              <input
                type="text"
                placeholder="e.g. Cohere or Groq"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Domain (optional)</label>
              <input
                type="text"
                placeholder="e.g. groq.com"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Search Keywords (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Groq, LPU, inference engine"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Tags / Sector</label>
              <input
                type="text"
                placeholder="e.g. Hardware, Inference, Cloud"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Description / Market Focus</label>
            <input
              type="text"
              placeholder="e.g. Fast LPU inference chips and cloud platform"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-slate-100 text-sm focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/20"
            >
              {loading ? 'Adding...' : 'Add to Surveillance Watchlist'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
