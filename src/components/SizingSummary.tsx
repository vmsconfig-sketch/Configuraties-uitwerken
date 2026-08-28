import React from 'react';
import { 
  Calculator, 
  HardDrive, 
  Activity, 
  Cpu, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Server, 
  Network,
  Download,
  AlertCircle
} from 'lucide-react';
import { ArchitectureProject } from '../types';
import { calculateProjectSizing } from '../utils/calculator';

interface SizingSummaryProps {
  project: ArchitectureProject;
  onOpenReportModal?: () => void;
}

export const SizingSummary: React.FC<SizingSummaryProps> = ({ project, onOpenReportModal }) => {
  const sizing = calculateProjectSizing(project);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-card">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Sizing, Hardware & Milestone Licentieoverzicht (BOM)</h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time berekening van benodigde opslagcapaciteit, netwerkbandbreedte, server specificaties en Milestone XProtect licenties.
          </p>
        </div>

        {onOpenReportModal && (
          <button
            onClick={onOpenReportModal}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Genereer Offerte & BOM Rapport</span>
          </button>
        )}
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cameras */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Totaal Camera's</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{sizing.totalCameras}</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Verdeeld over {sizing.totalSites} site(s)</span>
        </div>

        {/* Total Storage */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Netto + RAID Opslag</span>
            <HardDrive className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{sizing.totalStorageTB} <span className="text-sm font-normal text-slate-500">TB</span></div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
            {sizing.totalLiveStorageTB} TB Live + {sizing.totalArchiveStorageTB} TB Archief
          </span>
        </div>

        {/* Total Ingress Bandwidth */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Netwerk Ingress</span>
            <Activity className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{sizing.totalIngressBandwidthMbps} <span className="text-sm font-normal text-slate-500">Mbps</span></div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            WAN Egress: ~{sizing.totalWanEgressBandwidthMbps} Mbps
          </span>
        </div>

        {/* Total Servers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between text-slate-500 mb-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Opnameservers</span>
            <Server className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900">{sizing.totalRecordingServers}</div>
          <span className="text-[11px] text-indigo-700 font-medium mt-1 block">
            + {sizing.totalFailoverServers} Failover Standby server(s)
          </span>
        </div>
      </div>

      {/* MILESTONE LICENSING BILL OF MATERIALS (BOM) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Milestone XProtect Licentieoverzicht (Bill of Materials)</h3>
              <span className="text-xs text-slate-500">Officiële benodigde Milestone licentiecomponenten voor deze architectuur</span>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {project.architectureType.toUpperCase()}
          </span>
        </div>

        {/* License Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] bg-slate-50/70">
                <th className="py-2.5 px-3 font-semibold">Licentietype</th>
                <th className="py-2.5 px-3 font-semibold">Beschrijving & Rol</th>
                <th className="py-2.5 px-3 text-center font-semibold">Aantal</th>
                <th className="py-2.5 px-3 text-right font-semibold">Status / Toelichting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {/* Base Licenses */}
              {sizing.licensingBOM.baseLicenses.map((base, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    {base.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    Centrale basislicentie voor het Management Server VMS platform.
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {base.count}x
                  </td>
                  <td className="py-3 px-3 text-right font-medium text-blue-700">
                    Verplicht (1 per autonome site)
                  </td>
                </tr>
              ))}

              {/* Standard Device Channel Licenses */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Milestone Device Channel License
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Apparaatlicentie per aangesloten fysieke IP videocamera of encoder kanaal.
                </td>
                <td className="py-3 px-3 text-center font-bold text-emerald-700">
                  {sizing.licensingBOM.deviceLicenses}x
                </td>
                <td className="py-3 px-3 text-right font-medium text-slate-600">
                  1 per camera op de lokale server
                </td>
              </tr>

              {/* Milestone Interconnect Device Licenses (If Applicable) */}
              {project.architectureType === 'interconnect' && (
                <tr className="hover:bg-amber-50/60 bg-amber-50/30 transition-colors">
                  <td className="py-3 px-3 font-bold text-amber-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Milestone Interconnect Camera License
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    Geactiveerd op de centrale <strong>XProtect Corporate</strong> server om remote sites/camera's te koppelen.
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-amber-800">
                    {sizing.licensingBOM.interconnectLicenses}x
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-amber-700">
                    Verplicht voor Interconnect Hub
                  </td>
                </tr>
              )}

              {/* Milestone Care Plus */}
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Milestone Care Plus (Software Assurance)
                </td>
                <td className="py-3 px-3 text-slate-600">
                  Gegarandeerde software updates (3x per jaar), cybersecurity patches, Customer Dashboard en Milestone Trade-in credits.
                </td>
                <td className="py-3 px-3 text-center font-bold text-slate-900">
                  {sizing.licensingBOM.carePlusRecommendedYears} Jaar
                </td>
                <td className="py-3 px-3 text-right font-medium text-emerald-700">
                  Sterk Aanbevolen
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* HARDWARE ENGINEERING RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Management Server Specs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Cpu className="w-4 h-4 text-blue-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Management Server & SQL Server Specificaties
              </h4>
              <span className="text-[11px] text-slate-500">Voor configuratie, logs, authenticatie en event verwerking</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Processor (CPU):</span>
              <strong className="text-slate-900 text-right">{sizing.serverHardwareRecommendations.managementServer.cpu}</strong>
            </div>
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Werkgeheugen (RAM):</span>
              <strong className="text-slate-900">{sizing.serverHardwareRecommendations.managementServer.ram}</strong>
            </div>
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">OS & SQL Schijven:</span>
              <strong className="text-slate-900 text-right">{sizing.serverHardwareRecommendations.managementServer.disk}</strong>
            </div>
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Besturingssysteem:</span>
              <strong className="text-slate-900 text-right">{sizing.serverHardwareRecommendations.managementServer.os}</strong>
            </div>
          </div>
        </div>

        {/* Recording Servers Specs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Server className="w-4 h-4 text-emerald-600" />
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recording Server(s) Specificaties
              </h4>
              <span className="text-[11px] text-slate-500">Berekend voor {sizing.totalIngressBandwidthMbps} Mbps continue video stream opname</span>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Processor (CPU):</span>
              <strong className="text-slate-900 text-right">{sizing.serverHardwareRecommendations.recordingServers.cpu}</strong>
            </div>
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Werkgeheugen (RAM):</span>
              <strong className="text-slate-900">{sizing.serverHardwareRecommendations.recordingServers.ram}</strong>
            </div>
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Storage Controller & I/O:</span>
              <strong className="text-slate-900 text-right text-[11px] max-w-[220px]">
                {sizing.serverHardwareRecommendations.recordingServers.storageIops}
              </strong>
            </div>
            <div className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500">Netwerkkaarten (NIC):</span>
              <strong className="text-slate-900">{sizing.serverHardwareRecommendations.recordingServers.nic}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
