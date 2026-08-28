import React, { useState } from 'react';
import { 
  Layers, 
  Search, 
  Lock, 
  ShieldCheck, 
  Server, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  Filter
} from 'lucide-react';
import { MILESTONE_PORTS } from '../data/milestoneKnowledge';

export const PortGuide: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCriticality, setSelectedCriticality] = useState<string>('all');

  const filteredPorts = MILESTONE_PORTS.filter(p => {
    const matchesCrit = selectedCriticality === 'all' || p.criticality === selectedCriticality;
    const matchesSearch = 
      p.port.toString().includes(search) ||
      p.purpose.toLowerCase().includes(search.toLowerCase()) ||
      p.source.toLowerCase().includes(search.toLowerCase()) ||
      p.destination.toLowerCase().includes(search.toLowerCase()) ||
      p.notes.toLowerCase().includes(search.toLowerCase());
    return matchesCrit && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Milestone XProtect Netwerkpoorten & Firewall Configuratie
            </h2>
            <p className="text-xs text-slate-500">
              Essentiële TCP/UDP poorten voor communicatie tussen Management Server, Recording Servers, Smart Clients, Mobile Server en Interconnect/MFA.
            </p>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-100 mt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter:</span>
            {['all', 'Verplicht', 'Aanbevolen', 'Optioneel'].map((crit) => (
              <button
                key={crit}
                onClick={() => setSelectedCriticality(crit)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  selectedCriticality === crit
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {crit === 'all' ? 'Alle Poorten' : crit}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Zoek op poortnummer (bijv. 7563, 443, 80)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Ports Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 uppercase text-[10px]">
                <th className="py-3 px-4 font-semibold">Poort & Protocol</th>
                <th className="py-3 px-4 font-semibold">Bron (Source)</th>
                <th className="py-3 px-4 font-semibold">Bestemming (Destination)</th>
                <th className="py-3 px-4 font-semibold">Doel / Functie</th>
                <th className="py-3 px-4 font-semibold">Prioriteit</th>
                <th className="py-3 px-4 font-semibold">Opmerkingen & Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPorts.map((p) => (
                <tr key={p.port} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">
                    <span className="bg-blue-50 px-2 py-0.5 rounded border border-blue-200 inline-block text-[11px]">
                      {p.port} / {p.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-600">{p.source}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{p.destination}</td>
                  <td className="py-3 px-4 text-slate-600 leading-relaxed">{p.purpose}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      p.criticality === 'Verplicht' 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : p.criticality === 'Aanbevolen'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {p.criticality}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px] leading-relaxed">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
