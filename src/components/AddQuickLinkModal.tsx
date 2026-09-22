import React, { useState } from 'react';
import { EvidenceItem, LearningOutcome, MediaItem } from '../types';
import { X, ExternalLink, Cloud, Video, Github, Link2, Check, Terminal } from 'lucide-react';

interface AddQuickLinkModalProps {
  isOpen: boolean;
  sprintId: number;
  learningOutcomes: LearningOutcome[];
  onClose: () => void;
  onAddEvidence: (item: EvidenceItem) => Promise<void>;
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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const toggleLU = (luId: string) => {
    if (selectedLUs.includes(luId)) {
      if (selectedLUs.length > 1) {
        setSelectedLUs(selectedLUs.filter((id) => id !== luId));
      }
    } else {
      setSelectedLUs([...selectedLUs, luId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setIsSaving(true);
    setSaveError(null);
    try {
      await onAddEvidence(newItem);
      onClose();
    } catch {
      setSaveError('Opslaan in Supabase is mislukt. Je invoer is behouden; probeer het opnieuw.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white max-w-lg w-full overflow-hidden border border-[#050505] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F1F1F] bg-[#050505] text-white">
          <div className="flex items-center gap-2.5 font-mono">
            <div className="w-8 h-8 bg-[#E32636] text-white flex items-center justify-center">
              <ExternalLink className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                EXTERNE LINK // SPRINT 0{targetSprint}
              </h3>
              <p className="text-[10px] text-[#D5D5D0] uppercase">
                Zero-Repo-Bloat: Directe cloud-koppeling
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#D5D5D0] hover:text-[#E32636] transition-colors cursor-pointer"
            aria-label="Sluiten"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold text-[#050505] mb-1.5 uppercase tracking-wider">
              // PLATFORM KEUZE
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPlatform('onedrive')}
                className={`flex flex-col items-center justify-center p-2.5 border text-xs uppercase tracking-wider gap-1.5 transition-all cursor-pointer ${
                  platform === 'onedrive'
                    ? 'bg-[#050505] text-white border-[#050505] font-bold'
                    : 'bg-[#F4F3EF] border-[#D5D5D0] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                }`}
              >
                <Cloud className="w-4 h-4" />
                <span>OneDrive</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('youtube')}
                className={`flex flex-col items-center justify-center p-2.5 border text-xs uppercase tracking-wider gap-1.5 transition-all cursor-pointer ${
                  platform === 'youtube'
                    ? 'bg-[#E32636] text-white border-[#E32636] font-bold'
                    : 'bg-[#F4F3EF] border-[#D5D5D0] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>YouTube</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('github')}
                className={`flex flex-col items-center justify-center p-2.5 border text-xs uppercase tracking-wider gap-1.5 transition-all cursor-pointer ${
                  platform === 'github'
                    ? 'bg-[#050505] text-white border-[#050505] font-bold'
                    : 'bg-[#F4F3EF] border-[#D5D5D0] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            </div>
          </div>

          {/* Sprint Selector & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#050505] mb-1 uppercase tracking-wider">
                Sprint
              </label>
              <select
                value={targetSprint}
                onChange={(e) => setTargetSprint(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F4F3EF] border border-[#D5D5D0] font-mono text-xs text-[#050505] outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    Sprint 0{num}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#050505] mb-1 uppercase tracking-wider">
                Titel van de deliverable *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Bijv. Onderzoeksrapport Ethische AI (PDF)"
                className="w-full px-3 py-2 bg-[#F4F3EF] border border-[#D5D5D0] text-xs font-mono text-[#050505] outline-none focus:border-[#050505] focus:bg-white"
              />
            </div>
          </div>

          {/* External URL */}
          <div>
            <label className="block text-xs font-bold text-[#050505] mb-1 uppercase tracking-wider">
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
                className="w-full pl-9 pr-3 py-2 bg-[#F4F3EF] border border-[#D5D5D0] text-xs font-mono text-[#050505] outline-none focus:border-[#050505] focus:bg-white"
              />
              <Link2 className="w-4 h-4 text-[#6B6B6B] absolute left-3 top-2" />
            </div>
          </div>

          {/* Korte Toelichting */}
          <div>
            <label className="block text-xs font-bold text-[#050505] mb-1 uppercase tracking-wider">
              Korte toelichting (optioneel)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Bijv. 10 minuten presentatie over RAG architectuur."
              className="w-full px-3 py-2 bg-[#F4F3EF] border border-[#D5D5D0] text-xs font-mono text-[#050505] outline-none focus:border-[#050505] focus:bg-white"
            />
          </div>

          {/* Leeruitkomsten Koppeling */}
          <div>
            <label className="block text-xs font-bold text-[#050505] mb-1.5 uppercase tracking-wider">
              // KOPPELING AAN LEERUITKOMSTEN
            </label>
            <div className="grid grid-cols-2 gap-2">
              {learningOutcomes.map((lu) => {
                const isSelected = selectedLUs.includes(lu.id);
                return (
                  <button
                    type="button"
                    key={lu.id}
                    onClick={() => toggleLU(lu.id)}
                    className={`flex items-center gap-2 p-2 border text-left text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#050505] text-white border-[#050505] font-bold'
                        : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                    }`}
                  >
                    <div className={`w-3.5 h-3.5 border flex items-center justify-center text-[10px] ${isSelected ? 'border-white text-white' : 'border-[#D5D5D0]'}`}>
                      {isSelected && <Check className="w-2.5 h-2.5" />}
                    </div>
                    <span className="truncate">{lu.code}: {lu.title.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {saveError && <p role="alert" className="p-2.5 bg-[#050505] border border-[#E32636] font-mono text-xs text-[#E32636]">{saveError}</p>}

          {/* Actions */}
          <div className="pt-3 border-t border-[#D5D5D0] flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs uppercase tracking-wider font-mono text-[#6B6B6B] hover:text-[#050505] transition-colors cursor-pointer"
            >
              Annuleren
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 text-xs font-bold text-white bg-[#050505] hover:bg-[#E32636] uppercase tracking-wider font-mono transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isSaving ? 'OPSLAAN...' : `LINK OPSLAAN (SPRINT 0${targetSprint})`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
