import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Network, 
  Server, 
  Wifi, 
  DollarSign, 
  HelpCircle,
  TrendingUp,
  Cpu,
  Shield,
  Zap,
  Info
} from 'lucide-react';
import { ArchitectureRecommendation, ArchitectureType } from '../types';
import { WIZARD_QUESTIONS, calculateWizardRecommendation, PRESET_ARCHITECTURES } from '../data/milestoneKnowledge';

interface WizardProps {
  onApplyRecommendation: (type: ArchitectureType) => void;
  onViewDetails: (type: ArchitectureType) => void;
}

export const Wizard: React.FC<WizardProps> = ({ onApplyRecommendation, onViewDetails }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    siteCount: '6-25',
    networkCondition: 'low-wan',
    autonomy: 'isolated-independent',
    streamingStrategy: 'local-record-demand-pull',
    licensingPreference: 'any-optimal'
  });

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const recommendations = calculateWizardRecommendation(answers);
  const bestMatch = recommendations[0];

  const handleSelectOption = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const getArchitectureIcon = (type: ArchitectureType) => {
    switch (type) {
      case 'interconnect':
        return <Wifi className="w-5 h-5 text-amber-400" />;
      case 'federated':
        return <Network className="w-5 h-5 text-emerald-400" />;
      case 'multi-site':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'single-site':
        return <Server className="w-5 h-5 text-blue-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 50) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 30) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-600 bg-slate-100 border-slate-200';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Intro Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-card relative overflow-hidden">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Intelligente Milestone Topologie Adviseur</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welke Milestone Architectuur Past Bij Uw Situatie?
          </h2>
          <p className="text-sm text-slate-600 mt-2 leading-relaxed">
            Geef uw locaties, netwerkcondities, beheerwensen en videostrategie in. Ons adviessysteem berekent direct de match score tussen 
            <strong className="text-slate-800"> Milestone Interconnect</strong>, <strong className="text-slate-800"> Milestone Federated Architecture (MFA)</strong>, 
            <strong className="text-slate-800"> Multi-Site</strong> en <strong className="text-slate-800"> Single Site</strong>.
          </p>
        </div>
      </div>

      {/* Main Grid: Questionnaire on Left, Live Recommendations on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Questionnaire */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                Vragenlijst & Specificaties
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                5 Vragen • Real-time analyse
              </span>
            </div>

            <div className="space-y-6">
              {WIZARD_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="space-y-2.5">
                  <label className="text-xs font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    {q.question}
                  </label>
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = answers[q.id] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectOption(q.id, opt.value)}
                          className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-600 text-blue-900 font-semibold shadow-xs ring-1 ring-blue-500'
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="leading-relaxed">{opt.label}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Recommendation Cards */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Aanbevelingen op Basis van Uw Invoer
            </h3>
            <span className="text-xs text-slate-500">Gesorteerd op geschiktheid</span>
          </div>

          {/* Top Recommendation Highlight Card */}
          <div className="bg-white border-2 border-blue-600 rounded-2xl p-6 shadow-card relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  {getArchitectureIcon(bestMatch.type)}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Beste Match
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">{bestMatch.dutchTitle}</h4>
                </div>
              </div>

              <div className={`px-3 py-1.5 rounded-lg border text-sm font-bold flex items-center gap-1.5 ${getScoreColor(bestMatch.matchScore)}`}>
                <span>{bestMatch.matchScore}%</span>
                <span className="text-[10px] font-medium opacity-80">Match</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {bestMatch.summary}
            </p>

            {/* Key benefits list */}
            <div className="space-y-2 mb-5">
              <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                Waarom deze architectuur voor u?
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {bestMatch.keyBenefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Network & Licensing Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Netwerk Impact</span>
                <span className="text-slate-800 font-semibold">{bestMatch.bandwidthRequirements}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block font-medium">Ondersteunde Milestone Tiers</span>
                <span className="text-blue-700 font-semibold">{bestMatch.recommendedTiers.join(', ')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id={`btn-apply-${bestMatch.type}`}
                onClick={() => onApplyRecommendation(bestMatch.type)}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/25 transition-all flex items-center justify-center gap-2"
              >
                <span>Genereer & Open in Topologie Diagram</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Other 3 Architectures for comparison */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Alternatieve Architectuur Opties
            </h4>

            {recommendations.slice(1).map((rec) => (
              <div
                key={rec.type}
                className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 shadow-xs transition-all"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                      {getArchitectureIcon(rec.type)}
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-800">{rec.dutchTitle}</h5>
                      <span className="text-[11px] text-slate-500">{rec.bestFitScenario}</span>
                    </div>
                  </div>

                  <div className={`px-2.5 py-1 rounded-md border text-xs font-bold ${getScoreColor(rec.matchScore)}`}>
                    {rec.matchScore}%
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 line-clamp-2">
                  {rec.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500">
                    Tiers: <strong className="text-slate-700">{rec.recommendedTiers.join(', ')}</strong>
                  </span>
                  <button
                    onClick={() => onApplyRecommendation(rec.type)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Kies deze opzet</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
