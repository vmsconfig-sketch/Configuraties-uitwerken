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
  Maximize2 
} from 'lucide-react';

interface MilestoneOfficialDiagramProps {
  config: ArchitectureState;
}

export const MilestoneOfficialDiagram: React.FC<MilestoneOfficialDiagramProps> = ({ config }) => {
  const [zoom, setZoom] = useState<number>(1);

  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(1.4, Math.max(0.65, Number((prev + delta).toFixed(1)))));
  };

  const resetZoom = () => setZoom(1);

  // Active camera types (only > 0)
  const activeCameraTypes = config.cameraTypes.filter(t => t.enabled && t.count > 0);

  // Filter sites with active elements
  const activeSites = config.sites.filter(s => s.recorders > 0 || s.cameras > 0 || s.managementServers > 0);
  const displaySites = activeSites.length > 0 ? activeSites : [config.sites[0] || {
    id: 'default-hq',
    name: 'Centrale Locatie',
    type: 'hq',
    cameras: config.cameras,
    recorders: config.recorders,
    managementServers: config.managementServers
  }];

  const hqSite = displaySites.find(s => s.type === 'hq') || displaySites[0];
  const remoteSites = displaySites.filter(s => s !== hqSite);

  // Distribute camera types for a specific site
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

  return (
    <div className="bg-white border border-slate-300 rounded-2xl overflow-hidden shadow-card flex flex-col select-none">
      {/* Top minimal control bar */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0080C8]"></span>
          <span className="font-bold text-slate-800">Milestone XProtect Systeemarchitectuur</span>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleZoom(-0.1)}
            disabled={zoom <= 0.65}
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
            disabled={zoom >= 1.4}
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

      {/* Main SVG Vector Canvas */}
      <div className="relative w-full overflow-auto bg-white min-h-[640px] flex items-center justify-center p-4 sm:p-6">
        <div 
          className="transition-transform duration-200 origin-center"
          style={{ transform: `scale(${zoom})` }}
        >
          <svg 
            viewBox="0 0 900 820" 
            className="w-[880px] h-[800px] max-w-none"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* DEFINITIONS FOR ICONS AND GRADIENTS */}
            <defs>
              {/* Drop shadow filter */}
              <filter id="subtle-shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.06"/>
              </filter>
            </defs>

            {/* INTER-SITE CONNECTING NETWORK LINES (3) */}
            {remoteSites.length > 0 && (
              <g id="network-links" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round">
                {remoteSites.length >= 1 && (
                  <path d="M 405 285 L 630 330" />
                )}
                {remoteSites.length >= 2 && (
                  <path d="M 380 435 L 530 520" />
                )}
                {remoteSites.length >= 3 && (
                  <path d="M 230 445 L 210 545" />
                )}
              </g>
            )}

            {/* CALLOUT NUMBER 3 ON NETWORK LINK */}
            {remoteSites.length > 0 && (
              <text x="515" y="300" fill="#0080C8" fontSize="20" fontWeight="600" fontFamily="sans-serif">
                3
              </text>
            )}

            {/* ======================================================== */}
            {/* 1. CENTRAL / HQ SITE CIRCLE                              */}
            {/* ======================================================== */}
            <g id="hq-site" filter="url(#subtle-shadow)">
              {/* Site circle outline */}
              <circle 
                cx="245" 
                cy="235" 
                r="225" 
                fill="#FFFFFF" 
                stroke="#94A3B8" 
                strokeWidth="2.5" 
              />
              
              {/* Callout Number 1 */}
              <text x="245" y="32" fill="#0080C8" fontSize="22" fontWeight="600" fontFamily="sans-serif">
                1
              </text>

              {/* Network Bus Bar (Grey + Blue Stripe) */}
              <g id="hq-bus">
                {/* Top grey line */}
                <line x1="75" y1="220" x2="415" y2="220" stroke="#B0BEC5" strokeWidth="2" />
                {/* Blue bus stripe */}
                <rect x="75" y="222" width="340" height="7" fill="#4BA3E3" />
                {/* Bottom grey line */}
                <line x1="75" y1="229" x2="415" y2="229" stroke="#B0BEC5" strokeWidth="2" />
              </g>

              {/* TOP ROW: MANAGEMENT & SQL SERVERS */}
              {/* Connection lines from top servers to bus */}
              <line x1="130" y1="185" x2="130" y2="220" stroke="#90A4AE" strokeWidth="1.5" />
              {config.managementServers > 1 && (
                <line x1="190" y1="185" x2="190" y2="220" stroke="#90A4AE" strokeWidth="1.5" />
              )}
              <line x1="330" y1="185" x2="330" y2="220" stroke="#90A4AE" strokeWidth="1.5" />

              {/* Management Server 1 (with Gear + Cylinder badges) */}
              <g transform="translate(108, 90)">
                <ServerTower />
                <BadgeGear x={30} y={40} />
                <BadgeDatabase x={30} y={64} />
              </g>

              {/* Management Server 2 / Failover (if > 1) */}
              {config.managementServers > 1 && (
                <g transform="translate(168, 90)">
                  <ServerTower />
                  <BadgeGear x={30} y={40} />
                  <BadgeDatabase x={30} y={64} />
                </g>
              )}

              {/* Central SQL Database Server */}
              <g transform="translate(308, 90)">
                <ServerTower />
                <BadgeDatabase x={30} y={64} />
              </g>

              {/* BOTTOM ROW IN HQ: RECORDING SERVERS */}
              {/* Callout Number 2 */}
              <text x="170" y="425" fill="#0080C8" fontSize="22" fontWeight="600" fontFamily="sans-serif">
                2
              </text>

              {/* Recorders with connection lines to bus */}
              {/* Up to 5 visual recording towers based on config.recorders */}
              {(() => {
                const recCount = Math.max(1, Math.min(5, hqSite.recorders));
                const positions = [
                  { x: 85, y: 265, lx: 107 },
                  { x: 145, y: 265, lx: 167 },
                  { x: 205, y: 265, lx: 227 },
                  { x: 285, y: 265, lx: 307 },
                  { x: 345, y: 265, lx: 367 },
                ].slice(0, recCount);

                return positions.map((pos, idx) => (
                  <g key={idx}>
                    {/* Vertical link to bus */}
                    <line x1={pos.lx} y1="229" x2={pos.lx} y2="265" stroke="#90A4AE" strokeWidth="1.5" />
                    {/* Recording Server Tower */}
                    <g transform={`translate(${pos.x}, ${pos.y})`}>
                      <ServerTower />
                      <BadgeRecordDisk x={30} y={64} />
                    </g>
                  </g>
                ));
              })()}

              {/* If Single Site with Cameras, show cameras inside main circle */}
              {remoteSites.length === 0 && hqSite.cameras > 0 && (
                <g transform="translate(130, 375)">
                  <line x1="40" y1="-146" x2="40" y2="-10" stroke="#90A4AE" strokeWidth="1.5" strokeDasharray="3 3" />
                  <g transform="translate(0, 0)">
                    <PTZDomeCamera />
                  </g>
                  <g transform="translate(100, 5)">
                    <BulletCamera />
                  </g>
                </g>
              )}
            </g>


            {/* ======================================================== */}
            {/* 2. SATELLITE REMOTE SITE 1 (TOP RIGHT)                   */}
            {/* ======================================================== */}
            {remoteSites.length >= 1 && (
              <g id="remote-site-1" filter="url(#subtle-shadow)">
                {/* Circle */}
                <circle 
                  cx="705" 
                  cy="365" 
                  r="140" 
                  fill="#FFFFFF" 
                  stroke="#94A3B8" 
                  strokeWidth="2.5" 
                />

                {/* Callout Number 4 */}
                <text x="815" y="245" fill="#0080C8" fontSize="22" fontWeight="600" fontFamily="sans-serif">
                  4
                </text>

                {/* Callout Number 5 */}
                <text x="735" y="260" fill="#0080C8" fontSize="22" fontWeight="600" fontFamily="sans-serif">
                  5
                </text>

                {/* Server Tower (Management & Recording) */}
                <g transform="translate(685, 240)">
                  <ServerTower />
                  <BadgeGear x={30} y={40} />
                  <BadgeRecordDisk x={30} y={64} />
                </g>

                {/* Network Bus Bar */}
                <g id="remote-bus-1">
                  <line x1="615" y1="390" x2="795" y2="390" stroke="#B0BEC5" strokeWidth="2" />
                  <rect x="615" y="392" width="180" height="6" fill="#4BA3E3" />
                  <line x1="615" y1="398" x2="795" y2="398" stroke="#B0BEC5" strokeWidth="2" />
                  
                  {/* Link from server to bus */}
                  <line x1="707" y1="335" x2="707" y2="390" stroke="#90A4AE" strokeWidth="1.5" />
                </g>

                {/* Cameras under the bus */}
                {(() => {
                  const siteCams = getSiteCameras(remoteSites[0]);
                  const hasPtz = siteCams.some(c => c.iconType === 'ptz');
                  const hasThermal = siteCams.some(c => c.iconType === 'thermal');
                  
                  return (
                    <g>
                      {/* Connection lines from bus to cameras */}
                      <line x1="655" y1="398" x2="655" y2="435" stroke="#90A4AE" strokeWidth="1.5" />
                      <line x1="755" y1="398" x2="755" y2="435" stroke="#90A4AE" strokeWidth="1.5" />

                      {/* Camera 1: PTZ Dome with rotation arrow */}
                      <g transform="translate(625, 435)">
                        <PTZDomeCamera />
                      </g>

                      {/* Camera 2: Bullet Camera on bracket */}
                      <g transform="translate(710, 440)">
                        <BulletCamera />
                      </g>
                    </g>
                  );
                })()}
              </g>
            )}


            {/* ======================================================== */}
            {/* 3. SATELLITE REMOTE SITE 2 (BOTTOM RIGHT)                */}
            {/* ======================================================== */}
            {remoteSites.length >= 2 && (
              <g id="remote-site-2" filter="url(#subtle-shadow)">
                {/* Circle */}
                <circle 
                  cx="580" 
                  cy="665" 
                  r="135" 
                  fill="#FFFFFF" 
                  stroke="#94A3B8" 
                  strokeWidth="2.5" 
                />

                {/* Server Tower */}
                <g transform="translate(560, 550)">
                  <ServerTower />
                  <BadgeGear x={30} y={40} />
                  <BadgeRecordDisk x={30} y={64} />
                </g>

                {/* Network Bus Bar */}
                <g id="remote-bus-2">
                  <line x1="490" y1="695" x2="670" y2="695" stroke="#B0BEC5" strokeWidth="2" />
                  <rect x="490" y="697" width="180" height="6" fill="#4BA3E3" />
                  <line x1="490" y1="703" x2="670" y2="703" stroke="#B0BEC5" strokeWidth="2" />
                  
                  {/* Link from server to bus */}
                  <line x1="582" y1="645" x2="582" y2="695" stroke="#90A4AE" strokeWidth="1.5" />
                </g>

                {/* Cameras under bus */}
                <g>
                  <line x1="535" y1="703" x2="535" y2="735" stroke="#90A4AE" strokeWidth="1.5" />
                  <line x1="630" y1="703" x2="630" y2="735" stroke="#90A4AE" strokeWidth="1.5" />

                  <g transform="translate(505, 735)">
                    <PTZDomeCamera />
                  </g>
                  <g transform="translate(585, 740)">
                    <BulletCamera />
                  </g>
                </g>
              </g>
            )}


            {/* ======================================================== */}
            {/* 4. SATELLITE REMOTE SITE 3 (BOTTOM LEFT)                 */}
            {/* ======================================================== */}
            {remoteSites.length >= 3 && (
              <g id="remote-site-3" filter="url(#subtle-shadow)">
                {/* Circle */}
                <circle 
                  cx="205" 
                  cy="680" 
                  r="135" 
                  fill="#FFFFFF" 
                  stroke="#94A3B8" 
                  strokeWidth="2.5" 
                />

                {/* Server Tower */}
                <g transform="translate(185, 565)">
                  <ServerTower />
                  <BadgeGear x={30} y={40} />
                  <BadgeRecordDisk x={30} y={64} />
                </g>

                {/* Network Bus Bar */}
                <g id="remote-bus-3">
                  <line x1="115" y1="710" x2="295" y2="710" stroke="#B0BEC5" strokeWidth="2" />
                  <rect x="115" y="712" width="180" height="6" fill="#4BA3E3" />
                  <line x1="115" y1="718" x2="295" y2="718" stroke="#B0BEC5" strokeWidth="2" />
                  
                  {/* Link from server to bus */}
                  <line x1="207" y1="660" x2="207" y2="710" stroke="#90A4AE" strokeWidth="1.5" />
                </g>

                {/* Cameras under bus */}
                <g>
                  <line x1="160" y1="718" x2="160" y2="750" stroke="#90A4AE" strokeWidth="1.5" />
                  <line x1="255" y1="718" x2="255" y2="750" stroke="#90A4AE" strokeWidth="1.5" />

                  <g transform="translate(130, 750)">
                    <PTZDomeCamera />
                  </g>
                  <g transform="translate(210, 755)">
                    <BulletCamera />
                  </g>
                </g>
              </g>
            )}

          </svg>
        </div>
      </div>
    </div>
  );
};


/* ========================================================================= */
/* VECTOR ICONS EXACTLY AS IN THE OFFICIAL MILESTONE ARCHITECTURE REFERENCE  */
/* ========================================================================= */

/**
 * Dark Navy Blue Server Tower Icon
 */
const ServerTower: React.FC = () => (
  <g>
    {/* Dark navy body */}
    <rect 
      x="0" 
      y="0" 
      width="44" 
      height="95" 
      fill="#0B374D" 
      rx="1" 
    />
    {/* Upper slot / drive indicators */}
    <line x1="8" y1="14" x2="36" y2="14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="8" y1="24" x2="36" y2="24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
  </g>
);

/**
 * Settings / Gear Badge (for Management Server / Service)
 */
const BadgeGear: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="12" cy="12" r="13" fill="#FFFFFF" stroke="#0B374D" strokeWidth="2" />
    {/* Gear icon */}
    <path 
      d="M12 7.5A4.5 4.5 0 1 0 12 16.5A4.5 4.5 0 1 0 12 7.5 Z" 
      fill="#FFFFFF" 
      stroke="#0B374D" 
      strokeWidth="2" 
    />
    {/* Teeth */}
    <path 
      d="M12 4.5 V 7 M12 17 V 19.5 M4.5 12 H 7 M17 12 H 19.5 M6.7 6.7 L 8.5 8.5 M15.5 15.5 L 17.3 17.3 M6.7 17.3 L 8.5 15.5 M15.5 8.5 L 17.3 6.7" 
      stroke="#0B374D" 
      strokeWidth="2" 
      strokeLinecap="round" 
    />
  </g>
);

/**
 * SQL Database Cylinder Badge
 */
const BadgeDatabase: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="12" cy="12" r="13" fill="#FFFFFF" stroke="#0B374D" strokeWidth="2" />
    {/* 3 Disk platter lines */}
    <ellipse cx="12" cy="7" rx="6.5" ry="2.2" fill="#FFFFFF" stroke="#0B374D" strokeWidth="1.8" />
    <path d="M5.5 7 V 12 C 5.5 13.5 18.5 13.5 18.5 12 V 7" fill="none" stroke="#0B374D" strokeWidth="1.8" />
    <path d="M5.5 12 V 17 C 5.5 18.5 18.5 18.5 18.5 17 V 12" fill="none" stroke="#0B374D" strokeWidth="1.8" />
  </g>
);

/**
 * Recording Disk Badge with Red Record Indicator Dot
 */
const BadgeRecordDisk: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x}, ${y})`}>
    <circle cx="12" cy="12" r="13" fill="#FFFFFF" stroke="#0B374D" strokeWidth="2" />
    {/* Cylinder disks */}
    <ellipse cx="12" cy="8" rx="6.5" ry="2.2" fill="#FFFFFF" stroke="#0B374D" strokeWidth="1.8" />
    <path d="M5.5 8 V 13 C 5.5 14.5 18.5 14.5 18.5 13 V 8" fill="none" stroke="#0B374D" strokeWidth="1.8" />
    <path d="M5.5 13 V 17 C 5.5 18.5 18.5 18.5 18.5 17 V 13" fill="none" stroke="#0B374D" strokeWidth="1.8" />
    {/* Red Recording Dot */}
    <circle cx="16" cy="15" r="3.2" fill="#E53935" />
  </g>
);

/**
 * PTZ Dome Camera with Rotation Arrow
 */
const PTZDomeCamera: React.FC = () => (
  <g>
    {/* Top base plate */}
    <path d="M12 0 H 48 L 44 8 H 16 Z" fill="#0B374D" />
    {/* Dome body */}
    <path d="M16 8 H 44 C 44 8 46 26 30 26 C 14 26 16 8 16 8 Z" fill="#0B374D" />
    {/* Lens eye */}
    <circle cx="30" cy="16" r="4.5" fill="#FFFFFF" />
    <circle cx="30" cy="16" r="2.5" fill="#0B374D" />

    {/* PTZ Pan Rotation arrows underneath */}
    <g transform="translate(10, 32)">
      <path 
        d="M 6 0 C 15 -3 25 -3 34 0" 
        fill="none" 
        stroke="#0B374D" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path d="M 6 -3 L 2 0 L 6 3" fill="none" stroke="#0B374D" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 34 -3 L 38 0 L 34 3" fill="none" stroke="#0B374D" strokeWidth="1.8" strokeLinecap="round" />

      <path 
        d="M 34 6 C 25 9 15 9 6 6" 
        fill="none" 
        stroke="#0B374D" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path d="M 6 3 L 2 6 L 6 9" fill="none" stroke="#0B374D" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 34 3 L 38 6 L 34 9" fill="none" stroke="#0B374D" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </g>
);

/**
 * Bullet Camera with Wall-Mount Bracket
 */
const BulletCamera: React.FC = () => (
  <g transform="rotate(10)">
    {/* Angled camera body */}
    <path d="M0 4 L 46 0 L 48 18 L 0 22 Z" fill="#0B374D" />
    {/* Front lens shade */}
    <path d="M-6 2 L 0 4 L 0 22 L -6 24 Z" fill="#0B374D" />
    {/* Back mount bracket */}
    <path d="M46 9 L 58 9 L 58 24 L 64 24" fill="none" stroke="#0B374D" strokeWidth="2.5" strokeLinecap="square" />
    {/* Wall mounting plate */}
    <line x1="64" y1="18" x2="64" y2="30" stroke="#0B374D" strokeWidth="2.5" strokeLinecap="round" />
  </g>
);
