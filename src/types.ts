export type ArchitectureType = 'single-site' | 'multi-site' | 'federated' | 'interconnect';

export type MilestoneTier = 'Express+' | 'Professional+' | 'Expert' | 'Corporate';

export type ServerRole = 
  | 'management' 
  | 'recording' 
  | 'failover-recording' 
  | 'mobile' 
  | 'event' 
  | 'log' 
  | 'sql-database' 
  | 'api-gateway'
  | 'smart-client';

export type StorageTier = 'live-nvme-ssd' | 'live-sas-hdd' | 'archive-nas-san' | 'archive-cloud-s3';

export type CameraCodec = 'H.264' | 'H.265' | 'H.265+ (Smart Codec)' | 'MJPEG';

export type CameraResolution = '1080p (2MP)' | '4MP (2K)' | '8MP (4K)' | '12MP / 360°' | 'Thermal / Low-Res';

export interface CameraGroup {
  id: string;
  name: string;
  count: number;
  resolution: CameraResolution;
  codec: CameraCodec;
  fps: number;
  motionPercent: number; // 10% to 100%
  recordingMode: 'continuous' | 'motion-only' | 'edge-only' | 'edge-with-retrieve';
  bitrateKbps: number;
  retentionDays: number;
}

export interface StorageConfig {
  liveStorageDays: number;
  liveStorageType: StorageTier;
  liveStorageRaid: 'RAID 0' | 'RAID 1' | 'RAID 5' | 'RAID 6' | 'RAID 10';
  archiveEnabled: boolean;
  archiveStorageDays: number;
  archiveStorageType: StorageTier;
  archiveStorageRaid: 'RAID 5' | 'RAID 6' | 'JBOD' | 'Cloud';
}

export interface ServerNode {
  id: string;
  name: string;
  role: ServerRole;
  hostname?: string;
  ipAddress?: string;
  isFailover?: boolean;
  failoverType?: 'cold-standby' | 'hot-standby';
  specs?: {
    cpuCores: number;
    ramGb: number;
    nicSpeedGbps: number;
    os: string;
  };
  assignedCameraIds?: string[];
}

export interface SiteModel {
  id: string;
  name: string;
  locationName: string;
  role: 'hq-parent' | 'child-federated' | 'remote-interconnected' | 'distributed-branch' | 'standalone';
  milestoneTier: MilestoneTier;
  networkType: 'LAN (10GbE/1GbE)' | 'Fiber WAN (>100Mbps)' | 'Broadband WAN (20-100Mbps)' | '4G/5G Cellular (<20Mbps)' | 'Intermittent / Mobile';
  wanBandwidthMbps: number;
  wanLatencyMs: number;
  isAutonomous: boolean; // Has local Management Server and SQL DB
  edgeRecordingEnabled: boolean;
  servers: ServerNode[];
  cameraGroups: CameraGroup[];
  storage: StorageConfig;
  notes?: string;
}

export interface ArchitectureProject {
  id: string;
  title: string;
  description: string;
  architectureType: ArchitectureType;
  primaryTier: MilestoneTier;
  author: string;
  updatedAt: string;
  sites: SiteModel[];
  globalSettings: {
    redundancyLevel: 'none' | 'failover-recording' | 'management-cluster' | 'full-ha';
    enableCarePlus: boolean;
    customerSector: 'Retail' | 'Smart City / Politie' | 'Campus / Onderwijs' | 'Industrie & Logistiek' | 'Kantoor / Corporate' | 'Transport & Mobiel';
  };
}

export interface ArchitectureRecommendation {
  type: ArchitectureType;
  title: string;
  dutchTitle: string;
  matchScore: number; // 0 - 100
  recommendedTiers: MilestoneTier[];
  summary: string;
  keyBenefits: string[];
  drawbacks: string[];
  bandwidthRequirements: string;
  licensingModel: string;
  bestFitScenario: string;
}

export interface SizingCalculation {
  totalCameras: number;
  totalSites: number;
  totalRecordingServers: number;
  totalFailoverServers: number;
  totalLiveStorageTB: number;
  totalArchiveStorageTB: number;
  totalStorageTB: number;
  totalIngressBandwidthMbps: number;
  totalWanEgressBandwidthMbps: number;
  licensingBOM: {
    baseLicenses: { tier: MilestoneTier; count: number; name: string }[];
    deviceLicenses: number;
    interconnectLicenses: number;
    carePlusRecommendedYears: number;
  };
  serverHardwareRecommendations: {
    managementServer: { cpu: string; ram: string; disk: string; os: string };
    recordingServers: { cpu: string; ram: string; storageIops: string; nic: string };
  };
}

export interface MilestonePortInfo {
  port: number;
  protocol: 'TCP' | 'UDP' | 'TCP/UDP';
  source: string;
  destination: string;
  purpose: string;
  criticality: 'Verplicht' | 'Aanbevolen' | 'Optioneel';
  notes: string;
}
