import React from 'react';
import { Eye, Shield, Cpu, GitBranch, Settings, FileText, BarChart3, Radio } from 'lucide-react';
import ShinyText from './reactbits/ShinyText';

export default function Navbar({
  activeTab,
  setActiveTab,
  competitorCount,
  onOpenManageModal,
  isScanning
}) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 border border-cyan-400/40 shadow-lg shadow-cyan-500/20">
            <Radio className={`w-5 h-5 text-white ${isScanning ? 'animate-pulse' : ''}`} />
            {isScanning && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-cyan-400">
                Threat Intelligence
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Live Agent
              </span>
            </div>
            <h1 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight leading-none">
              <ShinyText text="AI Competitor Watch" shimmerColor="#38bdf8" />
            </h1>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'feed'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Live Radar & Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('brief')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'brief'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Intelligence Brief</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'analytics'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Threat Matrix</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenManageModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/80 transition-colors shadow-sm"
          >
            <Settings className="w-3.5 h-3.5 text-cyan-400" />
            <span>Targets ({competitorCount})</span>
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors"
            title="GitHub Repository"
          >
            <GitBranch className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
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
          Intelligence Brief
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-1.5 rounded-lg shrink-0 ${activeTab === 'analytics' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'}`}
        >
          Threat Matrix
        </button>
      </div>
    </header>
  );
}
