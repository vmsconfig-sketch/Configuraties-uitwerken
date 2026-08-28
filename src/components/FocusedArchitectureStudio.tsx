import React, { useState, useEffect } from 'react';
import { 
  Network, 
  Server, 
  Video, 
  Monitor, 
  Smartphone, 
  Database, 
  Layers, 
  Wifi, 
  ShieldCheck, 
  Globe, 
  Radio, 
  Cable, 
  Check, 
  Info,
  Printer,
  Copy,
  CheckCircle2,
  Building,
  HardDrive,
  MapPin,
  Plus,
  Trash2,
  Sliders,
  Scan,
  Compass,
  Flame,
  Maximize2,
  Cpu,
  Eye,
  Laptop,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { MilestoneArchitectureStack } from './MilestoneArchitectureStack';

export type MainArchitectureType = 'federated' | 'interconnect' | 'multi-site' | 'single-site';

export type SingleSiteTier = 'Express+' | 'Professional+' | 'Expert' | 'Corporate';

export type NetworkConnectionType = 
  | 'lan' 
  | 'fiber-wan' 
  | 'vpn-ipsec' 
  | 'cellular-4g5g' 
  | 'internet-cloud';

export interface CameraTypeConfig {
  id: string;
  name: string;
  shortName: string;
  description: string;
  enabled: boolean;
  count: number;
  resolution: string;
  avgBitrateMbps: number;
  iconType: '4k' | 'ptz' | '1080p' | 'thermal' | 'anpr' | 'panoramic' | 'multisensor';
}

export interface SiteLocation {
  id: string;
  name: string;
  type: 'hq' | 'remote' | 'mobile';
  cameras: number;
  recorders: number;
  /** Extra Recording Server(s) at this location configured as hot/cold standby for the primary recorder(s). */
  failoverRecorders: number;
  managementServers: number;
  mobileServers: number;
  /** Smart Client operator workstations local to this site (meaningful for Federated/Interconnect, where every site is autonomous). */
  clients: number;
  networkLink?: string;
  tier?: string;
  notes?: string;
}

export type ServerTopology = 'combined' | 'distributed';

export interface ArchitectureState {
  architecture: MainArchitectureType;
  singleSiteTier: SingleSiteTier;
  network: NetworkConnectionType;
  customBandwidthMbps: number;
  recorders: number;
  /** Total extra Recording Server(s) across all sites configured as hot/cold standby failover. */
  failoverRecorders: number;
  managementServers: number;
  mobileServers: number;
  clients: number;
  cameras: number;
  sites: SiteLocation[];
  cameraTypes: CameraTypeConfig[];
  /** Single-Site only: whether Management/SQL/Recording (+Mobile) run combined on one server, or on separate dedicated servers. */
  singleSiteServerTopology: ServerTopology;
}

export interface MilestoneTierDetail {
  id: SingleSiteTier;
  title: string;
  badge: string;
  badgeColor: string;
  activeBorder: string;
  activeBg: string;
  maxCameras: string;
  recordersText: string;
  failoverSupport: boolean;
  smartWallSupport: boolean;
  description: string;
  highlights: string[];
}

export const SINGLE_SITE_TIERS: MilestoneTierDetail[] = [
  {
    id: 'Express+',
    title: 'XProtect Express+',
    badge: 'Max. 100 Devices',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    activeBorder: 'border-blue-600 ring-2 ring-blue-600/20',
    activeBg: 'bg-gradient-to-br from-blue-50 to-indigo-100/80',
    maxCameras: 'Max. 100 devices / camera\'s',
    recordersText: '1 Recording Server',
    failoverSupport: false,
    smartWallSupport: false,
    description: 'Instap editie voor kleinere tot middelgrote installaties en winkels. Ondersteunt tot maximaal 100 devices/camera’s op één centrale opnameserver.',
    highlights: ['Max. 100 apparaten / camera\'s', '1 centrale Recording Server', 'Smart Client, Mobile & Web App']
  },
  {
    id: 'Professional+',
    title: 'XProtect Professional+',
    badge: 'MKB / Multi-Server',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    activeBorder: 'border-blue-600 ring-2 ring-blue-600/20',
    activeBg: 'bg-gradient-to-br from-blue-50 to-indigo-100/80',
    maxCameras: 'Onbeperkt aantal camera\'s',
    recordersText: 'Meerdere servers (onbeperkt)',
    failoverSupport: false,
    smartWallSupport: false,
    description: 'Voor groeiende bedrijven. Onbeperkt aantal camera’s en meerdere Recording Servers binnen het LAN zonder restricties.',
    highlights: ['Onbeperkt aantal camera\'s', 'Meerdere Recording Servers', 'Automatische NAS/SAN archivering']
  },
  {
    id: 'Expert',
    title: 'XProtect Expert',
    badge: 'High-Availability / Failover',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    activeBorder: 'border-blue-600 ring-2 ring-blue-600/20',
    activeBg: 'bg-gradient-to-br from-blue-50 to-indigo-100/80',
    maxCameras: 'Onbeperkt aantal camera\'s',
    recordersText: 'Meerdere servers + Failover',
    failoverSupport: true,
    smartWallSupport: false,
    description: 'Bedrijfskritische installaties met hoge uptime-eisen. Biedt Failover Recording Servers (hot/cold standby) en Maps.',
    highlights: ['Failover Recording Servers (Hot/Cold)', 'Milestone Federated child site', 'Edge Storage playback & Rules']
  },
  {
    id: 'Corporate',
    title: 'XProtect Corporate',
    badge: 'Enterprise / Smart Wall',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    activeBorder: 'border-blue-600 ring-2 ring-blue-600/20',
    activeBg: 'bg-gradient-to-br from-blue-50 to-indigo-100/80',
    maxCameras: 'Onbeperkt aantal camera\'s',
    recordersText: 'High-Availability Cluster',
    failoverSupport: true,
    smartWallSupport: true,
    description: 'Het meest geavanceerde Enterprise VMS platform met Smart Wall videowalls, centrale MFA parent functionaliteit en dual recording.',
    highlights: ['Milestone Smart Wall ondersteuning', 'Centrale MFA Parent & Interconnect Hub', 'Dual-recording & hardwareversnelling']
  }
];

// All camera types start disabled with a count of 0 — the catalog is visible in Section 4,
// but nothing is pre-selected. Users opt in and set their own quantities.
export const DEFAULT_CAMERA_TYPES: CameraTypeConfig[] = [
  {
    id: 'cam-4k',
    name: '4K Ultra HD Vaste Camera\'s (8MP / 12MP)',
    shortName: '4K / Ultra HD',
    description: 'Hoge resolutie detailopname bij entrees, terreinen en perimeter.',
    enabled: false,
    count: 0,
    resolution: '3840x2160 (4K)',
    avgBitrateMbps: 8.0,
    iconType: '4k'
  },
  {
    id: 'cam-ptz',
    name: 'PTZ Bestuurbare Koepelcamera\'s (Pan/Tilt/Zoom)',
    shortName: 'PTZ Koepel',
    description: 'Actieve operatorsturing, 36x optische zoom en automatische tracking.',
    enabled: false,
    count: 0,
    resolution: '1920x1080 (30fps)',
    avgBitrateMbps: 6.0,
    iconType: 'ptz'
  },
  {
    id: 'cam-1080p',
    name: '1080p Full HD Dome / Bullet Camera\'s',
    shortName: 'Full HD 1080p',
    description: 'Standaard binnencamera\'s voor gangen, kantoren en magazijnen.',
    enabled: false,
    count: 0,
    resolution: '1920x1080 (HD)',
    avgBitrateMbps: 3.5,
    iconType: '1080p'
  },
  {
    id: 'cam-thermal',
    name: 'Thermische / Warmtebeeld Camera\'s',
    shortName: 'Thermisch',
    description: 'Detectie bij volledige duisternis, mist en rook over lange afstand.',
    enabled: false,
    count: 0,
    resolution: '640x512 Sensor',
    avgBitrateMbps: 2.0,
    iconType: 'thermal'
  },
  {
    id: 'cam-anpr',
    name: 'ANPR / LPR Kentekenherkenning Camera\'s',
    shortName: 'ANPR / Kenteken',
    description: 'Automatische kentekenregistratie bij slagbomen en parkeerterreinen.',
    enabled: false,
    count: 0,
    resolution: '1080p Global Shutter',
    avgBitrateMbps: 4.5,
    iconType: 'anpr'
  },
  {
    id: 'cam-panoramic',
    name: '360° Panoramic / Fisheye Camera\'s',
    shortName: '360° Fisheye',
    description: 'Volledig 360-graden ruimteoverzicht met software dewarping in Smart Client.',
    enabled: false,
    count: 0,
    resolution: '4000x3000 (12MP)',
    avgBitrateMbps: 6.5,
    iconType: 'panoramic'
  },
  {
    id: 'cam-multisensor',
    name: 'Multi-sensor / Multi-directionele Camera\'s',
    shortName: 'Multi-sensor',
    description: 'Vier verstelbare camerakoppen in 1 behuizing voor kruisingen en hallen.',
    enabled: false,
    count: 0,
    resolution: '4x 5MP Sensoren',
    avgBitrateMbps: 12.0,
    iconType: 'multisensor'
  }
];

// Every architecture starts with exactly one empty, unnamed location — 0 camera's, minimal structural
// servers only (a system inherently needs 1 Management Server and 1 Recording Server to function at all;
// nothing else is pre-filled). Users add locations and fill in real numbers themselves via "+ Locatie".
export const DEFAULT_SITES_BY_ARCH: Record<MainArchitectureType, SiteLocation[]> = {
  'single-site': [
    {
      id: 'site-single-main',
      name: '',
      type: 'hq',
      cameras: 0,
      recorders: 1,
      failoverRecorders: 0,
      managementServers: 1,
      mobileServers: 0,
      clients: 0,
      networkLink: 'Lokaal LAN',
      tier: 'XProtect Express+',
      notes: ''
    }
  ],
  'multi-site': [
    {
      id: 'site-ms-hq',
      name: '',
      type: 'hq',
      cameras: 0,
      recorders: 1,
      failoverRecorders: 0,
      managementServers: 1,
      mobileServers: 0,
      clients: 0,
      networkLink: '',
      notes: ''
    }
  ],
  'federated': [
    {
      id: 'site-mfa-parent',
      name: '',
      type: 'hq',
      cameras: 0,
      recorders: 1,
      failoverRecorders: 0,
      managementServers: 1,
      mobileServers: 0,
      clients: 0,
      networkLink: '',
      // Hoofdlocatie (Parent) heeft altijd een eigen Milestone editie nodig — Corporate is de meest gebruikelijke keuze, Expert kan ook.
      tier: 'XProtect Corporate',
      notes: ''
    }
  ],
  'interconnect': [
    {
      id: 'site-ic-central',
      name: '',
      type: 'hq',
      cameras: 0,
      recorders: 1,
      failoverRecorders: 0,
      managementServers: 1,
      mobileServers: 0,
      clients: 0,
      networkLink: '',
      // Centrale Hub heeft altijd een eigen Milestone editie nodig — Corporate is de meest gebruikelijke keuze, Expert kan ook.
      tier: 'XProtect Corporate',
      notes: ''
    }
  ]
};

const ARCHITECTURE_INFO: Record<MainArchitectureType, {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  recommendedTiers: string;
  pros: string[];
  cons: string[];
  icon: typeof Network;
  accentColor: string;
  bgBadge: string;
}> = {
  'single-site': {
    title: 'Single-Site',
    subtitle: 'Alles op 1 locatie (Lokaal LAN)',
    description: 'Een klassieke architectuur waarbij de Management Server, Recording Server(s), camera’s en clients zich allemaal op dezelfde fysieke locatie of binnen één campus LAN-netwerk bevinden.',
    tag: 'Eenvoudig & Krachtig',
    recommendedTiers: 'Express+ / Professional+ / Expert / Corporate',
    pros: [
      'Maximale netwerksnelheid en minimale netwerklatency (<1ms)',
      'Eenvoudig beheer en snelle installatie',
      'Directe live viewing zonder WAN-beperkingen'
    ],
    cons: [
      'Alle onderdelen delen dezelfde locatie: bij lokale netwerk- of stroomstoring ligt in het ergste geval het hele systeem plat',
      'Niet geschikt zodra er een tweede fysieke locatie met eigen WAN-koppeling ontsloten moet worden'
    ],
    icon: Server,
    accentColor: 'blue',
    bgBadge: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  'multi-site': {
    title: 'Multi-Site (Gedistribueerd)',
    subtitle: '1 centrale Management Server, lokale Recorders',
    description: 'Eén centrale Milestone Management Server beheert de centrale configuratie, terwijl Recording Servers lokaal op de vestigingen staan om camerabeelden direct op te slaan zonder het WAN netwerk te overbelasten.',
    tag: 'Eén Centrale Database',
    recommendedTiers: 'XProtect Expert / Corporate / Professional+',
    pros: [
      'Centraal beheer en één gezamenlijke SQL-configuratiedatabase onder één basislicentie',
      'Elke locatie neemt en kijkt lokaal terug via haar eigen Recording Server — geen WAN-afhankelijkheid voor live/playback',
      'Een lokale Recording Server kan per locatie redundant (failover) uitgevoerd worden',
      'Kostenefficiënt: slechts één centrale basislicentie nodig, Care+ dekt de hele site inclusief losse locaties'
    ],
    cons: [
      'Alleen mogelijk voor locaties van dezelfde organisatie/eindgebruiker (bijv. een campus) — niet voor volledig zelfstandige partijen',
      'Updates en Care+ verlenging gelden voor de hele omgeving tegelijk, dat kan niet per locatie apart',
      'Wilt u tussen aparte Multi-Site omgevingen of bedrijfsonderdelen heen kunnen kijken? Dan is een Corporate licentie met Milestone Interconnect nodig'
    ],
    icon: Building,
    accentColor: 'cyan',
    bgBadge: 'bg-cyan-50 text-cyan-700 border-cyan-200'
  },
  'interconnect': {
    title: 'Milestone Interconnect',
    subtitle: 'Centraal beheer van remote & mobiele sites',
    description: 'Verbindt remote Milestone systemen (zoals filialen, mobiele units of schepen) met een centrale XProtect Corporate server. Ondersteunt edge recording en opname retrieval op aanvraag over smalbandige verbindingen.',
    tag: 'Flexibel over WAN/4G',
    recommendedTiers: 'Corporate (Centraal) + Elk XProtect product (Remote)',
    pros: [
      'Remote sites kunnen elke Milestone editie zijn (Express+, Professional+, Expert of Corporate) — vrij te combineren per locatie',
      'Geen gedeeld domein of 2-way trust nodig tussen de centrale hub en de remote sites',
      'Beste keuze bij een slecht of onstabiel netwerk: werkt goed over lage bandbreedte, 4G/5G en tijdelijke verbindingen',
      'Centrale bewaking met geautomatiseerde video retrieval en edge storage op de remote locatie, inclusief lokale failover recording'
    ],
    cons: [
      'De koppeling gebeurt op Recording Server-niveau (niet op Management Server-niveau zoals bij Federated) — minder diepe integratie tussen sites',
      'Live beelden van remote sites zijn niet continu beschikbaar — vaak alleen op aanvraag (retrieval) i.p.v. permanente streaming',
      'De centrale hub moet XProtect Corporate zijn en er is altijd een aparte Interconnect device-licentie nodig per gekoppelde locatie'
    ],
    icon: Layers,
    accentColor: 'amber',
    bgBadge: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  'federated': {
    title: 'Federated Architecture (MFA)',
    subtitle: 'Hiërarchische koppeling van autonome sites',
    description: 'Milestone Federated Architecture verbindt meerdere zelfstandige Milestone XProtect systemen in een hiërarchie. Gebruikers loggen in op de centrale site en hebben naadloos toegang tot camera’s van aangesloten federated sites.',
    tag: 'Autonoom & Schaalbaar',
    recommendedTiers: 'XProtect Corporate / Expert',
    pros: [
      'Sites staan altijd in verbinding via de Management Servers — naadloos overzicht en inloggen op alle locaties vanuit één centrale site',
      'Onbeperkte schaalbaarheid met hoge betrouwbaarheid: elke locatie blijft 100% autonoom bij WAN-netwerkuitval',
      'Centraal beheer met lokale controle per locatie, inclusief lokale failover recording',
      'Geen extra licentiekosten voor de federatie-koppeling zelf — zit ingebakken in XProtect Expert/Corporate'
    ],
    cons: [
      'Elke locatie heeft een eigen volledige Management Server + SQL database nodig — hogere beheer- en hardwarelast per site',
      'Parent site moet XProtect Corporate zijn, child sites minimaal Expert — geen instap-editie mogelijk',
      'Vereist een Active Directory domein met 2-way trust tussen de domeinen van alle locaties, en een stabiel netwerk'
    ],
    icon: Network,
    accentColor: 'emerald',
    bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  }
};

const NETWORK_OPTIONS: {
  id: NetworkConnectionType;
  name: string;
  category: string;
  defaultSpeed: string;
  typicalLatency: string;
  description: string;
  icon: typeof Cable;
}[] = [
  {
    id: 'lan',
    name: 'Lokaal LAN (1 GbE / 10 GbE)',
    category: 'Local Area Network',
    defaultSpeed: '1.000 - 10.000 Mbps',
    typicalLatency: '< 1 ms',
    description: 'Hoogwaardig intern netwerk op kantoor of campus met maximale bandbreedte voor live video en opname.',
    icon: Cable
  },
  {
    id: 'fiber-wan',
    name: 'Dedicated WAN / Glasvezel',
    category: 'Point-to-Point / MPLS',
    defaultSpeed: '100 - 1.000 Mbps',
    typicalLatency: '2 - 10 ms',
    description: 'Permanente, symmetrische glasvezelverbinding tussen vaste bedrijfslocaties met hoge betrouwbaarheid.',
    icon: Globe
  },
  {
    id: 'vpn-ipsec',
    name: 'VPN / IPSec / SD-WAN',
    category: 'Encrypted Tunnel',
    defaultSpeed: '20 - 100 Mbps',
    typicalLatency: '15 - 35 ms',
    description: 'Beveiligde versleutelde verbinding over het openbare internet tussen filialen en het hoofdkantoor.',
    icon: ShieldCheck
  },
  {
    id: 'cellular-4g5g',
    name: 'Mobiel 4G / 5G / Draadloos',
    category: 'Cellular / Wireless',
    defaultSpeed: '5 - 30 Mbps',
    typicalLatency: '30 - 75 ms',
    description: 'Draadloze uplink voor mobiele surveillance, bouwplaatsen of remote locaties met variabele bandbreedte.',
    icon: Radio
  },
  {
    id: 'internet-cloud',
    name: 'Openbaar Internet / Cloud Link',
    category: 'Public HTTPS',
    defaultSpeed: '50 - 200 Mbps',
    typicalLatency: '20 - 50 ms',
    description: 'Directe internetcommunicatie via beveiligde poorten (HTTPS/TLS) naar de centrale Milestone gateway.',
    icon: Wifi
  }
];

export interface FocusedArchitectureStudioProps {
  externalSelectedTier?: SingleSiteTier | null;
  onNavigateToComparisonSheet?: () => void;
}

export const FocusedArchitectureStudio: React.FC<FocusedArchitectureStudioProps> = ({
  externalSelectedTier,
  onNavigateToComparisonSheet
}) => {
  // Zero-state by design: every user starts with a blank single-site project — nothing pre-filled.
  const [config, setConfig] = useState<ArchitectureState>(() => {
    const initialSites = DEFAULT_SITES_BY_ARCH['single-site'];
    const totalCams = initialSites.reduce((acc, s) => acc + s.cameras, 0);
    const totalRecorders = initialSites.reduce((acc, s) => acc + s.recorders, 0);
    const totalFailover = initialSites.reduce((acc, s) => acc + s.failoverRecorders, 0);
    const totalMgmt = initialSites.reduce((acc, s) => acc + s.managementServers, 0);
    const totalMobile = initialSites.reduce((acc, s) => acc + s.mobileServers, 0);
    const totalClients = initialSites.reduce((acc, s) => acc + s.clients, 0);

    return {
      architecture: 'single-site',
      singleSiteTier: 'Express+',
      network: 'lan',
      customBandwidthMbps: 0,
      recorders: totalRecorders,
      failoverRecorders: totalFailover,
      managementServers: totalMgmt,
      mobileServers: totalMobile,
      clients: totalClients,
      cameras: totalCams,
      sites: initialSites,
      cameraTypes: DEFAULT_CAMERA_TYPES,
      singleSiteServerTopology: 'distributed'
    };
  });

  // If a tier was selected from external comparison sheet, apply it
  useEffect(() => {
    if (externalSelectedTier) {
      handleSelectSingleSiteTier(externalSelectedTier);
      // Switch architecture to single-site if not already
      handleSelectArchitecture('single-site');
    }
  }, [externalSelectedTier]);

  const [copied, setCopied] = useState(false);
  const [diagramViewMode, setDiagramViewMode] = useState<'official' | 'layered'>('official');
  // Set of site IDs that have been manually overridden by the user in section 2
  const [manualSiteCameraOverrides, setManualSiteCameraOverrides] = useState<Set<string>>(new Set());

  const [collapsedSections, setCollapsedSections] = useState<Record<number, boolean>>({
    2: false,
    3: false,
    4: false
  });

  const toggleSection = (num: number) => {
    setCollapsedSections(prev => ({
      ...prev,
      [num]: !prev[num]
    }));
  };

  // Helper: Distribute a total number of cameras evenly across sites that are not manually overridden
  const distributeCamerasToSites = (
    sites: SiteLocation[],
    totalCameras: number,
    manualOverrides: Set<string>
  ): SiteLocation[] => {
    if (sites.length === 0) return sites;

    const unpinnedSites = sites.filter(s => !manualOverrides.has(s.id));
    const pinnedSites = sites.filter(s => manualOverrides.has(s.id));

    // If all sites are manually pinned, keep them as is
    if (unpinnedSites.length === 0) {
      return sites;
    }

    const pinnedCamsSum = pinnedSites.reduce((acc, s) => acc + s.cameras, 0);
    const remainingCams = Math.max(0, totalCameras - pinnedCamsSum);

    const basePerSite = Math.floor(remainingCams / unpinnedSites.length);
    const remainder = remainingCams % unpinnedSites.length;

    let unpinnedIdx = 0;
    return sites.map(s => {
      if (manualOverrides.has(s.id)) {
        return s;
      }
      const assigned = basePerSite + (unpinnedIdx < remainder ? 1 : 0);
      unpinnedIdx++;
      return {
        ...s,
        cameras: assigned
      };
    });
  };

  // Switch tier specifically for Single-Site architecture
  // Applies to every building/location on the site: Single-Site shares one Milestone edition system-wide.
  const handleSelectSingleSiteTier = (tier: SingleSiteTier) => {
    setConfig(prev => ({
      ...prev,
      singleSiteTier: tier,
      sites: prev.sites.map(s => ({ ...s, tier: `XProtect ${tier}` }))
    }));
  };

  // Switch how Single-Site server roles are physically laid out: one combined box vs dedicated servers per role
  const handleSelectServerTopology = (topology: ServerTopology) => {
    setConfig(prev => ({ ...prev, singleSiteServerTopology: topology }));
  };

  // Quick action: clamp cameras to 100 when Express+ is selected
  const handleClampExpressCameras = () => {
    setConfig(prev => {
      const targetCams = 100;
      const enabledTypes = prev.cameraTypes.filter(c => c.enabled);
      const currentActiveSum = enabledTypes.reduce((acc, c) => acc + c.count, 0) || 1;
      const nextCamTypes = prev.cameraTypes.map(ct => {
        if (!ct.enabled) return ct;
        const ratio = ct.count / currentActiveSum;
        return {
          ...ct,
          count: Math.max(1, Math.round(ratio * targetCams))
        };
      });
      const updatedTotalFromTypes = nextCamTypes.filter(t => t.enabled).reduce((acc, t) => acc + t.count, 0);

      const nextSites = prev.sites.map((s, idx) => idx === 0 ? { ...s, cameras: updatedTotalFromTypes } : s);
      return {
        ...prev,
        cameras: updatedTotalFromTypes,
        sites: nextSites,
        cameraTypes: nextCamTypes
      };
    });
  };

  // When architecture changes, populate default sites for that architecture
  const handleSelectArchitecture = (type: MainArchitectureType) => {
    const rawSites = DEFAULT_SITES_BY_ARCH[type];
    const newSites = rawSites.map(s => {
      if (type === 'single-site') {
        return {
          ...s,
          tier: `XProtect ${config.singleSiteTier || 'Professional+'}`
        };
      }
      return s;
    });

    const totalCams = newSites.reduce((acc, s) => acc + s.cameras, 0);
    const totalRecorders = newSites.reduce((acc, s) => acc + s.recorders, 0);
    const totalFailover = newSites.reduce((acc, s) => acc + s.failoverRecorders, 0);
    const totalMgmt = newSites.reduce((acc, s) => acc + s.managementServers, 0);
    const totalMobile = newSites.reduce((acc, s) => acc + s.mobileServers, 0);
    const totalClients = newSites.reduce((acc, s) => acc + s.clients, 0);

    // Reset manual overrides on architecture template change
    setManualSiteCameraOverrides(new Set());

    // Also adjust camera types proportional to total cams
    const updatedCamTypes = config.cameraTypes.map(ct => {
      if (!ct.enabled) return ct;
      // Keep ratio approximately
      return {
        ...ct,
        count: Math.max(1, Math.round((ct.count / Math.max(1, config.cameras)) * totalCams))
      };
    });

    setConfig(prev => ({
      ...prev,
      architecture: type,
      sites: newSites,
      cameras: totalCams,
      recorders: totalRecorders,
      failoverRecorders: totalFailover,
      managementServers: totalMgmt,
      mobileServers: totalMobile,
      clients: totalClients,
      cameraTypes: updatedCamTypes
    }));
  };

  // Sync total cameras whenever sites change manually in section 2
  const handleSiteCameraChange = (siteId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

    // Mark this site as manually customized
    setManualSiteCameraOverrides(prev => new Set(prev).add(siteId));

    setConfig(prev => {
      const nextSites = prev.sites.map(s => s.id === siteId ? { ...s, cameras: validCount } : s);
      const newTotalCams = nextSites.reduce((acc, s) => acc + s.cameras, 0);

      // Distribute enabled camera types in section 3 according to their existing ratios
      const enabledTypes = prev.cameraTypes.filter(c => c.enabled);
      const currentActiveSum = enabledTypes.reduce((acc, c) => acc + c.count, 0) || 1;

      const nextCamTypes = prev.cameraTypes.map(ct => {
        if (!ct.enabled) return ct;
        const ratio = ct.count / currentActiveSum;
        return {
          ...ct,
          count: Math.round(ratio * newTotalCams)
        };
      });

      return {
        ...prev,
        sites: nextSites,
        cameras: newTotalCams,
        cameraTypes: nextCamTypes
      };
    });
  };

  // Reset manual site camera overrides so section 3 evenly distributes across ALL sites again
  const handleResetManualSiteDistribution = () => {
    setManualSiteCameraOverrides(new Set());
    const totalFromTypes = config.cameraTypes.filter(t => t.enabled).reduce((acc, t) => acc + t.count, 0);
    const targetCams = totalFromTypes > 0 ? totalFromTypes : config.cameras;

    setConfig(prev => {
      const nextSites = distributeCamerasToSites(prev.sites, targetCams, new Set());
      return {
        ...prev,
        sites: nextSites,
        cameras: targetCams
      };
    });
  };

  // Update recorders per site
  const handleSiteRecorderChange = (siteId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 1 : Math.max(1, parsed);

    setConfig(prev => {
      const nextSites = prev.sites.map(s => s.id === siteId ? { ...s, recorders: validCount } : s);
      const newTotalRecorders = nextSites.reduce((acc, s) => acc + s.recorders, 0);
      return {
        ...prev,
        sites: nextSites,
        recorders: newTotalRecorders
      };
    });
  };

  // Make (part of) a site's recording capacity redundant — extra hot/cold standby Recording Server(s)
  const handleSiteFailoverRecorderChange = (siteId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig(prev => {
      const nextSites = prev.sites.map(s => s.id === siteId ? { ...s, failoverRecorders: validCount } : s);
      const newTotalFailover = nextSites.reduce((acc, s) => acc + s.failoverRecorders, 0);
      return {
        ...prev,
        sites: nextSites,
        failoverRecorders: newTotalFailover
      };
    });
  };

  // Update management servers per site — lets the user assign exactly where each Management Server lives
  const handleSiteManagementChange = (siteId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig(prev => {
      const nextSites = prev.sites.map(s => s.id === siteId ? { ...s, managementServers: validCount } : s);
      const newTotalMgmt = nextSites.reduce((acc, s) => acc + s.managementServers, 0);
      return {
        ...prev,
        sites: nextSites,
        managementServers: newTotalMgmt
      };
    });
  };

  // Update mobile servers per site — lets the user assign exactly where each Mobile Server gateway lives
  const handleSiteMobileChange = (siteId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig(prev => {
      const nextSites = prev.sites.map(s => s.id === siteId ? { ...s, mobileServers: validCount } : s);
      const newTotalMobile = nextSites.reduce((acc, s) => acc + s.mobileServers, 0);
      return {
        ...prev,
        sites: nextSites,
        mobileServers: newTotalMobile
      };
    });
  };

  // Update Smart Client workstations per site — for Single-Site/Multi-Site this is routed to the
  // hoofdlocatie (one shared system, so effectively still one number); for Federated/Interconnect every
  // autonomous site gets its own, since operators there each view their own location.
  const handleSiteClientsChange = (siteId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig(prev => {
      const nextSites = prev.sites.map(s => s.id === siteId ? { ...s, clients: validCount } : s);
      const newTotalClients = nextSites.reduce((acc, s) => acc + s.clients, 0);
      return {
        ...prev,
        sites: nextSites,
        clients: newTotalClients
      };
    });
  };

  // Update site name
  const handleSiteNameChange = (siteId: string, name: string) => {
    setConfig(prev => ({
      ...prev,
      sites: prev.sites.map(s => s.id === siteId ? { ...s, name } : s)
    }));
  };

  // Set the Milestone edition for a specific site — used for the Federated/Interconnect hoofdlocatie (Corporate or Expert)
  const handleSiteTierChange = (siteId: string, tier: string) => {
    setConfig(prev => ({
      ...prev,
      sites: prev.sites.map(s => s.id === siteId ? { ...s, tier } : s)
    }));
  };

  // Add a new site (or, for Single-Site, an extra standalone building/location on the same LAN)
  const handleAddSite = () => {
    const newIndex = config.sites.length + 1;
    const isSingleSite = config.architecture === 'single-site';
    const newSite: SiteLocation = {
      id: `site-custom-${Date.now()}`,
      name: isSingleSite ? `Gebouw / Locatie ${newIndex}` : `Vestiging / Locatie ${newIndex}`,
      type: 'remote',
      cameras: 0,
      recorders: 1,
      failoverRecorders: 0,
      // Single-Site deelt één centrale Management Server voor het hele systeem, dus nieuwe gebouwen krijgen er standaard geen eigen bij
      managementServers: config.architecture === 'federated' || config.architecture === 'interconnect' ? 1 : 0,
      mobileServers: config.architecture === 'federated' || config.architecture === 'interconnect' ? 1 : 0,
      clients: 0,
      networkLink: isSingleSite || config.network === 'lan' ? 'Lokaal LAN' : 'WAN / VPN Tunnel',
      tier: isSingleSite ? `XProtect ${config.singleSiteTier}` : config.architecture === 'federated' ? 'XProtect Expert (Child)' : 'Remote Site',
      notes: isSingleSite ? 'Standalone locatie binnen dezelfde Single-Site LAN' : 'Extra aangesloten locatie'
    };

    setConfig(prev => {
      const updatedSitesList = [...prev.sites, newSite];
      // Automatically distribute current total camera count across the new site configuration
      const distributedSites = distributeCamerasToSites(updatedSitesList, prev.cameras, manualSiteCameraOverrides);
      const newTotalCams = distributedSites.reduce((acc, s) => acc + s.cameras, 0);
      const newTotalRecorders = distributedSites.reduce((acc, s) => acc + s.recorders, 0);
      const newTotalFailover = distributedSites.reduce((acc, s) => acc + s.failoverRecorders, 0);
      const newTotalMgmt = distributedSites.reduce((acc, s) => acc + s.managementServers, 0);
      const newTotalMobile = distributedSites.reduce((acc, s) => acc + s.mobileServers, 0);
      const newTotalClients = distributedSites.reduce((acc, s) => acc + s.clients, 0);

      return {
        ...prev,
        sites: distributedSites,
        cameras: newTotalCams,
        recorders: newTotalRecorders,
        failoverRecorders: newTotalFailover,
        managementServers: newTotalMgmt,
        mobileServers: newTotalMobile,
        clients: newTotalClients
      };
    });
  };

  // Remove a site
  const handleRemoveSite = (siteId: string) => {
    if (config.sites.length <= 1) return; // keep at least 1 site

    setManualSiteCameraOverrides(prev => {
      const next = new Set(prev);
      next.delete(siteId);
      return next;
    });

    setConfig(prev => {
      const filteredSites = prev.sites.filter(s => s.id !== siteId);
      const distributedSites = distributeCamerasToSites(filteredSites, prev.cameras, manualSiteCameraOverrides);
      const newTotalCams = distributedSites.reduce((acc, s) => acc + s.cameras, 0);
      const newTotalRecorders = distributedSites.reduce((acc, s) => acc + s.recorders, 0);
      const newTotalFailover = distributedSites.reduce((acc, s) => acc + s.failoverRecorders, 0);
      const newTotalMgmt = distributedSites.reduce((acc, s) => acc + s.managementServers, 0);
      const newTotalMobile = distributedSites.reduce((acc, s) => acc + s.mobileServers, 0);
      const newTotalClients = distributedSites.reduce((acc, s) => acc + s.clients, 0);

      return {
        ...prev,
        sites: distributedSites,
        cameras: newTotalCams,
        recorders: newTotalRecorders,
        failoverRecorders: newTotalFailover,
        managementServers: newTotalMgmt,
        mobileServers: newTotalMobile,
        clients: newTotalClients
      };
    });
  };

  // Toggle Camera Type on/off (in Section 3) -> updates total camera count and distributes evenly to non-manual sites
  const handleToggleCameraType = (typeId: string) => {
    setConfig(prev => {
      const updatedTypes = prev.cameraTypes.map(ct => {
        if (ct.id === typeId) {
          const nextEnabled = !ct.enabled;
          return {
            ...ct,
            enabled: nextEnabled,
            count: nextEnabled ? Math.max(1, Math.round(prev.cameras * 0.15)) : 0
          };
        }
        return ct;
      });

      // Recalculate total enabled count and distribute
      const enabledTypes = updatedTypes.filter(t => t.enabled);
      if (enabledTypes.length === 0) {
        // keep at least 1 enabled
        return prev;
      }

      const newTotalFromTypes = updatedTypes.filter(t => t.enabled).reduce((acc, t) => acc + t.count, 0);
      const nextSites = distributeCamerasToSites(prev.sites, newTotalFromTypes, manualSiteCameraOverrides);

      return {
        ...prev,
        cameraTypes: updatedTypes,
        cameras: newTotalFromTypes,
        sites: nextSites
      };
    });
  };

  // Change count of specific camera type in Section 3 -> updates total and distributes evenly across sites (unless manually adjusted in Section 2)
  const handleCameraTypeCountChange = (typeId: string, val: string | number) => {
    const parsed = typeof val === 'number' ? val : parseInt(val, 10);
    const validCount = isNaN(parsed) ? 0 : Math.max(0, parsed);

    setConfig(prev => {
      const updatedTypes = prev.cameraTypes.map(ct => 
        ct.id === typeId ? { ...ct, count: validCount, enabled: validCount > 0 ? true : ct.enabled } : ct
      );
      
      const newTotalFromTypes = updatedTypes.filter(t => t.enabled).reduce((acc, t) => acc + t.count, 0);
      const targetCams = newTotalFromTypes > 0 ? newTotalFromTypes : prev.cameras;

      // Distribute evenly across non-manually adjusted sites in Section 2
      const nextSites = distributeCamerasToSites(prev.sites, targetCams, manualSiteCameraOverrides);

      return {
        ...prev,
        cameraTypes: updatedTypes,
        cameras: targetCams,
        sites: nextSites
      };
    });
  };

  const selectedArch = ARCHITECTURE_INFO[config.architecture];
  const selectedNet = NETWORK_OPTIONS.find(n => n.id === config.network) || NETWORK_OPTIONS[0];

  // Calculate total bandwidth from active camera types
  const totalCalculatedBandwidthMbps = config.cameraTypes
    .filter(t => t.enabled)
    .reduce((acc, t) => acc + (t.count * t.avgBitrateMbps), 0);

  const handleCopySummary = () => {
    const summaryText = `--- MILESTONE VMS ARCHITECTUUR SPECIFICATIE ---
Gekozen Architectuur: ${selectedArch.title} (${config.architecture})
${config.architecture === 'single-site' ? `Milestone Editie: XProtect ${config.singleSiteTier}\n` : ''}Netwerkverbinding: ${selectedNet.name} (${selectedNet.defaultSpeed}, latency: ${selectedNet.typicalLatency})

Locaties / Sites Overzicht:
${config.sites.map(s => `• ${s.name}: ${s.cameras} camera's, ${s.recorders} recorder(s)${s.failoverRecorders > 0 ? ` + ${s.failoverRecorders} failover` : ''} [${s.tier || s.networkLink || 'LAN'}]`).join('\n')}

Totaal Componenten:
- Totaal Camera's: ${config.cameras}
- Totaal Recorders: ${config.recorders}${config.failoverRecorders > 0 ? ` (+ ${config.failoverRecorders} failover/redundant)` : ''}
- Management servers: ${config.managementServers}
- Mobile servers: ${config.mobileServers}
- Smart Clients: ${config.clients}

Actieve Camera Types:
${config.cameraTypes.filter(t => t.enabled).map(t => `• ${t.name}: ${t.count} stuks (~${(t.count * t.avgBitrateMbps).toFixed(1)} Mbps)`).join('\n')}

Totale Ingress Videobandbreedte: ~${totalCalculatedBandwidthMbps.toFixed(1)} Mbps
Milestone Tier: ${config.architecture === 'single-site' ? `XProtect ${config.singleSiteTier}` : selectedArch.recommendedTiers}
`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      
      {/* SECTION 1: ARCHITECTUUR KEUZE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <h2 className="text-base font-bold text-slate-900">
                Kies de Milestone Architectuur
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Selecteer het topologiemodel om te bepalen hoe management servers, databases en recorders verdeeld zijn.
            </p>
          </div>
          <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full self-start sm:self-auto border border-slate-200">
            Geselecteerd: <strong className="text-blue-700">{selectedArch.title}</strong>
          </span>
        </div>

        {/* 4 Architecture Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {(Object.keys(ARCHITECTURE_INFO) as MainArchitectureType[]).map((type) => {
            const arch = ARCHITECTURE_INFO[type];
            const isSelected = config.architecture === type;
            const Icon = arch.icon;

            return (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectArchitecture(type)}
                className={`relative p-4 rounded-2xl text-left transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-100/80 shadow-card ring-2 ring-blue-600/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {arch.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {arch.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {arch.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-500">Tier advies:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[130px]" title={arch.recommendedTiers}>
                    {arch.recommendedTiers.split('/')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Architecture Highlight Details */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-3">
          <div className="flex items-start gap-2.5 min-w-0">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="min-w-0">
              <span className="font-bold text-slate-900">{selectedArch.title}: </span>
              <span className="text-slate-600">{selectedArch.description}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2.5 border-t border-slate-200/70">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Voordelen</span>
              <ul className="space-y-1.5">
                {selectedArch.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Aandachtspunten</span>
              <ul className="space-y-1.5">
                {selectedArch.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-700 leading-relaxed">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SINGLE SITE TIER SELECTION (EXPRESS+, PROFESSIONAL+, EXPERT, CORPORATE) */}
        {config.architecture === 'single-site' && (
          <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Kies de Milestone Editie voor Single-Site
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecteer de gewenste Milestone software editie (Express+, Professional+, Expert of Corporate).
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {onNavigateToComparisonSheet && (
                  <button
                    type="button"
                    onClick={onNavigateToComparisonSheet}
                    className="text-xs font-semibold px-2.5 py-1 bg-white hover:bg-slate-50 text-blue-700 rounded-lg border border-blue-200 shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>Bekijk Comparison Sheet</span>
                    <ChevronRight className="w-3 h-3 text-blue-600" />
                  </button>
                )}
                <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200 shrink-0">
                  Geselecteerde Editie: <strong>XProtect {config.singleSiteTier}</strong>
                </span>
              </div>
            </div>

            {/* 4 Single Site Tier Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {SINGLE_SITE_TIERS.map((tier) => {
                const isSelected = config.singleSiteTier === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => handleSelectSingleSiteTier(tier.id)}
                    className={`p-3.5 rounded-2xl text-left transition-all flex flex-col justify-between border ${
                      isSelected
                        ? `${tier.activeBorder} ${tier.activeBg} shadow-card`
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${tier.badgeColor}`}>
                          {tier.badge}
                        </span>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {tier.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                        {tier.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 space-y-1 text-[11px] text-slate-600">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Camera limiet:</span>
                        <span className="font-semibold text-slate-800">{tier.maxCameras}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Recorders:</span>
                        <span className="font-semibold text-slate-800">{tier.recordersText}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Failover / Standby:</span>
                        <span className={`font-semibold ${tier.failoverSupport ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                          {tier.failoverSupport ? 'Ja (Hot/Cold)' : 'Nee'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* SERVER TOPOLOGY: COMBINED (ALLES-IN-1) VS DISTRIBUTED (DEDICATED PER ROL) */}
            <div className="pt-4 mt-1 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-2.5">
                <Server className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Hoe is de server opgebouwd?</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Bij kleinere installaties draait vaak alles (Management, SQL, Recording) op één fysieke server. Bij grotere of kritieke installaties worden deze rollen over aparte, dedicated servers verdeeld. Kies zelf hoe dit voor uw installatie werkt.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSelectServerTopology('combined')}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex items-start gap-3 ${
                    config.singleSiteServerTopology === 'combined'
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-100/80 shadow-card ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    config.singleSiteServerTopology === 'combined' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Gecombineerde Server (Alles-in-1)</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      Management, SQL en Recording (+ Mobile) draaien samen op één server. Typisch voor kleinschalige installaties.
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectServerTopology('distributed')}
                  className={`p-3.5 rounded-2xl text-left transition-all border flex items-start gap-3 ${
                    config.singleSiteServerTopology === 'distributed'
                      ? 'border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-100/80 shadow-card ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    config.singleSiteServerTopology === 'distributed' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Gescheiden Servers (Dedicated per rol)</span>
                    <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                      Management, SQL en Recording draaien elk op hun eigen dedicated server. Typisch voor grotere of kritieke installaties.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Express+ Camera count warning helper */}
            {config.singleSiteTier === 'Express+' && config.cameras > 100 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 mt-2">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Licentiewaarschuwing: </span>
                    <span>
                      XProtect Express+ heeft een licentielimiet van maximaal 100 devices / camera's. Uw huidige configuratie heeft <strong>{config.cameras} camera's</strong>.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleClampExpressCameras}
                    className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-md shadow-2xs transition-colors text-[11px]"
                  >
                    Zet op 100 camera's
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectSingleSiteTier('Professional+')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-semibold rounded-md shadow-2xs transition-colors text-[11px]"
                  >
                    Kies Professional+
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Quick Collapse / Expand All bar */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-500 -my-2">
        <span className="font-medium text-slate-600">Opties 2 t/m 4:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCollapsedSections({ 2: true, 3: true, 4: true })}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors shadow-2xs text-[11px]"
          >
            Alles inklappen
          </button>
          <button
            type="button"
            onClick={() => setCollapsedSections({ 2: false, 3: false, 4: false })}
            className="px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-medium transition-colors shadow-2xs text-[11px]"
          >
            Alles uitklappen
          </button>
        </div>
      </div>

      {/* SECTION 2: LOCATIES & CAMERA'S PER LOCATIE INSTELLEN (MULTI-SITE, FEDERATED, INTERCONNECT OF SINGLE-SITE) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-card transition-all">
        <div 
          onClick={() => toggleSection(2)}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                <MapPin className="w-4 h-4 text-blue-600" />
                Locaties & Camera's per Locatie
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {config.architecture === 'single-site'
                ? 'Alles draait op dezelfde Single-Site LAN, maar dat mag best over meerdere gebouwen of standalone serverlocaties verdeeld zijn — bijvoorbeeld een hoofdgebouw én een apart Lab. Voeg toe waar nodig.'
                : `Beheer de vestigingen en vul het exacte aantal camera's en recorders in per ${selectedArch.title} locatie.`}
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0" onClick={(e) => e.stopPropagation()}>
            {manualSiteCameraOverrides.size > 0 && config.sites.length > 1 && (
              <button
                type="button"
                onClick={handleResetManualSiteDistribution}
                className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                title="Herstel automatische evenredige verdeling van alle camera's uit de cameratypes over alle locaties"
              >
                <RotateCcw className="w-3 h-3 text-amber-700" />
                <span>Herstel Evenredig</span>
              </button>
            )}
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {config.sites.length} Locaties • <span className="text-purple-700">{config.cameras} Camera's</span> • <span className="text-emerald-700">{config.recorders} Recorders</span>
              {config.failoverRecorders > 0 && <> • <span className="text-orange-700">{config.failoverRecorders} Failover</span></>}
              {' '}• <span className="text-blue-700">{config.managementServers} Mgmt</span> • <span className="text-indigo-700">{config.mobileServers} Mobile</span> • <span className="text-cyan-700">{config.clients} Clients</span>
            </span>
            {!collapsedSections[2] && (
              <button
                type="button"
                onClick={handleAddSite}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ {config.architecture === 'single-site' ? 'Gebouw' : 'Locatie'}</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => toggleSection(2)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title={collapsedSections[2] ? 'Uitklappen' : 'Inklappen'}
            >
              <span className="hidden sm:inline text-[11px]">{collapsedSections[2] ? 'Uitklappen' : 'Inklappen'}</span>
              {collapsedSections[2] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {!collapsedSections[2] && (
          <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
            {/* Sites List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {config.sites.map((site, index) => {
                // Single-Site has no forced "hoofdlocatie": every building/location on the LAN is equal —
                // which one hosts the Management Server is shown via its own badge, not a hard-coded hierarchy.
                const isHq = config.architecture !== 'single-site' && (site.type === 'hq' || index === 0);

                return (
                  <div 
                    key={site.id} 
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3.5 ${
                      isHq 
                        ? 'border-blue-300 bg-blue-50/20 shadow-2xs' 
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    {/* Site Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isHq ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isHq ? <Building className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={site.name}
                            onChange={(e) => handleSiteNameChange(site.id, e.target.value)}
                            className="w-full text-xs font-bold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none bg-transparent py-0.5"
                            placeholder="Locatienaam..."
                          />
                          <span className="text-[10px] text-slate-500 block truncate">
                            {config.architecture === 'single-site'
                              ? 'Gebouw / Standalone locatie (zelfde LAN)'
                              : isHq
                              ? 'Centrale Hoofdlocatie'
                              : config.architecture === 'federated'
                              ? 'Autonome Child Site'
                              : config.architecture === 'interconnect'
                              ? 'Remote Edge Locatie'
                              : 'Aangesloten Vestiging'}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button for extra sites */}
                      <div className="flex items-center gap-1 shrink-0">
                        {manualSiteCameraOverrides.has(site.id) && config.sites.length > 1 && (
                          <span 
                            className="text-[9px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                            title="Camera-aantal voor deze locatie is handmatig vastgezet"
                          >
                            Vastgezet
                          </span>
                        )}
                        {config.sites.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSite(site.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors shrink-0"
                            title="Verwijder deze locatie"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Hoofdlocatie Milestone editie — Federated Parent / Interconnect Hub moet minimaal Expert of Corporate zijn */}
                    {(config.architecture === 'federated' || config.architecture === 'interconnect') && isHq && (
                      <div className="flex items-center justify-between gap-2 py-2 border-b border-slate-100">
                        <span className="text-[10px] font-semibold text-slate-500">
                          Editie {config.architecture === 'federated' ? 'Parent' : 'Hub'}:
                        </span>
                        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                          {['XProtect Expert', 'XProtect Corporate'].map((tierOption) => (
                            <button
                              key={tierOption}
                              type="button"
                              onClick={() => handleSiteTierChange(site.id, tierOption)}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors ${
                                site.tier === tierOption
                                  ? 'bg-blue-600 text-white shadow-xs'
                                  : 'text-slate-600 hover:bg-white'
                              }`}
                            >
                              {tierOption.replace('XProtect ', '')}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Site Inputs (Camera's, Recorders, Management & Mobile Servers) */}
                    <div className="grid grid-cols-2 gap-2.5">

                      {/* Camera's for this Site */}
                      <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-purple-900 flex items-center gap-1">
                            <Video className="w-3 h-3 text-purple-700" />
                            Camera's:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSiteCameraChange(site.id, Math.max(0, site.cameras - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 camera minder"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="10000"
                            step="1"
                            value={site.cameras}
                            onChange={(e) => handleSiteCameraChange(site.id, e.target.value)}
                            className="w-full text-center font-bold text-sm text-purple-950 bg-white border border-purple-300 rounded py-0.5 focus:border-purple-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSiteCameraChange(site.id, site.cameras + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-purple-100 border border-purple-200 text-purple-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 camera meer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Recorders for this Site */}
                      <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-emerald-700" />
                            Recorders:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSiteRecorderChange(site.id, Math.max(1, site.recorders - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={site.recorders}
                            onChange={(e) => handleSiteRecorderChange(site.id, e.target.value)}
                            className="w-full text-center font-bold text-sm text-emerald-950 bg-white border border-emerald-300 rounded py-0.5 focus:border-emerald-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSiteRecorderChange(site.id, site.recorders + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Management Servers for this Site */}
                      <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1">
                            <Server className="w-3 h-3 text-blue-700" />
                            Mgmt Servers:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSiteManagementChange(site.id, Math.max(0, site.managementServers - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 management server minder op deze locatie"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={site.managementServers}
                            onChange={(e) => handleSiteManagementChange(site.id, e.target.value)}
                            className="w-full text-center font-bold text-sm text-blue-950 bg-white border border-blue-300 rounded py-0.5 focus:border-blue-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSiteManagementChange(site.id, site.managementServers + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 management server meer op deze locatie"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Mobile Servers for this Site */}
                      <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-indigo-900 flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-indigo-700" />
                            Mobile Servers:
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSiteMobileChange(site.id, Math.max(0, site.mobileServers - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 mobile server minder op deze locatie"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={site.mobileServers}
                            onChange={(e) => handleSiteMobileChange(site.id, e.target.value)}
                            className="w-full text-center font-bold text-sm text-indigo-950 bg-white border border-indigo-300 rounded py-0.5 focus:border-indigo-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSiteMobileChange(site.id, site.mobileServers + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 mobile server meer op deze locatie"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Failover / Redundant Recorders for this Site — hot/cold standby, on top of the primary recorders above */}
                      <div className="p-2.5 rounded-lg bg-orange-50/60 border border-orange-200 col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-bold text-orange-900 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-orange-700" />
                            Failover Recorders (Redundantie):
                          </span>
                          <span className="text-[10px] text-orange-700/80">Hot/Cold Standby, op deze locatie</span>
                        </div>
                        <div className="flex items-center gap-1.5 max-w-[140px]">
                          <button
                            type="button"
                            onClick={() => handleSiteFailoverRecorderChange(site.id, Math.max(0, site.failoverRecorders - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 failover recorder minder op deze locatie"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={site.failoverRecorders}
                            onChange={(e) => handleSiteFailoverRecorderChange(site.id, e.target.value)}
                            className="w-full text-center font-bold text-sm text-orange-950 bg-white border border-orange-300 rounded py-0.5 focus:border-orange-600 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSiteFailoverRecorderChange(site.id, site.failoverRecorders + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-orange-100 border border-orange-200 text-orange-800 font-bold text-xs flex items-center justify-center transition-colors"
                            title="1 failover recorder meer op deze locatie"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Smart Clients local to this site — Federated/Interconnect only: every autonomous location
                          (incl. the hoofdlocatie) has its own operators viewing its own site. */}
                      {(config.architecture === 'federated' || config.architecture === 'interconnect') && (
                        <div className="p-2.5 rounded-lg bg-cyan-50/60 border border-cyan-200 col-span-2">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[11px] font-bold text-cyan-900 flex items-center gap-1">
                              <Monitor className="w-3 h-3 text-cyan-700" />
                              Smart Clients (lokaal):
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 max-w-[140px]">
                            <button
                              type="button"
                              onClick={() => handleSiteClientsChange(site.id, Math.max(0, site.clients - 1))}
                              className="w-6 h-6 rounded bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-xs flex items-center justify-center transition-colors"
                              title="1 smart client minder op deze locatie"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="1000"
                              value={site.clients}
                              onChange={(e) => handleSiteClientsChange(site.id, e.target.value)}
                              className="w-full text-center font-bold text-sm text-cyan-950 bg-white border border-cyan-300 rounded py-0.5 focus:border-cyan-600 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleSiteClientsChange(site.id, site.clients + 1)}
                              className="w-6 h-6 rounded bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-xs flex items-center justify-center transition-colors"
                              title="1 smart client meer op deze locatie"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )}

                    </div>

                    {/* Site Notes / Educational detail */}
                    <div className="text-[10px] text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100">
                      <span>~{Math.round(site.cameras / Math.max(1, site.recorders))} cam/recorder</span>
                      <span className="font-semibold text-slate-700">
                        {config.architecture === 'federated' 
                          ? 'Eigen Mgmt Server & SQL' 
                          : config.architecture === 'multi-site' 
                          ? (isHq ? 'Centrale SQL & Mgmt' : 'Lokale Storage Pool') 
                          : 'Lokale Storage'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Smart Clients — Single-Site/Multi-Site: één gedeeld systeem, dus systeembreed (gekoppeld aan de hoofdlocatie).
                Federated/Interconnect: elke autonome locatie heeft haar eigen Smart Clients — zie de locatiekaarten hierboven. */}
            {config.architecture !== 'federated' && config.architecture !== 'interconnect' && (
              <div className="pt-4 border-t border-slate-100">
                <div className="p-4 rounded-2xl border border-cyan-200 bg-cyan-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
                      <Monitor className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Smart Clients</span>
                      <span className="text-[11px] text-slate-500">Operator werkplekken & meldkamers — systeembreed, niet per locatie</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        const hqSiteForClients = config.sites.find(s => s.type === 'hq') || config.sites[0];
                        if (hqSiteForClients) handleSiteClientsChange(hqSiteForClients.id, Math.max(0, hqSiteForClients.clients - 1));
                      }}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-base flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      value={config.clients}
                      onChange={(e) => {
                        const hqSiteForClients = config.sites.find(s => s.type === 'hq') || config.sites[0];
                        if (hqSiteForClients) handleSiteClientsChange(hqSiteForClients.id, e.target.value);
                      }}
                      className="w-16 text-center font-bold text-base text-cyan-950 bg-white border border-cyan-300 rounded-lg py-1 focus:border-cyan-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const hqSiteForClients = config.sites.find(s => s.type === 'hq') || config.sites[0];
                        if (hqSiteForClients) handleSiteClientsChange(hqSiteForClients.id, hqSiteForClients.clients + 1);
                      }}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 font-bold text-base flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 3: CAMERA TYPES AAN / UIT ZETTEN & AANTALLEN SPECIFICEREN */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-card transition-all">
        <div
          onClick={() => toggleSection(3)}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 group-hover:text-blue-600 transition-colors">
                <Sliders className="w-4 h-4 text-purple-600" />
                Camera Types (Aan / Uit & Aantallen)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Schakel specifieke cameratypes in/uit en pas de aantallen aan. Aantallen worden automatisch evenredig verdeeld over de locaties bij optie 2 (tenzij handmatig vastgezet).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-700 border border-purple-200">
              Actieve Types: {config.cameraTypes.filter(t => t.enabled).length} van {config.cameraTypes.length}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-200">
              ~{totalCalculatedBandwidthMbps.toFixed(0)} Mbps
            </span>
            <button
              type="button"
              onClick={() => toggleSection(3)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title={collapsedSections[3] ? 'Uitklappen' : 'Inklappen'}
            >
              <span className="hidden sm:inline text-[11px]">{collapsedSections[3] ? 'Uitklappen' : 'Inklappen'}</span>
              {collapsedSections[3] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {!collapsedSections[3] && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            {/* Camera Types Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {config.cameraTypes.map((camType) => {
                const isEnabled = camType.enabled;

                return (
                  <div
                    key={camType.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                      isEnabled
                        ? 'border-purple-300 bg-purple-50/30 shadow-2xs'
                        : 'border-slate-200 bg-slate-50/60 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Top row: Title and Toggle Button */}
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isEnabled ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            <Video className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <strong className="text-xs font-bold text-slate-900 block leading-tight">
                              {camType.shortName}
                            </strong>
                            <span className="text-[10px] text-slate-500 block">
                              {camType.resolution}
                            </span>
                          </div>
                        </div>

                        {/* Enable / Disable Toggle Switch */}
                        <button
                          type="button"
                          onClick={() => handleToggleCameraType(camType.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 border ${
                            isEnabled
                              ? 'bg-purple-600 text-white border-purple-700 shadow-2xs'
                              : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {isEnabled ? 'AAN' : 'UIT'}
                        </button>
                      </div>

                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {camType.description}
                      </p>
                    </div>

                    {/* Bottom Row: Quantity input & Bandwidth calculation */}
                    {isEnabled ? (
                      <div className="pt-2 border-t border-purple-200/60 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-bold text-slate-700">Aantal:</span>
                          <div className="flex items-center">
                            <button
                              type="button"
                              onClick={() => handleCameraTypeCountChange(camType.id, Math.max(0, camType.count - 1))}
                              className="w-6 h-6 rounded-l bg-white hover:bg-purple-100 border border-purple-300 text-purple-800 font-bold text-xs flex items-center justify-center transition-colors"
                              title="1 camera minder"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              max="10000"
                              step="1"
                              value={camType.count}
                              onChange={(e) => handleCameraTypeCountChange(camType.id, e.target.value)}
                              className="w-12 text-center font-bold text-xs text-purple-950 bg-white border-y border-purple-300 py-0.5 focus:border-purple-600 focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => handleCameraTypeCountChange(camType.id, camType.count + 1)}
                              className="w-6 h-6 rounded-r bg-white hover:bg-purple-100 border border-purple-300 text-purple-800 font-bold text-xs flex items-center justify-center transition-colors"
                              title="1 camera meer"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-purple-900 bg-white px-2 py-0.5 rounded border border-purple-200">
                          ~{(camType.count * camType.avgBitrateMbps).toFixed(1)} Mbps
                        </span>
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 italic">
                        Camera type uitgeschakeld
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: NETWERK VERBINDING (CONNECTIE) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-card transition-all">
        <div
          onClick={() => toggleSection(4)}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                4
              </span>
              <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Kies de Netwerk Connectie
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Geef aan welk type netwerkverbinding er tussen de locaties, servers en gebruikers ligt.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-xs font-medium px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
              Connectie: <strong className="text-blue-700">{selectedNet.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => toggleSection(4)}
              className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors flex items-center gap-1 text-xs font-semibold"
              title={collapsedSections[4] ? 'Uitklappen' : 'Inklappen'}
            >
              <span className="hidden sm:inline text-[11px]">{collapsedSections[4] ? 'Uitklappen' : 'Inklappen'}</span>
              {collapsedSections[4] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Collapsible Content */}
        {!collapsedSections[4] && (
          <div className="pt-4 mt-4 border-t border-slate-100">
            {/* Network Connection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {NETWORK_OPTIONS.map((net) => {
                const isSelected = config.network === net.id;
                const Icon = net.icon;

                return (
                  <button
                    key={net.id}
                    type="button"
                    onClick={() => setConfig(prev => ({ ...prev, network: net.id }))}
                    className={`p-3.5 rounded-2xl text-left transition-all border flex items-start gap-3 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 shadow-xs ring-2 ring-blue-600/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {net.name}
                        </h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <span className="font-semibold text-slate-700">{net.defaultSpeed}</span>
                        <span>•</span>
                        <span>Latency: {net.typicalLatency}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                        {net.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* SECTION 5: VISUEEL ARCHITECTUUR DIAGRAM (GESTAPELD HIERARCHISCH MODEL) */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Network className="w-5 h-5 text-blue-600" />
              Systeemarchitectuur & Topologie Opbouw
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {config.architecture === 'federated' || config.architecture === 'interconnect'
                ? "Gestructureerd gelaagd architectuuroverzicht: Cliëntagency (Boven) → Netwerkbus → Locaties (Onder), elk met een eigen zelfstandige Management Server, SQL, Recording & Mobile Server."
                : "Gestructureerd gelaagd architectuuroverzicht: Cliëntagency (Boven) → Beheer & Database (Midden) → Netwerkbus → Locaties, Recorders & Camera's (Onder)."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Gekopieerd' : 'Kopieer Specificatie'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Afdrukken / PDF</span>
            </button>
          </div>
        </div>

        {/* Stacked Clean Architecture Diagram */}
        <MilestoneArchitectureStack config={config} />

        {/* Overview Summary Box */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <strong className="text-xs uppercase tracking-wider text-slate-200">
                Samenvatting Milestone VMS Architectuur & Locaties
              </strong>
            </div>
            <span className="text-xs font-semibold text-blue-300">
              {selectedArch.title}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
            <div>
              <span className="text-slate-400 text-[11px] block">Architectuur:</span>
              <strong className="text-white text-xs">{selectedArch.title}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Netwerklink:</span>
              <strong className="text-white text-xs">{selectedNet.name.split('(')[0]}</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Locaties / Recorders:</span>
              <strong className="text-emerald-400 text-xs">
                {config.sites.length} Locaties • {config.recorders} Recorders{config.failoverRecorders > 0 && ` • +${config.failoverRecorders} Failover`}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Management / Mobile:</span>
              <strong className="text-blue-300 text-xs">{config.managementServers} Mgmt • {config.mobileServers} Mob</strong>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Smart Clients / Camera's:</span>
              <strong className="text-cyan-300 text-xs">{config.clients} Clients • {config.cameras} Cam's</strong>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
