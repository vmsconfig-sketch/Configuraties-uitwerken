import React from 'react';
import {
  Network,
  WifiOff,
  Layers,
  Sliders,
  ShieldCheck,
  Table2
} from 'lucide-react';
import { MainArchitectureType } from './FocusedArchitectureStudio';

export type AppTabType = 'studio' | 'tier-comparison' | 'arch-comparison';

interface HeaderProps {
  activeTab: AppTabType;
  onTabChange: (tab: AppTabType) => void;
  currentArchitecture?: MainArchitectureType;
}

const TABS: {
  id: AppTabType;
  label: string;
  icon: typeof Sliders;
  iconColor: string;
  sublabel?: string;
}[] = [
  { id: 'studio', label: 'Architectuur Studio', icon: Sliders, iconColor: 'text-indigo-600' },
  { id: 'tier-comparison', label: 'Pakketten Vergelijking', icon: ShieldCheck, iconColor: 'text-emerald-600', sublabel: 'Express+ t/m Corporate' },
  { id: 'arch-comparison', label: 'Architectuur Matrix', icon: Table2, iconColor: 'text-indigo-600', sublabel: 'Single vs Multi vs MFA vs Interconnect' }
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-40 bg-gradient-to-br from-[#dbe2fb] via-[#c1cdf5] to-[#93a5e8] shadow-[0_4px_24px_rgba(20,26,55,0.35)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3.5 pb-3">
        {/* Top bar: Brand & status */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-700 via-indigo-700 to-blue-700 flex items-center justify-center text-white shadow-lg shadow-indigo-900/25 font-bold shrink-0">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-indigo-950 flex items-center gap-2">
                  Milestone VMS Architectuur Studio
                </h1>
                <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-800 border border-emerald-600/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <WifiOff className="w-2.5 h-2.5" />
                  OFFLINE READY
                </span>
              </div>
              <p className="text-xs text-indigo-900/70 mt-0.5 hidden sm:block font-medium">
                Selecteer architectuur, netwerkverbinding, Milestone editie en systeemcapaciteit.
              </p>
            </div>
          </div>

          {/* Right badge */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/50 border border-white/60 rounded-full text-[11px] font-bold text-indigo-900">
              <Layers className="w-3 h-3 text-indigo-700" />
              Milestone XProtect Systeemontwerp
            </span>
          </div>
        </div>

        {/* Tab Navigation Row — segmented-control style for stronger visibility */}
        <div className="flex items-center gap-1 bg-white/25 border border-white/40 rounded-2xl p-1.5 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-white text-indigo-950 shadow-md shadow-indigo-950/20'
                    : 'text-indigo-900/70 hover:bg-white/40 hover:text-indigo-950'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? tab.iconColor : 'text-indigo-900/60'}`} />
                <span>{tab.label}</span>
                {tab.sublabel && (
                  <span className={`text-[10px] font-normal hidden md:inline ${isActive ? 'text-slate-400' : 'text-indigo-900/50'}`}>
                    {tab.sublabel}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
