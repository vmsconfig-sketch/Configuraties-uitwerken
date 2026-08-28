import { ArchitectureProject, ArchitectureRecommendation, MilestonePortInfo } from '../types';

export interface ArchitectureComparisonItem {
  dimension: string;
  category: 'Architectuur & Schaal' | 'Netwerk & WAN' | 'Beheer & Authenticatie' | 'Live & Playback' | 'Licenties & Kosten';
  singleSite: string;
  multiSite: string;
  federated: string;
  interconnect: string;
}

export const ARCHITECTURE_COMPARISON: ArchitectureComparisonItem[] = [
  {
    dimension: 'Aantal Locaties / Sites',
    category: 'Architectuur & Schaal',
    singleSite: '1 fysieke locatie (LAN)',
    multiSite: 'Meerdere locaties (1 centraal beheer, meerdere opnameservers)',
    federated: 'Meerdere onafhankelijke sites (tot honderden hiërarchisch geschakeld)',
    interconnect: 'Centrale Corporate hub verbonden met tientallen/honderden remote sites of mobiele units'
  },
  {
    dimension: 'Autonomie van de Remote Site',
    category: 'Architectuur & Schaal',
    singleSite: 'N.v.t. (Alles op 1 locatie)',
    multiSite: 'Laag: Als WAN uitvalt, kunnen lokale opnameservers wel opnemen mits cache actief, maar configuratie en login vereisen verbinding met Management Server',
    federated: 'Hoog: Elke child site heeft eigen Management Server + SQL DB en blijft 100% operationeel bij WAN uitval',
    interconnect: 'Zeer Hoog: Elke remote site is een volledig standalone Milestone VMS systeem (of Husky appliance) met eigen lokale werking'
  },
  {
    dimension: 'Ondersteunde Milestone Edities',
    category: 'Licenties & Kosten',
    singleSite: 'Express+, Professional+, Expert, Corporate',
    multiSite: 'Professional+ (beperkt), Expert, Corporate',
    federated: 'Alleen XProtect Corporate en XProtect Expert (Parent & Child sites)',
    interconnect: 'Centraal: XProtect Corporate vereist. Remote: Alle edities (Corporate, Expert, Pro+, Express+) of Husky'
  },
  {
    dimension: 'Extra Licentiekosten',
    category: 'Licenties & Kosten',
    singleSite: 'Alleen standaard apparaatlicenties (Device licenses)',
    multiSite: 'Alleen standaard apparaatlicenties op de centrale server',
    federated: 'Geen extra licentiekosten! MFA functionaliteit is inbegrepen in Corporate & Expert',
    interconnect: '1x Milestone Interconnect apparaatlicentie op de centrale Corporate server per verbonden camera'
  },
  {
    dimension: 'Netwerk & Bandbreedte Vereisten',
    category: 'Netwerk & WAN',
    singleSite: 'Alleen lokaal gigabit LAN netwerk (1GbE / 10GbE)',
    multiSite: 'Permanente, stabiele WAN verbinding met lage latency vereist tussen Management Server en opnameservers',
    federated: 'Continue IP netwerkverbinding vereist tussen de Management Servers van parent en child sites',
    interconnect: 'Uiterst flexibel: Geschikt voor lage bandbreedte, 4G/5G, periodieke of onderbroken verbindingen (Edge pull on demand)'
  },
  {
    dimension: 'Edge Storage & Video Retrieval',
    category: 'Live & Playback',
    singleSite: 'Optioneel (bijv. SD-kaart backup in camera bij server downtime)',
    multiSite: 'Camera Edge storage synchronisatie mogelijk',
    federated: 'Geen automatische cross-site bulk video retrieve naar parent; beelden blijven op de child site',
    interconnect: 'Geavanceerd: Geautomatiseerde alarm-gestuurde retrieval, geplande nacht-upload of on-demand retrieve naar de centrale server'
  },
  {
    dimension: 'Gebruikersbeheer & Authenticatie',
    category: 'Beheer & Authenticatie',
    singleSite: 'Windows Active Directory / Lokale Windows accounts / Basis gebruikers',
    multiSite: 'Centraal geregeld via de centrale Management Server (1 centraal AD domein)',
    federated: 'Centraal inloggen via Active Directory Domain Trust of federated user mapping. Operators zien de hele boomstructuur',
    interconnect: 'Onafhankelijk: Centrale Corporate beheert centrale operators. Remote sites behouden hun eigen lokale accounts/rollen'
  },
  {
    dimension: 'Live Weergave & Smart Client Ervaring',
    category: 'Live & Playback',
    singleSite: 'Rechtstreeks streamen vanaf lokale opnameserver (lage latency)',
    multiSite: 'Smart Client streamt direct vanaf de remote opnameserver via WAN of via Mobile Server',
    federated: 'Naadloos: Operator logt 1x in op Parent Smart Client en navigeert transparant door alle child sites',
    interconnect: 'Directe live streaming naar centrale Smart Client (mits bandbreedte toereikend) of proxy streaming via centrale server'
  },
  {
    dimension: 'Centraal vs Lokaal Systeembeheer',
    category: 'Beheer & Authenticatie',
    singleSite: '1 Management Client voor het hele systeem',
    multiSite: '1 centrale Management Client beheert alle opnameservers en camera\'s',
    federated: 'Decentraal: Lokale beheerders configureren hun eigen child site; Parent site kan geen camera-instellingen forceren op child',
    interconnect: 'Volledig gescheiden beheer: Remote beheerder configureert eigen site. Corporate beheerder koppelt enkel de camera streams'
  },
  {
    dimension: 'Failover & Redundantie',
    category: 'Architectuur & Schaal',
    singleSite: 'Cold / Hot Standby failover opnameservers (Expert/Corporate)',
    multiSite: 'Failover opnameservers kunnen lokaal per vestiging of centraal worden geplaatst',
    federated: 'Elke site kan eigen failover servers en MS clustering inzetten voor maximale lokale continuïteit',
    interconnect: 'Remote sites blijven continu opnemen, zelfs bij totale storing van de centrale Corporate hub'
  }
];

export const MILESTONE_PORTS: MilestonePortInfo[] = [
  {
    port: 80,
    protocol: 'TCP',
    source: 'Smart Client / Web Client / Management Client / DLNA',
    destination: 'Management Server / Mobile Server',
    purpose: 'HTTP web service communicatie, licentie activatie, downloadpagina',
    criticality: 'Verplicht',
    notes: 'Kan worden omgeleid of vervangen door HTTPS (443)'
  },
  {
    port: 443,
    protocol: 'TCP',
    source: 'Clients / Services / Interconnect / MFA',
    destination: 'Management Server / API Gateway / Mobile Server',
    purpose: 'Beveiligde HTTPS communicatie, certificaat-gebaseerde encryptie, OIDC authenticatie',
    criticality: 'Verplicht',
    notes: 'Sterk aanbevolen voor TLS 1.2 / TLS 1.3 versleuteling'
  },
  {
    port: 7563,
    protocol: 'TCP',
    source: 'Smart Client / Mobile Server / Interconnect Corporate',
    destination: 'Recording Server',
    purpose: 'Live & Playback video streaming vanaf de opnameserver naar clients',
    criticality: 'Verplicht',
    notes: 'Standaard niet-versleutelde videostreams. Versleuteld op 7563 met servercertificaat.'
  },
  {
    port: 22331,
    protocol: 'TCP',
    source: 'Management Server / Failover Server',
    destination: 'Recording Server',
    purpose: 'Opnameserver configuratie & status polling via SOAP/WCF service',
    criticality: 'Verplicht',
    notes: 'Cruciaal voor communicatie tussen Management Server en Recording Servers'
  },
  {
    port: 22332,
    protocol: 'TCP',
    source: 'Recording Server / Analytics / MIP Plugins',
    destination: 'Event Server',
    purpose: 'Verzenden van alarmen, camera events, analytics triggers en access control events',
    criticality: 'Verplicht',
    notes: 'Essentieel voor de Milestone Alarm Manager en regelengine'
  },
  {
    port: 22333,
    protocol: 'TCP',
    source: 'Recording Server / Services',
    destination: 'Log Server',
    purpose: 'Audit logs, systeem logs en regellogs verzenden',
    criticality: 'Aanbevolen',
    notes: 'Draait standaard op de Management Server of dedicated machine'
  },
  {
    port: 8081,
    protocol: 'TCP',
    source: 'Web Browser / Mobile App (iOS & Android)',
    destination: 'Mobile Server',
    purpose: 'HTTP poort voor Web Client en XProtect Mobile App',
    criticality: 'Aanbevolen',
    notes: 'Meestal omgeleid naar 8082 (HTTPS)'
  },
  {
    port: 8082,
    protocol: 'TCP',
    source: 'Web Browser / Mobile App (iOS & Android)',
    destination: 'Mobile Server',
    purpose: 'Beveiligde HTTPS poort voor Web Client en Mobile streaming',
    criticality: 'Aanbevolen',
    notes: 'Ondersteunt video push van smartphone camera\'s naar Milestone'
  },
  {
    port: 1433,
    protocol: 'TCP',
    source: 'Management Server / Event Server / Log Server',
    destination: 'SQL Server Database',
    purpose: 'Microsoft SQL Server communicatie voor VMS configuratiedatabase',
    criticality: 'Verplicht',
    notes: 'SQL Server Express of SQL Server Standard/Enterprise'
  }
];

export const PRESET_ARCHITECTURES: ArchitectureProject[] = [
  {
    id: 'preset-single-site',
    title: 'Enkel Hoofdkantoor (Single Site)',
    description: 'Typische opstelling voor één bedrijfspand met 64 Full HD camera\'s, centrale opnameserver met failover en lokale monitoring.',
    architectureType: 'single-site',
    primaryTier: 'Expert',
    author: 'Milestone Solution Architect',
    updatedAt: '2026-08-22',
    globalSettings: {
      redundancyLevel: 'failover-recording',
      enableCarePlus: true,
      customerSector: 'Kantoor / Corporate'
    },
    sites: [
      {
        id: 'site-hq',
        name: 'Hoofdkantoor Amsterdam',
        locationName: 'Amsterdam Science Park',
        role: 'standalone',
        milestoneTier: 'Expert',
        networkType: 'LAN (10GbE/1GbE)',
        wanBandwidthMbps: 1000,
        wanLatencyMs: 1,
        isAutonomous: true,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'srv-mgmt-sql',
            name: 'AMS-MGMT-SQL01',
            role: 'management',
            hostname: 'ams-mgmt.corp.local',
            ipAddress: '192.168.10.10',
            specs: { cpuCores: 16, ramGb: 32, nicSpeedGbps: 10, os: 'Windows Server 2022 Datacenter' }
          },
          {
            id: 'srv-rec-01',
            name: 'AMS-REC01 (Primaire Opnameserver)',
            role: 'recording',
            hostname: 'ams-rec01.corp.local',
            ipAddress: '192.168.10.21',
            specs: { cpuCores: 24, ramGb: 64, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'srv-failover-01',
            name: 'AMS-FO01 (Hot Standby Failover)',
            role: 'failover-recording',
            isFailover: true,
            failoverType: 'hot-standby',
            hostname: 'ams-fo01.corp.local',
            ipAddress: '192.168.10.25',
            specs: { cpuCores: 24, ramGb: 64, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'srv-mobile-01',
            name: 'AMS-MOB01 (Web & Mobile Gateway)',
            role: 'mobile',
            hostname: 'ams-mob01.corp.local',
            ipAddress: '192.168.10.30',
            specs: { cpuCores: 8, ramGb: 16, nicSpeedGbps: 1, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-grp-1',
            name: 'Binnenruimtes & Kantoren',
            count: 48,
            resolution: '1080p (2MP)',
            codec: 'H.265+ (Smart Codec)',
            fps: 15,
            motionPercent: 35,
            recordingMode: 'motion-only',
            bitrateKbps: 1800,
            retentionDays: 30
          },
          {
            id: 'cam-grp-2',
            name: 'Perimeter & Ingangen (4K High-Res)',
            count: 16,
            resolution: '8MP (4K)',
            codec: 'H.265',
            fps: 25,
            motionPercent: 60,
            recordingMode: 'continuous',
            bitrateKbps: 6000,
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
        },
        notes: 'Enkele site met complete scheiding tussen live storage (NVMe SSD) en archief storage (Synology Enterprise NAS).'
      }
    ]
  },
  {
    id: 'preset-federated-smartcity',
    title: 'Smart City & Politie Regio (Federated Architecture - MFA)',
    description: 'Milestone Federated Architecture met een centrale meldkamer (Parent Corporate) die transparant toegang heeft tot 3 zelfstandige gemeentelijke sites (Child Corporate/Expert).',
    architectureType: 'federated',
    primaryTier: 'Corporate',
    author: 'Milestone Solution Architect',
    updatedAt: '2026-08-22',
    globalSettings: {
      redundancyLevel: 'full-ha',
      enableCarePlus: true,
      customerSector: 'Smart City / Politie'
    },
    sites: [
      {
        id: 'site-parent-meldkamer',
        name: 'Centrale Meldkamer Regio (Parent)',
        locationName: 'Regionale Veiligheidsregio HQ',
        role: 'hq-parent',
        milestoneTier: 'Corporate',
        networkType: 'Fiber WAN (>100Mbps)',
        wanBandwidthMbps: 10000,
        wanLatencyMs: 2,
        isAutonomous: true,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'parent-mgmt-sql',
            name: 'HQ-MGMT-CLUSTER (Active/Passive)',
            role: 'management',
            hostname: 'hq-mgmt.veiligheid.local',
            ipAddress: '10.100.1.10',
            specs: { cpuCores: 32, ramGb: 64, nicSpeedGbps: 10, os: 'Windows Server 2022 Cluster' }
          },
          {
            id: 'parent-event-ai',
            name: 'HQ-EVENT-AI (Milestone Open Platform Analytics)',
            role: 'event',
            hostname: 'hq-event.veiligheid.local',
            ipAddress: '10.100.1.15',
            specs: { cpuCores: 16, ramGb: 32, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'parent-rec-01',
            name: 'HQ-REC01 (Centrale HQ Camera\'s)',
            role: 'recording',
            hostname: 'hq-rec01.veiligheid.local',
            ipAddress: '10.100.1.20',
            specs: { cpuCores: 24, ramGb: 64, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-hq-1',
            name: 'Meldkamer & HQ Beveiliging',
            count: 32,
            resolution: '4MP (2K)',
            codec: 'H.265',
            fps: 25,
            motionPercent: 50,
            recordingMode: 'continuous',
            bitrateKbps: 3500,
            retentionDays: 60
          }
        ],
        storage: {
          liveStorageDays: 14,
          liveStorageType: 'live-nvme-ssd',
          liveStorageRaid: 'RAID 10',
          archiveEnabled: true,
          archiveStorageDays: 46,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'RAID 6'
        },
        notes: 'Parent site met centrale Smart Client video wall voor gezamenlijke operators.'
      },
      {
        id: 'site-child-stad-noord',
        name: 'Gemeente Noord (Child Site 1)',
        locationName: 'Stadscentrum Noord',
        role: 'child-federated',
        milestoneTier: 'Corporate',
        networkType: 'Fiber WAN (>100Mbps)',
        wanBandwidthMbps: 1000,
        wanLatencyMs: 4,
        isAutonomous: true,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'child1-mgmt',
            name: 'NOORD-MGMT01 (Lokale Autonome Server)',
            role: 'management',
            hostname: 'noord-mgmt.gemeente.local',
            ipAddress: '10.101.1.10',
            specs: { cpuCores: 16, ramGb: 32, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'child1-rec01',
            name: 'NOORD-REC01 (Openbare Orde Camera\'s)',
            role: 'recording',
            hostname: 'noord-rec01.gemeente.local',
            ipAddress: '10.101.1.20',
            specs: { cpuCores: 32, ramGb: 128, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'child1-fo01',
            name: 'NOORD-FO01 (Hot Standby Failover)',
            role: 'failover-recording',
            isFailover: true,
            failoverType: 'hot-standby',
            hostname: 'noord-fo01.gemeente.local',
            ipAddress: '10.101.1.25',
            specs: { cpuCores: 32, ramGb: 128, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-child1-ptz',
            name: 'CCTV Pleinen & Uitgaansgebied (PTZ & 4K)',
            count: 96,
            resolution: '8MP (4K)',
            codec: 'H.265+ (Smart Codec)',
            fps: 25,
            motionPercent: 75,
            recordingMode: 'continuous',
            bitrateKbps: 5000,
            retentionDays: 28
          }
        ],
        storage: {
          liveStorageDays: 7,
          liveStorageType: 'live-nvme-ssd',
          liveStorageRaid: 'RAID 10',
          archiveEnabled: true,
          archiveStorageDays: 21,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'RAID 6'
        }
      },
      {
        id: 'site-child-stad-zuid',
        name: 'Gemeente Zuid (Child Site 2)',
        locationName: 'Haven & Bedrijventerrein',
        role: 'child-federated',
        milestoneTier: 'Expert',
        networkType: 'Fiber WAN (>100Mbps)',
        wanBandwidthMbps: 500,
        wanLatencyMs: 6,
        isAutonomous: true,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'child2-mgmt',
            name: 'ZUID-MGMT01',
            role: 'management',
            hostname: 'zuid-mgmt.gemeente.local',
            ipAddress: '10.102.1.10',
            specs: { cpuCores: 16, ramGb: 32, nicSpeedGbps: 1, os: 'Windows Server 2022' }
          },
          {
            id: 'child2-rec01',
            name: 'ZUID-REC01',
            role: 'recording',
            hostname: 'zuid-rec01.gemeente.local',
            ipAddress: '10.102.1.20',
            specs: { cpuCores: 24, ramGb: 64, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-child2-anpr',
            name: 'ANPR Kenteken & Haven Ingangen',
            count: 48,
            resolution: '4MP (2K)',
            codec: 'H.265',
            fps: 25,
            motionPercent: 40,
            recordingMode: 'continuous',
            bitrateKbps: 3200,
            retentionDays: 28
          }
        ],
        storage: {
          liveStorageDays: 5,
          liveStorageType: 'live-sas-hdd',
          liveStorageRaid: 'RAID 5',
          archiveEnabled: true,
          archiveStorageDays: 23,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'RAID 6'
        }
      }
    ]
  },
  {
    id: 'preset-interconnect-retail',
    title: 'Retail Keten & Tankstations (Milestone Interconnect)',
    description: 'Milestone Interconnect architectuur met centrale XProtect Corporate meldkamer die verbinding maakt met 25 autonome filialen (XProtect Express+ of Husky IVO) over 4G/ADSL.',
    architectureType: 'interconnect',
    primaryTier: 'Corporate',
    author: 'Milestone Solution Architect',
    updatedAt: '2026-08-22',
    globalSettings: {
      redundancyLevel: 'none',
      enableCarePlus: true,
      customerSector: 'Retail'
    },
    sites: [
      {
        id: 'site-interconnect-central',
        name: 'Centraal Beveiligingscentrum (Corporate Hub)',
        locationName: 'Distributiecentrum Utrecht',
        role: 'hq-parent',
        milestoneTier: 'Corporate',
        networkType: 'Fiber WAN (>100Mbps)',
        wanBandwidthMbps: 1000,
        wanLatencyMs: 2,
        isAutonomous: true,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'ic-hq-mgmt',
            name: 'DC-CORP-MGMT01',
            role: 'management',
            hostname: 'dc-mgmt.retail.local',
            ipAddress: '172.16.1.10',
            specs: { cpuCores: 24, ramGb: 48, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'ic-hq-rec',
            name: 'DC-CORP-REC01 (Centrale Retrieval Buffer)',
            role: 'recording',
            hostname: 'dc-rec01.retail.local',
            ipAddress: '172.16.1.20',
            specs: { cpuCores: 32, ramGb: 64, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-dc-internal',
            name: 'Distributiecentrum Lokaal',
            count: 30,
            resolution: '1080p (2MP)',
            codec: 'H.265',
            fps: 15,
            motionPercent: 40,
            recordingMode: 'motion-only',
            bitrateKbps: 2000,
            retentionDays: 30
          }
        ],
        storage: {
          liveStorageDays: 30,
          liveStorageType: 'live-sas-hdd',
          liveStorageRaid: 'RAID 6',
          archiveEnabled: false,
          archiveStorageDays: 0,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'JBOD'
        },
        notes: 'Op de centrale Corporate server worden Milestone Interconnect cameralicenties geactiveerd voor alle aangesloten winkels.'
      },
      {
        id: 'site-remote-filiaal-1',
        name: 'Winkel Filiaal 01 (Husky IVO Edge)',
        locationName: 'Winkelcentrum Rotterdam',
        role: 'remote-interconnected',
        milestoneTier: 'Express+',
        networkType: 'Broadband WAN (20-100Mbps)',
        wanBandwidthMbps: 50,
        wanLatencyMs: 25,
        isAutonomous: true,
        edgeRecordingEnabled: true,
        servers: [
          {
            id: 'husky-f01',
            name: 'HUSKY-F01 (All-In-One Appliance)',
            role: 'recording',
            hostname: 'husky01.store.local',
            ipAddress: '192.168.50.10',
            specs: { cpuCores: 8, ramGb: 16, nicSpeedGbps: 1, os: 'Windows 10 IoT Enterprise' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-f01-kassa',
            name: 'Winkelvloer & Kassa\'s',
            count: 12,
            resolution: '4MP (2K)',
            codec: 'H.265+ (Smart Codec)',
            fps: 15,
            motionPercent: 30,
            recordingMode: 'edge-with-retrieve',
            bitrateKbps: 1600,
            retentionDays: 30
          }
        ],
        storage: {
          liveStorageDays: 30,
          liveStorageType: 'live-sas-hdd',
          liveStorageRaid: 'RAID 5',
          archiveEnabled: false,
          archiveStorageDays: 0,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'JBOD'
        },
        notes: 'Neemt 100% lokaal op. Stuurt bij overval/inbraak alarm direct video fragment naar het centrale HQ.'
      },
      {
        id: 'site-remote-filiaal-2',
        name: 'Winkel Filiaal 02 (Husky IVO Edge)',
        locationName: 'Winkelcentrum Eindhoven',
        role: 'remote-interconnected',
        milestoneTier: 'Express+',
        networkType: 'Broadband WAN (20-100Mbps)',
        wanBandwidthMbps: 40,
        wanLatencyMs: 30,
        isAutonomous: true,
        edgeRecordingEnabled: true,
        servers: [
          {
            id: 'husky-f02',
            name: 'HUSKY-F02 (All-In-One Appliance)',
            role: 'recording',
            hostname: 'husky02.store.local',
            ipAddress: '192.168.51.10',
            specs: { cpuCores: 8, ramGb: 16, nicSpeedGbps: 1, os: 'Windows 10 IoT Enterprise' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-f02-kassa',
            name: 'Winkelvloer & Magazijn',
            count: 12,
            resolution: '4MP (2K)',
            codec: 'H.265+ (Smart Codec)',
            fps: 15,
            motionPercent: 30,
            recordingMode: 'edge-with-retrieve',
            bitrateKbps: 1600,
            retentionDays: 30
          }
        ],
        storage: {
          liveStorageDays: 30,
          liveStorageType: 'live-sas-hdd',
          liveStorageRaid: 'RAID 5',
          archiveEnabled: false,
          archiveStorageDays: 0,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'JBOD'
        }
      }
    ]
  },
  {
    id: 'preset-multi-site-campus',
    title: 'Universiteitscampus (Multi-Site / Distributed Recording)',
    description: 'Eén centrale Management Server op het hoofd datacentrum met 4 gedistribueerde Recording Servers geplaatst in afzonderlijke faculteitsgebouwen over dark fiber LAN/WAN.',
    architectureType: 'multi-site',
    primaryTier: 'Expert',
    author: 'Milestone Solution Architect',
    updatedAt: '2026-08-22',
    globalSettings: {
      redundancyLevel: 'failover-recording',
      enableCarePlus: true,
      customerSector: 'Campus / Onderwijs'
    },
    sites: [
      {
        id: 'site-campus-dc',
        name: 'Centraal Data Center (Management Hub)',
        locationName: 'IT Data Center Hoofdgebouw',
        role: 'hq-parent',
        milestoneTier: 'Expert',
        networkType: 'LAN (10GbE/1GbE)',
        wanBandwidthMbps: 10000,
        wanLatencyMs: 1,
        isAutonomous: true,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'campus-mgmt',
            name: 'CAMPUS-MGMT01 & SQL Standard',
            role: 'management',
            hostname: 'mgmt.uni.local',
            ipAddress: '10.0.1.10',
            specs: { cpuCores: 24, ramGb: 48, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          },
          {
            id: 'campus-mobile',
            name: 'CAMPUS-MOB01 (Beveiligers App)',
            role: 'mobile',
            hostname: 'mob.uni.local',
            ipAddress: '10.0.1.15',
            specs: { cpuCores: 16, ramGb: 32, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [],
        storage: {
          liveStorageDays: 0,
          liveStorageType: 'live-nvme-ssd',
          liveStorageRaid: 'RAID 10',
          archiveEnabled: false,
          archiveStorageDays: 0,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'RAID 6'
        }
      },
      {
        id: 'site-gebouw-a',
        name: 'Gebouw A - Faculteit Bèta',
        locationName: 'Campus West Gebouw A',
        role: 'distributed-branch',
        milestoneTier: 'Expert',
        networkType: 'Fiber WAN (>100Mbps)',
        wanBandwidthMbps: 1000,
        wanLatencyMs: 1,
        isAutonomous: false,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'rec-gebouw-a',
            name: 'REC-BETA-01 (Gedistribueerde Opnameserver)',
            role: 'recording',
            hostname: 'rec-a.uni.local',
            ipAddress: '10.0.10.20',
            specs: { cpuCores: 16, ramGb: 48, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-gebouw-a',
            name: 'Collegezalen & Gangen Bèta',
            count: 40,
            resolution: '1080p (2MP)',
            codec: 'H.265',
            fps: 20,
            motionPercent: 40,
            recordingMode: 'continuous',
            bitrateKbps: 2200,
            retentionDays: 30
          }
        ],
        storage: {
          liveStorageDays: 7,
          liveStorageType: 'live-sas-hdd',
          liveStorageRaid: 'RAID 10',
          archiveEnabled: true,
          archiveStorageDays: 23,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'RAID 6'
        }
      },
      {
        id: 'site-gebouw-b',
        name: 'Gebouw B - Faculteit Geneeskunde',
        locationName: 'Campus Oost Gebouw B',
        role: 'distributed-branch',
        milestoneTier: 'Expert',
        networkType: 'Fiber WAN (>100Mbps)',
        wanBandwidthMbps: 1000,
        wanLatencyMs: 1,
        isAutonomous: false,
        edgeRecordingEnabled: false,
        servers: [
          {
            id: 'rec-gebouw-b',
            name: 'REC-MED-01 (Gedistribueerde Opnameserver)',
            role: 'recording',
            hostname: 'rec-b.uni.local',
            ipAddress: '10.0.20.20',
            specs: { cpuCores: 16, ramGb: 48, nicSpeedGbps: 10, os: 'Windows Server 2022' }
          }
        ],
        cameraGroups: [
          {
            id: 'cam-gebouw-b',
            name: 'Laboratoria & Ingangen Medisch',
            count: 36,
            resolution: '4MP (2K)',
            codec: 'H.265',
            fps: 20,
            motionPercent: 45,
            recordingMode: 'continuous',
            bitrateKbps: 3000,
            retentionDays: 30
          }
        ],
        storage: {
          liveStorageDays: 7,
          liveStorageType: 'live-sas-hdd',
          liveStorageRaid: 'RAID 10',
          archiveEnabled: true,
          archiveStorageDays: 23,
          archiveStorageType: 'archive-nas-san',
          archiveStorageRaid: 'RAID 6'
        }
      }
    ]
  }
];

export const WIZARD_QUESTIONS = [
  {
    id: 'siteCount',
    question: 'Hoeveel fysieke locaties of panden omvat uw installatie?',
    options: [
      { value: '1', label: '1 enkele locatie (Enkel gebouw of campus op 1 LAN netwerk)' },
      { value: '2-5', label: '2 tot 5 locaties (Hoofdkantoor met enkele bijkantoren of gebouwen)' },
      { value: '6-25', label: '6 tot 25 locaties (Regionale vestigingen, meerdere scholen of winkels)' },
      { value: '25+', label: 'Meer dan 25 locaties (Grootschalige retailketen, openbaar vervoer, smart city)' }
    ]
  },
  {
    id: 'networkCondition',
    question: 'Wat is de netwerkverbinding tussen de verschillende locaties?',
    options: [
      { value: 'lan-fiber', label: 'Lokaal LAN of Donkere Glasvezel (Extreem snel >1 Gbps, <2ms latency)' },
      { value: 'stable-wan', label: 'Permanente stabiele zakelijke WAN/VPN (>50 Mbps, lage latency)' },
      { value: 'low-wan', label: 'Beperkte breedband of wisselende WAN (<20 Mbps, periodieke congestie)' },
      { value: 'cellular-mobile', label: '4G/5G Mobiel, voertuigen of tijdelijke/onderbroken verbindingen' }
    ]
  },
  {
    id: 'autonomy',
    question: 'Hoe moeten de afzonderlijke locaties beheerd worden?',
    options: [
      { value: 'single-central', label: '1 Centraal IT beheerteam: Alles vanuit één centrale beheerconsole' },
      { value: 'local-autonomous', label: 'Zelfstandige lokale beheerders per locatie met eigen beheer, maar gezamenlijke centrale meldkamer' },
      { value: 'isolated-independent', label: 'Volledig onafhankelijke lokale systemen (bijv. franchisenemers of externe partners) die beelden delen' }
    ]
  },
  {
    id: 'streamingStrategy',
    question: 'Hoe wenst u de camerabeelden te bekijken en op te slaan?',
    options: [
      { value: 'all-central-live', label: 'Continu live streamen naar centrale meldkamer (hoge bandbreedte vereist)' },
      { value: 'local-record-demand-pull', label: '100% lokaal opnemen; alleen live streamen op aanvraag of video ophalen bij alarm (Edge Retrieval)' },
      { value: 'local-and-central-archive', label: 'Lokaal opnemen met geplande nachtelijke upload naar centraal archief' }
    ]
  },
  {
    id: 'licensingPreference',
    question: 'Welke Milestone XProtect licentieformule heeft uw voorkeur of budget?',
    options: [
      { value: 'any-optimal', label: 'Technisch optimale keuze (Adviseer mij)' },
      { value: 'low-cost-tier', label: 'Kostenbewust op remote sites (Express+ of Professional+)' },
      { value: 'enterprise-corporate', label: 'Enterprise niveau met maximale redundantie (Corporate & Expert)' }
    ]
  }
];

export function calculateWizardRecommendation(answers: Record<string, string>): ArchitectureRecommendation[] {
  let scoreSingleSite = 0;
  let scoreMultiSite = 0;
  let scoreFederated = 0;
  let scoreInterconnect = 0;

  // Site count evaluation
  if (answers.siteCount === '1') {
    scoreSingleSite += 60;
    scoreMultiSite += 10;
    scoreFederated += 5;
    scoreInterconnect += 5;
  } else if (answers.siteCount === '2-5') {
    scoreSingleSite += 10;
    scoreMultiSite += 35;
    scoreFederated += 35;
    scoreInterconnect += 20;
  } else if (answers.siteCount === '6-25') {
    scoreSingleSite += 0;
    scoreMultiSite += 20;
    scoreFederated += 40;
    scoreInterconnect += 40;
  } else if (answers.siteCount === '25+') {
    scoreSingleSite += 0;
    scoreMultiSite += 10;
    scoreFederated += 35;
    scoreInterconnect += 55;
  }

  // Network condition evaluation
  if (answers.networkCondition === 'lan-fiber') {
    scoreSingleSite += 30;
    scoreMultiSite += 35;
    scoreFederated += 25;
    scoreInterconnect += 10;
  } else if (answers.networkCondition === 'stable-wan') {
    scoreMultiSite += 30;
    scoreFederated += 30;
    scoreInterconnect += 25;
  } else if (answers.networkCondition === 'low-wan') {
    scoreMultiSite -= 20;
    scoreFederated += 10;
    scoreInterconnect += 45;
  } else if (answers.networkCondition === 'cellular-mobile') {
    scoreMultiSite -= 40;
    scoreFederated -= 20;
    scoreInterconnect += 60;
  }

  // Autonomy evaluation
  if (answers.autonomy === 'single-central') {
    scoreSingleSite += 20;
    scoreMultiSite += 35;
    scoreFederated += 10;
    scoreInterconnect += 15;
  } else if (answers.autonomy === 'local-autonomous') {
    scoreFederated += 40;
    scoreInterconnect += 30;
  } else if (answers.autonomy === 'isolated-independent') {
    scoreInterconnect += 50;
    scoreFederated += 20;
  }

  // Streaming strategy evaluation
  if (answers.streamingStrategy === 'all-central-live') {
    scoreSingleSite += 25;
    scoreMultiSite += 30;
    scoreFederated += 20;
  } else if (answers.streamingStrategy === 'local-record-demand-pull') {
    scoreInterconnect += 45;
    scoreFederated += 15;
  } else if (answers.streamingStrategy === 'local-and-central-archive') {
    scoreInterconnect += 40;
    scoreFederated += 25;
    scoreMultiSite += 15;
  }

  // Normalize scores to 0-100%
  const maxScore = Math.max(scoreSingleSite, scoreMultiSite, scoreFederated, scoreInterconnect, 1);
  const normSingle = Math.min(100, Math.max(10, Math.round((scoreSingleSite / maxScore) * 98)));
  const normMulti = Math.min(100, Math.max(10, Math.round((scoreMultiSite / maxScore) * 98)));
  const normFed = Math.min(100, Math.max(10, Math.round((scoreFederated / maxScore) * 98)));
  const normIC = Math.min(100, Math.max(10, Math.round((scoreInterconnect / maxScore) * 98)));

  const recs: ArchitectureRecommendation[] = [
    {
      type: 'interconnect',
      title: 'Milestone Interconnect',
      dutchTitle: 'Milestone Interconnect Architectuur',
      matchScore: normIC,
      recommendedTiers: ['Corporate', 'Express+', 'Professional+'],
      summary: 'Centrale XProtect Corporate VMS hub die autonoom opnemende remote sites, winkels of voertuigen verbindt via intelligente edge retrieval.',
      keyBenefits: [
        'Ideaal voor lage bandbreedte, 4G/5G mobiel en periodieke netwerkverbindingen',
        'Geen videoverlies bij WAN uitval: Remote sites blijven 100% autonoom opnemen',
        'Zeer kostenefficiënt: Remote sites kunnen goedkopere XProtect edities (Express+, Pro+) of Husky appliances gebruiken',
        'Geavanceerde edge retrieval: Beelden worden alleen naar HQ gehaald bij alarm of gepland in de daluren'
      ],
      drawbacks: [
        'Vereist XProtect Corporate op de centrale hub',
        'Vereist 1x Milestone Interconnect apparaatlicentie per verbonden camera op de centrale hub'
      ],
      bandwidthRequirements: 'Lage WAN belasting; On-demand streaming & batch video transfers',
      licensingModel: 'Centraal Corporate basislicentie + Interconnect Device Licenses. Remote voordelige basis- en apparaatlicenties.',
      bestFitScenario: 'Retailketens, tankstations, logistiek met mobiele vloten (bussen/treinen), politie met tijdelijke mobiele camera\'s.'
    },
    {
      type: 'federated',
      title: 'Milestone Federated Architecture (MFA)',
      dutchTitle: 'Milestone Federated Architecture (MFA)',
      matchScore: normFed,
      recommendedTiers: ['Corporate', 'Expert'],
      summary: 'Hiërarchische koppeling van onafhankelijke Corporate en Expert systemen waarbij operators centraal kunnen inloggen en alle sites naadloos kunnen bedienen.',
      keyBenefits: [
        'Geen extra licentiekosten: MFA is gratis inbegrepen in XProtect Corporate & Expert',
        'Volledige lokale autonomie: Elke site behoudt eigen Management Server en lokale administratie',
        'Naadloze Smart Client ervaring: Eén login geeft toegang tot de volledige hiërarchische siteboom',
        'Centraal alarmbeheer en cross-site video wall weergave'
      ],
      drawbacks: [
        'Vereist XProtect Corporate of Expert op ALLE deelnemende sites (geen Express+ of Pro+)',
        'Vereist continue en betrouwbare IP netwerkverbinding tussen de Management Servers',
        'Vereist Active Directory Domain Trust of federated user mapping'
      ],
      bandwidthRequirements: 'Matig tot hoog; Vaste WAN IP verbinding tussen Management Servers vereist',
      licensingModel: 'Corporate of Expert basislicentie + standaard apparaatlicenties per site. Geen extra MFA toeslag.',
      bestFitScenario: 'Grote ziekenhuiscampussen, gemeenten/veiligheidsregio\'s, multinationale ondernemingen met eigen IT teams per vestiging.'
    },
    {
      type: 'multi-site',
      title: 'Multi-Site (Gedistribueerde Opnameservers)',
      dutchTitle: 'Multi-Site Gedistribueerde Architectuur',
      matchScore: normMulti,
      recommendedTiers: ['Expert', 'Corporate'],
      summary: 'Één centrale Management Server en SQL database die meerdere Recording Servers op afstand aanstuurt over een betrouwbare WAN.',
      keyBenefits: [
        'Eén centrale beheeromgeving: 1x Management Client voor alle camera\'s en servers',
        'Eén centraal gebruikersbeheer en één centrale SQL database',
        'Geen extra licenties vereist behalve standaard camera apparaatlicenties',
        'Lokale recording servers verminderen WAN videoverkeer voor lokaal bekijken'
      ],
      drawbacks: [
        'Afhankelijk van WAN verbinding voor serverconfiguratie en client login',
        'Bij langdurige WAN uitval kunnen remote servers wel opnemen, maar beheer ligt plat',
        'Vereist snelle en betrouwbare WAN met lage latency'
      ],
      bandwidthRequirements: 'Stabiele WAN/VPN verbinding met lage latency tussen centrale en remote vestigingen',
      licensingModel: '1 centrale Basislicentie (Expert of Corporate) + standaard Device licenties per camera.',
      bestFitScenario: 'Universiteitscampus met meerdere gebouwen, scholengemeenschappen, bedrijven met betrouwbare dark fiber verbindingen.'
    },
    {
      type: 'single-site',
      title: 'Single Site',
      dutchTitle: 'Single Site Architectuur',
      matchScore: normSingle,
      recommendedTiers: ['Express+', 'Professional+', 'Expert', 'Corporate'],
      summary: 'Klassieke standalone installatie voor één gebouw of campus met alle VMS componenten op hetzelfde lokale netwerk.',
      keyBenefits: [
        'Eenvoudigste installatie, configuratie en onderhoud',
        'Maximale betrouwbaarheid op lokaal netwerk (geen afhankelijkheid van externe WAN links)',
        'Ondersteunt Milestone edities: Express+, Professional+, Expert en Corporate',
        'Lage netwerklatency en supersnelle live streaming'
      ],
      drawbacks: [
        'Niet geschikt voor geografisch verspreide autonome vestigingen zonder directe LAN'
      ],
      bandwidthRequirements: 'Lokaal gigabit LAN netwerk (1GbE / 10GbE)',
      licensingModel: '1x Basislicentie naar keuze + standaard Device licenties per camera.',
      bestFitScenario: 'Enkel kantoorgebouw, fabriek, distributiecentrum of winkelpand.'
    }
  ];

  return recs.sort((a, b) => b.matchScore - a.matchScore);
}

export type FeatureValueType = 'yes' | 'no' | 'optional' | 'text';

export interface MilestoneTierFeatureItem {
  name: string;
  category: 
    | 'Systeemcapaciteit & Schaalbaarheid'
    | 'Hoge Beschikbaarheid & Redundantie'
    | 'Multi-Site & Architectuurintegratie'
    | 'Monitoring & Videofuncties'
    | 'Beveiliging, Compliance & Privacy'
    | 'Licenties & Toepassing';
  description: string;
  express: { value: string; status: FeatureValueType };
  professional: { value: string; status: FeatureValueType };
  expert: { value: string; status: FeatureValueType };
  corporate: { value: string; status: FeatureValueType };
}

export interface MilestoneTierOverview {
  tier: 'Express+' | 'Professional+' | 'Expert' | 'Corporate';
  title: string;
  tagline: string;
  badge: string;
  badgeColor: string;
  headerBg: string;
  accentColor: string;
  targetAudience: string;
  maxDevices: string;
  recorders: string;
  failover: string;
  mfaRole: string;
  smartWall: string;
  keyStrengths: string[];
}

export const MILESTONE_TIERS_OVERVIEW: MilestoneTierOverview[] = [
  {
    tier: 'Express+',
    title: 'XProtect Express+',
    tagline: 'Kleine tot middelgrote standalone vestigingen en winkels',
    badge: 'Max. 100 Devices',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    headerBg: 'bg-emerald-500/10 text-emerald-800 border-emerald-200',
    accentColor: 'emerald',
    targetAudience: 'Winkels, apotheken, tankstations, kleine kantoren tot 100 camera\'s.',
    maxDevices: '100 camera\'s / devices',
    recorders: '1 Recording Server',
    failover: 'Niet ondersteund',
    mfaRole: 'Alleen via Interconnect',
    smartWall: 'Nee',
    keyStrengths: [
      'Voordeligste instap voor IP videobewaking',
      'Max. 100 camera\'s op 1 centrale Recording Server',
      'Ondersteunt Smart Client, Web Client & Mobile App',
      'Ondersteuning voor Milestone Interconnect'
    ]
  },
  {
    tier: 'Professional+',
    title: 'XProtect Professional+',
    tagline: 'MKB, campussen en groeiende multi-server locaties',
    badge: 'Onbeperkt / Multi-Server',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    headerBg: 'bg-blue-500/10 text-blue-800 border-blue-200',
    accentColor: 'blue',
    targetAudience: 'Middelgrote bedrijven, scholen, logistieke centra, meerdere gebouwen.',
    maxDevices: 'Onbeperkt',
    recorders: 'Onbeperkt aantal servers',
    failover: 'Niet ondersteund',
    mfaRole: 'Alleen via Interconnect',
    smartWall: 'Nee',
    keyStrengths: [
      'Onbeperkt aantal camera\'s en servers',
      'Centraal beheer via Management Client',
      'Multi-layer kaarten en geavanceerd alarmbeheer',
      'Automatische archivering naar NAS/SAN'
    ]
  },
  {
    tier: 'Expert',
    title: 'XProtect Expert',
    tagline: 'Bedrijfskritische installaties met hoge beschikbaarheid',
    badge: 'High-Availability / Failover',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    headerBg: 'bg-indigo-500/10 text-indigo-800 border-indigo-200',
    accentColor: 'indigo',
    targetAudience: 'Ziekenhuizen, universiteiten, kritieke infrastructuur, MFA child sites.',
    maxDevices: 'Onbeperkt',
    recorders: 'Onbeperkt + Failover clusters',
    failover: 'Hot & Cold Standby',
    mfaRole: 'MFA Child Site',
    smartWall: 'Optionele Add-on licentie',
    keyStrengths: [
      'Failover Recording Servers (minimale downtime)',
      'Edge Storage automatische synchronisatie',
      'Ondersteunt Milestone Federated Architecture (Child)',
      'Smart Map met GIS & GPS ondersteuning'
    ]
  },
  {
    tier: 'Corporate',
    title: 'XProtect Corporate',
    tagline: 'Top-tier Enterprise VMS voor meldkamers en multinationale netwerken',
    badge: 'Enterprise / Smart Wall / MFA Parent',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    headerBg: 'bg-purple-500/10 text-purple-800 border-purple-200',
    accentColor: 'purple',
    targetAudience: 'Veiligheidsregio\'s, luchthavens, smart cities, centrale meldkamers.',
    maxDevices: 'Onbeperkt',
    recorders: 'Onbeperkt + High-Availability',
    failover: 'Hot & Cold Standby + Dual Recording',
    mfaRole: 'MFA Parent & Child Hub',
    smartWall: 'Standaard inbegrepen',
    keyStrengths: [
      'Milestone Smart Wall standaard inbegrepen',
      'Centrale Federated Architecture Parent & Interconnect Hub',
      'Dual-recording en FIPS 140-2 encryptie',
      'Geavanceerde privacy masking & Evidence Lock'
    ]
  }
];

export const MILESTONE_PRODUCT_TIERS_COMPARISON: MilestoneTierFeatureItem[] = [
  // Categorie 1: Systeemcapaciteit & Schaalbaarheid
  {
    name: 'Maximaal aantal camera\'s / devices',
    category: 'Systeemcapaciteit & Schaalbaarheid',
    description: 'Het maximale aantal apparaten (camera\'s, encoders, I/O modules, audio kanalen) dat op het VMS aangesloten kan worden.',
    express: { value: 'Max. 100 devices', status: 'text' },
    professional: { value: 'Onbeperkt', status: 'yes' },
    expert: { value: 'Onbeperkt', status: 'yes' },
    corporate: { value: 'Onbeperkt', status: 'yes' }
  },
  {
    name: 'Aantal Recording Servers per systeem',
    category: 'Systeemcapaciteit & Schaalbaarheid',
    description: 'Aantal afzonderlijke opnameservers die gekoppeld kunnen worden aan één centrale Management Server.',
    express: { value: 'Max. 1 server', status: 'text' },
    professional: { value: 'Onbeperkt', status: 'yes' },
    expert: { value: 'Onbeperkt', status: 'yes' },
    corporate: { value: 'Onbeperkt', status: 'yes' }
  },
  {
    name: 'Multi-server architectuur (Gedistribueerd LAN/WAN)',
    category: 'Systeemcapaciteit & Schaalbaarheid',
    description: 'Mogelijkheid om opnameservers te verdelen over meerdere fysieke servers en netwerksegmenten.',
    express: { value: 'Nee (Enkele server)', status: 'no' },
    professional: { value: 'Ja (Onbeperkt)', status: 'yes' },
    expert: { value: 'Ja (Onbeperkt)', status: 'yes' },
    corporate: { value: 'Ja (Onbeperkt)', status: 'yes' }
  },
  {
    name: 'Aantal gelijktijdige Smart Clients, Web & Mobile',
    category: 'Systeemcapaciteit & Schaalbaarheid',
    description: 'Aantal gelijktijdige werkplekken, beveiligers en mobiele gebruikers die beelden kunnen bekijken en bedienen.',
    express: { value: 'Onbeperkt', status: 'yes' },
    professional: { value: 'Onbeperkt', status: 'yes' },
    expert: { value: 'Onbeperkt', status: 'yes' },
    corporate: { value: 'Onbeperkt', status: 'yes' }
  },
  {
    name: 'Centraal Systeembeheer (Management Client)',
    category: 'Systeemcapaciteit & Schaalbaarheid',
    description: 'Eén centrale console voor configuratie van camera\'s, opslag, regels, tijdschema\'s en gebruikersrechten.',
    express: { value: 'Inbegrepen', status: 'yes' },
    professional: { value: 'Inbegrepen', status: 'yes' },
    expert: { value: 'Inbegrepen', status: 'yes' },
    corporate: { value: 'Inbegrepen', status: 'yes' }
  },

  // Categorie 2: Hoge Beschikbaarheid & Redundantie
  {
    name: 'Failover Recording Server (Cold Standby)',
    category: 'Hoge Beschikbaarheid & Redundantie',
    description: 'Reserve opnameserver die automatisch opnames overneemt bij hardware-uitval of gepland serveronderhoud.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Ja (Cold standby)', status: 'yes' },
    corporate: { value: 'Ja (Cold standby)', status: 'yes' }
  },
  {
    name: 'Failover Recording Server (Hot Standby)',
    category: 'Hoge Beschikbaarheid & Redundantie',
    description: 'Real-time draaiende failover server die binnen enkele seconden naadloos opnames overneemt zonder videoverlies.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Ja (Hot standby)', status: 'yes' },
    corporate: { value: 'Ja (Hot standby)', status: 'yes' }
  },
  {
    name: 'Edge Storage Playback & Naadloos Ophalen',
    category: 'Hoge Beschikbaarheid & Redundantie',
    description: 'Automatische synchronisatie van op SD-kaart opgeslagen camerabeelden naar de server na een netwerkonderbreking.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Ja (Inclusief)', status: 'yes' },
    corporate: { value: 'Ja (Inclusief)', status: 'yes' }
  },
  {
    name: 'Dual Recording (Synchrone dubbele opname)',
    category: 'Hoge Beschikbaarheid & Redundantie',
    description: 'Gelijktijdige opname van dezelfde camerastream naar twee fysiek gescheiden Recording Servers voor extreme redundantie.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Nee', status: 'no' },
    corporate: { value: 'Ja (Inclusief)', status: 'yes' }
  },
  {
    name: 'Microsoft Clustering Support (Management Server HA)',
    category: 'Hoge Beschikbaarheid & Redundantie',
    description: 'Volledige ondersteuning voor Windows Server Failover Clustering op de centrale Management Server en SQL database.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Ja (MS Cluster)', status: 'yes' },
    corporate: { value: 'Ja (MS Cluster)', status: 'yes' }
  },
  {
    name: 'Hardwareversnelde videodecodering & opname',
    category: 'Hoge Beschikbaarheid & Redundantie',
    description: 'Gebruik van Intel Quick Sync en NVIDIA GPU\'s om server CPU-belasting en energieverbruik drastisch te verlagen.',
    express: { value: 'Ja (Intel/NVIDIA)', status: 'yes' },
    professional: { value: 'Ja (Intel/NVIDIA)', status: 'yes' },
    expert: { value: 'Ja (Intel/NVIDIA)', status: 'yes' },
    corporate: { value: 'Ja (Intel/NVIDIA)', status: 'yes' }
  },

  // Categorie 3: Multi-Site & Architectuurintegratie
  {
    name: 'Milestone Federated Architecture (MFA) - Centrale Parent',
    category: 'Multi-Site & Architectuurintegratie',
    description: 'Fungeert als overkoepelende centrale hub waarmee operators inloggen en alle onderliggende federated child sites bedienen.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Nee (Alleen Child)', status: 'no' },
    corporate: { value: 'Ja (Centrale Parent)', status: 'yes' }
  },
  {
    name: 'Milestone Federated Architecture (MFA) - Child Site',
    category: 'Multi-Site & Architectuurintegratie',
    description: 'Kan worden aangesloten als dochter-site binnen een overkoepelend XProtect Corporate MFA federatienetwerk.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Ja (Child Site)', status: 'yes' },
    corporate: { value: 'Ja (Child & Parent)', status: 'yes' }
  },
  {
    name: 'Milestone Interconnect - Centrale Hub',
    category: 'Multi-Site & Architectuurintegratie',
    description: 'Kan functioneren als centrale meldkamer die externe zelfstandige Milestone systemen (ook Express+/Pro+) verbindt.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Nee', status: 'no' },
    corporate: { value: 'Ja (Centrale Hub)', status: 'yes' }
  },
  {
    name: 'Milestone Interconnect - Remote Verbonden Site',
    category: 'Multi-Site & Architectuurintegratie',
    description: 'Kan via een Interconnect licentie op afstand worden gekoppeld aan een centrale Corporate meldkamer.',
    express: { value: 'Ja (Ondersteund)', status: 'yes' },
    professional: { value: 'Ja (Ondersteund)', status: 'yes' },
    expert: { value: 'Ja (Ondersteund)', status: 'yes' },
    corporate: { value: 'Ja (Ondersteund)', status: 'yes' }
  },

  // Categorie 4: Monitoring & Videofuncties
  {
    name: 'Milestone Smart Wall (Meldkamer Videowall)',
    category: 'Monitoring & Videofuncties',
    description: 'Geavanceerd videowall-beheer voor meldkamers met dynamische layout-presets, automatische alarm-popups en regie.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Optioneel (Add-on licentie)', status: 'optional' },
    corporate: { value: 'Standaard inbegrepen', status: 'yes' }
  },
  {
    name: 'Smart Map (Geografische GIS, CAD & OpenStreetMap)',
    category: 'Monitoring & Videofuncties',
    description: 'Interactieve wereldkaart met vectorlagen, CAD plattegronden, cameradekking en live statusindicatoren.',
    express: { value: 'Standaard Maps', status: 'text' },
    professional: { value: 'Multi-layer Maps', status: 'text' },
    expert: { value: 'Smart Map (GIS/CAD)', status: 'yes' },
    corporate: { value: 'Smart Map (GIS/CAD)', status: 'yes' }
  },
  {
    name: 'Centrale Alarm Manager & Alarm Matrix',
    category: 'Monitoring & Videofuncties',
    description: 'Geïntegreerd overzicht van alle technische meldingen, VCA video-analyses, toegangscontrole en externe triggers.',
    express: { value: 'Basis Alarm Manager', status: 'text' },
    professional: { value: 'Uitgebreid', status: 'yes' },
    expert: { value: 'Volledig + Matrix', status: 'yes' },
    corporate: { value: 'Volledig + Matrix', status: 'yes' }
  },
  {
    name: 'Bookmarks (Handmatig & Automatisch regels)',
    category: 'Monitoring & Videofuncties',
    description: 'Markeren en labelen van specifieke videogebeurtenissen op de tijdbalk voor snelle terugzoekacties en dossieropbouw.',
    express: { value: 'Alleen handmatig', status: 'text' },
    professional: { value: 'Handmatig & Regels', status: 'yes' },
    expert: { value: 'Handmatig & Regels', status: 'yes' },
    corporate: { value: 'Handmatig & Regels + Tags', status: 'yes' }
  },
  {
    name: 'Hardwareversnelling op Smart Client decodering',
    category: 'Monitoring & Videofuncties',
    description: 'Vloeiende weergave van tientallen 4K/UHD camera\'s op meerdere schermen via GPU hardwaredecodering.',
    express: { value: 'Ja (Intel & NVIDIA)', status: 'yes' },
    professional: { value: 'Ja (Intel & NVIDIA)', status: 'yes' },
    expert: { value: 'Ja (Intel & NVIDIA)', status: 'yes' },
    corporate: { value: 'Ja (Intel & NVIDIA)', status: 'yes' }
  },

  // Categorie 5: Beveiliging, Compliance & Privacy
  {
    name: 'Incident Manager (Onderzoek & Zaakdossiers)',
    category: 'Beveiliging, Compliance & Privacy',
    description: 'Gestructureerd incidentbeheer in de Smart Client: bundel video, opmerkingen, rapporten en logboeken in één zaak.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Inbegrepen', status: 'yes' },
    corporate: { value: 'Inbegrepen', status: 'yes' }
  },
  {
    name: 'Evidence Lock (Verlengde Bewaarperiode)',
    category: 'Beveiliging, Compliance & Privacy',
    description: 'Veiligstellen van bewijsmateriaal tegen automatische overschrijving door de retentietermijn tijdelijk of permanent op te heffen.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Ja (Inclusief)', status: 'yes' },
    corporate: { value: 'Ja (Inclusief)', status: 'yes' }
  },
  {
    name: 'End-to-End Encryptie (HTTPS, SRTP, TLS)',
    category: 'Beveiliging, Compliance & Privacy',
    description: 'Volledig versleutelde communicatie tussen camera\'s, opnameservers, clients en mobiele applicaties via HTTPS/TLS.',
    express: { value: 'Ja (TLS 1.3)', status: 'yes' },
    professional: { value: 'Ja (TLS 1.3)', status: 'yes' },
    expert: { value: 'Ja (TLS 1.3)', status: 'yes' },
    corporate: { value: 'Ja (TLS 1.3 + FIPS)', status: 'yes' }
  },
  {
    name: 'Media Database Encryptie & Digitale Handtekening',
    category: 'Beveiliging, Compliance & Privacy',
    description: 'Versleuteling van video-opslag op disk met AES-256 en SHA-2 digitale handtekeningen om manipulatie van bewijs uit te sluiten.',
    express: { value: 'Digitale handtekening', status: 'text' },
    professional: { value: 'Digitale handtekening', status: 'text' },
    expert: { value: 'AES-256 & Signing', status: 'yes' },
    corporate: { value: 'AES-256 & Signing + FIPS', status: 'yes' }
  },
  {
    name: 'Dubbele Autorisatie (Vier-ogen principe & Privacy)',
    category: 'Beveiliging, Compliance & Privacy',
    description: 'Vereist dat een tweede geautoriseerde gebruiker of supervisor inlogt voordat beschermde privacy-camera\'s bekeken kunnen worden.',
    express: { value: 'Nee', status: 'no' },
    professional: { value: 'Nee', status: 'no' },
    expert: { value: 'Nee', status: 'no' },
    corporate: { value: 'Ja (Inclusief)', status: 'yes' }
  },

  // Categorie 6: Licenties & Toepassing
  {
    name: 'Licentiemodel',
    category: 'Licenties & Toepassing',
    description: 'De opbouw van de softwarelicentie voor het basisplatform en de aangesloten apparaten.',
    express: { value: 'Basislicentie + Apparaatlicentie (max. 100)', status: 'text' },
    professional: { value: 'Basislicentie + Apparaatlicenties (onbeperkt)', status: 'text' },
    expert: { value: 'Basislicentie + Apparaatlicenties (onbeperkt)', status: 'text' },
    corporate: { value: 'Basislicentie + Apparaatlicenties (onbeperkt)', status: 'text' }
  },
  {
    name: 'Software Upgrade Plan (Milestone Care Plus)',
    category: 'Licenties & Toepassing',
    description: 'Toegang tot 3x jaarlijkse software-updates, nieuwe functies, beveiligingspatches en mobiele push-notificaties.',
    express: { value: 'Optioneel beschikbaar', status: 'yes' },
    professional: { value: 'Optioneel beschikbaar', status: 'yes' },
    expert: { value: 'Optioneel beschikbaar', status: 'yes' },
    corporate: { value: 'Optioneel beschikbaar', status: 'yes' }
  },
  {
    name: 'Ideaal Toepassingsgebied',
    category: 'Licenties & Toepassing',
    description: 'Aanbevolen installatietype en omgeving voor deze XProtect software editie.',
    express: { value: 'Winkels, MKB, standalone locaties (tot 100 cam)', status: 'text' },
    professional: { value: 'Middelgrote bedrijven, campussen, multi-servers', status: 'text' },
    expert: { value: 'Bedrijfskritisch, ziekenhuizen, failover clusters', status: 'text' },
    corporate: { value: 'Grote enterprise, meldkamers, steden & federaties', status: 'text' }
  }
];

