import React, { useState } from 'react';
import { X, Globe, Github, Terminal, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';
import { UserProfile, EvidenceItem } from '../types';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  evidenceItems: EvidenceItem[];
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
  profile,
  evidenceItems,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'vercel' | 'github' | 'code'>('vercel');

  const exportData = JSON.stringify({ profile, evidenceItems }, null, 2);

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#FFFFFF] border border-[#050505] max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Editorial Top Bar */}
        <div className="bg-[#050505] text-[#FFFFFF] px-6 py-4 flex items-center justify-between border-b border-[#050505]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#D5D5D0]/30 bg-[#FFFFFF]/5 text-[#FFFFFF] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#E32636]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="w-1.5 h-1.5 bg-[#E32636]" />
                <span className="font-mono text-[10px] tracking-widest text-[#D5D5D0] uppercase">
                  // DEPLOYMENT & TELEMETRY PROTOCOL
                </span>
              </div>
              <h3 className="font-heading font-black text-base sm:text-lg text-[#FFFFFF] tracking-tight">
                Productie & Publicatie Gids
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#D5D5D0] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-colors cursor-pointer"
            aria-label="Sluit gids"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Technical Nav Tabs */}
        <div className="flex border-b border-[#D5D5D0] bg-[#F4F3EF] px-6 pt-2 gap-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`pb-2.5 px-1 border-b-2 uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            [01] Vercel Hosting
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-1 border-b-2 uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            [02] GitHub Pages
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-1 border-b-2 uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            [03] Data & Export
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-[#050505]">
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="bg-[#F4F3EF] border-l-2 border-[#E32636] border-y border-r border-[#D5D5D0] p-4">
                <h4 className="font-heading font-black text-[#050505] text-sm mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E32636]" />
                  Aanbevolen Productie Pipeline (Vercel)
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Vercel herkent de Vite-architectuur automatisch. Door de Supabase-cloudintegratie en externe media blijft de GitHub-repository licht en snel te builden.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm leading-relaxed text-[#050505]">
                <li>Zorg dat alle wijzigingen gepusht zijn naar je <strong>GitHub repository</strong>.</li>
                <li>Navigeer naar <strong>vercel.com</strong> en selecteer <em>"Add New Project"</em>.</li>
                <li>Verbind en importeer je portfolio repository.</li>
                <li>
                  Verifieer de standaard configuratie:
                  <div className="mt-2 border border-[#D5D5D0] bg-[#050505] text-[#FFFFFF] p-3 font-mono text-[11px] space-y-1">
                    <p className="text-[#D5D5D0]">FRAMEWORK: Vite</p>
                    <p className="text-[#D5D5D0]">BUILD_CMD: npm run build</p>
                    <p className="text-[#D5D5D0]">OUTPUT_DIR: dist</p>
                  </div>
                </li>
                <li className="pt-1">Klik op <strong>Deploy</strong>. Het portfolio is binnen enkele seconden wereldwijd bereikbaar met automatische SSL en telemetry.</li>
              </ol>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-[#F4F3EF] border border-[#D5D5D0] p-4">
                <h4 className="font-heading font-black text-[#050505] text-sm mb-1 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#050505]" />
                  Statische Distributie
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Het project kan ook als statische bundel via GitHub Pages of een willekeurige static web server gehost worden.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  Lokaal testen van de productiebuild:
                </p>
                <div className="bg-[#050505] text-[#FFFFFF] p-3 border border-[#050505] font-mono text-[11px] space-y-1">
                  <p className="text-[#D5D5D0]">$ npm run build</p>
                  <p className="text-[#D5D5D0]">$ npm run preview</p>
                </div>
                <p className="text-xs text-[#6B6B6B]">
                  De directory <code className="font-mono bg-[#F4F3EF] px-1 py-0.5 border border-[#D5D5D0]">dist/</code> bevat de geoptimaliseerde productiebestanden.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="bg-[#F4F3EF] border border-[#D5D5D0] p-4">
                <h4 className="font-heading font-black text-[#050505] text-sm mb-1 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#050505]" />
                  Datastructuur & Lokale Defaults
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Standaard profielgegevens, fallback deliverables en initiële bewijsstukken worden beheerd in:
                </p>
                <p className="font-mono text-xs font-bold text-[#050505] bg-[#FFFFFF] p-2 border border-[#D5D5D0] mt-2">
                  src/data/initialData.ts
                </p>
              </div>

              <div className="border border-[#D5D5D0] p-4 space-y-3 bg-[#FFFFFF]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                    Portfolio JSON Snapshot Exporteren
                  </span>
                  <button
                    onClick={handleCopyJSON}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#050505] hover:bg-[#E32636] text-[#FFFFFF] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Gekopieerd' : 'Kopieer JSON'}
                  </button>
                </div>
                <p className="text-xs text-[#6B6B6B] leading-relaxed">
                  Kopieer de actuele runtime data om deze eventueel als hardcoded backup of initiële configuratie in de repository op te slaan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#D5D5D0] bg-[#F4F3EF] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 font-mono text-xs uppercase tracking-wider text-[#050505] hover:text-[#FFFFFF] bg-[#FFFFFF] hover:bg-[#050505] border border-[#D5D5D0] transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
