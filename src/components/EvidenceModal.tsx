import React from 'react';
import { EvidenceItem, LearningOutcome } from '../types';
import { 
  X, 
  Calendar, 
  ExternalLink, 
  Image as ImageIcon, 
  Video, 
  CheckCircle2, 
  Clock, 
  Check, 
  Tag, 
  Lightbulb, 
  Wrench, 
  Search
} from 'lucide-react';

interface EvidenceModalProps {
  item: EvidenceItem | null;
  learningOutcomes: LearningOutcome[];
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: 'voldoende' | 'in_behandeling' | 'zelfevaluatie_klaar') => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  item,
  learningOutcomes,
  onClose,
  onUpdateStatus,
}) => {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-200 bg-slate-50/70">
          <div className="pr-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md bg-slate-900 text-white text-xs font-bold">
                Sprint {item.sprintId}
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {item.date}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                item.evaluationStatus === 'voldoende' 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {item.evaluationStatus === 'voldoende' ? 'Beoordeling: Voldoende' : 'Status: In behandeling'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {item.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Linked Learning Outcomes Cards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
              Gekoppelde Leeruitkomsten
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {item.learningOutcomeIds.map((luId) => {
                const lu = getLU(luId);
                if (!lu) return null;
                return (
                  <div 
                    key={lu.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      {lu.code}: {lu.title}
                    </div>
                    <p className="text-slate-600 leading-relaxed">
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
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Search className="w-4 h-4 text-emerald-600" />
                Wat heb ik onderzocht?
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {item.investigated}
              </p>
            </div>

            {/* Wat gemaakt */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                <Wrench className="w-4 h-4 text-emerald-600" />
                Wat heb ik gemaakt?
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {item.created}
              </p>
            </div>

            {/* Wat geleerd */}
            <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200">
              <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm mb-2">
                <Lightbulb className="w-4 h-4 text-emerald-700" />
                Wat heb ik geleerd? (Zelfevaluatie & Reflectie)
              </div>
              <p className="text-emerald-950 leading-relaxed whitespace-pre-line">
                {item.learned}
              </p>
            </div>
          </div>

          {/* Media Items Showcase */}
          {item.media && item.media.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Bewijsmateriaal & Media
              </h4>

              <div className="space-y-4">
                {item.media.map((media, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50"
                  >
                    {media.type === 'image' && (
                      <div>
                        <img
                          src={media.url}
                          alt={media.title}
                          className="w-full max-h-96 object-contain bg-slate-900"
                        />
                        <div className="p-3 bg-white border-t border-slate-200">
                          <p className="font-semibold text-slate-900 text-xs sm:text-sm">
                            {media.title}
                          </p>
                          {media.caption && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {media.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {media.type === 'video' && (
                      <div>
                        <div className="aspect-video w-full bg-slate-950 flex items-center justify-center">
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
                        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-rose-500" />
                              {media.title}
                            </p>
                            {media.caption && (
                              <p className="text-xs text-slate-500 mt-0.5">
                                {media.caption}
                              </p>
                            )}
                          </div>
                          <a
                            href={media.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex-shrink-0"
                          >
                            <span>Openen</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {media.type === 'link' && (
                      <div className="p-3.5 bg-white flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {media.title}
                          </p>
                          <p className="text-xs text-slate-500 truncate max-w-sm">
                            {media.url}
                          </p>
                        </div>
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors cursor-pointer"
                        >
                          Openen
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools and Tags */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Gebruikte Tools & Methoden:</span>
            {item.toolsUsed.map((tool, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
              >
                {tool}
              </span>
            ))}
            {item.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer / Assessor Evaluation Toggle */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          {onUpdateStatus ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600">Beoordelingsstatus:</span>
              <button
                onClick={() => onUpdateStatus(item.id, 'voldoende')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  item.evaluationStatus === 'voldoende'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Voldoende
              </button>
              <button
                onClick={() => onUpdateStatus(item.id, 'in_behandeling')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  item.evaluationStatus === 'in_behandeling'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                In Behandeling
              </button>
            </div>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      </div>
    </div>
  );
};
