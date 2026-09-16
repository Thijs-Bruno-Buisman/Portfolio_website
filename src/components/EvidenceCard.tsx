import React from 'react';
import { EvidenceItem, LearningOutcome } from '../types';
import { 
  Calendar, 
  ExternalLink, 
  Image as ImageIcon, 
  Video, 
  Tag, 
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
      label: 'Beoordeeld: Voldoende',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle,
    },
    in_behandeling: {
      label: 'In Behandeling',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: Clock,
    },
    zelfevaluatie_klaar: {
      label: 'Zelfevaluatie Gereed',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Clock,
    },
  }[item.evaluationStatus] || {
    label: 'In Behandeling',
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    icon: Clock,
  };

  const StatusIcon = statusConfig.icon;
  const firstImage = item.media.find((m) => m.type === 'image');
  const hasVideo = item.media.some((m) => m.type === 'video');

  return (
    <article className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
      {/* Header of the Card */}
      <div className="p-5 sm:p-6 pb-4">
        {/* Top Badges Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold tracking-tight">
              Sprint {item.sprintId}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1 font-medium ml-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {item.date}
            </span>
          </div>

          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${statusConfig.bg}`}>
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </div>
        </div>

        {/* Title */}
        <h3 
          onClick={() => onOpenDetails(item)}
          className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer leading-snug mb-3"
        >
          {item.title}
        </h3>

        {/* Learning Outcome Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.learningOutcomeIds.map((luId) => {
            const lu = getLU(luId);
            if (!lu) return null;
            return (
              <span
                key={lu.id}
                title={lu.fullDesc}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="font-bold">{lu.code}:</span> {lu.title}
              </span>
            );
          })}
        </div>

        {/* Media Preview (If any) */}
        {firstImage && (
          <div 
            onClick={() => onOpenDetails(item)}
            className="relative rounded-xl overflow-hidden mb-4 bg-slate-100 cursor-pointer max-h-48 border border-slate-100"
          >
            <img
              src={firstImage.url}
              alt={firstImage.title}
              className="w-full h-44 object-cover group-hover:scale-[1.02] transition-transform duration-300"
            />
            {hasVideo && (
              <div className="absolute top-2 right-2 bg-slate-900/80 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1 backdrop-blur-xs font-medium">
                <Video className="w-3.5 h-3.5 text-rose-400" />
                Video
              </div>
            )}
            {firstImage.caption && (
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-2.5 text-xs text-white truncate">
                {firstImage.caption}
              </div>
            )}
          </div>
        )}

        {/* External Deliverable Links (OneDrive / YouTube / GitHub) */}
        {item.media.filter((m) => m.type === 'link' || m.type === 'video' || m.type === 'file').length > 0 && (
          <div className="mb-4 space-y-1.5">
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
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 text-xs transition-colors group/link"
                  >
                    <span className="flex items-center gap-2 truncate pr-2">
                      {isOneDrive && <Cloud className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                      {isYouTube && <Video className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
                      {isGitHub && <Github className="w-3.5 h-3.5 text-slate-800 flex-shrink-0" />}
                      {isFile && <FileText className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                      {!isOneDrive && !isYouTube && !isGitHub && !isFile && <Link2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
                      <span className="font-semibold text-slate-800 truncate group-hover/link:text-emerald-800">
                        {media.title || 'Externe Deliverable'}
                      </span>
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-400 group-hover/link:text-emerald-700 flex-shrink-0" />
                  </a>
                );
              })}
          </div>
        )}

        {/* The 3 HU Core Pillars: Onderzocht, Gemaakt, Geleerd */}
        <div className="space-y-3 text-xs sm:text-sm">
          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              🔍 Wat heb ik onderzocht?
            </span>
            <p className="text-slate-700 line-clamp-3 leading-relaxed">
              {item.investigated}
            </p>
          </div>

          <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-0.5">
              🛠️ Wat heb ik gemaakt?
            </span>
            <p className="text-slate-700 line-clamp-3 leading-relaxed">
              {item.created}
            </p>
          </div>

          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-100/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-0.5">
              💡 Wat heb ik geleerd?
            </span>
            <p className="text-emerald-950 line-clamp-3 leading-relaxed">
              {item.learned}
            </p>
          </div>
        </div>
      </div>

      {/* Footer of Card */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        {/* Tools & Tags */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
          {item.toolsUsed.slice(0, 3).map((tool, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[11px] font-medium"
            >
              {tool}
            </span>
          ))}
          {item.toolsUsed.length > 3 && (
            <span className="text-slate-400 text-[10px]">
              +{item.toolsUsed.length - 3}
            </span>
          )}
        </div>

        {/* View Details Action */}
        <div className="flex items-center gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(item)}
              className="text-slate-400 hover:text-emerald-700 p-1 rounded transition-colors cursor-pointer"
              title="Bewijs bewerken"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
              title="Bewijs verwijderen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => onOpenDetails(item)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
          >
            Bekijk bewijs
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
