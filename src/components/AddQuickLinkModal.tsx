import React, { useState } from 'react';
import { EvidenceItem, LearningOutcome, MediaItem } from '../types';
import { X, ExternalLink, Cloud, Video, Github, Layout, Link2, Sparkles, Check } from 'lucide-react';

interface AddQuickLinkModalProps {
  isOpen: boolean;
  sprintId: number;
  learningOutcomes: LearningOutcome[];
  onClose: () => void;
  onAddEvidence: (item: EvidenceItem) => void;
}

export const AddQuickLinkModal: React.FC<AddQuickLinkModalProps> = ({
  isOpen,
  sprintId,
  learningOutcomes,
  onClose,
  onAddEvidence,
}) => {
  if (!isOpen) return null;

  const [targetSprint, setTargetSprint] = useState<number>(sprintId);
  const [platform, setPlatform] = useState<'onedrive' | 'youtube' | 'github' | 'figma' | 'other'>('onedrive');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLUs, setSelectedLUs] = useState<string[]>(['lu1']);

  const toggleLU = (luId: string) => {
    if (selectedLUs.includes(luId)) {
      if (selectedLUs.length > 1) {
        setSelectedLUs(selectedLUs.filter((id) => id !== luId));
      }
    } else {
      setSelectedLUs([...selectedLUs, luId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let mediaType: 'link' | 'video' = 'link';
    if (platform === 'youtube' || url.includes('youtube') || url.includes('youtu.be')) {
      mediaType = 'video';
    }

    const platformNames: Record<string, string> = {
      onedrive: 'OneDrive / SharePoint',
      youtube: 'YouTube Video',
      github: 'GitHub Repository',
      figma: 'Figma / Miro Board',
      other: 'Externe Link',
    };

    const media: MediaItem[] = [
      {
        type: mediaType,
        url: url.trim(),
        title: title.trim(),
        caption: description.trim() || `${platformNames[platform]} voor Sprint ${targetSprint}`,
      },
    ];

    const newItem: EvidenceItem = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      sprintId: Number(targetSprint),
      learningOutcomeIds: selectedLUs,
      date: new Date().toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      investigated: `Deliverable gekoppeld via ${platformNames[platform]}. Bekijk het originele document of de opname via de externe link.`,
      created: description.trim() || `${title.trim()} (${platformNames[platform]})`,
      learned: `Zelfevaluatie en koppeling aan leeruitkomsten (${selectedLUs.map(id => id.toUpperCase()).join(', ')}). Externe opslag via cloud URL conform zero-bloat portfolio richtlijn.`,
      media,
      evaluationStatus: 'voldoende',
      tags: [platformNames[platform], 'Externe Deliverable', `Sprint ${targetSprint}`],
      toolsUsed: [platformNames[platform]],
    };

    onAddEvidence(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleUp border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Externe Link Toevoegen aan Sprint {targetSprint}
              </h3>
              <p className="text-xs text-slate-500">
                Zero-Repo-Bloat: Geen grote bestanden in de git repository
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Type Platform
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlatform('onedrive')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                  platform === 'onedrive'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Cloud className="w-4 h-4 text-blue-600" />
                OneDrive
              </button>

              <button
                type="button"
                onClick={() => setPlatform('youtube')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                  platform === 'youtube'
                    ? 'border-red-500 bg-red-50 text-red-800 ring-2 ring-red-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Video className="w-4 h-4 text-red-600" />
                YouTube Video
              </button>

              <button
                type="button"
                onClick={() => setPlatform('github')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold gap-1.5 transition-all cursor-pointer ${
                  platform === 'github'
                    ? 'border-slate-700 bg-slate-100 text-slate-900 ring-2 ring-slate-700/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <Github className="w-4 h-4 text-slate-800" />
                GitHub Code
              </button>
            </div>
          </div>

          {/* Sprint Selector & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sprint
              </label>
              <select
                value={targetSprint}
                onChange={(e) => setTargetSprint(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-emerald-500 text-xs"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    Sprint {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Titel van de deliverable *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bijv. Onderzoeksrapport Ethische AI (PDF)"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 text-xs"
              />
            </div>
          </div>

          {/* External URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Externe URL (OneDrive / YouTube / GitHub) *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={
                  platform === 'onedrive'
                    ? 'https://hu-my.sharepoint.com/:b:/g/personal/...'
                    : platform === 'youtube'
                    ? 'https://www.youtube.com/watch?v=...'
                    : 'https://github.com/...'
                }
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 text-xs"
              />
              <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {platform === 'onedrive' && 'Zorg dat de OneDrive deellink ingesteld staat op "Iedereen bij HU met de link kan bekijken".'}
              {platform === 'youtube' && 'Mag een openbare of verborgen (unlisted) YouTube video zijn.'}
              {platform === 'github' && 'Link direct naar de repository of de specifieke branch/commit.'}
            </p>
          </div>

          {/* Korte Toelichting */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Korte toelichting (optioneel)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bijv. 10 minuten presentatie over RAG architectuur en benchmarkresultaten."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 text-xs"
            />
          </div>

          {/* Leeruitkomsten Koppeling */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Koppel aan Leeruitkomst(en)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {learningOutcomes.map((lu) => {
                const isSelected = selectedLUs.includes(lu.id);
                return (
                  <button
                    type="button"
                    key={lu.id}
                    onClick={() => toggleLU(lu.id)}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="truncate">{lu.code}: {lu.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Annuleren
            </button>

            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              Link Opslaan in Sprint {targetSprint}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
