import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  HardDrive, 
  Server, 
  Activity,
  Layers,
  Network
} from 'lucide-react';
import { ArchitectureProject } from '../types';
import { calculateProjectSizing } from '../utils/calculator';

interface ExportModalProps {
  project: ArchitectureProject;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sizing = calculateProjectSizing(project);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(project, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Technisch Architectuur Dossier & Specificaties
              </h3>
              <span className="text-xs text-slate-500">
                Milestone XProtect VMS Ontwerp • Gereed voor PDF & Print
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Gekopieerd' : 'Kopieer JSON'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Afdrukken / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-dossier" className="p-6 sm:p-8 space-y-6 text-slate-800 text-xs bg-white">
          {/* Document Header */}
          <div className="border-b-2 border-blue-600 pb-4 flex justify-between items-end">
            <div>
              <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Milestone Solution Design Document
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">{project.title}</h1>
              <p className="text-xs text-slate-500 mt-1">Sector: {project.globalSettings.customerSector} • Auteur: {project.author}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase block">
                {project.architectureType}
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Datum: {project.updatedAt}</span>
            </div>
          </div>

          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Totaal Camera's</span>
              <strong className="text-lg font-bold text-slate-900">{sizing.totalCameras}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Aantal Sites</span>
              <strong className="text-lg font-bold text-slate-900">{sizing.totalSites}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Netto Opslag (TB)</span>
              <strong className="text-lg font-bold text-emerald-700">{sizing.totalStorageTB} TB</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-medium">Netwerk Ingress</span>
              <strong className="text-lg font-bold text-blue-700">{sizing.totalIngressBandwidthMbps} Mbps</strong>
            </div>
          </div>

          {/* SITES BREAKDOWN */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <Network className="w-4 h-4 text-blue-600" />
              1. Locaties & Architectuur Sitedetails
            </h3>

            <div className="space-y-3">
              {project.sites.map((site) => (
                <div key={site.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 text-xs">{site.name}</strong>
                      <span className="text-[11px] text-slate-500 ml-2">({site.locationName})</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      Milestone XProtect {site.milestoneTier}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>Rol: <strong className="text-slate-900 capitalize">{site.role}</strong></div>
                    <div>Netwerk: <strong className="text-slate-900">{site.networkType}</strong></div>
                    <div>Servers: <strong className="text-slate-900">{site.servers.length}x</strong></div>
                    <div>Camera's: <strong className="text-blue-700">{site.cameraGroups.reduce((a, b) => a + b.count, 0)}x</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LICENSING BILL OF MATERIALS */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Milestone Licentieoverzicht (BOM)
            </h3>

            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase">
                <tr>
                  <th className="p-2.5 font-semibold">Omschrijving</th>
                  <th className="p-2.5 text-center font-semibold">Aantal</th>
                  <th className="p-2.5 font-semibold">Doel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {sizing.licensingBOM.baseLicenses.map((base, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-bold text-slate-900">{base.name}</td>
                    <td className="p-2.5 text-center font-bold text-slate-900">{base.count}</td>
                    <td className="p-2.5 text-slate-600">VMS Basislicentie voor Management Server</td>
                  </tr>
                ))}
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Milestone Device Channel Licenses</td>
                  <td className="p-2.5 text-center font-bold text-emerald-700">{sizing.licensingBOM.deviceLicenses}</td>
                  <td className="p-2.5 text-slate-600">Camera kanaallicenties op lokale opnameservers</td>
                </tr>
                {project.architectureType === 'interconnect' && (
                  <tr className="hover:bg-amber-50/50 bg-amber-50/20">
                    <td className="p-2.5 font-bold text-amber-900">Milestone Interconnect Device Licenses</td>
                    <td className="p-2.5 text-center font-bold text-amber-800">{sizing.licensingBOM.interconnectLicenses}</td>
                    <td className="p-2.5 text-slate-700">Actief op centrale Corporate server voor remote camera's</td>
                  </tr>
                )}
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-900">Milestone Care Plus Software Assurance</td>
                  <td className="p-2.5 text-center font-bold text-slate-900">3 Jaar</td>
                  <td className="p-2.5 text-slate-600">Software updates, security patches & support dekking</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
