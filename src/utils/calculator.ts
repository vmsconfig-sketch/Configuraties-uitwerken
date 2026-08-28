import { ArchitectureProject, CameraGroup, SizingCalculation, MilestoneTier } from '../types';

export function calculateProjectSizing(project: ArchitectureProject): SizingCalculation {
  let totalCameras = 0;
  let totalRecordingServers = 0;
  let totalFailoverServers = 0;
  let totalLiveStorageTB = 0;
  let totalArchiveStorageTB = 0;
  let totalIngressBandwidthMbps = 0;
  let totalWanEgressBandwidthMbps = 0;

  const baseLicensesMap: Record<MilestoneTier, number> = {
    'Express+': 0,
    'Professional+': 0,
    'Expert': 0,
    'Corporate': 0,
  };

  let totalStandardDeviceLicenses = 0;
  let totalInterconnectLicenses = 0;

  project.sites.forEach((site) => {
    // Count servers
    site.servers.forEach((srv) => {
      if (srv.role === 'recording') {
        totalRecordingServers++;
      } else if (srv.role === 'failover-recording') {
        totalFailoverServers++;
      }
    });

    // Base license count
    if (project.architectureType === 'single-site' || project.architectureType === 'multi-site') {
      if (site.role === 'hq-parent' || site.role === 'standalone') {
        baseLicensesMap[site.milestoneTier] = (baseLicensesMap[site.milestoneTier] || 0) + 1;
      }
    } else {
      // Federated or Interconnect: Each autonomous site requires its own base license
      if (site.isAutonomous) {
        baseLicensesMap[site.milestoneTier] = (baseLicensesMap[site.milestoneTier] || 0) + 1;
      }
    }

    // Process camera groups
    let siteCameras = 0;
    let siteIngressMbps = 0;

    site.cameraGroups.forEach((camGroup: CameraGroup) => {
      const count = camGroup.count || 0;
      siteCameras += count;
      totalCameras += count;

      // Bitrate in Mbps
      const groupBandwidthMbps = (count * camGroup.bitrateKbps) / 1000;
      siteIngressMbps += groupBandwidthMbps;
      totalIngressBandwidthMbps += groupBandwidthMbps;

      // Storage calculation:
      // Bitrate * seconds/day * motion factor / 8 bits / 10^6 MB
      const motionFactor = (camGroup.motionPercent || 50) / 100;
      const effectiveBitrateKbps = camGroup.recordingMode === 'continuous' 
        ? camGroup.bitrateKbps 
        : camGroup.bitrateKbps * motionFactor;

      // Gigabytes per day for this group
      // (Kbps * 3600 * 24) / (8 * 1024 * 1024) = GB/day per camera
      const gbPerDayPerCam = (effectiveBitrateKbps * 86400) / (8 * 1024 * 1024);
      const totalGbPerDay = gbPerDayPerCam * count;

      // Live storage vs Archive storage
      const liveDays = Math.min(site.storage.liveStorageDays, camGroup.retentionDays);
      const archiveDays = site.storage.archiveEnabled 
        ? Math.max(0, camGroup.retentionDays - liveDays) 
        : 0;

      // RAID overhead multipliers
      const liveRaidMultiplier = getRaidMultiplier(site.storage.liveStorageRaid);
      const archiveRaidMultiplier = getRaidMultiplier(site.storage.archiveStorageRaid);

      const liveTB = ((totalGbPerDay * liveDays) / 1024) * liveRaidMultiplier * 1.15; // 15% safety margin
      const archiveTB = ((totalGbPerDay * archiveDays) / 1024) * archiveRaidMultiplier * 1.15;

      totalLiveStorageTB += liveTB;
      totalArchiveStorageTB += archiveTB;

      // Licenties
      totalStandardDeviceLicenses += count;

      if (project.architectureType === 'interconnect' && (site.role === 'remote-interconnected' || site.role === 'child-federated')) {
        totalInterconnectLicenses += count;
      }
    });

    // WAN calculations
    if (site.role === 'remote-interconnected') {
      if (site.edgeRecordingEnabled) {
        // Interconnect edge upload: ~15% bandwidth overhead on demand or alarm
        totalWanEgressBandwidthMbps += siteIngressMbps * 0.15;
      } else {
        totalWanEgressBandwidthMbps += siteIngressMbps;
      }
    } else if (site.role === 'distributed-branch') {
      // Multi-site branch streaming to central smart client
      totalWanEgressBandwidthMbps += siteIngressMbps * 0.35;
    }
  });

  // Base license breakdown
  const baseLicenses = Object.entries(baseLicensesMap)
    .filter(([_, count]) => count > 0)
    .map(([tier, count]) => ({
      tier: tier as MilestoneTier,
      count,
      name: `Milestone XProtect ${tier} Base License`
    }));

  // Hardware sizing recommendations
  const recCpu = totalCameras > 200 ? 'Intel Xeon Silver / AMD EPYC 16-Core' : (totalCameras > 64 ? 'Intel Xeon E-2388G / Core i7 8-Core' : 'Intel Core i5 / Xeon E-2300 4-Core');
  const recRam = totalCameras > 200 ? '64 GB ECC DDR4/DDR5' : (totalCameras > 64 ? '32 GB ECC DDR4' : '16 GB DDR4');

  const recRecordingCpu = totalIngressBandwidthMbps > 1000 ? 'Dual Intel Xeon Gold / AMD EPYC 24-Core' : (totalIngressBandwidthMbps > 400 ? 'Intel Xeon Silver 12-Core' : 'Intel Xeon E-2388G 8-Core');
  const recRecordingRam = totalIngressBandwidthMbps > 1000 ? '64 GB - 128 GB ECC' : (totalIngressBandwidthMbps > 400 ? '32 GB - 64 GB ECC' : '16 GB - 32 GB ECC');

  return {
    totalCameras,
    totalSites: project.sites.length,
    totalRecordingServers,
    totalFailoverServers,
    totalLiveStorageTB: Math.round(totalLiveStorageTB * 10) / 10,
    totalArchiveStorageTB: Math.round(totalArchiveStorageTB * 10) / 10,
    totalStorageTB: Math.round((totalLiveStorageTB + totalArchiveStorageTB) * 10) / 10,
    totalIngressBandwidthMbps: Math.round(totalIngressBandwidthMbps),
    totalWanEgressBandwidthMbps: Math.round(totalWanEgressBandwidthMbps),
    licensingBOM: {
      baseLicenses,
      deviceLicenses: totalStandardDeviceLicenses,
      interconnectLicenses: totalInterconnectLicenses,
      carePlusRecommendedYears: 3
    },
    serverHardwareRecommendations: {
      managementServer: {
        cpu: recCpu,
        ram: recRam,
        disk: '2x 480GB NVMe SSD (RAID 1 Mirror for OS & SQL DB)',
        os: 'Microsoft Windows Server 2022 Standard / Datacenter'
      },
      recordingServers: {
        cpu: recRecordingCpu,
        ram: recRecordingRam,
        storageIops: totalIngressBandwidthMbps > 800 ? 'Enterprise NVMe / SAS SSD + MegaRAID Controller with BBU Cache' : 'Enterprise SAS 12Gbps 7.2k HDD in RAID 10/6',
        nic: totalIngressBandwidthMbps > 600 ? 'Dual 10GbE SFP+ (LACP Bonding)' : 'Dual 1GbE / 2.5GbE'
      }
    }
  };
}

function getRaidMultiplier(raid: string): number {
  switch (raid) {
    case 'RAID 1':
    case 'RAID 10':
      return 2.0; // 50% usable capacity
    case 'RAID 5':
      return 1.25; // ~80% usable capacity
    case 'RAID 6':
      return 1.35; // ~70% usable capacity
    case 'RAID 0':
    case 'JBOD':
    case 'Cloud':
    default:
      return 1.05;
  }
}
