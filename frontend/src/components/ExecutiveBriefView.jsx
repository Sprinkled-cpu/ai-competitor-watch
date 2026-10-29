import React, { useState } from 'react';
import { FileText, Download, Copy, Check, Sparkles, RefreshCw, AlertTriangle, Shield, Calendar, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import SpotlightCard from './reactbits/SpotlightCard';
import ShinyText from './reactbits/ShinyText';
import { getExportMarkdownUrl } from '../api';

export default function ExecutiveBriefView({ brief, onRegenerate, isGenerating }) {
  const [copied, setCopied] = useState(false);

  if (!brief) {
    return (
      <SpotlightCard className="p-8 text-center text-slate-400">
        <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <p>No executive intelligence brief generated yet.</p>
        <button
          onClick={onRegenerate}
          disabled={isGenerating}
          className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-medium inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Generate Intelligence Brief Now
        </button>
      </SpotlightCard>
    );
  }

  const handleCopy = () => {
    const text = `# ${brief.title}\n\n${brief.executive_summary}\n\n## Recommendations\n${brief.strategic_recommendations?.map(r => `- [${r.pillar}] ${r.action}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    window.open(getExportMarkdownUrl(brief.id), '_blank');
  };

  const formatDate = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <SpotlightCard className="border-cyan-500/30 bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-indigo-950/40 p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Executive Intelligence Brief</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400">{brief.timeframe}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              <ShinyText text={brief.title} />
            </h2>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> Generated: {formatDate(brief.created_at)}
              </span>
              <span>•</span>
              <span className="text-cyan-300">{brief.competitors_analyzed?.length || 0} Competitors Monitored</span>
              <span>•</span>
              <span className="text-indigo-300">{brief.total_updates_analyzed || 0} Updates Synthesized</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Brief'}</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export .MD</span>
            </button>

            <button
              onClick={onRegenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Re-Synthesize'}</span>
            </button>
          </div>
        </div>
      </SpotlightCard>

      {/* Grid: Executive Narrative & Playbook Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Executive Summary Column */}
        <div className="lg:col-span-2 space-y-6">
          <SpotlightCard className="p-6">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <Shield className="w-4 h-4 text-cyan-400" />
              Strategic Executive Assessment
            </h3>
            
            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed space-y-4">
              {brief.executive_summary.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line text-slate-300 font-normal">
                  {paragraph.replace(/\*\*(.*?)\*\*/g, '$1')}
                </p>
              ))}
            </div>

            {/* Category Distribution Pills */}
            {brief.category_breakdown && (
              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2.5">
                  Surveillance Signal Breakdown
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(brief.category_breakdown).map(([category, count]) => (
                    <div
                      key={category}
                      className="flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-mono bg-slate-800/80 border border-slate-700/60 text-slate-300"
                    >
                      <span>{category}:</span>
                      <strong className="text-cyan-400 font-bold">{count}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </SpotlightCard>

          {/* Top Strategic Threat Alerts */}
          {brief.top_strategic_threats && brief.top_strategic_threats.length > 0 && (
            <SpotlightCard className="p-6">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Critical Tactical Shifts (Impact Score 8-10)
              </h3>

              <div className="space-y-3.5">
                {brief.top_strategic_threats.slice(0, 4).map((threat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-800 text-cyan-300">
                          {threat.competitor_name}
                        </span>
                        <span className="text-xs font-mono text-slate-400">[{threat.category}]</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400 bg-rose-950/40 px-2 py-0.5 rounded border border-rose-500/40">
                        {threat.impact_score}/10 Impact
                      </span>
                    </div>

                    <h5 className="text-sm font-semibold text-slate-100 mb-1">
                      {threat.title}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mb-2">
                      {threat.raw_summary}
                    </p>

                    <div className="text-[11px] text-cyan-300/90 font-medium bg-cyan-950/30 px-2.5 py-1 rounded-md border border-cyan-800/40">
                      💡 {threat.strategic_takeaway}
                    </div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          )}
        </div>

        {/* Playbook Column */}
        <div className="space-y-6">
          <SpotlightCard className="p-6 border-indigo-500/30">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-4 pb-2 border-b border-slate-800">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Strategic Playbook Counter-Moves
            </h3>

            <div className="space-y-4">
              {brief.strategic_recommendations?.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-gradient-to-b from-slate-950/70 to-indigo-950/20 border border-indigo-500/20 hover:border-indigo-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold font-mono text-indigo-300 uppercase tracking-wide">
                      {rec.pillar}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                      rec.urgency?.includes('Immediate')
                        ? 'bg-rose-950/60 text-rose-300 border-rose-500/50'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                    }`}>
                      {rec.urgency}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {rec.action}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <div className="rounded-xl p-3 bg-slate-950/60 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  Share this intelligence brief directly with your product, GTM, and engineering leads for weekly alignment.
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
}
