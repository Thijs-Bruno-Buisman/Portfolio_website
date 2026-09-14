import React, { useState } from 'react';
import { EvidenceItem, LearningOutcome, MediaItem } from '../types';
import { X, Plus, Sparkles, Image, Video, Link as LinkIcon, HelpCircle, RotateCcw } from 'lucide-react';
import { EVIDENCE_TEMPLATES, EvidenceTemplate } from '../data/templates';

interface AddEvidenceModalProps {
  isOpen: boolean;
  learningOutcomes: LearningOutcome[];
  onClose: () => void;
  onAddEvidence: (item: EvidenceItem) => void;
  defaultSprintId?: number | null;
}

export const AddEvidenceModal: React.FC<AddEvidenceModalProps> = ({
  isOpen,
  learningOutcomes,
  onClose,
  onAddEvidence,
  defaultSprintId,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [sprintId, setSprintId] = useState<number>(defaultSprintId || 1);
  const [selectedLUs, setSelectedLUs] = useState<string[]>(['lu1']);
  const [investigated, setInvestigated] = useState('');
  const [created, setCreated] = useState('');
  const [learned, setLearned] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [projectLink, setProjectLink] = useState('');
  const [activeTemplateName, setActiveTemplateName] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const mediaList: MediaItem[] = [];
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
      id: `ev-${Date.now()}`,
      title: title.trim(),
      sprintId: Number(sprintId),
      learningOutcomeIds: selectedLUs,
      date: new Date().toLocaleDateString('nl-NL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      investigated: investigated.trim() || 'Onderzoek uitgevoerd naar de impact van de gekozen methodiek.',
      created: created.trim() || 'Documentatie en functioneel artefact geproduceerd.',
      learned: learned.trim() || 'Inzicht opgedaan in de werking en praktische randvoorwaarden.',
      media: mediaList,
      evaluationStatus: 'in_behandeling',
      tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      toolsUsed: toolsInput.split(',').map((t) => t.trim()).filter(Boolean),
    };

    onAddEvidence(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Nieuw Bewijsstuk Toevoegen
            </h3>
            <p className="text-xs text-slate-500">
              Vul je eigen bevindingen in of kies een sjabloon als invulhulp.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Template Selection Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-950">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Invulsjablonen (optioneel):</span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
                title="Maak alle velden weer leeg"
              >
                <RotateCcw className="w-3 h-3" />
                Velden leegmaken
              </button>
            </div>

            <p className="text-[11px] text-slate-600 leading-snug">
              Klik op een sjabloon om direct handige richtvragen en koppen in de invoervelden te laden:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {EVIDENCE_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => applyTemplate(tmpl)}
                  className={`p-2 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeTemplateName === tmpl.name
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-slate-800 border-emerald-200/70 hover:bg-emerald-100/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-0.5">
                    <span className="font-bold text-xs truncate">
                      {tmpl.name}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      activeTemplateName === tmpl.name
                        ? 'bg-emerald-800 text-emerald-100'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {tmpl.badge}
                    </span>
                  </div>
                  <span className={`text-[10px] truncate ${
                    activeTemplateName === tmpl.name ? 'text-emerald-100' : 'text-slate-500'
                  }`}>
                    {tmpl.description}
                  </span>
                </button>
              ))}
            </div>

            {activeTemplateName && (
              <div className="text-[11px] font-medium text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                <span>
                  Sjabloon <strong>{activeTemplateName}</strong> geladen! Pas de tekst hieronder aan met je eigen ervaring.
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Titel van het bewijsstuk *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Evaluatie van Prompting Frameworks in Sprint 1"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900"
            />
          </div>

          {/* Sprint & Learning Outcomes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kies Sprint *
              </label>
              <select
                value={sprintId}
                onChange={(e) => setSprintId(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900 bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sprint {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Koppel Leeruitkomst(en) *
              </label>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {learningOutcomes.map((lu) => {
                  const isChecked = selectedLUs.includes(lu.id);
                  return (
                    <button
                      type="button"
                      key={lu.id}
                      onClick={() => toggleLU(lu.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {lu.code}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* The 3 HU Questions */}
          <div className="space-y-3 pt-2">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                🔍 Wat heb ik onderzocht? *
              </label>
              <textarea
                required
                rows={2}
                value={investigated}
                onChange={(e) => setInvestigated(e.target.value)}
                placeholder="Beschrijf welke leervraag, literatuur, modellen of casus je hebt verkend..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                🛠️ Wat heb ik gemaakt? *
              </label>
              <textarea
                required
                rows={2}
                value={created}
                onChange={(e) => setCreated(e.target.value)}
                placeholder="Beschrijf het concrete artefact: prototype, prompt library, testmatrix, code..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                💡 Wat heb ik geleerd? (Reflectie) *
              </label>
              <textarea
                required
                rows={2}
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                placeholder="Wat zijn je belangrijkste inzichten? Wat ging goed en wat zou je anders doen?"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900"
              />
            </div>
          </div>

          {/* Tools & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gebruikte Tools (komma-gescheiden)
              </label>
              <input
                type="text"
                value={toolsInput}
                onChange={(e) => setToolsInput(e.target.value)}
                placeholder="ChatGPT, Cursor, Python"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Onderwerp Tags
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="LLM, Ethiek, Prototyping"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-500 text-slate-900"
              />
            </div>
          </div>

          {/* Media Links with Zero-Repo-Bloat Guidance */}
          <div className="pt-2 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="block font-semibold text-slate-800 text-xs uppercase tracking-wider">
                Externe Bronnen & Media (OneDrive, YouTube, etc.)
              </span>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                Geen bestandsgrootte-limieten
              </span>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-normal">
              Omdat GitHub en Vercel strikte bestands- en payloadlimieten hebben, hosten we geen grote bestanden direct in de repository. Plak hieronder directe externe links.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  📄 OneDrive / SharePoint / Drive Document (PDF/Word/Slides)
                </label>
                <input
                  type="url"
                  value={projectLink}
                  onChange={(e) => setProjectLink(e.target.value)}
                  placeholder="https://hu-my.sharepoint.com/... of OneDrive link"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  🎬 Video Demo (YouTube / Loom screencast)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=... of Loom embed"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  🖼️ Screenshot / Afbeelding URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... screenshot URL"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  🏷️ Bijschrift bij afbeelding
                </label>
                <input
                  type="text"
                  value={imageCaption}
                  onChange={(e) => setImageCaption(e.target.value)}
                  placeholder="Korte beschrijving van de screenshot"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-xl text-xs focus:outline-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 font-medium cursor-pointer"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-sm cursor-pointer"
            >
              Bewijs Opslaan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
