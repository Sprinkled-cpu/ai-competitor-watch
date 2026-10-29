import React, { useState } from 'react';
import { Eye, Shield, Cpu, GitBranch, Settings, FileText, BarChart3, Radio, Volume2, VolumeX, HelpCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import ShinyText from './reactbits/ShinyText';
import { toggleMute, getMuteState, playPop } from '../utils/soundEffects';

export default function Navbar({
  activeTab,
  setActiveTab,
  competitorCount,
  onOpenManageModal,
  isScanning,
  hasLaunchedDashboard,
  onReturnToSetup
}) {
  const [muted, setMuted] = useState(getMuteState());

  const handleToggleSound = () => {
    const isNowMuted = toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) playPop();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 border border-cyan-400/40 shadow-lg shadow-cyan-500/25">
            <Radio className={`w-5 h-5 text-white ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-cyan-400">
                Universal Spy Dashboard
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Tracker
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight leading-none">
              <ShinyText text="AI Competitor Watch" shimmerColor="#38bdf8" />
            </h1>
          </div>
        </div>

        {/* View Switcher Tabs - only shown when dashboard is launched */}
        {hasLaunchedDashboard && (
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                playPop();
                setActiveTab('feed');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'feed'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Radar & Live Signals</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setActiveTab('brief');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'brief'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Executive Brief</span>
            </button>

            <button
              onClick={() => {
                playPop();
                setActiveTab('analytics');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Threat Matrix</span>
            </button>
          </nav>
        )}

        {/* Right Actions: Return to Setup + Sound Toggle + Targets + GitHub */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {hasLaunchedDashboard && (
            <button
              type="button"
              onClick={onReturnToSetup}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/50 transition-colors shadow-sm"
              title="Return to initial setup and search different competitors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Change Targets</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/70 transition-colors"
            title={muted ? 'Unmute interactive sound effects' : 'Mute sound effects'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Manage Targets Button - shown when dashboard is active */}
          {hasLaunchedDashboard && (
            <button
              onClick={() => {
                playPop();
                onOpenManageModal();
              }}
              className="flex items-center gap-2 px-3 py-2 sm:px-3.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
            >
              <Settings className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Targets ({competitorCount})</span>
              <span className="sm:hidden">{competitorCount}</span>
            </button>
          )}

          {/* GitHub Repo Link */}
          <a
            href="https://github.com/Sprinkled-cpu/ai-competitor-watch"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
            title="GitHub Repository: Sprinkled-cpu/ai-competitor-watch"
          >
            <GitBranch className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Mobile Nav Tabs - only shown when dashboard is launched */}
      {hasLaunchedDashboard && (
        <div className="flex md:hidden border-t border-slate-800/80 px-4 py-2 gap-2 overflow-x-auto text-xs bg-slate-950/80">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'feed' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
          >
            Live Feed
          </button>
          <button
            onClick={() => setActiveTab('brief')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'brief' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
          >
            Executive Brief
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
          >
            Threat Matrix
          </button>
          <button
            onClick={onReturnToSetup}
            className="px-3 py-1.5 rounded-lg shrink-0 text-cyan-400 border border-cyan-800/60 bg-cyan-950/40"
          >
            Change Targets
          </button>
        </div>
      )}
    </header>
  );
}
