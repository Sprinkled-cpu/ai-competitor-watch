import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Flame, Shield, Layers, Copy, Check, TrendingUp, Calendar, Tag, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function UpdateDetailModal({ update, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !update) return null;

  const handleCopy = () => {
    const text = `[${update.category}] ${update.title}\nSource: ${update.source}\nImpact: ${update.impact_score}/10\nTakeaway: ${update.strategic_takeaway}\nURL: ${update.url}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 text-slate-100"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-800 text-cyan-300 border border-slate-700">
                  {update.competitor_name}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-950/60 text-purple-300 border border-purple-500/40">
                  {update.category}
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-rose-950/60 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Impact: {update.impact_score}/10
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100 leading-snug">
                {update.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="py-5 space-y-5 text-sm">
            {/* Raw Summary */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Verified Event Narrative
              </span>
              <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {update.raw_summary}
              </p>
            </div>

            {/* Strategic Implications Card */}
            {update.strategic_takeaway && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-indigo-950/30 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Strategic Consequence & Market Threat</span>
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {update.strategic_takeaway}
                </p>
              </div>
            )}

            {/* Deduplication & Source Syndication Info */}
            {update.duplicate_count > 0 && (
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-2 font-semibold text-amber-400 mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Cross-Outlet Noise Suppression ({update.duplicate_count} syndications)</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  The deduplication agent clustered stories across:{' '}
                  <strong className="text-slate-200 font-normal">
                    {update.similar_sources?.join(', ') || 'multiple newsrooms'}
                  </strong>
                  .
                </p>
              </div>
            )}

            {/* Metadata Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-2">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Published: <strong className="text-slate-200">{formatDate(update.published_at)}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Primary Outlet: <strong className="text-slate-200">{update.source}</strong></span>
              </div>
            </div>

            {/* Tags */}
            {update.tags && update.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {update.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800/80 text-cyan-300 border border-slate-700/60"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Intelligence' : 'Copy Event Summary'}</span>
            </button>

            {update.url && (
              <a
                href={update.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/25"
              >
                <span>Read Original News Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
