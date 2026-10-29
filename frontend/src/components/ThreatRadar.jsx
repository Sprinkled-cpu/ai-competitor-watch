import React from 'react';
import { ShieldAlert, TrendingUp, Flame, AlertCircle, ArrowUpRight, Zap } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export default function ThreatRadar({ items = [], onSelectCompetitor, selectedCompetitor }) {
  if (!items || items.length === 0) return null;

  const getThreatBadge = (level) => {
    switch (level) {
      case 'Critical Threat':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-300',
          dot: 'bg-rose-400',
          glow: 'rgba(244, 63, 94, 0.2)'
        };
      case 'High Threat':
        return {
          bg: 'bg-amber-950/40 border-amber-500/50 text-amber-300',
          dot: 'bg-amber-400',
          glow: 'rgba(245, 158, 11, 0.2)'
        };
      case 'Moderate':
        return {
          bg: 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300',
          dot: 'bg-cyan-400',
          glow: 'rgba(56, 189, 248, 0.2)'
        };
      default:
        return {
          bg: 'bg-slate-800/40 border-slate-700 text-slate-300',
          dot: 'bg-slate-400',
          glow: 'transparent'
        };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          <h3 className="text-base font-bold text-slate-100 tracking-tight">Threat Radar & Competitive Velocity</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">Real-time Threat Scoring (1-10)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {items.map((item, idx) => {
          const badge = getThreatBadge(item.threat_level);
          const isSelected = selectedCompetitor === item.competitor_name;

          return (
            <SpotlightCard
              key={idx}
              spotlightColor={badge.glow}
              borderColor={isSelected ? 'rgba(56, 189, 248, 0.6)' : undefined}
              className={`cursor-pointer transition-all duration-300 !p-4 group ${
                isSelected ? 'ring-2 ring-cyan-500/50 bg-slate-800/80' : 'hover:-translate-y-1'
              }`}
              onClick={() => onSelectCompetitor(isSelected ? null : item.competitor_name)}
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <h4 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-sm">
                    {item.competitor_name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity" />
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">Primary: {item.primary_category}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${badge.bg}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${badge.dot} animate-pulse`} />
                  <span>{item.threat_level}</span>
                </div>
              </div>

              {/* Threat Score Bar */}
              <div className="mb-3">
                <div className="flex justify-between items-center text-[11px] font-mono mb-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-400" /> Score
                  </span>
                  <span className="font-bold text-slate-200">{item.threat_score} / 10</span>
                </div>
                <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      item.threat_score >= 8
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                        : item.threat_score >= 6
                        ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ width: `${item.threat_score * 10}%` }}
                  />
                </div>
              </div>

              {/* Alert summary quote */}
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed italic border-l-2 border-slate-700 pl-2">
                &ldquo;{item.key_threat_summary}&rdquo;
              </p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-cyan-400" /> {item.recent_velocity} verified signals
                </span>
                <span className="text-cyan-400/80 group-hover:text-cyan-300 font-medium">Filter feed &rarr;</span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}
