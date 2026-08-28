import React, { useState } from 'react';
import { 
  Table2, 
  Search, 
  CheckCircle2, 
  Network, 
  Layers, 
  Wifi, 
  Server, 
  Filter, 
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { ARCHITECTURE_COMPARISON } from '../data/milestoneKnowledge';

export const ComparisonMatrix: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Architectuur & Schaal', 'Netwerk & WAN', 'Beheer & Authenticatie', 'Live & Playback', 'Licenties & Kosten'];

  const filteredComparison = ARCHITECTURE_COMPARISON.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = 
      item.dimension.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.singleSite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.multiSite.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.federated.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.interconnect.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Milestone Architectuur Vergelijkingsmatrix
            </h2>
            <p className="text-xs text-slate-500">
              Gedetailleerde vergelijking tussen Single Site, Multi-Site, Federated Architecture (MFA) en Milestone Interconnect.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-3">
          {/* Category Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'Alle Categorieën' : cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Zoek op kenmerk, poort, licentie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="py-3.5 px-4 font-bold text-slate-800 w-1/5 uppercase text-[10px] tracking-wider">
                  Kenmerk / Dimensie
                </th>
                <th className="py-3.5 px-4 font-bold text-blue-700 w-1/5 border-l border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-blue-600" />
                    <span>Single Site</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold text-cyan-700 w-1/5 border-l border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Multi-Site (Gedistribueerd)</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold text-emerald-700 w-1/5 border-l border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Federated Architecture (MFA)</span>
                  </div>
                </th>
                <th className="py-3.5 px-4 font-bold text-amber-700 w-1/5 border-l border-slate-200">
                  <div className="flex items-center gap-1.5">
                    <Wifi className="w-3.5 h-3.5 text-amber-600" />
                    <span>Milestone Interconnect</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComparison.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    <div className="space-y-0.5">
                      <span>{item.dimension}</span>
                      <span className="block text-[10px] text-slate-500 font-normal">{item.category}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 border-l border-slate-100 leading-relaxed bg-blue-50/20">
                    {item.singleSite}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 border-l border-slate-100 leading-relaxed bg-cyan-50/20">
                    {item.multiSite}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 border-l border-slate-100 leading-relaxed bg-emerald-50/20">
                    {item.federated}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 border-l border-slate-100 leading-relaxed bg-amber-50/20">
                    {item.interconnect}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
