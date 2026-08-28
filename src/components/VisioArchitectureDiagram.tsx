import React, { useState } from 'react';
import { 
  Server, 
  Video, 
  Monitor, 
  Smartphone, 
  Database, 
  Layers, 
  HardDrive, 
  Globe, 
  Radio, 
  Cable, 
  Wifi, 
  ShieldCheck, 
  ArrowUp, 
  Building, 
  Laptop,
  MapPin,
  Scan,
  Compass,
  Flame,
  Maximize2,
  Cpu,
  ZoomIn, 
  ZoomOut, 
  RotateCcw
} from 'lucide-react';
import { 
  ArchitectureState, 
  CameraTypeConfig,
  SiteLocation
} from './FocusedArchitectureStudio';

interface VisioArchitectureDiagramProps {
  config: ArchitectureState;
}

export const VisioArchitectureDiagram: React.FC<VisioArchitectureDiagramProps> = ({ config }) => {
  const [zoom, setZoom] = useState<number>(1);

  // Active camera types: only those enabled AND with count > 0
  const activeCameraTypes = config.cameraTypes.filter(t => t.enabled && t.count > 0);

  // Active sites with cameras > 0 or recorders > 0
  const activeSites = config.sites.filter(s => s.recorders > 0 || s.cameras > 0);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.3, Math.max(0.75, Number((prev + delta).toFixed(1)))));
  };

  const resetZoom = () => setZoom(1);

  // Network connection helper
  const getNetworkIconAndLabel = () => {
    switch (config.network) {
      case 'fiber-wan':
        return { name: 'Glasvezel / WAN', icon: Globe };
      case 'vpn-ipsec':
        return { name: 'VPN / IPSec', icon: ShieldCheck };
      case 'cellular-4g5g':
        return { name: '4G / 5G Mobiel', icon: Radio };
      case 'internet-cloud':
        return { name: 'Internet (HTTPS)', icon: Wifi };
      default:
        return { name: 'Lokaal LAN', icon: Cable };
    }
  };

  const net = getNetworkIconAndLabel();
  const NetIcon = net.icon;

  // Helper for camera type icon
  const getCamIcon = (iconType: CameraTypeConfig['iconType']) => {
    switch (iconType) {
      case '4k': return Video;
      case 'ptz': return Compass;
      case 'thermal': return Flame;
      case 'anpr': return Scan;
      case 'panoramic': return Maximize2;
      case 'multisensor': return Cpu;
      default: return Video;
    }
  };

  // Calculate camera breakdown per site
  const getSiteCameraTypes = (site: SiteLocation) => {
    if (site.cameras <= 0 || activeCameraTypes.length === 0) return [];

    if (activeSites.length === 1) {
      return activeCameraTypes.filter(t => t.count > 0);
    }

    const totalSiteCams = activeSites.reduce((sum, s) => sum + s.cameras, 0);
    if (totalSiteCams === 0) return [];

    const ratio = site.cameras / totalSiteCams;

    // Proportional camera counts for this location
    const allocated = activeCameraTypes.map(t => {
      const rawCount = t.count * ratio;
      const rounded = Math.round(rawCount);
      return {
        ...t,
        count: rounded
      };
    });

    const valid = allocated.filter(t => t.count > 0);

    // Fallback if rounding dropped all counts but site has cameras
    if (valid.length === 0 && site.cameras > 0 && activeCameraTypes.length > 0) {
      const dominantType = [...activeCameraTypes].sort((a, b) => b.count - a.count)[0];
      return [{ ...dominantType, count: site.cameras }];
    }

    return valid;
  };

  // Determine which client items to show
  const showSmartClient = config.clients > 0;
  const showMobileClient = config.mobileServers > 0;
  const showWebClient = config.mobileServers > 0 || config.clients > 0;
  const hasClientsLayer = showSmartClient || showWebClient || showMobileClient;

  // Management layer items
  const showMgmtServer = config.managementServers > 0;
  const showSqlDb = config.managementServers > 0;
  const showMobileServer = config.mobileServers > 0;
  const hasMgmtLayer = showMgmtServer || showSqlDb || showMobileServer;

  // Locations / Sites with servers or cameras
  const hasSitesLayer = activeSites.length > 0;

  return (
    <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-card flex flex-col">
      {/* Minimal Toolbar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-700" />
          <span className="font-bold text-slate-800">Systeem Architectuur Overzicht</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            disabled={zoom <= 0.75}
            className="p-1 hover:bg-slate-100 disabled:opacity-40 text-slate-600 rounded transition-colors"
            title="Uitzoomen"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-1.5 text-[11px] font-bold text-slate-700 min-w-[36px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => handleZoom(0.1)}
            disabled={zoom >= 1.3}
            className="p-1 hover:bg-slate-100 disabled:opacity-40 text-slate-600 rounded transition-colors"
            title="Inzoomen"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition-colors border-l border-slate-200 ml-0.5"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Diagram Area: Pure Icons and Concise Labels */}
      <div 
        className="relative w-full overflow-x-auto bg-[#F8FAFC] min-h-[580px] p-6 select-none flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: 'center center'
        }}
      >
        <div 
          className="transition-transform duration-200 origin-center w-full max-w-4xl space-y-4"
          style={{ transform: `scale(${zoom})` }}
        >
          
          {/* ========================================================= */}
          {/* LAAG 4 (BOVEN): CLIENTS & UITKIJK                         */}
          {/* ========================================================= */}
          {hasClientsLayer && (
            <div className="border border-cyan-300 bg-white rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-600"></span>
                Clients {config.clients > 0 ? `(${config.clients} werkplekken)` : ''}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Smart Client */}
                {showSmartClient && (
                  <div className="bg-cyan-50/70 border border-cyan-200 rounded-lg p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-2xs mb-1.5">
                      <Monitor className="w-6 h-6" />
                    </div>
                    <strong className="text-xs font-bold text-slate-900">Smart Client</strong>
                    <span className="text-[11px] font-semibold text-cyan-700">{config.clients}x</span>
                  </div>
                )}

                {/* Web Client */}
                {showWebClient && (
                  <div className="bg-cyan-50/70 border border-cyan-200 rounded-lg p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-cyan-700 text-white flex items-center justify-center shadow-2xs mb-1.5">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <strong className="text-xs font-bold text-slate-900">Web Client</strong>
                    <span className="text-[11px] font-semibold text-cyan-700">Browser</span>
                  </div>
                )}

                {/* Mobile Client */}
                {showMobileClient && (
                  <div className="bg-cyan-50/70 border border-cyan-200 rounded-lg p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-2xs mb-1.5">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <strong className="text-xs font-bold text-slate-900">Mobile Client</strong>
                    <span className="text-[11px] font-semibold text-purple-700">App (iOS / Android)</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pijl Naar Boven als Clients en Management beide getoond worden */}
          {hasClientsLayer && hasMgmtLayer && (
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1.5 text-slate-400 bg-white px-3 py-0.5 rounded-full border border-slate-200 text-[11px] font-bold shadow-2xs">
                <ArrowUp className="w-3.5 h-3.5 text-cyan-600" />
                <span>Videostromen & Autorisatie</span>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* LAAG 3 (MIDDEN): MANAGEMENT, DATABASE & MOBILE SERVER     */}
          {/* ========================================================= */}
          {hasMgmtLayer && (
            <div className="border border-blue-300 bg-white rounded-xl p-3.5 shadow-2xs">
              <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Beheer & Database ({config.managementServers} Management Server{config.managementServers > 1 ? 's' : ''})
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Management Server */}
                {showMgmtServer && (
                  <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-2xs mb-1.5">
                      <Server className="w-6 h-6" />
                    </div>
                    <strong className="text-xs font-bold text-slate-900">Management Server</strong>
                    <span className="text-[11px] font-semibold text-blue-700">{config.managementServers}x</span>
                  </div>
                )}

                {/* SQL Database */}
                {showSqlDb && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-2xs mb-1.5">
                      <Database className="w-6 h-6" />
                    </div>
                    <strong className="text-xs font-bold text-slate-900">SQL Database</strong>
                    <span className="text-[11px] font-semibold text-slate-600">Configuratie</span>
                  </div>
                )}

                {/* Mobile Server */}
                {showMobileServer && (
                  <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-3 flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-2xs mb-1.5">
                      <Smartphone className="w-6 h-6" />
                    </div>
                    <strong className="text-xs font-bold text-slate-900">Mobile Server</strong>
                    <span className="text-[11px] font-semibold text-indigo-700">{config.mobileServers}x Gateway</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* NETWERK / VERBINDING BALK */}
          <div className="bg-slate-800 text-white rounded-lg px-4 py-2 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <NetIcon className="w-4 h-4 text-blue-400" />
              <span className="font-bold">{net.name}</span>
            </div>
            <span className="text-slate-300 text-[11px]">
              {activeSites.length} Actieve Locatie{activeSites.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* ========================================================= */}
          {/* LAAG 2 & 1: LOCATIES (RECORDING SERVERS & CAMERA'S)        */}
          {/* ========================================================= */}
          {hasSitesLayer && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Locaties & Camera's ({activeSites.length} Locatie{activeSites.length > 1 ? 's' : ''})</span>
                </div>
                <span className="text-[11px] font-bold text-slate-600">
                  Totaal {config.cameras} Camera's • {config.recorders} Recording Server{config.recorders > 1 ? 's' : ''}
                </span>
              </div>

              <div className={`grid gap-3.5 ${activeSites.length === 1 ? 'grid-cols-1' : activeSites.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                {activeSites.map((site) => {
                  const siteCams = getSiteCameraTypes(site);
                  const hasRecorders = site.recorders > 0;
                  const hasCams = siteCams.length > 0;

                  return (
                    <div key={site.id} className="border border-slate-300 bg-white rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                      <div>
                        {/* Site Header */}
                        <div className="flex items-start justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                              {site.type === 'hq' ? <Building className="w-4 h-4 text-blue-600" /> : <MapPin className="w-4 h-4 text-emerald-600" />}
                            </div>
                            <div className="min-w-0">
                              <strong className="text-xs font-bold text-slate-900 block truncate leading-tight">
                                {site.name}
                              </strong>
                              <span className="text-[10px] font-semibold text-slate-500">
                                {site.type === 'hq' ? 'Hoofdlocatie' : 'Externe Locatie'}
                              </span>
                            </div>
                          </div>
                          {site.cameras > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 shrink-0">
                              {site.cameras} Cams
                            </span>
                          )}
                        </div>

                        {/* Recording Server on this Site */}
                        {hasRecorders && (
                          <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2.5 mb-2.5">
                            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <HardDrive className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <strong className="text-xs font-bold text-slate-900 block truncate">
                                Recording Server
                              </strong>
                              <span className="text-[11px] font-bold text-emerald-700">
                                {site.recorders}x Server{site.recorders > 1 ? 's' : ''}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Stream arrow if both recording server and cameras exist on this site */}
                        {hasRecorders && hasCams && (
                          <div className="flex items-center justify-center my-1.5">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                              <ArrowUp className="w-3 h-3 text-purple-600" />
                              <span>Lokale Videostreams (RTSP)</span>
                            </div>
                          </div>
                        )}

                        {/* Camera Icons under this specific location */}
                        {hasCams && (
                          <div className="border border-purple-200 bg-purple-50/40 rounded-lg p-2.5">
                            <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider mb-2 flex items-center justify-between">
                              <span>Camera's ({site.cameras}x)</span>
                              <span className="text-purple-600 font-semibold">{siteCams.length} Typen</span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5">
                              {siteCams.map((camType) => {
                                const Icon = getCamIcon(camType.iconType);
                                return (
                                  <div key={camType.id} className="bg-white border border-purple-200 rounded-md p-1.5 flex items-center gap-2 shadow-2xs">
                                    <div className="w-7 h-7 rounded bg-purple-600 text-white flex items-center justify-center shrink-0">
                                      <Icon className="w-3.5 h-3.5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <strong className="text-[11px] font-bold text-slate-900 block truncate leading-tight">
                                        {camType.shortName}
                                      </strong>
                                      <span className="text-[10px] font-bold text-purple-700">
                                        {camType.count}x
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
