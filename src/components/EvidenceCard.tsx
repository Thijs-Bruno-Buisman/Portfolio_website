import React from 'react';
import { EvidenceItem, LearningOutcome } from '../types';
import { 
  Calendar, 
  ExternalLink, 
  Video, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Trash2,
  Cloud,
  Github,
  Link2,
  Pencil,
  FileText
} from 'lucide-react';

interface EvidenceCardProps {
  item: EvidenceItem;
  learningOutcomes: LearningOutcome[];
  onOpenDetails: (item: EvidenceItem) => void;
  onDelete?: (id: string) => void;
  onEdit?: (item: EvidenceItem) => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({
  item,
  learningOutcomes,
  onOpenDetails,
  onDelete,
  onEdit,
}) => {
  const getLU = (id: string) => learningOutcomes.find((lu) => lu.id === id);

  const statusConfig = {
    voldoende: {
      label: 'BEOORDEELD // VOLDOENDE',
      badge: 'bg-[#050505] text-white border-[#050505]',
      icon: CheckCircle,
    },
    in_behandeling: {
      label: 'STATUS // IN BEHANDELING',
      badge: 'bg-[#F4F3EF] text-[#6B6B6B] border-[#D5D5D0]',
      icon: Clock,
    },
    zelfevaluatie_klaar: {
      label: 'STATUS // ZELFEVALUATIE',
      badge: 'bg-white text-[#050505] border-[#050505]',
      icon: Clock,
    },
  }[item.evaluationStatus] || {
    label: 'STATUS // ONBEKEND',
    badge: 'bg-[#F4F3EF] text-[#6B6B6B] border-[#D5D5D0]',
    icon: Clock,
  };

  const StatusIcon = statusConfig.icon;
  const firstImage = item.media.find((m) => m.type === 'image');
  const hasVideo = item.media.some((m) => m.type === 'video');

  return (
    <article className="bg-white border border-[#D5D5D0] hover:border-[#050505] transition-all flex flex-col justify-between group">
      {/* Header & Core Content */}
      <div className="p-6 sm:p-7 pb-4">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#050505] text-white font-mono text-[11px] font-bold uppercase tracking-widest">
              SPRINT 0{item.sprintId}
            </span>
            <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5 font-medium ml-1">
              <Calendar className="w-3.5 h-3.5 text-[#6B6B6B]" />
              {item.date}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[10px] sm:text-[11px] font-semibold border ${statusConfig.badge}`}>
            <StatusIcon className="w-3 h-3 text-[#E32636]" />
            <span>{statusConfig.label}</span>
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetails(item)}
          className="font-display text-xl sm:text-2xl font-black text-[#050505] group-hover:text-[#E32636] transition-colors cursor-pointer leading-snug mb-3.5"
        >
          {item.title}
        </h3>

        {/* Learning Outcome Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {item.learningOutcomeIds.map((luId) => {
            const lu = getLU(luId);
            if (!lu) return null;
            return (
              <span
                key={lu.id}
                title={lu.fullDesc}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono uppercase tracking-wider bg-[#F4F3EF] text-[#050505] border border-[#D5D5D0]"
              >
                <span className="w-1.5 h-1.5 bg-[#E32636]" />
                <span className="font-bold">{lu.code}:</span>
                <span className="text-[#6B6B6B]">{lu.title.split(' ')[0]}</span>
              </span>
            );
          })}
        </div>

        {/* Media Preview (If any) */}
        {firstImage && (
          <div 
            onClick={() => onOpenDetails(item)}
            className="relative overflow-hidden mb-5 bg-[#050505] cursor-pointer max-h-52 border border-[#D5D5D0]"
          >
            <img
              src={firstImage.url}
              alt={firstImage.title}
              className="w-full h-48 object-cover opacity-95 group-hover:opacity-100 group-hover:scale-[1.01] transition-all duration-300"
            />
            {hasVideo && (
              <div className="absolute top-2 right-2 bg-[#050505] text-white px-2 py-1 font-mono text-[10px] tracking-wider uppercase flex items-center gap-1.5 border border-[#1F1F1F]">
                <Video className="w-3 h-3 text-[#E32636]" />
                VIDEO EMBED
              </div>
            )}
            {firstImage.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-[#050505]/90 border-t border-[#1F1F1F] p-2 text-xs font-mono text-[#D5D5D0] truncate">
                {firstImage.caption}
              </div>
            )}
          </div>
        )}

        {/* External Deliverable Links (OneDrive / YouTube / GitHub) */}
        {item.media.filter((m) => m.type === 'link' || m.type === 'video' || m.type === 'file').length > 0 && (
          <div className="mb-5 space-y-1.5">
            {item.media
              .filter((m) => m.type === 'link' || m.type === 'video' || m.type === 'file')
              .map((media, idx) => {
                const isOneDrive = media.url.includes('sharepoint') || media.url.includes('onedrive');
                const isYouTube = media.url.includes('youtube') || media.url.includes('youtu.be') || media.type === 'video';
                const isGitHub = media.url.includes('github');
                const isFile = media.type === 'file';

                return (
                  <a
                    key={idx}
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2.5 bg-[#F4F3EF] hover:bg-white border border-[#D5D5D0] hover:border-[#050505] text-xs transition-colors group/link"
                  >
                    <span className="flex items-center gap-2.5 truncate pr-2 font-mono">
                      {isOneDrive && <Cloud className="w-3.5 h-3.5 text-[#050505] flex-shrink-0" />}
                      {isYouTube && <Video className="w-3.5 h-3.5 text-[#E32636] flex-shrink-0" />}
                      {isGitHub && <Github className="w-3.5 h-3.5 text-[#050505] flex-shrink-0" />}
                      {isFile && <FileText className="w-3.5 h-3.5 text-[#050505] flex-shrink-0" />}
                      {!isOneDrive && !isYouTube && !isGitHub && !isFile && <Link2 className="w-3.5 h-3.5 text-[#050505] flex-shrink-0" />}
                      <span className="font-semibold text-[#050505] truncate group-hover/link:text-[#E32636] text-[11px] uppercase tracking-wide">
                        {media.title || 'Externe Deliverable'}
                      </span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-[#6B6B6B] group-hover/link:text-[#E32636] flex-shrink-0" />
                  </a>
                );
              })}
          </div>
        )}

        {/* The 3 HU Core Pillars: Onderzocht, Gemaakt, Geleerd */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          <div className="bg-[#F4F3EF] p-3.5 border border-[#D5D5D0]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B] block mb-1">
              // 01. ONDERZOEK & ANALYSE
            </span>
            <p className="text-[#050505]/85 line-clamp-3 leading-relaxed text-xs sm:text-sm">
              {item.investigated}
            </p>
          </div>

          <div className="bg-[#F4F3EF] p-3.5 border border-[#D5D5D0]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6B6B6B] block mb-1">
              // 02. ARTIFACTEN & CREATIE
            </span>
            <p className="text-[#050505]/85 line-clamp-3 leading-relaxed text-xs sm:text-sm">
              {item.created}
            </p>
          </div>

          <div className="bg-white p-3.5 border border-[#050505]">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#E32636] block mb-1">
              // 03. INZICHTEN & EVALUATIE
            </span>
            <p className="text-[#050505] line-clamp-3 leading-relaxed text-xs sm:text-sm">
              {item.learned}
            </p>
          </div>
        </div>
      </div>

      {/* Footer of Card */}
      <div className="px-6 py-4 bg-[#F4F3EF] border-t border-[#D5D5D0] flex items-center justify-between gap-3 text-xs">
        {/* Tools & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {item.toolsUsed.slice(0, 3).map((tool, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 bg-white text-[#050505] border border-[#D5D5D0] font-mono text-[10px] uppercase tracking-wider"
            >
              {tool}
            </span>
          ))}
          {item.toolsUsed.length > 3 && (
            <span className="font-mono text-[#6B6B6B] text-[10px]">
              +{item.toolsUsed.length - 3}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="text-[#6B6B6B] hover:text-[#050505] p-1.5 border border-transparent hover:border-[#D5D5D0] transition-colors cursor-pointer"
              title="Dossier bewerken"
              aria-label="Dossier bewerken"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="text-[#6B6B6B] hover:text-[#E32636] p-1.5 border border-transparent hover:border-[#D5D5D0] transition-colors cursor-pointer"
              title="Dossier verwijderen"
              aria-label="Dossier verwijderen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={() => onOpenDetails(item)}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider font-bold text-[#050505] group-hover:text-[#E32636] transition-colors cursor-pointer ml-1"
          >
            <span>DOSSIER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
