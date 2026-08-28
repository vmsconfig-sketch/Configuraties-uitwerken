import React from 'react';
import { 
  ShieldCheck, 
  HardDrive, 
  Cpu, 
  Network, 
  Clock, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Wifi, 
  Server,
  FolderLock
} from 'lucide-react';

export const BestPracticesGuide: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Milestone Systems Engineering & Deployment Best Practices
            </h2>
            <p className="text-xs text-slate-500">
              Gecertificeerde richtlijnen van Milestone Systems voor een veilige, stabiele en maximale performance video management installatie.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Best Practice Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Anti-Virus & Windows Defender Uitsluitingen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <FolderLock className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">1. Anti-Virus & Windows Defender Uitsluitingen</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Realtime anti-virus scans op Milestone databases of live videobestanden kunnen leiden tot disk-I/O locks, haperende opnames en verlies van beelden.
          </p>

          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-amber-800 block text-[11px]">Verplichte Mapuitsluitingen (Folders):</span>
              <ul className="space-y-1 text-slate-700 font-mono text-[11px] list-disc list-inside">
                <li>C:\Program Files\Milestone\*</li>
                <li>C:\Program Files (x86)\Milestone\*</li>
                <li>C:\ProgramData\Milestone\*</li>
                <li>Alle actieve Live Recording schijfletters (bijv. D:\LiveStorage\*)</li>
                <li>Alle Archief schijfletters (bijv. E:\ArchiveStorage\*)</li>
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="font-bold text-amber-800 block text-[11px]">Verplichte Bestandsextensies:</span>
              <p className="text-slate-700 font-mono text-[11px]">
                .mdf, .ldf, .idx, .bin, .xml, .db, .pic, .blk, .pq
              </p>
            </div>
          </div>
        </div>

        {/* 2. Storage & RAID Controller Instellingen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <HardDrive className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">2. Opslag & RAID Controller Optimalisatie</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Milestone XProtect schrijft continu videostreams in blokken van 512KB naar de live storage pool. Juiste storage controller instellingen zijn cruciaal.
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Battery-Backed Write Cache (BBWC/FBWC):</strong>
                <span className="block text-slate-500 mt-0.5">Zorg dat de hardware RAID controller voorzien is van een backup batterij en stel de cache in op 100% Write / 0% Read of 75/25.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">NTFS Clustergrootte:</strong>
                <span className="block text-slate-500 mt-0.5">Formatteer live en archief volumes met een NTFS Allocation Unit Size van <strong>64 KB</strong> voor optimale sequentiële I/O performance.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Geen Windows Indexing of Defrag:</strong>
                <span className="block text-slate-500 mt-0.5">Schakel Windows Search Indexing en automatische defragmentatie uit op alle video storage partities.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* 3. Tijdssynchronisatie & NTP */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Clock className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">3. Tijdssynchronisatie & NTP Server</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            In een VMS architectuur met meerdere servers en camera's is een uniforme tijdreferentie juridisch en operationeel onmisbaar.
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Tijdsafwijking &lt; 1 Seconde:</strong>
                <span className="block text-slate-500 mt-0.5">Koppel alle IP camera's, servers en clients aan dezelfde centrale NTP server (bijv. Windows Domain Controller of GPS Time Server).</span>
              </div>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Forensisch Bewijsmateriaal:</strong>
                <span className="block text-slate-500 mt-0.5">Tijdsynchronisatie garandeert dat geëxporteerde beelden (met digitale Milestone handtekening) juridisch standhouden bij politie en rechtbank.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* 4. Milestone Interconnect & MFA Netwerkrichtlijnen */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-card">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Wifi className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">4. Interconnect & Federated Netwerkrichtlijnen</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Tips voor betrouwbare verbindingen over openbare WAN verbindingen en tussen autonome organisaties.
          </p>

          <ul className="space-y-2 text-xs text-slate-700">
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Interconnect Bandwidth Throttling:</strong>
                <span className="block text-slate-500 mt-0.5">Stel op de centrale Corporate server een bandbreedtebeperking in per remote site om overbelasting van 4G/5G links te voorkomen.</span>
              </div>
            </li>
            <li className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">Certificaat-gebaseerde Encryptie (TLS 1.3):</strong>
                <span className="block text-slate-500 mt-0.5">Installeer geldige CA-certificaten op de Management Server en Recording Servers om end-to-end encryptie (poort 443 / 7563) te waarborgen.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
