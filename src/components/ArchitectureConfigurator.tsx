import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Server, 
  Camera, 
  HardDrive, 
  Layers, 
  Network, 
  ShieldCheck, 
  Save, 
  Check, 
  AlertCircle,
  HelpCircle,
  Smartphone,
  Database
} from 'lucide-react';
import { 
  ArchitectureProject, 
  SiteModel, 
  ServerNode, 
  CameraGroup, 
  MilestoneTier, 
  ArchitectureType,
  CameraResolution,
  CameraCodec,
  StorageTier
} from '../types';

interface ConfiguratorProps {
  project: ArchitectureProject;
  onUpdateProject: (updated: ArchitectureProject) => void;
}

export const ArchitectureConfigurator: React.FC<ConfiguratorProps> = ({ project, onUpdateProject }) => {
  const [selectedSiteId, setSelectedSiteId] = useState<string>(project.sites[0]?.id || '');
  const [showAddSiteModal, setShowAddSiteModal] = useState(false);
  const [showAddServerModal, setShowAddServerModal] = useState(false);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);

  // Active site
  const activeSite = project.sites.find(s => s.id === selectedSiteId) || project.sites[0];

  // Helper to update whole project
  const updateSite = (updatedSite: SiteModel) => {
    const updatedSites = project.sites.map(s => s.id === updatedSite.id ? updatedSite : s);
    onUpdateProject({ ...project, sites: updatedSites, updatedAt: new Date().toISOString().split('T')[0] });
  };

  const handleArchitectureTypeChange = (newType: ArchitectureType) => {
    onUpdateProject({ ...project, architectureType: newType });
  };

  const handleAddSite = (role: 'hq-parent' | 'child-federated' | 'remote-interconnected' | 'distributed-branch' | 'standalone') => {
    const newSiteId = `site-${Date.now()}`;
    const newSite: SiteModel = {
      id: newSiteId,
      name: role === 'hq-parent' ? 'Centraal Hoofdkantoor' : `Nieuwe Vestiging ${project.sites.length + 1}`,
      locationName: 'Nederland',
      role: role,
      milestoneTier: role === 'remote-interconnected' ? 'Express+' : (project.primaryTier || 'Corporate'),
      networkType: role === 'remote-interconnected' ? 'Broadband WAN (20-100Mbps)' : 'Fiber WAN (>100Mbps)',
      wanBandwidthMbps: role === 'remote-interconnected' ? 50 : 1000,
      wanLatencyMs: role === 'remote-interconnected' ? 25 : 2,
      isAutonomous: role !== 'distributed-branch',
      edgeRecordingEnabled: role === 'remote-interconnected',
      servers: [
        {
          id: `srv-${Date.now()}-1`,
          name: `${role.toUpperCase()}-REC01`,
          role: 'recording',
          specs: { cpuCores: 16, ramGb: 32, nicSpeedGbps: 10, os: 'Windows Server 2022' }
        }
      ],
      cameraGroups: [
        {
          id: `cam-${Date.now()}`,
          name: 'Standaard Beveiligingscamera\'s',
          count: 16,
          resolution: '1080p (2MP)',
          codec: 'H.265+ (Smart Codec)',
          fps: 15,
          motionPercent: 35,
          recordingMode: role === 'remote-interconnected' ? 'edge-with-retrieve' : 'continuous',
          bitrateKbps: 1800,
          retentionDays: 30
        }
      ],
      storage: {
        liveStorageDays: 7,
        liveStorageType: 'live-nvme-ssd',
        liveStorageRaid: 'RAID 10',
        archiveEnabled: true,
        archiveStorageDays: 23,
        archiveStorageType: 'archive-nas-san',
        archiveStorageRaid: 'RAID 6'
      }
    };

    onUpdateProject({ ...project, sites: [...project.sites, newSite] });
    setSelectedSiteId(newSiteId);
    setShowAddSiteModal(false);
  };

  const handleDeleteSite = (siteId: string) => {
    if (project.sites.length <= 1) {
      alert('Een project moet minimaal 1 site bevatten.');
      return;
    }
    const filtered = project.sites.filter(s => s.id !== siteId);
    onUpdateProject({ ...project, sites: filtered });
    setSelectedSiteId(filtered[0]?.id || '');
  };

  // Add Server to active site
  const handleAddServer = (role: 'management' | 'recording' | 'failover-recording' | 'mobile' | 'event') => {
    if (!activeSite) return;
    const newServer: ServerNode = {
      id: `srv-${Date.now()}`,
      name: `${activeSite.name.substring(0, 3).toUpperCase()}-${role.substring(0, 3).toUpperCase()}01`,
      role: role,
      isFailover: role === 'failover-recording',
      failoverType: role === 'failover-recording' ? 'hot-standby' : undefined,
      specs: {
        cpuCores: role === 'management' || role === 'recording' ? 16 : 8,
        ramGb: role === 'management' || role === 'recording' ? 32 : 16,
        nicSpeedGbps: role === 'recording' ? 10 : 1,
        os: 'Windows Server 2022'
      }
    };

    updateSite({
      ...activeSite,
      servers: [...activeSite.servers, newServer]
    });
    setShowAddServerModal(false);
  };

  const handleDeleteServer = (serverId: string) => {
    if (!activeSite) return;
    updateSite({
      ...activeSite,
      servers: activeSite.servers.filter(s => s.id !== serverId)
    });
  };

  // Add Camera Group to active site
  const handleAddCameraGroup = () => {
    if (!activeSite) return;
    const newGroup: CameraGroup = {
      id: `cam-${Date.now()}`,
      name: `Camera Groep ${activeSite.cameraGroups.length + 1}`,
      count: 12,
      resolution: '1080p (2MP)',
      codec: 'H.265+ (Smart Codec)',
      fps: 15,
      motionPercent: 40,
      recordingMode: activeSite.edgeRecordingEnabled ? 'edge-with-retrieve' : 'continuous',
      bitrateKbps: 2000,
      retentionDays: 30
    };

    updateSite({
      ...activeSite,
      cameraGroups: [...activeSite.cameraGroups, newGroup]
    });
  };

  const handleDeleteCameraGroup = (groupId: string) => {
    if (!activeSite) return;
    updateSite({
      ...activeSite,
      cameraGroups: activeSite.cameraGroups.filter(c => c.id !== groupId)
    });
  };

  const handleUpdateCameraGroup = (groupId: string, updates: Partial<CameraGroup>) => {
    if (!activeSite) return;
    const updatedGroups = activeSite.cameraGroups.map(cg => {
      if (cg.id !== groupId) return cg;
      const merged = { ...cg, ...updates };
      // Auto adjust bitrate if resolution changes
      if (updates.resolution) {
        if (updates.resolution === '8MP (4K)') merged.bitrateKbps = 6000;
        else if (updates.resolution === '4MP (2K)') merged.bitrateKbps = 3500;
        else if (updates.resolution === '1080p (2MP)') merged.bitrateKbps = 2000;
        else if (updates.resolution === '12MP / 360°') merged.bitrateKbps = 8000;
        else merged.bitrateKbps = 1000;
      }
      return merged;
    });
    updateSite({ ...activeSite, cameraGroups: updatedGroups });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Bar: Global Architecture Meta */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-4 h-4 text-blue-600" />
              Project & Algemene Architectuur Instellingen
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Beheer het overkoepelende Milestone VMS model, klantsector en redundantieniveau.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="space-y-1 w-full md:w-auto">
              <label className="text-[10px] text-slate-500 block font-semibold uppercase">Architectuur Vorm</label>
              <select
                id="select-arch-type"
                value={project.architectureType}
                onChange={(e) => handleArchitectureTypeChange(e.target.value as ArchitectureType)}
                className="w-full md:w-auto px-3 py-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="single-site">Single Site</option>
                <option value="multi-site">Multi-Site (Gedistribueerde Opnameservers)</option>
                <option value="federated">Milestone Federated Architecture (MFA)</option>
                <option value="interconnect">Milestone Interconnect</option>
              </select>
            </div>

            <div className="space-y-1 w-full md:w-auto">
              <label className="text-[10px] text-slate-500 block font-semibold uppercase">Primaire Tier</label>
              <select
                id="select-primary-tier"
                value={project.primaryTier}
                onChange={(e) => onUpdateProject({ ...project, primaryTier: e.target.value as MilestoneTier })}
                className="w-full md:w-auto px-3 py-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg focus:ring-1 focus:ring-blue-500 cursor-pointer shadow-2xs"
              >
                <option value="Express+">Express+</option>
                <option value="Professional+">Professional+</option>
                <option value="Expert">Expert</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Project Name and Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] text-slate-600 block font-medium mb-1">Projectnaam</label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdateProject({ ...project, title: e.target.value })}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-2xs"
            />
          </div>
          <div>
            <label className="text-[11px] text-slate-600 block font-medium mb-1">Klantsector / Toepassing</label>
            <select
              value={project.globalSettings.customerSector}
              onChange={(e) => onUpdateProject({
                ...project,
                globalSettings: { ...project.globalSettings, customerSector: e.target.value as any }
              })}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-2xs"
            >
              <option value="Retail">Retail & Winkels</option>
              <option value="Smart City / Politie">Smart City / Politie & Veiligheidsregio</option>
              <option value="Campus / Onderwijs">Campus / Onderwijs & Ziekenhuizen</option>
              <option value="Industrie & Logistiek">Industrie & Logistiek</option>
              <option value="Kantoor / Corporate">Kantoor / Corporate</option>
              <option value="Transport & Mobiel">Transport & Mobiel (Voertuigen/Bussen)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-600 block font-medium mb-1">Redundantie / High Availability</label>
            <select
              value={project.globalSettings.redundancyLevel}
              onChange={(e) => onUpdateProject({
                ...project,
                globalSettings: { ...project.globalSettings, redundancyLevel: e.target.value as any }
              })}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 text-slate-900 text-xs rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none shadow-2xs"
            >
              <option value="none">Geen (Standaard single server)</option>
              <option value="failover-recording">Failover Recording Servers (Hot/Cold Standby)</option>
              <option value="management-cluster">Management Server Windows Failover Cluster</option>
              <option value="full-ha">Full HA (Cluster + Failover Recording)</option>
            </select>
          </div>
        </div>
      </div>

      {/* SITES MANAGER & DETAIL TABS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Sites List (col 4) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Locaties & Sites ({project.sites.length})</h3>
              <span className="text-[10px] text-slate-500">Selecteer een site om aan te passen</span>
            </div>
            <button
              id="btn-add-site"
              onClick={() => setShowAddSiteModal(true)}
              className="px-2.5 py-1 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Site Toevoegen</span>
            </button>
          </div>

          {/* Sites list */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {project.sites.map((site) => {
              const isSelected = site.id === (activeSite?.id || '');
              const camCount = site.cameraGroups.reduce((acc, c) => acc + c.count, 0);

              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSiteId(site.id)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 text-blue-900 ring-1 ring-blue-500/40 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <span className="truncate max-w-[180px]">{site.name}</span>
                      {site.role === 'hq-parent' && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">HQ</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span>{site.servers.length} server(s)</span>
                      <span>•</span>
                      <span>{camCount} camera's</span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {site.milestoneTier}
                    </span>
                    {project.sites.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSite(site.id);
                        }}
                        title="Verwijder Site"
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Site Configurator (col 8) */}
        {activeSite && (
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 space-y-6 shadow-card">
            {/* Active Site Header & Settings */}
            <div className="border-b border-slate-100 pb-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Configuratie: {activeSite.name}</h3>
                    <span className="text-[11px] text-slate-500">{activeSite.locationName}</span>
                  </div>
                </div>
              </div>

              {/* Site Details Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium mb-1">Site Naam</label>
                  <input
                    type="text"
                    value={activeSite.name}
                    onChange={(e) => updateSite({ ...activeSite, name: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-lg shadow-2xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium mb-1">Locatienaam / Adres</label>
                  <input
                    type="text"
                    value={activeSite.locationName}
                    onChange={(e) => updateSite({ ...activeSite, locationName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-lg shadow-2xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium mb-1">Milestone Editie (Tier)</label>
                  <select
                    value={activeSite.milestoneTier}
                    onChange={(e) => updateSite({ ...activeSite, milestoneTier: e.target.value as MilestoneTier })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-lg shadow-2xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Express+">Express+</option>
                    <option value="Professional+">Professional+</option>
                    <option value="Expert">Expert</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium mb-1">Netwerk Type</label>
                  <select
                    value={activeSite.networkType}
                    onChange={(e) => updateSite({ ...activeSite, networkType: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-lg shadow-2xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="LAN (10GbE/1GbE)">Lokaal LAN (10GbE/1GbE)</option>
                    <option value="Fiber WAN (>100Mbps)">Donkere Glasvezel WAN (&gt;100 Mbps)</option>
                    <option value="Broadband WAN (20-100Mbps)">Zakelijk Breedband WAN (20-100 Mbps)</option>
                    <option value="4G/5G Cellular (<20Mbps)">4G/5G Mobiel (&lt;20 Mbps)</option>
                    <option value="Intermittent / Mobile">Onderbroken / Voertuignetwerk</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block font-medium mb-1">Bandbreedte (Mbps)</label>
                  <input
                    type="number"
                    value={activeSite.wanBandwidthMbps}
                    onChange={(e) => updateSite({ ...activeSite, wanBandwidthMbps: Number(e.target.value) || 10 })}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 text-slate-900 rounded-lg shadow-2xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id={`edge-rec-${activeSite.id}`}
                    checked={activeSite.edgeRecordingEnabled}
                    onChange={(e) => updateSite({ ...activeSite, edgeRecordingEnabled: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`edge-rec-${activeSite.id}`} className="text-xs text-slate-700 font-medium cursor-pointer">
                    Edge Recording & Retrieval actief
                  </label>
                </div>
              </div>
            </div>

            {/* SERVERS IN ACTIVE SITE */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                  <Server className="w-3.5 h-3.5 text-blue-600" />
                  Servers op deze locatie ({activeSite.servers.length})
                </h4>
                <button
                  onClick={() => setShowAddServerModal(true)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Server Toevoegen</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeSite.servers.map((srv) => (
                  <div key={srv.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{srv.name}</span>
                      <button
                        onClick={() => handleDeleteServer(srv.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                        title="Verwijder Server"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Rol:</span>
                        <span className="text-blue-700 font-semibold capitalize">{srv.role}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Hardware:</span>
                        <span className="text-slate-800 font-medium">
                          {srv.specs?.cpuCores} Cores • {srv.specs?.ramGb} GB RAM
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CAMERA GROUPS IN ACTIVE SITE */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  Camera Groepen ({activeSite.cameraGroups.reduce((a, b) => a + b.count, 0)} camera's)
                </h4>
                <button
                  onClick={handleAddCameraGroup}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 shadow-2xs flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Camera Groep Toevoegen</span>
                </button>
              </div>

              <div className="space-y-3">
                {activeSite.cameraGroups.map((cg) => (
                  <div key={cg.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex items-center justify-between gap-3">
                      <input
                        type="text"
                        value={cg.name}
                        onChange={(e) => handleUpdateCameraGroup(cg.id, { name: e.target.value })}
                        className="font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none px-1"
                      />
                      <button
                        onClick={() => handleDeleteCameraGroup(cg.id)}
                        className="text-slate-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Aantal Camera's</label>
                        <input
                          type="number"
                          value={cg.count}
                          onChange={(e) => handleUpdateCameraGroup(cg.id, { count: Math.max(1, Number(e.target.value)) })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Resolutie</label>
                        <select
                          value={cg.resolution}
                          onChange={(e) => handleUpdateCameraGroup(cg.id, { resolution: e.target.value as CameraResolution })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                        >
                          <option value="1080p (2MP)">1080p (2MP)</option>
                          <option value="4MP (2K)">4MP (2K)</option>
                          <option value="8MP (4K)">8MP (4K)</option>
                          <option value="12MP / 360°">12MP / 360°</option>
                          <option value="Thermal / Low-Res">Thermal / Low-Res</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Codec</label>
                        <select
                          value={cg.codec}
                          onChange={(e) => handleUpdateCameraGroup(cg.id, { codec: e.target.value as CameraCodec })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                        >
                          <option value="H.265+ (Smart Codec)">H.265+ (Smart Codec)</option>
                          <option value="H.265">H.265 Standard</option>
                          <option value="H.264">H.264 AVC</option>
                          <option value="MJPEG">MJPEG</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Retentie (Dagen)</label>
                        <input
                          type="number"
                          value={cg.retentionDays}
                          onChange={(e) => handleUpdateCameraGroup(cg.id, { retentionDays: Math.max(1, Number(e.target.value)) })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STORAGE ARCHITECTURE CONFIG */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider">
                <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                Opslag & Retentie Sizing
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                {/* Live storage */}
                <div className="space-y-2">
                  <span className="font-bold text-slate-800 block text-xs">Tier 1: Live Snelle Opslag</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] text-slate-500 block">Dagen Live</label>
                      <input
                        type="number"
                        value={activeSite.storage.liveStorageDays}
                        onChange={(e) => updateSite({
                          ...activeSite,
                          storage: { ...activeSite.storage, liveStorageDays: Number(e.target.value) || 1 }
                        })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 block">RAID Niveau</label>
                      <select
                        value={activeSite.storage.liveStorageRaid}
                        onChange={(e) => updateSite({
                          ...activeSite,
                          storage: { ...activeSite.storage, liveStorageRaid: e.target.value as any }
                        })}
                        className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                      >
                        <option value="RAID 10">RAID 10 (Snelst / 50%)</option>
                        <option value="RAID 5">RAID 5 (Standaard / 80%)</option>
                        <option value="RAID 6">RAID 6 (Dubbele Pariteit)</option>
                        <option value="RAID 1">RAID 1 (Mirror)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Archive storage */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">Tier 2: Archief Opslag</span>
                    <input
                      type="checkbox"
                      checked={activeSite.storage.archiveEnabled}
                      onChange={(e) => updateSite({
                        ...activeSite,
                        storage: { ...activeSite.storage, archiveEnabled: e.target.checked }
                      })}
                      className="rounded border-slate-300 text-blue-600"
                    />
                  </div>
                  {activeSite.storage.archiveEnabled && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500 block">Dagen Archief</label>
                        <input
                          type="number"
                          value={activeSite.storage.archiveStorageDays}
                          onChange={(e) => updateSite({
                            ...activeSite,
                            storage: { ...activeSite.storage, archiveStorageDays: Number(e.target.value) || 1 }
                          })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 block">Archief Type</label>
                        <select
                          value={activeSite.storage.archiveStorageType}
                          onChange={(e) => updateSite({
                            ...activeSite,
                            storage: { ...activeSite.storage, archiveStorageType: e.target.value as StorageTier }
                          })}
                          className="w-full px-2 py-1 bg-white border border-slate-300 text-slate-900 rounded"
                        >
                          <option value="archive-nas-san">NAS / SAN (iSCSI/SMB)</option>
                          <option value="archive-cloud-s3">Cloud Storage (S3/Azure)</option>
                          <option value="live-sas-hdd">Interne SAS HDD Pool</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Site Modal */}
      {showAddSiteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              Nieuwe Milestone Site Toevoegen
            </h3>
            <p className="text-xs text-slate-500">
              Kies het gewenste sitetype en rol binnen de Milestone architectuur:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => handleAddSite('child-federated')}
                className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-xs transition-colors space-y-0.5"
              >
                <strong className="text-emerald-700 block">Milestone Federated Child Site (MFA)</strong>
                <span className="text-slate-500 text-[11px]">Autonome site met eigen Management Server en Corporate/Expert licentie.</span>
              </button>

              <button
                onClick={() => handleAddSite('remote-interconnected')}
                className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 text-xs transition-colors space-y-0.5"
              >
                <strong className="text-amber-700 block">Milestone Interconnect Remote Site</strong>
                <span className="text-slate-500 text-[11px]">Standalone vestiging met Express+, Pro+ of Husky IVO edge recording.</span>
              </button>

              <button
                onClick={() => handleAddSite('distributed-branch')}
                className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-cyan-50/60 border border-slate-200 hover:border-cyan-300 text-xs transition-colors space-y-0.5"
              >
                <strong className="text-cyan-700 block">Gedistribueerde Branch Opnameserver</strong>
                <span className="text-slate-500 text-[11px]">Enkel een Recording Server gekoppeld aan de centrale Management Server.</span>
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddSiteModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Server Modal */}
      {showAddServerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Server Toevoegen aan {activeSite?.name}</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleAddServer('recording')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <strong className="text-slate-800 block">Primaire Recording Server</strong>
                  <span className="text-[10px] text-slate-500">Verwerkt camerastreams en schrijft naar storage.</span>
                </div>
                <Server className="w-4 h-4 text-blue-600" />
              </button>

              <button
                onClick={() => handleAddServer('failover-recording')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <strong className="text-amber-700 block">Failover Recording Server (Hot/Cold Standby)</strong>
                  <span className="text-[10px] text-slate-500">Neemt opnames over bij uitval van primaire server.</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-amber-600" />
              </button>

              <button
                onClick={() => handleAddServer('mobile')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <strong className="text-emerald-700 block">Mobile Server & Web Client Gateway</strong>
                  <span className="text-[10px] text-slate-500">Transcodeert videostreams voor browsers en smartphones.</span>
                </div>
                <Smartphone className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => handleAddServer('event')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-indigo-50 border border-slate-200 text-xs flex items-center justify-between"
              >
                <div>
                  <strong className="text-indigo-700 block">Event & Analytics Server</strong>
                  <span className="text-[10px] text-slate-500">Verwerkt alarmen, MIP SDK plugins en video analytics.</span>
                </div>
                <Database className="w-4 h-4 text-indigo-600" />
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddServerModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
