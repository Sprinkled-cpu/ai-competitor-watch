import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, AlertTriangle, Terminal, Activity, RefreshCw, Cpu, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';

export default function LiveAgentTerminal({ scanStatus, onTriggerScan, isScanning }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [scanStatus?.logs]);

  const stages = [
    { name: '1. Ingestion & Crawl', active: scanStatus?.progress >= 10 && scanStatus?.progress < 60 },
    { name: '2. Noise & Deduplication', active: scanStatus?.progress >= 60 && scanStatus?.progress < 75 },
    { name: '3. Strategic Classification', active: scanStatus?.progress >= 75 && scanStatus?.progress < 90 },
    { name: '4. Executive Synthesis', active: scanStatus?.progress >= 90 },
  ];

  return (
    <SpotlightCard className="border-cyan-500/20 bg-slate-900/80 shadow-2xl backdrop-blur-2xl">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3.5 h-3.5 rounded-full ${isScanning ? 'bg-cyan-400 animate-ping' : 'bg-emerald-400'}`} />
            <div className={`absolute inset-0 w-3.5 h-3.5 rounded-full ${isScanning ? 'bg-cyan-400' : 'bg-emerald-400'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 font-mono">Agent Engine</span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs font-mono text-slate-400">
                {isScanning ? (scanStatus?.current_competitor ? `Scanning: ${scanStatus.current_competitor}` : 'Autonomous Pipeline Running...') : 'Standby / Continuous Surveillance'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Autonomous Surveillance Agent
            </h3>
          </div>
        </div>

        {/* Action Button & Toggle */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onTriggerScan}
            disabled={isScanning}
            className={`relative group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 shadow-lg ${
              isScanning
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-400/30'
            }`}
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Agent Scanning...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white text-white group-hover:scale-110 transition-transform" />
                <span>Trigger Live Sweep</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 transition-colors border border-slate-700/60"
            title={isExpanded ? 'Collapse Terminal' : 'Expand Terminal'}
          >
            <Terminal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress & Pipeline Stages */}
      <div className="mt-4 space-y-3">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-mono mb-1.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pipeline Stage: <strong className="text-cyan-300">{scanStatus?.current_step || 'Ready'}</strong></span>
            </span>
            <span className="text-cyan-400 font-semibold">{scanStatus?.progress || 0}%</span>
          </div>
          <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(56,189,248,0.5)]"
              style={{ width: `${scanStatus?.progress || 0}%` }}
            />
          </div>
        </div>

        {/* Stage Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
          {stages.map((stage, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                stage.active
                  ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 shadow-[0_0_10px_rgba(56,189,248,0.2)]'
                  : scanStatus?.progress > (idx + 1) * 25
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400'
                  : 'border-slate-800/60 bg-slate-900/40 text-slate-500'
              }`}
            >
              {scanStatus?.progress > (idx + 1) * 25 ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : stage.active ? (
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
              )}
              <span className="truncate">{stage.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Output */}
      {isExpanded && (
        <div className="mt-4">
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 rounded-t-lg border-x border-t border-slate-800 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-slate-500 ml-2">agent_telemetry.log</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-slate-500">Deduplicated: <strong className="text-amber-400">{scanStatus?.duplicates_removed || 0}</strong></span>
              <span className="text-slate-500">Indexed: <strong className="text-emerald-400">{scanStatus?.updates_saved || 0}</strong></span>
            </div>
          </div>

          <div
            ref={logContainerRef}
            className="h-36 overflow-y-auto p-3 bg-[#070b13] rounded-b-lg border border-slate-800 font-mono text-xs space-y-1.5 select-text"
          >
            {(!scanStatus?.logs || scanStatus.logs.length === 0) ? (
              <div className="text-slate-600 italic py-2">
                Agent initialized and standing by. Click &quot;Trigger Live Sweep&quot; to initiate multi-source crawl across competitors.
              </div>
            ) : (
              scanStatus.logs.map((log, index) => (
                <div key={index} className="flex items-start gap-2 text-slate-300">
                  <span className="text-slate-600 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-semibold shrink-0 uppercase text-[10px] px-1.5 py-0.5 rounded ${
                      log.level === 'success'
                        ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40'
                        : log.level === 'warning'
                        ? 'bg-amber-950/60 text-amber-400 border border-amber-800/40'
                        : log.level === 'error'
                        ? 'bg-rose-950/60 text-rose-400 border border-rose-800/40'
                        : 'bg-cyan-950/60 text-cyan-400 border border-cyan-800/40'
                    }`}
                  >
                    {log.step}
                  </span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </SpotlightCard>
  );
}
