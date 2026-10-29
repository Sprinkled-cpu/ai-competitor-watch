import React from 'react';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, Flame, PieChart, Layers, Target } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export default function AnalyticsView({ analytics, threatRadar = [] }) {
  if (!analytics) return null;

  const categories = analytics.category_distribution || {};
  const sentiments = analytics.sentiment_distribution || {};
  const total = analytics.total_updates || 1;

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Product': return 'from-purple-500 to-indigo-500';
      case 'Pricing': return 'from-emerald-500 to-teal-500';
      case 'Hiring & Leadership': return 'from-blue-500 to-cyan-500';
      case 'Partnership': return 'from-amber-500 to-orange-500';
      case 'Funding & M&A': return 'from-rose-500 to-pink-500';
      case 'Research & Tech': return 'from-cyan-500 to-blue-500';
      default: return 'from-slate-500 to-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SpotlightCard className="!p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Monitored Targets</span>
            <Target className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-slate-100 font-mono">
            {analytics.active_competitors} / {analytics.total_competitors}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active surveillance nodes</p>
        </SpotlightCard>

        <SpotlightCard className="!p-5 border-cyan-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Verified Signals</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-300 font-mono">
            {analytics.total_updates}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Indexed & categorized events</p>
        </SpotlightCard>

        <SpotlightCard className="!p-5 border-rose-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">High Threat Moves</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-extrabold text-rose-400 font-mono">
            {analytics.high_impact_signals}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Impact rating &gt;= 8 / 10</p>
        </SpotlightCard>

        <SpotlightCard className="!p-5 border-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-400 uppercase">Noise Filtered</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-300 font-mono">
            {analytics.duplicates_suppressed}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Duplicates & clickbait suppressed</p>
        </SpotlightCard>
      </div>

      {/* Grid: Category distribution & Threat ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <SpotlightCard className="p-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            Strategic Activity by Category
          </h3>

          <div className="space-y-4">
            {Object.entries(categories).map(([category, count]) => {
              const pct = Math.round((count / total) * 100);
              return (
                <div key={category}>
                  <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                    <span className="text-slate-300">{category}</span>
                    <span className="text-slate-400 font-semibold">{count} signals ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full bg-gradient-to-r ${getCategoryColor(category)} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </SpotlightCard>

        {/* Competitor Velocity Ranking */}
        <SpotlightCard className="p-6">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Competitive Velocity Ranking
          </h3>

          <div className="space-y-3">
            {threatRadar.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800/80"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-mono font-bold text-xs text-slate-500">
                    #{idx + 1}
                  </span>
                  <div>
                    <h5 className="font-bold text-sm text-slate-200">{item.competitor_name}</h5>
                    <span className="text-[11px] font-mono text-slate-500">{item.primary_category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                  <div>
                    <div className="text-xs font-mono font-bold text-cyan-300">{item.recent_velocity} signals</div>
                    <div className="text-[10px] text-slate-500">Threat: {item.threat_score}/10</div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      item.threat_level === 'Critical Threat'
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/50'
                        : item.threat_level === 'High Threat'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                        : 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                    }`}
                  >
                    {item.threat_level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
}
