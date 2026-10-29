import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Flame, Shield, Layers, Copy, Check, TrendingUp, Calendar, Tag, Smile, Briefcase } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playPop, playChime } from '../utils/soundEffects';

export default function UpdateDetailModal({ update, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [simpleMode, setSimpleMode] = useState(false); // "Explain Like I'm 10"

  if (!isOpen || !update) return null;

  const handleCopy = () => {
    playChime();
    const text = `[${update.category}] ${update.title}\nSource: ${update.source}\nImpact: ${update.impact_score}/10\nTakeaway: ${update.strategic_takeaway}\nURL: ${update.url}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 35, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const getSimplifiedExplanation = () => {
    switch (update.category) {
      case 'Pricing':
        return `💸 Simple Explanation: ${update.competitor_name} is changing how much their stuff costs (giving discounts or raising prices). If they made it cheaper, customers might rush to them instead of other brands!`;
      case 'Product':
        return `🚀 Simple Explanation: ${update.competitor_name} just released a cool new item or big feature. They are trying to show off and get more people excited to buy from them!`;
      case 'Hiring & Leadership':
        return `👔 Simple Explanation: A big boss or top engineer changed teams at ${update.competitor_name}. This usually means they are planning to build something new or change their game plan!`;
      case 'Partnership':
        return `🤝 Simple Explanation: ${update.competitor_name} teamed up with another famous company. By working together, they can reach millions of new customers faster!`;
      case 'Funding & M&A':
        return `💰 Simple Explanation: ${update.competitor_name} got a massive mountain of cash or bought another company to grow even bigger and faster!`;
      case 'Research & Tech':
        return `🔬 Simple Explanation: Scientists and engineers at ${update.competitor_name} invented a new technology or patent that makes their products better or faster to make!`;
      default:
        return `💡 Simple Explanation: An important update about ${update.competitor_name} that could shake up their market!`;
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Safe external link validator (Security check)
  const isSafeUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'https:' || parsed.protocol === 'http:';
    } catch {
      return false;
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
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  Impact: {update.impact_score}/10
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-100 leading-snug">
                {update.title}
              </h3>
            </div>

            <button
              onClick={() => {
                playPop();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Simple vs Pro Mode Switcher Toggle (User-Friendly feature) */}
          <div className="my-4 p-1.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-slate-400 pl-3">Reading Mode:</span>
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  playPop();
                  setSimpleMode(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                  simpleMode
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smile className="w-3.5 h-3.5 text-emerald-300" />
                <span>👶 Simple Words (Easy)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPop();
                  setSimpleMode(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition-all ${
                  !simpleMode
                    ? 'bg-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                <span>💼 Business Analyst</span>
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-4 text-sm">
            {/* Simple Explanation Callout */}
            {simpleMode ? (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 to-teal-950/40 border border-emerald-500/40 text-emerald-100 leading-relaxed font-medium"
              >
                {getSimplifiedExplanation()}
              </motion.div>
            ) : null}

            {/* Event Summary */}
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                News Summary:
              </span>
              <p className="text-slate-200 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                {update.raw_summary}
              </p>
            </div>

            {/* Strategic Implications Card */}
            {update.strategic_takeaway && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-indigo-950/30 border border-cyan-500/30">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-1">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Strategic Significance:</span>
                </div>
                <p className="text-slate-200 font-medium leading-relaxed">
                  {update.strategic_takeaway}
                </p>
              </div>
            )}

            {/* Deduplication & Source Syndication Info */}
            {update.duplicate_count > 0 && (
              <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/20 text-xs">
                <div className="flex items-center gap-2 font-semibold text-amber-400 mb-1">
                  <Layers className="w-4 h-4" />
                  <span>Noise Cleaned: {update.duplicate_count} Duplicate Articles Filtered</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  We gathered and merged duplicate reports from:{' '}
                  <strong className="text-slate-200 font-normal">
                    {update.similar_sources?.join(', ') || 'multiple newsrooms'}
                  </strong>
                  .
                </p>
              </div>
            )}

            {/* Metadata Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono pt-1">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Date: <strong className="text-slate-200">{formatDate(update.published_at)}</strong></span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Source: <strong className="text-slate-200">{update.source}</strong></span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-5 mt-4 border-t border-slate-800 flex items-center justify-between gap-3 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            {isSafeUrl(update.url) && (
              <a
                href={update.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:from-cyan-400 hover:to-indigo-500 transition-all shadow-lg shadow-cyan-500/25"
              >
                <span>Read Full Article</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
