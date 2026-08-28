import React, { useState } from 'react';
import { Header, AppTabType } from './components/Header';
import { FocusedArchitectureStudio, SingleSiteTier } from './components/FocusedArchitectureStudio';
import { ProductTierComparison } from './components/ProductTierComparison';
import { ComparisonMatrix } from './components/ComparisonMatrix';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTabType>('studio');
  const [externalTier, setExternalTier] = useState<SingleSiteTier | null>(null);

  const handleSelectTierFromComparison = (tier: 'Express+' | 'Professional+' | 'Expert' | 'Corporate') => {
    setExternalTier(tier);
    setActiveTab('studio');
  };

  return (
    <div className="relative min-h-screen text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Ambient background: deep navy canvas + glowing accent orbs */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#141a37] via-[#182050] to-[#1a2456]">
        <div className="absolute inset-0 bg-grid-fade opacity-[0.12] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_10%,transparent_75%)]" />
        <div className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full bg-indigo-500/25 blur-[130px]" />
        <div className="absolute -top-20 right-[-120px] w-[480px] h-[480px] rounded-full bg-blue-400/20 blur-[130px]" />
        <div className="absolute top-[45%] left-[30%] w-[420px] h-[420px] rounded-full bg-emerald-400/10 blur-[140px]" />
      </div>

      {/* Streamlined App Header with Tab Navigation */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-16">
        {activeTab === 'studio' && (
          <FocusedArchitectureStudio
            externalSelectedTier={externalTier}
            onNavigateToComparisonSheet={() => setActiveTab('tier-comparison')}
          />
        )}

        {activeTab === 'tier-comparison' && (
          <ProductTierComparison
            onSelectTier={handleSelectTierFromComparison}
          />
        )}

        {activeTab === 'arch-comparison' && (
          <ComparisonMatrix />
        )}
      </main>

      {/* Persistent Bottom Status Bar */}
      <footer className="border-t border-white/10 bg-[#141a37]/90 backdrop-blur-md py-2.5 px-4 sm:px-6 text-xs text-slate-400 fixed bottom-0 left-0 right-0 z-30 shadow-[0_-1px_12px_rgba(0,0,0,0.25)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="relative flex w-2 h-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
              </span>
              Milestone XProtect Systeemconfiguratie Gereed
            </span>
            <span className="text-slate-600">•</span>
            <span>Express+ • Professional+ • Expert • Corporate</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Milestone Certified Architecture Standard 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
