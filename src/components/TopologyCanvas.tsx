import React, { useState, useRef } from 'react';
import { 
  Server, 
  Database, 
  Camera, 
  HardDrive, 
  Laptop, 
  Smartphone, 
  Network, 
  ShieldCheck, 
  Wifi, 
  Activity, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Eye, 
  Info,
  Share2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ArchitectureProject, SiteModel, ServerNode, ArchitectureType } from '../types';
import { NodeDetailModal } from './NodeDetailModal';

interface TopologyCanvasProps {
  project: ArchitectureProject;
  onSelectSite?: (siteId: string) => void;
}

export const TopologyCanvas: React.FC<TopologyCanvasProps> = ({ project, onSelectSite }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'hierarchical' | 'hub-spoke' | 'dataflow'>('hierarchical');
  const [selectedNode, setSelectedNode] = useState<{
    type: 'server' | 'camera-group' | 'storage' | 'site' | 'client';
    data: any;
    site?: SiteModel;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.15, 1.8));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.15, 0.6));
  const handleResetZoom = () => setZoom(1);

  const getArchitectureBadge = (type: ArchitectureType) => {
    switch (type) {
      case 'interconnect':
        return { label: 'Milestone Interconnect', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'federated':
        return { label: 'Milestone Federated Architecture (MFA)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'multi-site':
        return { label: 'Multi-Site Gedistribueerd', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
      case 'single-site':
        return { label: 'Single Site', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    }
  };

  const badge = getArchitectureBadge(project.architectureType);

  const exportSvg = () => {
    const svgEl = document.getElementById('milestone-topology-svg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milestone-architectuur-${project.architectureType}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">
      {/* Canvas Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">{project.title}</h2>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Klik op een server of component om Milestone poorten, hardware eisen en configuratie te inspecteren.
            </p>
          </div>
        </div>

        {/* View Mode & Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom buttons */}
          <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
            <button
              onClick={handleZoomOut}
              title="Zoom Uit"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-medium text-slate-700 px-2">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors ml-0.5 border-l border-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export SVG button */}
          <button
            onClick={exportSvg}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Download SVG</span>
          </button>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div 
        ref={containerRef}
        id="milestone-topology-canvas"
        className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 min-h-[580px] relative overflow-auto shadow-card transition-all"
      >
        {/* Subtle grid background pattern */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle, #CBD5E1 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Scaled Visual Content Container */}
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
          className="transition-transform duration-150 ease-out min-w-[850px] py-4 relative z-10"
        >
          {/* Top Level: Operators / Smart Clients / Video Wall */}
          <div className="flex justify-center mb-8">
            <div 
              onClick={() => setSelectedNode({
                type: 'client',
                data: { name: 'Milestone XProtect Smart Client & Video Wall' }
              })}
              className="bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-500 rounded-xl p-3.5 px-6 flex items-center gap-4 cursor-pointer shadow-sm hover:shadow transition-all group max-w-xl"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform shrink-0">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">XProtect Smart Client Workstations</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Poort 7563 / 443
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {project.architectureType === 'federated' && 'Centrale weergave van alle gekoppelde Child Sites (MFA naadloze login)'}
                  {project.architectureType === 'interconnect' && 'Centrale Corporate werkplek met on-demand edge streaming & alarm retrieval'}
                  {project.architectureType === 'multi-site' && 'Direct streamen vanaf gedistribueerde opnameservers via WAN'}
                  {project.architectureType === 'single-site' && 'Lokale high-performance live weergave met hardware acceleratie (DirectX)'}
                </p>
              </div>
            </div>
          </div>

          {/* Central Connecting Flow Lines */}
          <div className="flex justify-center -my-4 relative z-0">
            <div className="w-0.5 h-8 bg-blue-400 opacity-60" />
          </div>

          {/* SITES CONTAINER */}
          <div className="space-y-8">
            {/* 1. PRIMARY / PARENT / SINGLE SITE */}
            {project.sites.filter(s => s.role === 'hq-parent' || s.role === 'standalone').map((site) => (
              <div 
                key={site.id}
                className="bg-slate-50/70 border-2 border-blue-600 rounded-xl p-5 shadow-sm relative"
              >
                {/* Site Header Banner */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4 bg-white/80 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{site.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {site.role === 'hq-parent' ? 'CENTRAAL HOOFDKANTOOR (PARENT SITE)' : 'SINGLE SITE'}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          Milestone XProtect {site.milestoneTier}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{site.locationName} • Netwerk: {site.networkType}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block font-medium">Opslag & Camera's</span>
                    <span className="text-xs font-bold text-slate-800">
                      {site.cameraGroups.reduce((acc, c) => acc + c.count, 0)} Camera's • {site.storage.liveStorageDays}d Live
                    </span>
                  </div>
                </div>

                {/* Site Grid: Servers + Storage + Camera Pool */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Servers in this site */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      VMS Servers ({site.servers.length})
                    </span>
                    <div className="space-y-2">
                      {site.servers.map((srv) => (
                        <div
                          key={srv.id}
                          onClick={() => setSelectedNode({ type: 'server', data: srv, site })}
                          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between shadow-2xs ${
                            srv.role === 'management'
                              ? 'bg-blue-50/70 border-blue-200 hover:border-blue-400'
                              : srv.role === 'recording'
                              ? 'bg-indigo-50/70 border-indigo-200 hover:border-indigo-400'
                              : srv.role === 'failover-recording'
                              ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-2xs">
                              {srv.role === 'management' && <Database className="w-3.5 h-3.5 text-blue-600" />}
                              {srv.role === 'recording' && <Server className="w-3.5 h-3.5 text-indigo-600" />}
                              {srv.role === 'failover-recording' && <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />}
                              {srv.role === 'mobile' && <Smartphone className="w-3.5 h-3.5 text-emerald-600" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900">{srv.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono">{srv.ipAddress || '192.168.10.x'}</div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {srv.specs?.cpuCores ? `${srv.specs.cpuCores}c/${srv.specs.ramGb}GB` : 'Specs'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Storage Pool */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Opslagarchitectuur
                    </span>
                    <div 
                      onClick={() => setSelectedNode({ type: 'storage', data: site.storage, site })}
                      className="p-3.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <HardDrive className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-bold text-slate-900">Tier 1: Live Opname</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {site.storage.liveStorageRaid}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        <div>Type: <strong className="text-slate-800 capitalize">{site.storage.liveStorageType.replace('-', ' ')}</strong></div>
                        <div>Bewaartermijn: <strong className="text-slate-800">{site.storage.liveStorageDays} Dagen</strong></div>
                      </div>

                      {site.storage.archiveEnabled && (
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span>Tier 2: Archief</span>
                            <span className="text-[10px] text-blue-600">{site.storage.archiveStorageRaid}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {site.storage.archiveStorageDays} dagen op {site.storage.archiveStorageType.replace('-', ' ')}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Camera Groups */}
                  <div className="space-y-2.5">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Camera Groepen ({site.cameraGroups.reduce((a, b) => a + b.count, 0)} cams)
                    </span>
                    <div className="space-y-2">
                      {site.cameraGroups.map((cg) => (
                        <div
                          key={cg.id}
                          onClick={() => setSelectedNode({ type: 'camera-group', data: cg, site })}
                          className="p-2.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-2">
                            <Camera className="w-3.5 h-3.5 text-blue-600" />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{cg.name}</div>
                              <div className="text-[10px] text-slate-500">{cg.resolution} • {cg.codec}</div>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            {cg.count}x
                          </span>
                        </div>
                      ))}
                      {site.cameraGroups.length === 0 && (
                        <div className="p-3 text-center text-xs text-slate-500 italic bg-white rounded-lg border border-dashed border-slate-200">
                          Geen camera's op centrale hub (Zuiver beheer)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* 2. REMOTE / CHILD SITES / DISTRIBUTED BRANCHES */}
            {project.sites.filter(s => s.role !== 'hq-parent' && s.role !== 'standalone').length > 0 && (
              <div className="space-y-4">
                {/* WAN Link visual separator */}
                <div className="flex items-center justify-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs">
                    <Wifi className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
                    <span>
                      {project.architectureType === 'interconnect' && 'Milestone Interconnect WAN Links (Edge Retrieval & Alarms)'}
                      {project.architectureType === 'federated' && 'Milestone Federated Links (MFA HTTPS / Active Directory Trust)'}
                      {project.architectureType === 'multi-site' && 'WAN Verbinding naar Gedistribueerde Opnameservers'}
                    </span>
                  </div>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                {/* Sub-sites Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.sites.filter(s => s.role !== 'hq-parent' && s.role !== 'standalone').map((site) => (
                    <div 
                      key={site.id}
                      className={`bg-white border rounded-xl p-4 shadow-sm relative transition-all ${
                        project.architectureType === 'interconnect'
                          ? 'border-amber-200 hover:border-amber-400'
                          : project.architectureType === 'federated'
                          ? 'border-emerald-200 hover:border-emerald-400'
                          : 'border-cyan-200 hover:border-cyan-400'
                      }`}
                    >
                      {/* Sub-site Header */}
                      <div className="flex items-start justify-between border-b border-slate-100 pb-2.5 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900">{site.name}</h4>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${
                              site.role === 'child-federated'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : site.role === 'remote-interconnected'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            }`}>
                              {site.role === 'child-federated' && 'Child MFA'}
                              {site.role === 'remote-interconnected' && 'Interconnect Edge'}
                              {site.role === 'distributed-branch' && 'Gedistribueerd'}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500">{site.locationName} • {site.wanBandwidthMbps} Mbps</span>
                        </div>

                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                          {site.milestoneTier}
                        </span>
                      </div>

                      {/* Sub-site Servers & Cameras */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Server list */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-600 uppercase">Server(s)</span>
                          {site.servers.map((srv) => (
                            <div 
                              key={srv.id}
                              onClick={() => setSelectedNode({ type: 'server', data: srv, site })}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer text-[11px]"
                            >
                              <div className="font-bold text-slate-800 truncate">{srv.name}</div>
                              <div className="text-[10px] text-slate-500 capitalize">{srv.role}</div>
                            </div>
                          ))}
                        </div>

                        {/* Cameras in this sub-site */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-slate-600 uppercase">Camera's</span>
                          {site.cameraGroups.map((cg) => (
                            <div
                              key={cg.id}
                              onClick={() => setSelectedNode({ type: 'camera-group', data: cg, site })}
                              className="p-2 rounded-lg bg-slate-50 border border-slate-200 hover:border-slate-300 cursor-pointer text-[11px] flex items-center justify-between"
                            >
                              <div>
                                <div className="font-bold text-slate-800 truncate">{cg.name}</div>
                                <div className="text-[10px] text-blue-600">{cg.resolution}</div>
                              </div>
                              <span className="font-bold text-xs text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                                {cg.count}x
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Edge recording badge */}
                      {site.edgeRecordingEnabled && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-amber-700 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-amber-600" />
                          <span>100% Autonoom Edge Recording & Alarm Push geactiveerd</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Node Details Inspection Modal */}
      <NodeDetailModal
        selectedNode={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  );
};
