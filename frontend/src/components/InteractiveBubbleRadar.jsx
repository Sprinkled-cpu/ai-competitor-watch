import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ArrowUpRight, Zap, Sparkles, ShieldAlert, Radio } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

/**
 * InteractiveBubbleRadar
 * Visualizes competitors as interactive, floating bubble nodes.
 * Bubble size = Velocity / Activity Volume
 * Bubble color = Threat Level (Critical, High, Moderate)
 * Interactive physics with hover magnification, pulse waves, and click-to-filter / inspect.
 */
export default function InteractiveBubbleRadar({
  items = [],
  selectedCompetitor,
  onSelectCompetitor,
  onInspectCompetitor,
}) {
  const containerRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  if (!items || items.length === 0) return null;

  const getThreatColor = (level) => {
    switch (level) {
      case 'Critical Threat':
        return {
          bg: 'from-rose-500/30 to-rose-900/60',
          border: 'border-rose-500/80',
          glow: 'rgba(244, 63, 94, 0.4)',
          text: 'text-rose-300',
          ring: 'ring-rose-500/50',
          badge: 'bg-rose-950/80 text-rose-300 border-rose-500/40',
        };
      case 'High Threat':
        return {
          bg: 'from-amber-500/30 to-amber-900/60',
          border: 'border-amber-500/80',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-300',
          ring: 'ring-amber-500/50',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
        };
      case 'Moderate':
        return {
          bg: 'from-cyan-500/30 to-cyan-900/60',
          border: 'border-cyan-500/80',
          glow: 'rgba(56, 189, 248, 0.4)',
          text: 'text-cyan-300',
          ring: 'ring-cyan-500/50',
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40',
        };
      default:
        return {
          bg: 'from-slate-600/30 to-slate-900/60',
          border: 'border-slate-600',
          glow: 'rgba(148, 163, 184, 0.2)',
          text: 'text-slate-300',
          ring: 'ring-slate-500/50',
          badge: 'bg-slate-900 text-slate-400 border-slate-700',
        };
    }
  };

  return (
    <SpotlightCard className="border-cyan-500/20 bg-slate-900/85 shadow-2xl p-6 overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 text-cyan-400">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                Dynamic Radar
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 font-mono">Interactive Threat Bubbles</span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Competitive Momentum & Threat Cluster
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
            <span className="text-rose-400 font-semibold">Critical Threat</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-amber-400">High</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />
            <span className="text-cyan-400">Moderate</span>
          </span>
        </div>
      </div>

      {/* Floating Bubbles Canvas */}
      <div
        ref={containerRef}
        className="relative my-6 py-6 px-4 rounded-2xl bg-gradient-to-b from-[#060a14] via-[#090f1f] to-[#060a14] border border-slate-800/90 min-h-[280px] flex flex-wrap items-center justify-center gap-5 sm:gap-8 overflow-hidden"
      >
        {/* Ambient Radar Rings Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[180px] h-[180px] rounded-full border border-cyan-500/40 animate-ping" style={{ animationDuration: '6s' }} />
          <div className="w-[360px] h-[360px] rounded-full border border-indigo-500/30 absolute" />
          <div className="w-[520px] h-[520px] rounded-full border border-slate-700/40 absolute" />
        </div>

        {items.map((item, idx) => {
          const style = getThreatColor(item.threat_level);
          const isSelected = selectedCompetitor === item.competitor_name;
          // Calculate scale based on threat score and velocity
          const baseSize = Math.max(105, Math.min(145, 95 + item.threat_score * 4.5));

          return (
            <motion.div
              key={item.competitor_name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                y: [0, idx % 2 === 0 ? -8 : 8, 0],
              }}
              transition={{
                scale: { duration: 0.5, delay: idx * 0.08 },
                y: {
                  repeat: Infinity,
                  duration: 3 + (idx % 3) * 0.7,
                  ease: 'easeInOut',
                },
              }}
              whileHover={{
                scale: 1.15,
                zIndex: 20,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectCompetitor(isSelected ? null : item.competitor_name)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                width: `${baseSize}px`,
                height: `${baseSize}px`,
              }}
              className={`relative cursor-pointer rounded-full p-3 flex flex-col items-center justify-center text-center transition-shadow select-none backdrop-blur-md border shadow-lg ${
                style.border
              } bg-gradient-to-br ${style.bg} ${
                isSelected
                  ? `ring-4 ${style.ring} shadow-[0_0_30px_${style.glow}] scale-110 z-10`
                  : `hover:shadow-[0_0_25px_${style.glow}]`
              }`}
            >
              {/* Threat Pulse Ring */}
              {item.threat_level === 'Critical Threat' && (
                <div
                  className="absolute -inset-1 rounded-full border border-rose-500/40 animate-ping opacity-60 pointer-events-none"
                  style={{ animationDuration: '3s' }}
                />
              )}

              {/* Bubble Content */}
              <div className="relative z-10 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 block truncate max-w-[90px]">
                  {item.primary_category}
                </span>

                <h4 className="font-extrabold text-xs sm:text-sm text-white tracking-tight leading-tight line-clamp-1">
                  {item.competitor_name}
                </h4>

                <div className="flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-bold font-mono text-slate-100">
                    {item.threat_score}
                  </span>
                </div>

                <span className="text-[9px] font-mono text-cyan-300/90 block">
                  {item.recent_velocity} moves
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating Hover Quick Preview Tooltip */}
      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-100 text-sm">{hoveredItem.competitor_name}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${getThreatColor(hoveredItem.threat_level).badge}`}>
                {hoveredItem.threat_level} ({hoveredItem.threat_score}/10)
              </span>
              <span className="text-slate-400 font-mono">Sector: {hoveredItem.primary_category}</span>
            </div>

            <p className="text-slate-300 italic max-w-xl truncate">
              &ldquo;{hoveredItem.key_threat_summary}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </SpotlightCard>
  );
}
