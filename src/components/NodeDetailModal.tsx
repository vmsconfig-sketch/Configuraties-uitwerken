import React from 'react';
import { 
  X, 
  Server, 
  Database, 
  Camera, 
  HardDrive, 
  ShieldAlert, 
  Layers, 
  Activity, 
  Network, 
  Cpu, 
  MemoryStick, 
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { ServerNode, SiteModel, CameraGroup } from '../types';
import { MILESTONE_PORTS } from '../data/milestoneKnowledge';

interface NodeDetailModalProps {
  selectedNode: {
    type: 'server' | 'camera-group' | 'storage' | 'site' | 'client';
    data: any;
    site?: SiteModel;
  } | null;
  onClose: () => void;
}

export const NodeDetailModal: React.FC<NodeDetailModalProps> = ({ selectedNode, onClose }) => {
  if (!selectedNode) return null;

  const { type, data, site } = selectedNode;

  const getPortsForRole = (role: string) => {
    switch (role) {
      case 'management':
        return MILESTONE_PORTS.filter(p => [80, 443, 22331, 1433].includes(p.port));
      case 'recording':
      case 'failover-recording':
        return MILESTONE_PORTS.filter(p => [7563, 22331, 22332, 22333].includes(p.port));
      case 'mobile':
        return MILESTONE_PORTS.filter(p => [8081, 8082, 443].includes(p.port));
      case 'event':
        return MILESTONE_PORTS.filter(p => [22332, 1433].includes(p.port));
      case 'sql-database':
        return MILESTONE_PORTS.filter(p => [1433].includes(p.port));
      default:
        return MILESTONE_PORTS.slice(0, 3);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              {type === 'server' && <Server className="w-5 h-5" />}
              {type === 'camera-group' && <Camera className="w-5 h-5" />}
              {type === 'storage' && <HardDrive className="w-5 h-5" />}
              {type === 'site' && <Network className="w-5 h-5" />}
              {type === 'client' && <Layers className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                Milestone Component Details
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                {type === 'server' ? (data as ServerNode).name : (data.name || 'Component Specificaties')}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 text-xs text-slate-700">
          {/* Server Node Detail View */}
          {type === 'server' && (
            <>
              {/* Basic Server Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Server Rol</span>
                  <span className="text-slate-900 font-bold capitalize">{(data as ServerNode).role}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Hostname</span>
                  <span className="text-slate-800 font-mono text-[11px]">{(data as ServerNode).hostname || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">IP Adres</span>
                  <span className="text-slate-800 font-mono text-[11px]">{(data as ServerNode).ipAddress || '192.168.x.x'}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Site Locatie</span>
                  <span className="text-slate-800 font-medium">{site?.name || 'Centraal'}</span>
                </div>
              </div>

              {/* Hardware Specs */}
              {(data as ServerNode).specs && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                    <Cpu className="w-4 h-4 text-blue-600" />
                    Hardware & OS Specificaties
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">CPU Cores:</span>
                      <strong className="text-slate-800">{(data as ServerNode).specs?.cpuCores} vCPU / Cores</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Werkgeheugen (RAM):</span>
                      <strong className="text-slate-800">{(data as ServerNode).specs?.ramGb} GB ECC RAM</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Netwerk Interface:</span>
                      <strong className="text-slate-800">{(data as ServerNode).specs?.nicSpeedGbps} GbE NIC</strong>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-slate-500 block">Besturingssysteem:</span>
                      <strong className="text-slate-800">{(data as ServerNode).specs?.os}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Relevant Ports */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-2 text-xs">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Benodigde Firewall Poorten voor deze Server
                </h4>
                <div className="space-y-1.5">
                  {getPortsForRole((data as ServerNode).role).map((p) => (
                    <div key={p.port} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {p.port} {p.protocol}
                        </span>
                        <span className="text-slate-800 font-medium">{p.purpose}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.criticality === 'Verplicht' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {p.criticality}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Best Practices for this server */}
              <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 space-y-2">
                <h4 className="font-bold text-blue-800 flex items-center gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Milestone Certified Engineering Richtlijnen
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-700 list-disc list-inside">
                  <li>
                    <strong>Anti-Virus Uitsluitingen:</strong> Sluit <code className="bg-white border border-slate-200 px-1 py-0.5 rounded text-amber-700">%ProgramFiles%\Milestone</code> en alle opname- en archiefschijven uit van realtime scans.
                  </li>
                  <li>
                    <strong>Schijfcontroller:</strong> Schakel <em>Write-Through</em> of <em>Battery-Backed Write Cache (BBWC)</em> in voor recording storage pools om frame drops te voorkomen.
                  </li>
                  <li>
                    <strong>Netwerk:</strong> Gebruik dedicated NICs of VLAN voor camera multicast/unicast verkeer, gescheiden van client streaming.
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Camera Group Detail View */}
          {type === 'camera-group' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Aantal Camera's</span>
                  <span className="text-slate-900 text-base font-bold">{(data as CameraGroup).count} Kanalen</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Resolutie</span>
                  <span className="text-blue-700 font-bold">{(data as CameraGroup).resolution}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Videocodec</span>
                  <span className="text-emerald-700 font-bold">{(data as CameraGroup).codec}</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block font-medium">Framerate (FPS)</span>
                  <span className="text-amber-700 font-bold">{(data as CameraGroup).fps} FPS</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Opnamemodus & Retentie</h4>
                <div className="grid grid-cols-2 gap-4 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Opnamemethode:</span>
                    <strong className="text-slate-800 capitalize">{(data as CameraGroup).recordingMode}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Bewaarperiode (Retentie):</span>
                    <strong className="text-slate-800">{(data as CameraGroup).retentionDays} Dagen</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Gemiddelde Bitrate per Camera:</span>
                    <strong className="text-slate-800">{(data as CameraGroup).bitrateKbps} Kbps</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Totale Bandbreedte Groep:</span>
                    <strong className="text-blue-700 font-bold">
                      {Math.round(((data as CameraGroup).count * (data as CameraGroup).bitrateKbps) / 1000)} Mbps
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Storage Detail View */}
          {type === 'storage' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">Tier 1: Live Storage Configuratie</h4>
                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Live Bewaartermijn:</span>
                    <strong className="text-slate-800">{site?.storage.liveStorageDays} Dagen</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Schijftype:</span>
                    <strong className="text-blue-700 capitalize">{site?.storage.liveStorageType.replace('-', ' ')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">RAID Niveau:</span>
                    <strong className="text-emerald-700">{site?.storage.liveStorageRaid}</strong>
                  </div>
                </div>
              </div>

              {site?.storage.archiveEnabled && (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs">Tier 2: Archief Storage Configuratie</h4>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Archief Bewaartermijn:</span>
                      <strong className="text-slate-800">{site?.storage.archiveStorageDays} Dagen</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Archief Type:</span>
                      <strong className="text-blue-700 capitalize">{site?.storage.archiveStorageType.replace('-', ' ')}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">RAID / Opslag Pool:</span>
                      <strong className="text-emerald-700">{site?.storage.archiveStorageRaid}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
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
