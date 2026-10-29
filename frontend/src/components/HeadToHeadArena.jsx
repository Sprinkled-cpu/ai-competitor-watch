import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Flame, Trophy, Sparkles, TrendingUp, Zap, Shield, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import SpotlightCard from './reactbits/SpotlightCard';

export default function HeadToHeadArena({ competitors = [], updates = [], threatRadar = [] }) {
  if (!competitors || competitors.length < 2) return null;

  const [compA, setCompA] = useState(competitors[0]?.name || '');
  const [compB, setCompB] = useState(competitors[1]?.name || '');
  const [isBattling, setIsBattling] = useState(false);
  const [battleResult, setBattleResult] = useState(null);

  const getStats = (name) => {
    const radarItem = threatRadar.find((t) => t.competitor_name === name);
    const compUpdates = updates.filter((u) => u.competitor_name === name);
    const score = radarItem ? radarItem.threat_score : 6.0;
    const velocity = compUpdates.length;
    const topMove = compUpdates[0]?.title || 'Routine operational period';
    return { score, velocity, topMove, count: compUpdates.length };
  };

  const statsA = getStats(compA);
  const statsB = getStats(compB);

  const totalScore = (statsA.score + statsB.score) || 1;
  const percentA = Math.round((statsA.score / totalScore) * 100);
  const percentB = 100 - percentA;

  const handleSimulateClash = () => {
    setIsBattling(true);
    setBattleResult(null);

    setTimeout(() => {
      setIsBattling(false);
      const winner = statsA.score >= statsB.score ? compA : compB;
      const margin = Math.abs(statsA.score - statsB.score).toFixed(1);
      
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#f43f5e', '#fbbf24'],
      });

      setBattleResult({
        winner,
        margin,
        commentary:
          statsA.score >= statsB.score
            ? `${compA} holds a +${margin} threat lead, driven by higher velocity moves in ${statsA.velocity} recent strategic operations.`
            : `${compB} is outmaneuvering with a +${margin} threat delta, capitalizing on aggressive pricing and distribution channel expansion.`,
      });
    }, 1200);
  };

  return (
    <SpotlightCard className="border-indigo-500/30 bg-gradient-to-br from-slate-900/90 via-[#0a0f1d] to-indigo-950/30 p-6 md:p-8 overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 text-white shadow-lg shadow-rose-500/20">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-indigo-400 font-bold block">
              Head-to-Head Clash Arena
            </span>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              Strategic Rival Duel & Power Meter
            </h3>
          </div>
        </div>

        <button
          onClick={handleSimulateClash}
          disabled={isBattling}
          className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-lg shadow-rose-600/30 transition-all border border-rose-400/30 active:scale-95"
        >
          <Sparkles className={`w-4 h-4 ${isBattling ? 'animate-spin' : ''}`} />
          <span>{isBattling ? 'Simulating Clash...' : 'Simulate Duel'}</span>
        </button>
      </div>

      {/* Selectors and Duel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
        {/* Competitor A */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-cyan-950/30 to-slate-950/70 border border-cyan-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-semibold">Challenger 1</span>
            <select
              value={compA}
              onChange={(e) => setCompA(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-cyan-400 font-mono"
            >
              {competitors.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <h4 className="text-xl font-black text-cyan-200">{compA}</h4>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Threat Index</span>
              <strong className="text-cyan-300 text-base">{statsA.score} / 10</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Signal Velocity</span>
              <strong className="text-slate-200 text-base">{statsA.velocity} moves</strong>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 italic border-l-2 border-cyan-500/50 pl-2">
            &ldquo;{statsA.topMove}&rdquo;
          </p>
        </div>

        {/* Competitor B */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-rose-950/30 to-slate-950/70 border border-rose-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-rose-400 uppercase font-semibold">Challenger 2</span>
            <select
              value={compB}
              onChange={(e) => setCompB(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-rose-400 font-mono"
            >
              {competitors.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <h4 className="text-xl font-black text-rose-200">{compB}</h4>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-500 block text-[10px]">Threat Index</span>
              <strong className="text-rose-300 text-base">{statsB.score} / 10</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Signal Velocity</span>
              <strong className="text-slate-200 text-base">{statsB.velocity} moves</strong>
            </div>
          </div>

          <p className="text-xs text-slate-400 line-clamp-2 italic border-l-2 border-rose-500/50 pl-2">
            &ldquo;{statsB.topMove}&rdquo;
          </p>
        </div>
      </div>

      {/* Interactive Tug-of-War Power Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="text-cyan-400 font-bold">{compA} ({percentA}%)</span>
          <span className="text-slate-500 uppercase text-[10px] tracking-wider font-semibold">Relative Momentum Tug-of-War</span>
          <span className="text-rose-400 font-bold">{compB} ({percentB}%)</span>
        </div>

        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${percentA}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          />
          <motion.div
            initial={{ width: '50%' }}
            animate={{ width: `${percentB}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]"
          />
        </div>
      </div>

      {/* Battle Simulation Verdict Result */}
      <AnimatePresence>
        {battleResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-950 to-purple-950/80 border border-indigo-500/40 text-xs flex items-center gap-3.5 shadow-xl"
          >
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono uppercase tracking-wider text-amber-400 font-bold text-[10px]">
                  Quarterly Dominance Leader:
                </span>
                <strong className="text-slate-100 text-sm">{battleResult.winner}</strong>
              </div>
              <p className="text-slate-300 leading-relaxed font-normal">
                {battleResult.commentary}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SpotlightCard>
  );
}
