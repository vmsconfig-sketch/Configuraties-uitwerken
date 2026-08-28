import React, { useState } from 'react';
import { 
  ArchitectureState, 
  CameraTypeConfig, 
  SiteLocation 
} from './FocusedArchitectureStudio';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowDown,
  Building,
  MapPin,
  Cloud
} from 'lucide-react';

interface MilestoneArchitectureStackProps {
  config: ArchitectureState;
}

export const MilestoneArchitectureStack: React.FC<MilestoneArchitectureStackProps> = ({ config }) => {
  const [zoom, setZoom] = useState<number>(1);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.3, Math.max(0.7, Number((prev + delta).toFixed(1)))));
  };

  const resetZoom = () => setZoom(1);

  // Active camera types (only enabled and count > 0)
  const activeCameraTypes = config.cameraTypes.filter(t => t.enabled && t.count > 0);

  // Active sites with cameras > 0 or recorders > 0 or managementServers > 0
  const activeSites = config.sites.filter(s => s.recorders > 0 || s.cameras > 0 || s.managementServers > 0);
  const displaySites = activeSites.length > 0 ? activeSites : config.sites;

  // Camera distribution per location
  const getSiteCameras = (site: SiteLocation) => {
    if (site.cameras <= 0 || activeCameraTypes.length === 0) return [];
    if (displaySites.length === 1) {
      return activeCameraTypes;
    }
    const totalCams = displaySites.reduce((sum, s) => sum + s.cameras, 0) || 1;
    const ratio = site.cameras / totalCams;
    const allocated = activeCameraTypes.map(t => ({
      ...t,
      count: Math.max(1, Math.round(t.count * ratio))
    })).filter(t => t.count > 0);

    return allocated.length > 0 ? allocated : [{ ...activeCameraTypes[0], count: site.cameras }];
  };

  // Visibility flags (strictly hide when 0)
  const showSmartClient = config.clients > 0;
  const showMobileClient = config.mobileServers > 0;
  const showWebClient = config.mobileServers > 0 || config.clients > 0;
  const hasClientsLayer = showSmartClient || showWebClient || showMobileClient;

  const showMgmtServer = config.managementServers > 0;
  const showSqlDb = config.managementServers > 0;
  const showMobileServer = config.mobileServers > 0;
  const hasMgmtLayer = showMgmtServer || showSqlDb || showMobileServer;

  const hasLocationsLayer = displaySites.some(s => s.recorders > 0 || s.cameras > 0);

  // Single-Site "combined" topology: Management + SQL + Recording (+ Mobile) run on one physical
  // server instead of dedicated boxes per role. The primary site is the one hosting the Management Server.
  const isCombinedSingleSite = config.architecture === 'single-site' && config.singleSiteServerTopology === 'combined';
  const primarySite = isCombinedSingleSite ? displaySites.find(s => s.managementServers > 0) : undefined;

  // Federated & Interconnect: every location is its own standalone Milestone install (own Management
  // Server + SQL + Recording + Mobile), so there is no single shared Management tier to draw — each
  // site card gets its own Management Server box instead.
  const isPerSiteManagement = config.architecture === 'federated' || config.architecture === 'interconnect';

  // For Federated/Interconnect: the hoofdlocatie sits physically above the sub-locations in the hierarchy,
  // linked over a WAN/cloud connection — not drawn as an equal peer in the same grid.
  const hqSite = isPerSiteManagement ? (displaySites.find(s => s.type === 'hq') || displaySites[0]) : undefined;
  const subSites = isPerSiteManagement && hqSite ? displaySites.filter(s => s.id !== hqSite.id) : [];

  const renderSiteCard = (site: SiteLocation, wide: boolean = false) => {
    const siteCams = getSiteCameras(site);
    const hasRec = site.recorders > 0;
    const hasCams = siteCams.length > 0;
    // This site's Management/SQL/Recording already appear combined in the "Alles-in-1 Server" box above.
    const isPrimaryCombined = isCombinedSingleSite && primarySite?.id === site.id;

    const headerBlock = (
      <div className="flex items-start justify-between gap-2 pb-2.5 mb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200">
            {config.architecture !== 'single-site' && site.type === 'hq' ? (
              <Building className="w-4 h-4 text-[#0080C8]" />
            ) : (
              <MapPin className="w-4 h-4 text-emerald-600" />
            )}
          </div>
          <div className="min-w-0">
            <strong className="text-xs font-bold text-slate-900 block truncate">
              {site.name}
            </strong>
            <span className="text-[10px] font-semibold text-slate-500">
              {config.architecture === 'single-site'
                ? 'Gebouw / Locatie (zelfde LAN)'
                : site.type === 'hq'
                ? 'Centrale Hoofdlocatie'
                : 'Satelliet / Nevenlocatie'}
            </span>
          </div>
        </div>
        {site.cameras > 0 && (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 shrink-0 border border-purple-200">
            {site.cameras} Cams
          </span>
        )}
      </div>
    );

    // Smart Clients — who views this location — sits at the top of the block, above Management/Recording,
    // so the card reads top-down in hierarchical order: Clients -> Management -> Recording -> Cameras.
    const clientsBlock = isPerSiteManagement && site.clients > 0 && (
      <div className="flex items-center gap-2.5 bg-sky-50/70 border border-sky-200 rounded-lg p-2.5 mb-3">
        <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0">
          <SmartClientIcon />
        </div>
        <div>
          <strong className="text-xs font-bold text-slate-900 block">Smart Clients</strong>
          <span className="text-[10px] text-slate-500">
            {site.clients}x lokale operator werkplek{site.clients > 1 ? 'ken' : ''}
          </span>
        </div>
      </div>
    );

    // Management Server for this location — full self-contained box for Federated/Interconnect,
    // since every site there is its own standalone Milestone install (own Mgmt + SQL + Mobile).
    const mgmtBlock = isPerSiteManagement && site.managementServers > 0 && !isPrimaryCombined && (
      <div className="bg-blue-50/70 border border-blue-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <strong className="text-xs font-bold text-slate-900">Management Server</strong>
            {site.tier && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-white text-blue-700 border border-blue-300">
                {site.tier.replace('XProtect ', '')}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
            {site.managementServers}x Node{site.managementServers > 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <MilestoneServerTower badges={site.mobileServers > 0 ? ['gear', 'database', 'mobile'] : ['gear', 'database']} />
          <ul className="text-[11px] text-slate-600 leading-relaxed space-y-0.5">
            <li>Service Channel</li>
            <li>Event Server</li>
            <li>SQL Server</li>
            <li>Log Server</li>
            {site.mobileServers > 0 && <li>Mobile Server ({site.mobileServers}x)</li>}
          </ul>
        </div>
        <div className="text-[10px] text-slate-500 border-t border-blue-200/60 pt-1.5 mt-2">
          Autonome, zelfstandige installatie op deze locatie
        </div>
      </div>
    );

    // Fallback small badges: other architectures, or a per-site Mobile Server without its own Management Server
    const fallbackBadges = !(isPerSiteManagement && site.managementServers > 0) && (site.managementServers > 0 || site.mobileServers > 0) && !isPrimaryCombined && (
      <div className="flex flex-wrap items-center gap-1.5 mb-3 -mt-1">
        {site.managementServers > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            {site.managementServers}x Mgmt Server{site.managementServers > 1 ? 's' : ''}
          </span>
        )}
        {site.mobileServers > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            {site.mobileServers}x Mobile Server{site.mobileServers > 1 ? 's' : ''}
          </span>
        )}
      </div>
    );

    // Local Recording Servers on this location - VISUALLY RENDERING EACH SERVER
    const recordingBlock = hasRec && !isPrimaryCombined && (
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3 mb-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-1.5">
          <strong className="text-xs font-bold text-slate-900">
            Recording Server Pool
          </strong>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              {site.recorders}x Dedicated Server{site.recorders > 1 ? 's' : ''}
            </span>
            {site.failoverRecorders > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-800 border border-orange-200">
                +{site.failoverRecorders}x Failover (Hot/Cold)
              </span>
            )}
          </div>
        </div>

        {/* Render ALL individual server towers side-by-side! Failover towers get a dashed ring to mark them as standby, not extra capacity. */}
        <div className="flex flex-wrap items-end gap-3 my-2 py-1">
          {Array.from({ length: site.recorders }).map((_, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <MilestoneServerTower badges={['record']} />
              <span className="text-[9px] font-bold text-emerald-800 mt-1">
                {site.recorders > 1 ? `Recorder ${idx + 1}` : 'Recording Server'}
              </span>
            </div>
          ))}
          {Array.from({ length: site.failoverRecorders }).map((_, idx) => (
            <div key={`fo-${idx}`} className="flex flex-col items-center opacity-80">
              <div className="rounded-md ring-2 ring-orange-400 ring-offset-2 ring-offset-emerald-50/70">
                <MilestoneServerTower badges={['record']} />
              </div>
              <span className="text-[9px] font-bold text-orange-700 mt-1">
                Standby {idx + 1}
              </span>
            </div>
          ))}
        </div>

        <div className="text-[10px] text-slate-500 border-t border-emerald-200/60 pt-1.5 mt-1 flex justify-between">
          <span>Lokale Archivering</span>
          <span className="font-semibold text-emerald-700">
            {site.failoverRecorders > 0 ? 'Redundante Opname (Failover)' : 'Directe Video Streaming'}
          </span>
        </div>
      </div>
    );

    const streamIndicator = hasRec && hasCams && (
      <div className="flex items-center justify-center my-2">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
          <ArrowDown className="w-3 h-3 text-purple-600" />
          <span>Lokale Camerastromen (RTSP / ONVIF)</span>
        </div>
      </div>
    );

    // Camera breakdown under this location
    const cameraBlock = hasCams && (
      <div className="bg-purple-50/40 border border-purple-200 rounded-lg p-3">
        <div className="text-[10px] font-bold text-purple-900 uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Aangesloten Camera's ({site.cameras}x)</span>
          <span className="text-purple-700 font-semibold">{siteCams.length} Typen</span>
        </div>

        <div className="grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
          {siteCams.map((cam) => (
            <div
              key={cam.id}
              className="bg-white border border-purple-200 rounded-lg p-2.5 flex items-center gap-2.5 shadow-2xs min-w-0"
            >
              <div className="w-9 h-9 rounded-md bg-[#0B374D] flex items-center justify-center shrink-0">
                <MilestoneCameraIcon iconType={cam.iconType} />
              </div>
              <div className="min-w-0 flex-1">
                <strong className="text-[11px] font-bold text-slate-900 block truncate leading-tight">
                  {cam.name}
                </strong>
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <span className="text-[10px] font-bold text-purple-700 shrink-0">
                    {cam.count}x Camera
                  </span>
                  <span className="text-[9px] text-slate-400 truncate">
                    {cam.shortName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div
        key={site.id}
        className="bg-white border-2 border-slate-300 hover:border-blue-400 transition-colors rounded-xl p-4 shadow-sm"
      >
        {headerBlock}
        {clientsBlock}
        {wide ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                {mgmtBlock}
                {fallbackBadges}
              </div>
              <div>
                {recordingBlock}
              </div>
            </div>
            {streamIndicator}
            {cameraBlock}
          </>
        ) : (
          <>
            {mgmtBlock}
            {fallbackBadges}
            {recordingBlock}
            {streamIndicator}
            {cameraBlock}
          </>
        )}
      </div>
    );
  };

  // Reusable branching connector (1 / 2 / 3+ columns) — used both for hq -> sub-locations (Federated/Interconnect)
  // and for management-tier -> locations (other architectures).
  const renderBranchConnector = (count: number) => (
    <svg className="w-full max-w-4xl h-12" preserveAspectRatio="none" viewBox="0 0 600 48">
      <line x1="300" y1="0" x2="300" y2="24" stroke="#0080C8" strokeWidth="2.5" />
      <circle cx="300" cy="0" r="4" fill="#0080C8" />
      <circle cx="300" cy="24" r="4.5" fill="#0B374D" />

      {count === 1 && (
        <>
          <line x1="300" y1="24" x2="300" y2="48" stroke="#0080C8" strokeWidth="2.5" />
          <circle cx="300" cy="48" r="4" fill="#0080C8" />
        </>
      )}

      {count === 2 && (
        <>
          <line x1="150" y1="24" x2="450" y2="24" stroke="#0080C8" strokeWidth="2.5" />
          <line x1="150" y1="24" x2="150" y2="48" stroke="#0080C8" strokeWidth="2.5" />
          <line x1="450" y1="24" x2="450" y2="48" stroke="#0080C8" strokeWidth="2.5" />
          <circle cx="150" cy="48" r="4" fill="#0080C8" />
          <circle cx="450" cy="48" r="4" fill="#0080C8" />
        </>
      )}

      {count >= 3 && (
        <>
          <line x1="100" y1="24" x2="500" y2="24" stroke="#0080C8" strokeWidth="2.5" />
          <line x1="100" y1="24" x2="100" y2="48" stroke="#0080C8" strokeWidth="2.5" />
          <line x1="300" y1="24" x2="300" y2="48" stroke="#0080C8" strokeWidth="2.5" />
          <line x1="500" y1="24" x2="500" y2="48" stroke="#0080C8" strokeWidth="2.5" />
          <circle cx="100" cy="48" r="4" fill="#0080C8" />
          <circle cx="300" cy="48" r="4" fill="#0080C8" />
          <circle cx="500" cy="48" r="4" fill="#0080C8" />
        </>
      )}
    </svg>
  );

  return (
    <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-card flex flex-col select-none">
      {/* Minimal Toolbar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0080C8]"></span>
          <span className="font-bold text-slate-800">Milestone XProtect Systeemarchitectuur</span>
          <span className="text-slate-400 font-normal">|</span>
          <span className="text-slate-600 font-medium capitalize">
            {config.architecture === 'single-site' ? 'Standalone / Single-Site' : config.architecture.replace('-', ' ')}
          </span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            disabled={zoom <= 0.7}
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
            title="Reset Schaal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div 
        className="relative w-full overflow-x-auto bg-[#F8FAFC] min-h-[640px] p-6 sm:p-8 flex items-center justify-center"
        style={{
          backgroundImage: `
            linear-gradient(to right, #E2E8F0 1px, transparent 1px),
            linear-gradient(to bottom, #E2E8F0 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: 'center center'
        }}
      >
        <div 
          className="transition-transform duration-200 origin-top w-full max-w-5xl space-y-0"
          style={{ transform: `scale(${zoom})` }}
        >

          {/* ========================================================= */}
          {/* CLIENT PC'S & APPS (UNBOXED / FREESTANDING)               */}
          {/* Federated/Interconnect: clients are per-site (own Smart Clients per location, incl. hoofdlocatie) — see site cards below. */}
          {/* ========================================================= */}
          {hasClientsLayer && !isPerSiteManagement && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 pb-0">
              {/* Smart Client PC's */}
              {showSmartClient && (
                <div className="bg-white border-2 border-sky-400 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3.5 hover:border-sky-600 transition-colors">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(4, config.clients) }).map((_, idx) => (
                      <div key={idx} className="w-10 h-10 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                        <SmartClientIcon />
                      </div>
                    ))}
                    {config.clients > 4 && (
                      <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2 py-1 rounded-md">
                        +{config.clients - 4}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">
                        XProtect Smart Client PC's
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        {config.clients}x Station{config.clients > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Operator Werkplekken (Live & Playback)
                    </span>
                  </div>
                </div>
              )}

              {/* Web Client */}
              {showWebClient && (
                <div className="bg-white border-2 border-sky-300 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3.5 hover:border-sky-500 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-sky-700 text-white flex items-center justify-center shadow-xs">
                    <WebClientIcon />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">
                        XProtect Web Client
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                        HTML5 Portal
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Webbrowser Toegang
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile App */}
              {showMobileClient && (
                <div className="bg-white border-2 border-purple-300 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3.5 hover:border-purple-500 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                    <MobileClientIcon />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">
                        XProtect Mobile App
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                        iOS / Android
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Smartphones & Tablets
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* DIRECTE LIJN: CLIENTS -> MANAGEMENT SERVERS              */}
          {/* ========================================================= */}
          {hasClientsLayer && hasMgmtLayer && !isPerSiteManagement && (
            <div className="w-full flex items-center justify-center py-1">
              <svg className="w-full max-w-2xl h-8" preserveAspectRatio="none" viewBox="0 0 600 32">
                <line x1="300" y1="0" x2="300" y2="32" stroke="#0080C8" strokeWidth="2" strokeDasharray="4 3" />
                <circle cx="300" cy="0" r="3.5" fill="#0080C8" />
                <circle cx="300" cy="32" r="3.5" fill="#0080C8" />
              </svg>
            </div>
          )}

          {/* ========================================================= */}
          {/* MANAGEMENT SERVERS & DATABASE (UNBOXED / FREESTANDING)    */}
          {/* ========================================================= */}
          {hasMgmtLayer && isCombinedSingleSite && primarySite && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-1">
              {/* Combined all-in-one server: one physical box running every role — a single tower, not several */}
              <div className="bg-white border-2 border-blue-500 rounded-xl px-5 py-4 shadow-sm hover:border-blue-600 transition-colors w-full max-w-[240px]">
                <strong className="text-xs font-bold text-slate-900 block">
                  Management Server
                </strong>
                <ul className="text-[11px] text-slate-600 leading-relaxed mt-1 mb-3 space-y-0.5">
                  <li>Event Server</li>
                  <li>{primarySite.recorders > 1 ? `Recording Server (${primarySite.recorders}x)` : 'Recording Server'}</li>
                  <li>Mobile Server</li>
                  <li>Log Server</li>
                  <li>SQL Server</li>
                </ul>
                <div className="flex justify-center">
                  <MilestoneServerTower badges={['gear', 'database', 'record', 'mobile']} />
                </div>
              </div>
            </div>
          )}

          {hasMgmtLayer && !isCombinedSingleSite && !isPerSiteManagement && (
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 py-1">
              {/* Management Server */}
              {showMgmtServer && (
                <div className="bg-white border-2 border-blue-500 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 hover:border-blue-600 transition-colors">
                  <div className="flex items-end gap-2">
                    {Array.from({ length: config.managementServers }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <MilestoneServerTower badges={['gear']} />
                        <span className="text-[9px] font-bold text-slate-600 mt-1">
                          {config.managementServers > 1 ? `Mgmt ${idx + 1}` : 'Mgmt'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">
                        Management Server
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {config.managementServers}x Node{config.managementServers > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Centraal Beheer, Rechten & Licenties
                    </span>
                  </div>
                </div>
              )}

              {/* SQL Database */}
              {showSqlDb && (
                <div className="bg-white border-2 border-slate-300 rounded-xl px-4 py-3 shadow-sm flex items-center gap-3.5 hover:border-slate-400 transition-colors">
                  <div className="flex flex-col items-center">
                    <MilestoneServerTower badges={['database']} />
                    <span className="text-[9px] font-bold text-slate-600 mt-1">SQL</span>
                  </div>
                  <div>
                    <strong className="text-xs font-bold text-slate-900 block">
                      SQL Database Server
                    </strong>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Systeem Repository & Logs
                    </span>
                  </div>
                </div>
              )}

              {/* Mobile Gateway Server */}
              {showMobileServer && (
                <div className="bg-white border-2 border-indigo-400 rounded-xl px-4 py-3 shadow-sm flex items-center gap-4 hover:border-indigo-600 transition-colors">
                  <div className="flex items-end gap-2">
                    {Array.from({ length: config.mobileServers }).map((_, idx) => (
                      <div key={idx} className="flex flex-col items-center">
                        <MilestoneServerTower badges={['mobile']} />
                        <span className="text-[9px] font-bold text-indigo-700 mt-1">
                          {config.mobileServers > 1 ? `Mob ${idx + 1}` : 'Mobile'}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-xs font-bold text-slate-900">
                        Mobile Server Gateway
                      </strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                        {config.mobileServers}x Node{config.mobileServers > 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium block">
                      Web & Mobile Streaming Gateway
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* TIER 3 & 4: LOCATIES MET RECORDING SERVERS & CAMERA'S     */}
          {/* Federated/Interconnect: hoofdlocatie staat fysiek boven de sub-locaties, verbonden via WAN/cloud. */}
          {/* ========================================================= */}
          {hasLocationsLayer && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <strong className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Tier 3 & 4: Locaties, Recording Servers & Camera's
                  </strong>
                </div>
                <span className="text-[11px] font-bold text-slate-600">
                  Totaal {config.cameras} Camera's • {config.recorders} Recording Server{config.recorders > 1 ? 's' : ''}
                  {config.failoverRecorders > 0 && ` • +${config.failoverRecorders} Failover`}
                </span>
              </div>

              {isPerSiteManagement && hqSite ? (
                <>
                  {/* Hoofdlocatie: physically on top of the hierarchy, own standalone stack — wide layout,
                      not a tall narrow column, since it has the full diagram width to itself. */}
                  <div className="w-full">
                    {renderSiteCard(hqSite, true)}
                  </div>

                  {subSites.length > 0 && (
                    <>
                      {/* WAN / Cloud link down to the sub-locations */}
                      <div className="w-full flex flex-col items-center justify-center gap-1 py-1">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <line x1="12" y1="0" x2="12" y2="8" stroke="#0080C8" strokeWidth="2.5" />
                        </svg>
                        <div className="w-11 h-11 rounded-full bg-white border-2 border-[#0080C8] flex items-center justify-center shadow-2xs">
                          <Cloud className="w-5 h-5 text-[#0080C8]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                          {config.architecture === 'federated' ? 'Federated Trust (WAN)' : 'Milestone Interconnect (WAN)'}
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-center">
                        {renderBranchConnector(subSites.length)}
                      </div>

                      {/* Sub-locations grid below the hoofdlocatie */}
                      <div className={`grid gap-4 ${subSites.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : subSites.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                        {subSites.map((site) => renderSiteCard(site))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* Direct connector from the tier above straight into the locations grid */}
                  <div className="w-full flex items-center justify-center py-2">
                    {renderBranchConnector(displaySites.length)}
                  </div>

                  {/* Grid of locations */}
                  <div className={`grid gap-4 ${displaySites.length === 1 ? 'grid-cols-1 max-w-xl mx-auto' : displaySites.length === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {displaySites.map((site) => renderSiteCard(site))}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};


/* ========================================================================= */
/* ACCURATE MILESTONE VECTOR ELEMENTS (DARK NAVY TOWERS & OFFICIAL BADGES)    */
/* ========================================================================= */

type ServerBadgeType = 'gear' | 'database' | 'record' | 'mobile';

interface ServerTowerProps {
  /** One badge (classic single-role server) or several stacked badges (one physical box, multiple roles). */
  badges: ServerBadgeType[];
}

const ServerBadgeIcon: React.FC<{ badgeType: ServerBadgeType }> = ({ badgeType }) => {
  switch (badgeType) {
    case 'gear':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B374D" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'database':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B374D" strokeWidth="2.4">
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );
    case 'record':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0B374D" strokeWidth="2.4">
          <ellipse cx="12" cy="7" rx="7" ry="2.5" />
          <path d="M5 7v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V7" />
          <path d="M5 12v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-5" />
          <circle cx="16" cy="15" r="3.5" fill="#E53935" stroke="#FFFFFF" strokeWidth="1" />
        </svg>
      );
    case 'mobile':
      return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2.4">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
        </svg>
      );
  }
};

const MilestoneServerTower: React.FC<ServerTowerProps> = ({ badges }) => {
  // Single role: one badge, centered on the corner (classic look).
  // Multiple roles on one physical box: badges stack in a small cluster instead of implying separate machines.
  const isCluster = badges.length > 1;

  return (
    <div className="relative inline-block select-none">
      <svg width="42" height="74" viewBox="0 0 44 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Dark Navy Tower */}
        <rect x="2" y="2" width="40" height="72" fill="#0B374D" rx="2" stroke="#062433" strokeWidth="1.5" />

        {/* Drive bays / slots */}
        <line x1="8" y1="12" x2="36" y2="12" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <line x1="8" y1="20" x2="36" y2="20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
        <line x1="8" y1="28" x2="36" y2="28" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>

      {isCluster ? (
        <div className="absolute -bottom-1.5 -right-2.5 bg-white rounded-lg p-1 border-2 border-[#0B374D] shadow-2xs grid grid-cols-2 gap-0.5 max-w-[34px]">
          {badges.map((b, idx) => (
            <ServerBadgeIcon key={idx} badgeType={b} />
          ))}
        </div>
      ) : (
        <div className="absolute -bottom-1 -right-2 bg-white rounded-full p-0.5 border-2 border-[#0B374D] shadow-2xs">
          <div className="w-[18px] h-[18px] flex items-center justify-center">
            <ServerBadgeIcon badgeType={badges[0]} />
          </div>
        </div>
      )}
    </div>
  );
};


/**
 * Camera Icons in official vector styling
 */
const MilestoneCameraIcon: React.FC<{ iconType: CameraTypeConfig['iconType'] }> = ({ iconType }) => {
  switch (iconType) {
    case 'ptz':
      // PTZ Dome with pan arrows
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 4h14l-1.5 4h-11L5 4z" fill="#FFFFFF" />
          <path d="M6.5 8h11c0 4-2.5 8-5.5 8s-5.5-4-5.5-8z" fill="#FFFFFF" />
          <circle cx="12" cy="11" r="2.2" fill="#0B374D" />
          <path d="M4 20c4-1.5 12-1.5 16 0M4 20l3-2M20 20l-3-2" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case 'thermal':
      // Thermal heat / flame icon
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      );
    case 'anpr':
      // License plate / optical scan
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <line x1="7" y1="12" x2="17" y2="12" strokeWidth="2.5" />
          <line x1="7" y1="9" x2="9" y2="9" />
          <line x1="15" y1="9" x2="17" y2="9" />
        </svg>
      );
    case 'panoramic':
    case 'multisensor':
      // Multi-directional / 360 sensor
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="3" />
          <line x1="12" y1="3" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="21" />
          <line x1="3" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="21" y2="12" />
        </svg>
      );
    default:
      // Standard Bullet / Fixed Camera
      return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 7l12-3v12L2 13V7z" fill="#FFFFFF" stroke="none" />
          <path d="M14 8l6-3v10l-6-3" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="6" y1="13" x2="6" y2="18" stroke="#FFFFFF" strokeWidth="2" />
          <line x1="3" y1="18" x2="9" y2="18" stroke="#FFFFFF" strokeWidth="2" />
        </svg>
      );
  }
};

const SmartClientIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const WebClientIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const MobileClientIcon: React.FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
  </svg>
);
