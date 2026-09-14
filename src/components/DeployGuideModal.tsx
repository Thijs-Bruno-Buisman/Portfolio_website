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
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scaleUp border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center">
              <Globe className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Deploy- & Code Gids (Vercel & GitHub Pages)
              </h3>
              <p className="text-xs text-slate-500">
                Statische HTML/CSS/JS export en tekstbeheer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50/50 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'vercel'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ▲ Vercel Hosting (Aanbevolen)
          </button>
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'github'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Github className="w-3.5 h-3.5 inline mr-1" />
            GitHub Pages
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'border-emerald-600 text-emerald-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 inline mr-1" />
            Tekst & Links Aanpassen
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <h4 className="font-bold text-emerald-900 text-sm mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Binnen 2 minuten live op Vercel
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Vercel herkent Vite projecten automatisch en host de statische build razendsnel. Omdat grote bestanden extern in OneDrive en YouTube staan, blijft de repo licht en gratis.
                </p>
              </div>

              <ol className="list-decimal list-inside space-y-2 text-slate-700 text-xs sm:text-sm">
                <li>Push je code naar een <strong>GitHub repository</strong>.</li>
                <li>Ga naar <strong>vercel.com</strong> en klik op <em>"Add New Project"</em>.</li>
                <li>Importeer je GitHub repository.</li>
                <li>
                  Vercel stelt automatisch in:
                  <ul className="list-disc list-inside pl-4 mt-1 space-y-1 text-slate-600 font-mono text-[11px]">
                    <li>Framework Preset: <code>Vite</code></li>
                    <li>Build Command: <code>npm run build</code></li>
                    <li>Output Directory: <code>dist</code></li>
                  </ul>
                </li>
                <li>Klik op <strong>Deploy</strong>. Binnen 30 seconden is je portfolio wereldwijd online met een gratis SSL-certificaat!</li>
              </ol>
            </div>
          )}

          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-1 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-slate-700" />
                  GitHub Pages Build
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Je kunt het project ook als statische HTML/CSS/JS hosten op GitHub Pages via een GitHub Action.
                </p>
              </div>

              <div className="space-y-2 text-xs">
                <p className="font-semibold text-slate-800">Lokaal testen van de statische productiebuild:</p>
                <div className="bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] space-y-1">
                  <p>npm run build</p>
                  <p>npm run preview</p>
                </div>
                <p className="text-slate-500">
                  De map <code>dist/</code> bevat alle pure statische HTML, CSS en JavaScript bestanden die direct gehost kunnen worden.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-1">
                  Waar pas ik teksten & links aan?
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Alle teksten, naam, talenten, passies, dromen, sprints en OneDrive links staan overzichtelijk gecentreerd in:
                </p>
                <p className="font-mono text-xs font-bold text-emerald-700 bg-white p-2 rounded-lg border border-slate-200 mt-2">
                  src/data/initialData.ts
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs">
                    Huidige Portfolio Data Exporteren (JSON)
                  </span>
                  <button
                    onClick={handleCopyJSON}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Gekopieerd!' : 'Kopieer JSON'}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Handig als je in de browser teksten of links hebt toegevoegd en deze definitief wilt opslaan in je code vóór het committen.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
