import React, { useState } from 'react';
import { EvidenceItem, LearningOutcome, MediaItem } from '../types';
import { X, Layers, RotateCcw, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { EVIDENCE_TEMPLATES, EvidenceTemplate } from '../data/templates';

interface AddEvidenceModalProps {
  isOpen: boolean;
  learningOutcomes: LearningOutcome[];
  onClose: () => void;
  onAddEvidence: (item: EvidenceItem, files?: File[], removedMedia?: MediaItem[]) => Promise<void>;
  defaultSprintId?: number | null;
  initialItem?: EvidenceItem | null;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  learningOutcomes,
  onClose,
  onAddEvidence,
  defaultSprintId,
  initialItem,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState(initialItem?.title ?? '');
  const [sprintId, setSprintId] = useState<number>(initialItem?.sprintId ?? defaultSprintId ?? 1);
  const [selectedLUs, setSelectedLUs] = useState<string[]>(initialItem?.learningOutcomeIds ?? ['lu1']);
  const [investigated, setInvestigated] = useState(initialItem?.investigated ?? '');
  const [created, setCreated] = useState(initialItem?.created ?? '');
  const [learned, setLearned] = useState(initialItem?.learned ?? '');
  const [toolsInput, setToolsInput] = useState(initialItem?.toolsUsed.join(', ') ?? '');
  const [tagsInput, setTagsInput] = useState(initialItem?.tags.join(', ') ?? '');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [activeTemplateName, setActiveTemplateName] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingMedia, setExistingMedia] = useState<MediaItem[]>(initialItem?.media ?? []);
  const [removedMedia, setRemovedMedia] = useState<MediaItem[]>([]);

  const toggleLU = (luId: string) => {
    if (selectedLUs.includes(luId)) {
      if (selectedLUs.length > 1) {
        setSelectedLUs(selectedLUs.filter((id) => id !== luId));
      }
    } else {
      setSelectedLUs([...selectedLUs, luId]);
    }
  };

  const applyTemplate = (tmpl: EvidenceTemplate) => {
    if (!title.trim()) {
      setTitle(tmpl.suggestedTitle);
    }
    setInvestigated(tmpl.investigatedText);
    setCreated(tmpl.createdText);
    setLearned(tmpl.learnedText);
    setSelectedLUs(tmpl.defaultLU);
    setToolsInput(tmpl.suggestedTools);
    setTagsInput(tmpl.suggestedTags);
    setActiveTemplateName(tmpl.name);
  };

  const handleClear = () => {
    setTitle('');
    setInvestigated('');
    setCreated('');
    setLearned('');
    setToolsInput('');
    setTagsInput('');
    setImageUrl('');
    setImageCaption('');
    setVideoUrl('');
    setProjectLink('');
    setActiveTemplateName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const mediaList: MediaItem[] = [...existingMedia];
    if (imageUrl.trim()) {
      mediaList.push({
        type: 'image',
        url: imageUrl.trim(),
        title: title.trim(),
        caption: imageCaption.trim() || undefined,
      });
    }
    if (videoUrl.trim()) {
      mediaList.push({
        type: 'video',
        url: videoUrl.trim(),
        title: `Video demo: ${title.trim()}`,
      });
    }
    if (projectLink.trim()) {
      mediaList.push({
        type: 'link',
        url: projectLink.trim(),
        title: 'Project Repository / Document',
      });
    }

    const newItem: EvidenceItem = {
      id: initialItem?.id ?? `ev-${Date.now()}`,
      title: title.trim(),
      sprintId: Number(sprintId),
      learningOutcomeIds: selectedLUs,
      date: initialItem?.date ?? new Date().toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      investigated: investigated.trim() || 'Onderzoek uitgevoerd naar de impact van de gekozen methodiek.',
      created: created.trim() || 'Documentatie en functioneel artefact geproduceerd.',
      learned: learned.trim() || 'Inzicht opgedaan in de werking en praktische randvoorwaarden.',
      media: mediaList,
      evaluationStatus: initialItem?.evaluationStatus ?? 'in_behandeling',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      toolsUsed: toolsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    setIsSaving(true);
    setSaveError(null);
    try {
      await onAddEvidence(newItem, selectedFiles, removedMedia);
      onClose();
    } catch {
      setSaveError('Opslaan in Supabase is mislukt. Je invoer is behouden; probeer het opnieuw.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#050505]/75 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-[#FFFFFF] border border-[#050505] shadow-2xl overflow-hidden my-6 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Editorial Top Bar */}
        <div className="bg-[#050505] text-[#FFFFFF] px-6 py-4 flex items-center justify-between border-b border-[#050505]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-[#E32636]" />
              <span className="font-mono text-[10px] tracking-widest text-[#D5D5D0] uppercase">
                {initialItem ? '// EDIT EVIDENCE DOSSIER' : '// NEW EVIDENCE REGISTRATION'}
              </span>
            </div>
            <h3 className="font-heading font-black text-lg sm:text-xl tracking-tight text-[#FFFFFF]">
              {initialItem ? 'Bewijsstuk Bewerken' : 'Nieuw Onderzoeksdossier Registreren'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#D5D5D0] hover:text-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-colors cursor-pointer"
            aria-label="Sluit venster"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-sm text-[#050505]">
          {/* Template Selection Drawer */}
          <div className="border border-[#D5D5D0] bg-[#F4F3EF] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#050505]" />
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  Onderzoekssjablonen (Optioneel)
                </span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="font-mono text-[11px] text-[#6B6B6B] hover:text-[#050505] flex items-center gap-1 cursor-pointer transition-colors"
                title="Maak alle velden weer leeg"
              >
                <RotateCcw className="w-3 h-3" />
                Herstel invoer
              </button>
            </div>

            <p className="text-xs text-[#6B6B6B] leading-relaxed">
              Selecteer een sjabloon om gestructureerde vraagstellingen en metadata in te laden:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EVIDENCE_TEMPLATES.map((tmpl) => {
                const isActive = activeTemplateName === tmpl.name;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => applyTemplate(tmpl)}
                    className={`p-2.5 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-[#050505] text-[#FFFFFF] border-[#050505]'
                        : 'bg-[#FFFFFF] text-[#050505] border-[#D5D5D0] hover:border-[#050505]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-xs truncate">
                        {tmpl.name}
                      </span>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider ${
                        isActive
                          ? 'bg-[#E32636] text-[#FFFFFF]'
                          : 'bg-[#F4F3EF] text-[#6B6B6B] border border-[#D5D5D0]'
                      }`}>
                        {tmpl.badge}
                      </span>
                    </div>
                    <span className={`text-[11px] truncate ${
                      isActive ? 'text-[#D5D5D0]' : 'text-[#6B6B6B]'
                    }`}>
                      {tmpl.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {activeTemplateName && (
              <div className="font-mono text-xs text-[#050505] bg-[#FFFFFF] border border-[#D5D5D0] px-3 py-2 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#E32636] shrink-0" />
                <span>
                  Sjabloon <strong className="font-bold">{activeTemplateName}</strong> geladen. Pas de tekst hieronder aan.
                </span>
              </div>
            )}
          </div>

          {/* Dossier Title */}
          <div>
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
              Titel van het Bewijsstuk *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Evaluatie van RAG Architecture & Context Retrieval in Sprint 3"
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] text-sm font-sans"
            />
          </div>

          {/* Sprint & Learning Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                Kies Sprint *
              </label>
              <select
                value={sprintId}
                onChange={(e) => setSprintId(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] font-mono text-xs cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sprint {s < 10 ? `0${s}` : s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                Koppel Leeruitkomst(en) *
              </label>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {learningOutcomes.map((lu) => {
                  const isChecked = selectedLUs.includes(lu.id);
                  return (
                    <button
                      type="button"
                      key={lu.id}
                      onClick={() => toggleLU(lu.id)}
                      className={`px-3 py-1.5 font-mono text-xs tracking-wider border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#050505] text-[#FFFFFF] border-[#050505]'
                          : 'bg-[#FFFFFF] text-[#6B6B6B] border-[#D5D5D0] hover:border-[#050505] hover:text-[#050505]'
                      }`}
                    >
                      {lu.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* The 3 Editorial Questions */}
          <div className="space-y-4 pt-2 border-t border-[#D5D5D0]">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#E32636]">// 01. ONDERZOEK</span>
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  Wat heb ik onderzocht? *
                </label>
              </div>
              <textarea
                required
                rows={3}
                value={investigated}
                onChange={(e) => setInvestigated(e.target.value)}
                placeholder="Beschrijf leervraag, literatuur, modellen of geteste hypotheses..."
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] text-xs sm:text-sm font-sans leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#E32636]">// 02. ARTIFACTEN</span>
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  Wat heb ik gemaakt? *
                </label>
              </div>
              <textarea
                required
                rows={3}
                value={created}
                onChange={(e) => setCreated(e.target.value)}
                placeholder="Beschrijf het concrete artefact: prototype, benchmarking script, prompt library, testmatrix..."
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] text-xs sm:text-sm font-sans leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-mono text-xs font-bold text-[#E32636]">// 03. INZICHTEN</span>
                <label className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  Wat heb ik geleerd? (Reflectie) *
                </label>
              </div>
              <textarea
                required
                rows={3}
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                placeholder="Wat zijn de kernbevindingen? Welke randvoorwaarden werden ontdekt en wat zijn de vervolgstappen?"
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] text-xs sm:text-sm font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Tools & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                Gebruikte Tools (komma-gescheiden)
              </label>
              <input
                type="text"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                placeholder="PyTorch, Cursor, LangChain, Claude 3.5 Sonnet"
                className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505] mb-1.5">
                Onderwerp Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="RAG, Evaluation, Prompt-Engineering"
                className="w-full px-3.5 py-2 bg-[#FFFFFF] border border-[#D5D5D0] focus:border-[#050505] focus:outline-none text-[#050505] font-mono text-xs"
              />
            </div>
          </div>

          {/* Media & Files Upload Section */}
          <div className="pt-4 border-t border-[#D5D5D0] space-y-3">
            <div>
              <span className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                Bestanden & Bewijslast Koppelen
              </span>
              <p className="mt-1 text-xs text-[#6B6B6B]">
                Ondersteuning voor PDF, bronbestanden, afbeeldingen of documentatie (max 50 MB per bestand).
              </p>
            </div>

            {existingMedia.length > 0 && (
              <div className="space-y-2">
                <p className="font-mono text-[11px] font-bold text-[#6B6B6B] uppercase tracking-wider">
                  Reeds gekoppelde artefacten
                </p>
                {existingMedia.map((media, index) => (
                  <div key={media.storagePath ?? `${media.url}-${index}`} className="flex items-center gap-2 border border-[#D5D5D0] bg-[#F4F3EF] p-2.5">
                    <FileText className="h-4 w-4 shrink-0 text-[#050505]" />
                    <input
                      value={media.title}
                      onChange={(event) => setExistingMedia((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))}
                      className="min-w-0 flex-1 border border-[#D5D5D0] bg-[#FFFFFF] px-2.5 py-1 text-xs text-[#050505] font-mono focus:border-[#050505] focus:outline-none"
                      aria-label="Bestandsnaam in portfolio"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setRemovedMedia((items) => [...items, media]);
                        setExistingMedia((items) => items.filter((_, itemIndex) => itemIndex !== index));
                      }}
                      className="p-1 text-[#6B6B6B] hover:text-[#E32636] transition-colors"
                      title="Bestand of link ontkoppelen"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-[#6B6B6B] bg-[#F4F3EF] px-4 py-5 font-mono text-xs uppercase tracking-wider text-[#050505] transition-colors hover:border-[#050505] hover:bg-[#FFFFFF]">
              <Upload className="h-4 w-4 text-[#E32636]" />
              Selecteer bestanden via verkenner
              <input
                type="file"
                multiple
                className="sr-only"
                onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
              />
            </label>

            {selectedFiles.length > 0 && (
              <div className="space-y-1.5">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${file.lastModified}`} className="flex items-center justify-between gap-3 border border-[#D5D5D0] bg-[#FFFFFF] px-3 py-2 font-mono text-xs">
                    <span className="flex min-w-0 items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-[#050505]" />
                      <span className="truncate font-bold text-[#050505]">{file.name}</span>
                      <span className="shrink-0 text-[#6B6B6B]">({(file.size / 1024).toFixed(file.size < 1024 * 1024 ? 0 : 1)} {file.size < 1024 * 1024 ? 'KB' : 'MB'})</span>
                    </span>
                    <button 
                      type="button" 
                      onClick={() => setSelectedFiles((files) => files.filter((_, fileIndex) => fileIndex !== index))} 
                      className="text-[#6B6B6B] hover:text-[#E32636]" 
                      title="Verwijder uit selectie"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {saveError && (
            <div className="p-3 border border-[#E32636] bg-[#E32636]/10 text-[#E32636] text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{saveError}</span>
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#D5D5D0] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider text-[#6B6B6B] hover:text-[#050505] border border-[#D5D5D0] bg-[#FFFFFF] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 text-xs font-mono uppercase tracking-wider text-[#FFFFFF] bg-[#050505] hover:bg-[#E32636] transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Synchroniseren...' : 'Dossier Opslaan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
