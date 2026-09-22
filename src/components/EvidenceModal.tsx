import React, { useState } from 'react';
import { EvidenceItem, LearningOutcome } from '../types';
import { 
  X, 
  Calendar, 
  ExternalLink, 
  Video, 
  CheckCircle2, 
  Clock, 
  Pencil,
  FileText,
  Terminal,
  Search,
  Wrench,
  Lightbulb,
  Link2,
  Cloud,
  Github,
  Share2,
  Check
} from 'lucide-react';

interface EvidenceModalProps {
  item: EvidenceItem | null;
  learningOutcomes: LearningOutcome[];
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: 'voldoende' | 'in_behandeling' | 'zelfevaluatie_klaar') => void;
  onEdit?: (item: EvidenceItem) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  item,
  learningOutcomes,
  onClose,
  onUpdateStatus,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const getLU = (id: string) => learningOutcomes.find((lu) => lu.id === id);

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2] && match[2].length === 11) {
      return `https://www.youtube-nocookie.com/embed/${match[2]}`;
    }
    return url;
  };

  const handleCopyLink = () => {
    const shareUrl = new URL(window.location.href);
    shareUrl.hash = `#sprints?item=${encodeURIComponent(item.id)}`;
    navigator.clipboard.writeText(shareUrl.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#050505]/85 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white border border-[#050505] shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 bg-[#050505] text-white border-b border-[#1F1F1F]">
          <div className="pr-4">
            <div className="flex flex-wrap items-center gap-2.5 mb-2.5">
              <span className="px-2.5 py-0.5 bg-[#E32636] text-white font-mono text-[11px] font-bold uppercase tracking-widest">
                SPRINT 0{item.sprintId}
              </span>
              <span className="font-mono text-xs text-[#D5D5D0] flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#D5D5D0]" />
                {item.date}
              </span>
              <span className="font-mono text-xs text-white uppercase border border-[#1F1F1F] bg-[#1F1F1F] px-2 py-0.5">
                {item.evaluationStatus === 'voldoende' ? 'STATUS // GEREED' : 'STATUS // IN ONTWIKKELING'}
              </span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
              {item.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyLink}
              className="px-2.5 py-1.5 border border-[#1F1F1F] bg-[#1F1F1F] hover:border-white text-white font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Kopieer directe link naar dit dossier"
              aria-label="Kopieer dossier link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#E32636]" />
                  <span>Gekopieerd!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Deel link</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#D5D5D0] hover:text-[#E32636] transition-colors cursor-pointer"
              aria-label="Dossier sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm bg-white">
          {/* Linked Learning Outcomes Cards */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#6B6B6B] mb-3">
              // GEKOPPELDE LEERUITKOMSTEN
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {item.learningOutcomeIds.map((luId) => {
                const lu = getLU(luId);
                if (!lu) return null;
                return (
                  <div 
                    key={lu.id}
                    className="p-3.5 bg-[#F4F3EF] border border-[#D5D5D0] text-xs"
                  >
                    <div className="flex items-center gap-2 font-mono font-bold text-[#050505] mb-1.5 uppercase">
                      <span className="w-2 h-2 bg-[#E32636]" />
                      <span>{lu.code}: {lu.title}</span>
                    </div>
                    <p className="text-[#050505]/80 leading-relaxed font-sans text-xs">
                      {lu.fullDesc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core 3 In-Depth Sections */}
          <div className="space-y-4">
            {/* Wat onderzocht */}
            <div className="bg-[#F4F3EF] p-4 sm:p-5 border border-[#D5D5D0]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#050505] text-xs uppercase tracking-wider mb-2 pb-1 border-b border-[#D5D5D0]">
                <Search className="w-3.5 h-3.5 text-[#050505]" />
                // 01. ONDERZOEK & METHODIEK
              </div>
              <p className="text-[#050505]/85 leading-relaxed whitespace-pre-line text-sm">
                {item.investigated}
              </p>
            </div>

            {/* Wat gemaakt */}
            <div className="bg-[#F4F3EF] p-4 sm:p-5 border border-[#D5D5D0]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#050505] text-xs uppercase tracking-wider mb-2 pb-1 border-b border-[#D5D5D0]">
                <Wrench className="w-3.5 h-3.5 text-[#050505]" />
                // 02. ARTIFACTEN & CREATIE
              </div>
              <p className="text-[#050505]/85 leading-relaxed whitespace-pre-line text-sm">
                {item.created}
              </p>
            </div>

            {/* Wat geleerd */}
            <div className="bg-white p-4 sm:p-5 border-2 border-[#050505]">
              <div className="flex items-center gap-2 font-mono font-bold text-[#E32636] text-xs uppercase tracking-wider mb-2 pb-1 border-b border-[#D5D5D0]">
                <Lightbulb className="w-3.5 h-3.5 text-[#E32636]" />
                // 03. INZICHTEN, ZELFEVALUATIE & REFLECTIE
              </div>
              <p className="text-[#050505] leading-relaxed whitespace-pre-line text-sm">
                {item.learned}
              </p>
            </div>
          </div>

          {/* Media Items Showcase */}
          {item.media && item.media.length > 0 && (
            <div>
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#6B6B6B] mb-3">
                // BEWIJSLAST & MEDIA
              </h4>

              <div className="space-y-4">
                {item.media.map((media, idx) => (
                  <div
                    key={idx}
                    className="border border-[#D5D5D0] overflow-hidden bg-[#050505]"
                  >
                    {media.type === 'image' && (
                      <div>
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full max-h-96 object-contain bg-[#050505]"
                        />
                        <div className="p-3 bg-white border-t border-[#D5D5D0]">
                          <p className="font-display font-bold text-[#050505] text-sm">
                            {media.title}
                          </p>
                          {media.caption && (
                            <p className="font-mono text-xs text-[#6B6B6B] mt-0.5">
                              {media.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {media.type === 'video' && (
                      <div>
                        <div className="aspect-video w-full bg-[#050505] flex items-center justify-center">
                          {media.url.includes('youtube') || media.url.includes('youtu.be') ? (
                            <iframe
                              src={getYouTubeEmbedUrl(media.url)}
                              title={media.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video 
                              src={media.url} 
                              controls 
                              className="w-full h-full"
                            />
                          )}
                        </div>
                        <div className="p-3 bg-white border-t border-[#D5D5D0] flex items-center justify-between gap-3">
                          <div>
                            <p className="font-display font-bold text-[#050505] text-sm flex items-center gap-2">
                              <Video className="w-4 h-4 text-[#E32636]" />
                              {media.title}
                            </p>
                            {media.caption && (
                              <p className="font-mono text-xs text-[#6B6B6B] mt-0.5">
                                {media.caption}
                              </p>
                            )}
                          </div>
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors flex-shrink-0"
                          >
                            <span>Openen</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {media.type === 'link' && (
                      <div className="p-4 bg-white flex items-center justify-between gap-3">
                        <div>
                          <p className="font-display font-bold text-[#050505] text-sm">
                            {media.title}
                          </p>
                          <p className="font-mono text-xs text-[#6B6B6B] truncate max-w-sm mt-0.5">
                            {media.url}
                          </p>
                        </div>
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          <span>Openen</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    {media.type === 'file' && (
                      <div className="p-4 bg-white flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 font-display font-bold text-[#050505] text-sm">
                            <FileText className="h-4 w-4 shrink-0 text-[#050505]" />
                            <span className="truncate">{media.title}</span>
                          </p>
                          {media.size && <p className="mt-0.5 font-mono text-xs text-[#6B6B6B]">{(media.size / 1024 / 1024).toFixed(2)} MB</p>}
                        </div>
                        <a 
                          href={media.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex shrink-0 items-center gap-1.5 bg-[#050505] hover:bg-[#E32636] px-3.5 py-1.5 font-mono text-xs uppercase tracking-wider font-bold text-white transition-colors"
                        >
                          <span>Openen</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools and Tags */}
          <div className="pt-3 border-t border-[#D5D5D0] flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="text-[#6B6B6B] uppercase font-bold">TOOLS:</span>
            {item.toolsUsed.map((tool, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-[#F4F3EF] text-[#050505] border border-[#D5D5D0] text-[11px] uppercase tracking-wider"
              >
                {tool}
              </span>
            ))}
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-white text-[#050505] border border-[#050505] text-[11px] uppercase tracking-wider font-bold"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer / Assessor Evaluation Toggle */}
        <div className="p-4 sm:p-5 border-t border-[#D5D5D0] bg-[#F4F3EF] flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
          {onUpdateStatus ? (
            <div className="flex items-center gap-2">
              <span className="text-[#6B6B6B] uppercase tracking-wider font-bold">BEOORDELING:</span>
              <button
                onClick={() => onUpdateStatus(item.id, 'voldoende')}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  item.evaluationStatus === 'voldoende'
                    ? 'bg-[#050505] text-white border-[#050505] font-bold'
                    : 'bg-white text-[#050505] border-[#D5D5D0] hover:border-[#050505]'
                }`}
              >
                Voldoende
              </button>
              <button
                onClick={() => onUpdateStatus(item.id, 'in_behandeling')}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                  item.evaluationStatus === 'in_behandeling'
                    ? 'bg-[#050505] text-white border-[#050505] font-bold'
                    : 'bg-white text-[#050505] border-[#D5D5D0] hover:border-[#050505]'
                }`}
              >
                In Behandeling
              </button>
            </div>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            {onEdit && (
              <button 
                onClick={() => onEdit(item)} 
                className="inline-flex items-center gap-1.5 border border-[#D5D5D0] hover:border-[#050505] bg-white px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-[#050505] transition-colors cursor-pointer"
              >
                <Pencil className="h-3.5 w-3.5" />
                <span>Bewerken</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#050505] hover:bg-[#E32636] text-white text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
