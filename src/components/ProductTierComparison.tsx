import React, { useState, useMemo } from 'react';
import { 
  Check, 
  X, 
  Plus, 
  Search, 
  Copy, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Server, 
  Layers, 
  Filter, 
  Info, 
  ArrowRight, 
  Sparkles,
  HelpCircle,
  HardDrive,
  Eye,
  Lock,
  ChevronRight
} from 'lucide-react';
import { 
  MILESTONE_TIERS_OVERVIEW, 
  MILESTONE_PRODUCT_TIERS_COMPARISON, 
  MilestoneTierOverview, 
  MilestoneTierFeatureItem,
  FeatureValueType
} from '../data/milestoneKnowledge';

interface ProductTierComparisonProps {
  onSelectTier?: (tier: 'Express+' | 'Professional+' | 'Expert' | 'Corporate') => void;
}

export const ProductTierComparison: React.FC<ProductTierComparisonProps> = ({ onSelectTier }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyDifferences, setShowOnlyDifferences] = useState(false);
  const [highlightedTier, setHighlightedTier] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Decision guide checklist state
  const [reqMoreThan100, setReqMoreThan100] = useState(false);
  const [reqMultiServer, setReqMultiServer] = useState(false);
  const [reqFailover, setReqFailover] = useState(false);
  const [reqSmartWall, setReqSmartWall] = useState(false);
  const [reqMfaParent, setReqMfaParent] = useState(false);
  const [reqDualRecording, setReqDualRecording] = useState(false);

  const categories = [
    'all',
    'Systeemcapaciteit & Schaalbaarheid',
    'Hoge Beschikbaarheid & Redundantie',
    'Multi-Site & Architectuurintegratie',
    'Monitoring & Videofuncties',
    'Beveiliging, Compliance & Privacy',
    'Licenties & Toepassing'
  ];

  // Calculate recommended tier based on decision checklist
  const recommendedTier = useMemo(() => {
    if (reqMfaParent || reqDualRecording) return 'Corporate';
    if (reqSmartWall) return 'Corporate'; // Corporate has standard Smart Wall, Expert is add-on
    if (reqFailover) return 'Expert';
    if (reqMoreThan100 || reqMultiServer) return 'Professional+';
    return 'Express+';
  }, [reqMoreThan100, reqMultiServer, reqFailover, reqSmartWall, reqMfaParent, reqDualRecording]);

  // Filter features
  const filteredFeatures = useMemo(() => {
    return MILESTONE_PRODUCT_TIERS_COMPARISON.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      // Differences filter
      if (showOnlyDifferences) {
        const v1 = item.express.value;
        const v2 = item.professional.value;
        const v3 = item.expert.value;
        const v4 = item.corporate.value;
        const allSame = v1 === v2 && v2 === v3 && v3 === v4;
        if (allSame) return false;
      }

      // Search query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesExpress = item.express.value.toLowerCase().includes(q);
        const matchesPro = item.professional.value.toLowerCase().includes(q);
        const matchesExpert = item.expert.value.toLowerCase().includes(q);
        const matchesCorp = item.corporate.value.toLowerCase().includes(q);

        return matchesName || matchesDesc || matchesCategory || matchesExpress || matchesPro || matchesExpert || matchesCorp;
      }

      return true;
    });
  }, [selectedCategory, showOnlyDifferences, searchQuery]);

  // Group features by category for neat table layout
  const groupedFeatures = useMemo(() => {
    const groups: { [cat: string]: MilestoneTierFeatureItem[] } = {};
    filteredFeatures.forEach(feat => {
      if (!groups[feat.category]) {
        groups[feat.category] = [];
      }
      groups[feat.category].push(feat);
    });
    return groups;
  }, [filteredFeatures]);

  const handleCopySummary = () => {
    const text = `--- MILESTONE XPROTECT PAKKETTEN VERGELIJKING SHEET ---
1. XProtect Express+:
   • Capaciteit: Max. 100 devices / camera's, 1 Recording Server
   • Redundantie: Geen Failover
   • Doelgroep: Winkels, MKB, standalone locaties

2. XProtect Professional+:
   • Capaciteit: Onbeperkt devices & onbeperkt aantal Recording Servers
   • Redundantie: Geen Failover
   • Doelgroep: Middelgrote bedrijven, campussen, multi-server locaties

3. XProtect Expert:
   • Capaciteit: Onbeperkt devices & multi-server
   • Redundantie: Failover Recording Servers (Hot & Cold standby), Edge retrieval
   • Multi-site: Milestone Federated Architecture (MFA Child Site)
   • Doelgroep: Bedrijfskritische omgevingen, ziekenhuizen, high-uptime locaties

4. XProtect Corporate:
   • Capaciteit: Onbeperkt enterprise platform
   • Redundantie: Failover Recording Servers, Dual-recording, Microsoft Clustering
   • Multi-site: Centrale MFA Parent & Interconnect Hub
   • Video: Milestone Smart Wall inbegrepen
   • Doelgroep: Centrale meldkamers, smart cities, multinationale enterprise netwerken
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const renderStatusPill = (val: string, status: FeatureValueType, tierKey: string) => {
    const isHighlighted = highlightedTier === tierKey;

    if (status === 'yes') {
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
          isHighlighted ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
        }`}>
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{val}</span>
        </span>
      );
    }

    if (status === 'no') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-normal text-slate-400 bg-slate-50 border border-slate-200/60">
          <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{val}</span>
        </span>
      );
    }

    if (status === 'optional') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
          <Plus className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{val}</span>
        </span>
      );
    }

    return (
      <span className={`inline-block text-xs font-medium ${isHighlighted ? 'text-blue-900 font-semibold' : 'text-slate-700'}`}>
        {val}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Banner / Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200">
                Milestone XProtect VMS Matrix
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Officiële Productvergelijking</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Milestone XProtect Pakketten Vergelijking
            </h2>
            <p className="text-xs text-slate-600 max-w-3xl leading-relaxed">
              Vergelijk direct alle capaciteiten, failover-opties, videowall functies en multi-site mogelijkheden tussen <strong>Express+</strong>, <strong>Professional+</strong>, <strong>Expert</strong> en <strong>Corporate</strong>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Gekopieerd!' : 'Kopieer Samenvatting'}</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Afdrukken</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Interactive Tier Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MILESTONE_TIERS_OVERVIEW.map((tier) => {
          const isSelected = highlightedTier === tier.tier;
          const isRec = recommendedTier === tier.tier;

          return (
            <div
              key={tier.tier}
              onMouseEnter={() => setHighlightedTier(tier.tier)}
              onMouseLeave={() => setHighlightedTier(null)}
              className={`rounded-2xl border transition-all p-4 bg-white flex flex-col justify-between relative ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md scale-[1.01]' 
                  : isRec 
                    ? 'border-emerald-400 ring-1 ring-emerald-400/30 shadow-xs' 
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {isRec && (
                <div className="absolute -top-2.5 right-3 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Aanbevolen keuze
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeColor}`}>
                    {tier.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {tier.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed min-h-[34px]">
                  {tier.tagline}
                </p>

                <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Camera Limiet:</span>
                    <span className="font-semibold text-slate-900">{tier.maxDevices}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Recording Servers:</span>
                    <span className="font-semibold text-slate-900">{tier.recorders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Failover HA:</span>
                    <span className={`font-semibold ${tier.failover.includes('Hot') ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                      {tier.failover}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Smart Wall:</span>
                    <span className={`font-semibold ${tier.smartWall.includes('inbegrepen') ? 'text-purple-700 font-bold' : tier.smartWall.includes('Optioneel') ? 'text-amber-700' : 'text-slate-400'}`}>
                      {tier.smartWall}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100/80">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1.5">Sterke punten:</span>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {tier.keyStrengths.map((ks, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <Check className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />
                        <span>{ks}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {onSelectTier && (
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onSelectTier(tier.tier)}
                    className="w-full py-1.5 px-3 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 transition-colors flex items-center justify-center gap-1.5 group"
                  >
                    <span>Kies in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Interactive Quick Decision Guide / Kieshulp */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-card border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">Interactieve Kieshulp</span>
            </div>
            <h3 className="text-base font-bold text-white">
              Welk Milestone XProtect pakket past bij uw eisen?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Vink uw specifieke projectvereisten aan om direct te zien welke Milestone editie minimaal vereist is:
            </p>
          </div>

          <div className="p-3 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 text-right shrink-0">
            <span className="text-[11px] text-slate-300 block">Minimaal aanbevolen editie:</span>
            <span className="text-lg font-bold text-white tracking-tight flex items-center gap-2 justify-end mt-0.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              XProtect {recommendedTier}
            </span>
          </div>
        </div>

        {/* Checkbox grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-slate-700/60 text-xs">
          <label className="flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700/50">
            <input
              type="checkbox"
              checked={reqMoreThan100}
              onChange={(e) => setReqMoreThan100(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900"
            />
            <span className="text-slate-200">&gt; 100 Camera's / devices</span>
          </label>

          <label className="flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700/50">
            <input
              type="checkbox"
              checked={reqMultiServer}
              onChange={(e) => setReqMultiServer(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900"
            />
            <span className="text-slate-200">Meerdere Recording Servers</span>
          </label>

          <label className="flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700/50">
            <input
              type="checkbox"
              checked={reqFailover}
              onChange={(e) => setReqFailover(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900"
            />
            <span className="text-slate-200">Failover Servers (Hot/Cold)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700/50">
            <input
              type="checkbox"
              checked={reqSmartWall}
              onChange={(e) => setReqSmartWall(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900"
            />
            <span className="text-slate-200">Milestone Smart Wall (Videowall)</span>
          </label>

          <label className="flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700/50">
            <input
              type="checkbox"
              checked={reqMfaParent}
              onChange={(e) => setReqMfaParent(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900"
            />
            <span className="text-slate-200">Centrale MFA Parent Hub</span>
          </label>

          <label className="flex items-center gap-2.5 p-2 bg-slate-800/80 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors border border-slate-700/50">
            <input
              type="checkbox"
              checked={reqDualRecording}
              onChange={(e) => setReqDualRecording(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-600 bg-slate-900"
            />
            <span className="text-slate-200">Dual Recording (2x opname)</span>
          </label>
        </div>
      </div>

      {/* Filter and Search Bar for the Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {cat === 'all' ? 'Alle Categorieën' : cat}
              </button>
            ))}
          </div>

          {/* Search and Toggle */}
          <div className="flex items-center gap-2.5">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <input
                type="checkbox"
                checked={showOnlyDifferences}
                onChange={(e) => setShowOnlyDifferences(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <span>Alleen verschillen tonen</span>
            </label>

            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Zoek functie of term..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg shadow-2xs focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Full-Width Comparison Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[860px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90 sticky top-0 z-10 backdrop-blur-xs">
                <th className="py-3.5 px-4 font-bold text-slate-800 w-[28%] uppercase text-[10px] tracking-wider">
                  Specificatie / Functionaliteit
                </th>
                <th 
                  onMouseEnter={() => setHighlightedTier('Express+')}
                  onMouseLeave={() => setHighlightedTier(null)}
                  className={`py-3.5 px-3 font-bold text-emerald-800 w-[18%] border-l border-slate-200 transition-colors ${
                    highlightedTier === 'Express+' ? 'bg-emerald-50/80' : 'bg-emerald-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs">XProtect Express+</span>
                      <span className="text-[10px] font-normal text-emerald-600">Max. 100 Devices</span>
                    </div>
                  </div>
                </th>
                <th 
                  onMouseEnter={() => setHighlightedTier('Professional+')}
                  onMouseLeave={() => setHighlightedTier(null)}
                  className={`py-3.5 px-3 font-bold text-blue-800 w-[18%] border-l border-slate-200 transition-colors ${
                    highlightedTier === 'Professional+' ? 'bg-blue-50/80' : 'bg-blue-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs">XProtect Professional+</span>
                      <span className="text-[10px] font-normal text-blue-600">MKB / Multi-Server</span>
                    </div>
                  </div>
                </th>
                <th 
                  onMouseEnter={() => setHighlightedTier('Expert')}
                  onMouseLeave={() => setHighlightedTier(null)}
                  className={`py-3.5 px-3 font-bold text-indigo-800 w-[18%] border-l border-slate-200 transition-colors ${
                    highlightedTier === 'Expert' ? 'bg-indigo-50/80' : 'bg-indigo-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs">XProtect Expert</span>
                      <span className="text-[10px] font-normal text-indigo-600">Failover / High-Availability</span>
                    </div>
                  </div>
                </th>
                <th 
                  onMouseEnter={() => setHighlightedTier('Corporate')}
                  onMouseLeave={() => setHighlightedTier(null)}
                  className={`py-3.5 px-3 font-bold text-purple-800 w-[18%] border-l border-slate-200 transition-colors ${
                    highlightedTier === 'Corporate' ? 'bg-purple-50/80' : 'bg-purple-50/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs">XProtect Corporate</span>
                      <span className="text-[10px] font-normal text-purple-600">Enterprise / Smart Wall</span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {Object.keys(groupedFeatures).length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    <Info className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                    <span>Geen functionaliteiten gevonden die voldoen aan de zoekcriteria.</span>
                  </td>
                </tr>
              ) : (
                (Object.entries(groupedFeatures) as [string, MilestoneTierFeatureItem[]][]).map(([category, items]) => (
                  <React.Fragment key={category}>
                    {/* Category Header Row */}
                    <tr className="bg-slate-100/70 border-t-2 border-b border-slate-200">
                      <td colSpan={5} className="py-2.5 px-4 font-bold text-slate-800 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-3.5 bg-blue-600 rounded-xs" />
                          <span>{category}</span>
                          <span className="text-[10px] text-slate-500 font-normal">({items.length} functies)</span>
                        </div>
                      </td>
                    </tr>

                    {/* Features in Category */}
                    {items.map((feat, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/90 transition-colors">
                        <td className="py-3 px-4 text-slate-900 align-top">
                          <div className="space-y-0.5">
                            <span className="font-semibold text-xs text-slate-900 block">{feat.name}</span>
                            <span className="text-[11px] text-slate-500 leading-snug block">{feat.description}</span>
                          </div>
                        </td>
                        <td 
                          className={`py-3 px-3 border-l border-slate-100 align-top transition-colors ${
                            highlightedTier === 'Express+' ? 'bg-emerald-50/30' : ''
                          }`}
                        >
                          {renderStatusPill(feat.express.value, feat.express.status, 'Express+')}
                        </td>
                        <td 
                          className={`py-3 px-3 border-l border-slate-100 align-top transition-colors ${
                            highlightedTier === 'Professional+' ? 'bg-blue-50/30' : ''
                          }`}
                        >
                          {renderStatusPill(feat.professional.value, feat.professional.status, 'Professional+')}
                        </td>
                        <td 
                          className={`py-3 px-3 border-l border-slate-100 align-top transition-colors ${
                            highlightedTier === 'Expert' ? 'bg-indigo-50/30' : ''
                          }`}
                        >
                          {renderStatusPill(feat.expert.value, feat.expert.status, 'Expert')}
                        </td>
                        <td 
                          className={`py-3 px-3 border-l border-slate-100 align-top transition-colors ${
                            highlightedTier === 'Corporate' ? 'bg-purple-50/30' : ''
                          }`}
                        >
                          {renderStatusPill(feat.corporate.value, feat.corporate.status, 'Corporate')}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Alle Milestone XProtect software-edities delen dezelfde intuïtieve Smart Client, Web Client en Mobile App gebruikerservaring.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 shrink-0">
          Bron: Milestone Systems XProtect Product Comparison Matrix 2026
        </span>
      </div>
    </div>
  );
};
