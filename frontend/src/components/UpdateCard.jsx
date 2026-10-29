import React from 'react';
import { ExternalLink, Layers, Sparkles, AlertOctagon, TrendingUp, DollarSign, Users, Handshake, Landmark, Cpu } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export default function UpdateCard({ update }) {
  const getCategoryConfig = (category) => {
    switch (category) {
      case 'Product':
        return {
          icon: Sparkles,
          badge: 'bg-purple-950/50 text-purple-300 border-purple-500/40',
          spotlight: 'rgba(168, 85, 247, 0.15)',
          border: 'rgba(168, 85, 247, 0.3)',
        };
      case 'Pricing':
        return {
          icon: DollarSign,
          badge: 'bg-emerald-950/50 text-emerald-300 border-emerald-500/40',
          spotlight: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.3)',
        };
      case 'Hiring & Leadership':
        return {
          icon: Users,
          badge: 'bg-blue-950/50 text-blue-300 border-blue-500/40',
          spotlight: 'rgba(59, 130, 246, 0.15)',
          border: 'rgba(59, 130, 246, 0.3)',
        };
      case 'Partnership':
        return {
          icon: Handshake,
          badge: 'bg-amber-950/50 text-amber-300 border-amber-500/40',
          spotlight: 'rgba(245, 158, 11, 0.15)',
          border: 'rgba(245, 158, 11, 0.3)',
        };
      case 'Funding & M&A':
        return {
          icon: Landmark,
          badge: 'bg-rose-950/50 text-rose-300 border-rose-500/40',
          spotlight: 'rgba(244, 63, 94, 0.15)',
          border: 'rgba(244, 63, 94, 0.3)',
        };
      case 'Research & Tech':
        return {
          icon: Cpu,
          badge: 'bg-cyan-950/50 text-cyan-300 border-cyan-500/40',
          spotlight: 'rgba(6, 182, 212, 0.15)',
          border: 'rgba(6, 182, 212, 0.3)',
        };
      default:
        return {
          icon: Layers,
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          spotlight: 'rgba(148, 163, 184, 0.15)',
          border: 'rgba(148, 163, 184, 0.3)',
        };
    }
  };

  const catConfig = getCategoryConfig(update.category);
  const CategoryIcon = catConfig.icon;

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <SpotlightCard
      spotlightColor={catConfig.spotlight}
      borderColor={catConfig.border}
      className="flex flex-col justify-between h-full group hover:-translate-y-1 transition-all duration-300"
    >
      <div>
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Competitor Name Pill */}
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800/90 text-cyan-300 border border-slate-700 font-mono">
              {update.competitor_name}
            </span>

            {/* Category Pill */}
            <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${catConfig.badge}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              <span>{update.category}</span>
            </span>
          </div>

          {/* Strategic Impact Rating */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-slate-500 font-mono">Impact:</span>
            <div
              className={`flex items-center px-2 py-0.5 rounded-full text-xs font-bold font-mono border ${
                update.impact_score >= 8
                  ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                  : update.impact_score >= 6
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                  : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
              }`}
            >
              {update.impact_score}/10
            </div>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-100 group-hover:text-cyan-200 transition-colors mb-2.5 leading-snug">
          {update.title}
        </h4>

        {/* Raw Summary */}
        <p className="text-xs text-slate-300/90 leading-relaxed mb-3.5 line-clamp-3">
          {update.raw_summary}
        </p>

        {/* Strategic Significance / Executive Takeaway Box */}
        {update.strategic_takeaway && (
          <div className="rounded-xl p-3 bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-slate-800/90 mb-3.5 relative overflow-hidden">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 uppercase tracking-wider mb-1 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>Strategic Implication</span>
            </div>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              {update.strategic_takeaway}
            </p>
          </div>
        )}

        {/* Deduplication & Source Merger Pill */}
        {update.duplicate_count > 0 && (
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 bg-amber-950/30 border border-amber-500/20 px-2.5 py-1 rounded-lg mb-3">
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              Merged {update.duplicate_count} syndicated stories from{' '}
              {update.similar_sources?.slice(0, 3).join(', ') || 'various outlets'}
            </span>
          </div>
        )}

        {/* Tags */}
        {update.tags && update.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {update.tags.map((tag, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/60 text-slate-400 border border-slate-700/50">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer bar */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 mt-2">
        <span className="truncate max-w-[180px] text-slate-500 font-mono">
          Via: <strong className="text-slate-300 font-normal">{update.source}</strong>
        </span>

        <div className="flex items-center gap-3">
          <span className="font-mono text-slate-500">{formatDate(update.published_at)}</span>
          {update.url && (
            <a
              href={update.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950/60 text-slate-400 hover:text-cyan-300 transition-colors border border-slate-700/60"
              title="Open verified source"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
}
