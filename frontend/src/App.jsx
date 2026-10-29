import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, RefreshCw, Plus, Layers, Flame, FileText, CheckCircle2, Radio, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import CyberGrid from './components/reactbits/CyberGrid';
import LiveAgentTerminal from './components/LiveAgentTerminal';
import ThreatRadar from './components/ThreatRadar';
import InteractiveBubbleRadar from './components/InteractiveBubbleRadar';
import UpdateCard from './components/UpdateCard';
import UpdateDetailModal from './components/UpdateDetailModal';
import ExecutiveBriefView from './components/ExecutiveBriefView';
import AnalyticsView from './components/AnalyticsView';
import ManageCompetitorsModal from './components/ManageCompetitorsModal';
import ShinyText from './components/reactbits/ShinyText';
import DecryptedText from './components/reactbits/DecryptedText';

import {
  fetchCompetitors,
  addCompetitor,
  deleteCompetitor,
  resetPreset,
  triggerScan,
  getScanStatus,
  fetchUpdates,
  fetchLatestBrief,
  generateBrief,
  fetchAnalytics,
} from './api';

const CATEGORIES = ['All', 'Product', 'Pricing', 'Hiring & Leadership', 'Partnership', 'Funding & M&A', 'Research & Tech'];

export default function App() {
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'brief' | 'analytics'
  const [competitors, setCompetitors] = useState([]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minImpact, setMinImpact] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [radarViewMode, setRadarViewMode] = useState('bubbles'); // 'bubbles' | 'matrix'
  const [selectedDetailUpdate, setSelectedDetailUpdate] = useState(null);

  const [updates, setUpdates] = useState([]);
  const [latestBrief, setLatestBrief] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isBriefGenerating, setIsBriefGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load all initial state
  const loadData = useCallback(async () => {
    try {
      const [comps, brf, stats] = await Promise.all([
        fetchCompetitors(),
        fetchLatestBrief(),
        fetchAnalytics(),
      ]);
      setCompetitors(comps || []);
      setLatestBrief(brf || null);
      setAnalytics(stats || null);
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch filtered updates
  const loadFilteredUpdates = useCallback(async () => {
    try {
      const compObj = competitors.find((c) => c.name === selectedCompetitor);
      const compId = compObj ? compObj.id : undefined;

      const data = await fetchUpdates({
        competitor_id: compId,
        category: selectedCategory,
        min_impact: minImpact,
        search: searchQuery,
      });
      setUpdates(data || []);
    } catch (err) {
      console.error('Error fetching updates:', err);
    }
  }, [selectedCompetitor, selectedCategory, minImpact, searchQuery, competitors]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadFilteredUpdates();
  }, [loadFilteredUpdates]);

  // Polling scan status when active
  useEffect(() => {
    let interval;
    if (isScanning) {
      interval = setInterval(async () => {
        try {
          const status = await getScanStatus();
          setScanStatus(status);
          if (!status.is_running) {
            setIsScanning(false);
            loadData();
            loadFilteredUpdates();
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isScanning, loadData, loadFilteredUpdates]);

  const handleTriggerScan = async () => {
    try {
      setIsScanning(true);
      await triggerScan();
      const status = await getScanStatus();
      setScanStatus(status);
    } catch (err) {
      console.error('Failed to trigger scan:', err);
      setIsScanning(false);
    }
  };

  const handleAddCompetitor = async (data) => {
    await addCompetitor(data);
    await loadData();
    await loadFilteredUpdates();
  };

  const handleDeleteCompetitor = async (id) => {
    await deleteCompetitor(id);
    await loadData();
    await loadFilteredUpdates();
  };

  const handleResetPreset = async () => {
    await resetPreset();
    await loadData();
    await loadFilteredUpdates();
    setIsManageModalOpen(false);
  };

  const handleRegenerateBrief = async () => {
    try {
      setIsBriefGenerating(true);
      const brief = await generateBrief();
      setLatestBrief(brief);
    } catch (err) {
      console.error('Failed to regenerate brief:', err);
    } finally {
      setIsBriefGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* React Bits Cyber Grid Background with Floating Ambient Bubbles */}
      <CyberGrid />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        competitorCount={competitors.length}
        onOpenManageModal={() => setIsManageModalOpen(true)}
        isScanning={isScanning}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Enterprise Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>ENTERPRISE SURVEILLANCE RADAR</span>
              <span className="text-slate-600">//</span>
              <DecryptedText text="REAL-TIME THREAT RADAR ONLINE" />
            </div>
            
            <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
              AI Competitor <ShinyText text="Intelligence Engine" />
            </h2>
            
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Enterprise-grade autonomous market intelligence system that continuously monitors key rival ecosystems, strips newsroom noise and duplicate syndicated articles, and delivers real-time strategic counter-moves.
            </p>

            {/* Live Status Indicators */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                Active Targets: <strong>{competitors.length} Monitored</strong>
              </span>

              <span className="px-3 py-1 rounded-full bg-slate-900/90 text-slate-300 border border-slate-800 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                Noise Suppression: <strong>Real-time</strong>
              </span>

              <span className="px-3 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/50 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Strategic Impact: <strong>1-10 Scale</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsManageModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700/80 hover:border-cyan-500/50 transition-all shadow-lg shadow-cyan-950/20"
            >
              <Plus className="w-4 h-4" />
              <span>Configure Targets</span>
            </button>
          </div>
        </div>

        {/* Live Autonomous Agent Telemetry & Control Terminal */}
        <LiveAgentTerminal
          scanStatus={scanStatus}
          onTriggerScan={handleTriggerScan}
          isScanning={isScanning}
        />

        {/* Tab 1: Live Feed View */}
        {activeTab === 'feed' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* View Switcher for Threat Radar: Interactive Bubbles vs Matrix Cards */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    Threat Radar Display Mode:
                  </span>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setRadarViewMode('bubbles')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      radarViewMode === 'bubbles'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>Dynamic Bubbles</span>
                  </button>
                  <button
                    onClick={() => setRadarViewMode('matrix')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                      radarViewMode === 'matrix'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Grid Matrix</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Radar View */}
              {latestBrief?.threat_radar && (
                radarViewMode === 'bubbles' ? (
                  <InteractiveBubbleRadar
                    items={latestBrief.threat_radar}
                    selectedCompetitor={selectedCompetitor}
                    onSelectCompetitor={setSelectedCompetitor}
                  />
                ) : (
                  <ThreatRadar
                    items={latestBrief.threat_radar}
                    selectedCompetitor={selectedCompetitor}
                    onSelectCompetitor={setSelectedCompetitor}
                  />
                )
              )}
            </div>

            {/* Target Competitor Filter Dock with Spring Bounce */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                  Filter by Monitored Rival:
                </span>
                {selectedCompetitor && (
                  <button
                    onClick={() => setSelectedCompetitor(null)}
                    className="text-xs font-mono text-cyan-400 hover:underline"
                  >
                    Reset Filter (Show All Competitors)
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCompetitor(null)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                    selectedCompetitor === null
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  All Competitors ({competitors.length})
                </motion.button>

                {competitors.map((comp) => {
                  const isSelected = selectedCompetitor === comp.name;
                  return (
                    <motion.button
                      key={comp.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCompetitor(isSelected ? null : comp.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                        isSelected
                          ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white border-cyan-400 shadow-md shadow-cyan-500/30 ring-2 ring-cyan-400/40'
                          : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <span>{comp.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Filter & Search Control Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 backdrop-blur-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Category Filter Bubbles */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
                {CATEGORIES.map((cat) => (
                  <motion.button
                    key={cat}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 border ${
                      selectedCategory === cat
                        ? 'bg-slate-800 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Search & High-Impact Toggle */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => setMinImpact(minImpact === 8 ? 1 : 8)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-mono font-medium border transition-all ${
                    minImpact >= 8
                      ? 'bg-rose-950/60 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                  title="Filter high impact signals (score >= 8)"
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>High Impact (8+)</span>
                </button>

                <div className="relative w-full sm:w-56">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search intelligence..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Updates Cards Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>
                  Showing <strong className="text-cyan-300">{updates.length}</strong> verified updates
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Click any card for Deep-Dive Pop-up</span>
                </span>
              </div>

              {updates.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  <Layers className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm">No updates match the current filters.</p>
                  <button
                    onClick={() => {
                      setSelectedCompetitor(null);
                      setSelectedCategory('All');
                      setMinImpact(1);
                      setSearchQuery('');
                    }}
                    className="mt-3 text-xs text-cyan-400 hover:underline font-mono"
                  >
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {updates.map((update) => (
                    <UpdateCard
                      key={update.id}
                      update={update}
                      onSelect={(u) => setSelectedDetailUpdate(u)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Intelligence Brief View */}
        {activeTab === 'brief' && (
          <div className="animate-in fade-in duration-300">
            <ExecutiveBriefView
              brief={latestBrief}
              onRegenerate={handleRegenerateBrief}
              isGenerating={isBriefGenerating}
            />
          </div>
        )}

        {/* Tab 3: Threat Matrix Analytics View */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in duration-300">
            <AnalyticsView
              analytics={analytics}
              threatRadar={latestBrief?.threat_radar || []}
            />
          </div>
        )}
      </main>

      {/* Interactive Update Detail Pop-up Modal */}
      <UpdateDetailModal
        update={selectedDetailUpdate}
        isOpen={Boolean(selectedDetailUpdate)}
        onClose={() => setSelectedDetailUpdate(null)}
      />

      {/* Manage Competitors Modal */}
      <ManageCompetitorsModal
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        competitors={competitors}
        onAddCompetitor={handleAddCompetitor}
        onDeleteCompetitor={handleDeleteCompetitor}
        onResetPreset={handleResetPreset}
      />
    </div>
  );
}
