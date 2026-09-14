import React from 'react';
import { Sprint, EvidenceItem } from '../types';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  CheckCircle2, 
  Plus, 
  ExternalLink, 
  Cloud, 
  Video, 
  Github, 
  FileText,
  Link2
} from 'lucide-react';

interface SprintNavProps {
  sprints: Sprint[];
  selectedSprintId: number | null; // null means 'Alle Sprints'
  onSelectSprint: (id: number | null) => void;
  evidenceItems?: EvidenceItem[];
  onOpenQuickLinkModal?: (sprintId: number) => void;
  onOpenAddModal?: (sprintId: number) => void;
  onOpenEvidenceDetails?: (item: EvidenceItem) => void;
  isOwner?: boolean;
}

export const SprintNav: React.FC<SprintNavProps> = ({
  sprints,
  selectedSprintId,
  onSelectSprint,
  evidenceItems = [],
  onOpenQuickLinkModal,
  onOpenAddModal,
  onOpenEvidenceDetails,
  isOwner = false,
}) => {
  const currentSprint = sprints.find((s) => s.id === selectedSprintId);

  // Extract external links for current sprint
  const currentSprintItems = selectedSprintId 
    ? evidenceItems.filter((e) => e.sprintId === selectedSprintId)
    : [];

  // Flatten media items that are external links or videos
  const sprintExternalLinks = currentSprintItems.flatMap((item) => {
    return (item.media || [])
      .filter((m) => m.type === 'link' || m.type === 'video')
      .map((m) => ({
        parentItem: item,
        media: m,
      }));
  });

  return (
    <div className="space-y-4">
      {/* Horizontal Sprint Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-2.5 shadow-sm">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            id="sprint-all-btn"
            onClick={() => onSelectSprint(null)}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              selectedSprintId === null
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Alle Sprints (1 - 8)
          </button>

          <div className="h-6 w-px bg-slate-200 mx-1 flex-shrink-0" />

          {sprints.map((sprint) => {
            const isSelected = selectedSprintId === sprint.id;
            const count = evidenceItems.filter((e) => e.sprintId === sprint.id).length;
            return (
              <button
                key={sprint.id}
                id={`sprint-btn-${sprint.id}`}
                onClick={() => onSelectSprint(sprint.id)}
                className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Sprint {sprint.id}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isSelected
                      ? 'bg-emerald-700 text-emerald-100'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {count} {count === 1 ? 'item' : 'items'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Sprint Details & Deliverables Callout */}
      {currentSprint && (
        <div className="bg-gradient-to-br from-emerald-50/50 via-white to-slate-50 rounded-2xl border border-emerald-100 p-5 sm:p-6 shadow-sm animate-fadeIn space-y-5">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-emerald-100/70">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Sprint {currentSprint.id}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {currentSprint.period}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                {currentSprint.title}
              </h3>
              <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {currentSprint.focus}
              </p>
            </div>

            {/* Action buttons for this sprint */}
            {isOwner && (
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                {onOpenQuickLinkModal && (
                  <button
                    id={`add-quick-link-sprint-${currentSprint.id}`}
                    onClick={() => onOpenQuickLinkModal(currentSprint.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    title="Direct een OneDrive of YouTube link toevoegen aan deze sprint"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    + Externe Link toevoegen
                  </button>
                )}

                {onOpenAddModal && (
                  <button
                    onClick={() => onOpenAddModal(currentSprint.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Volledig Bewijs
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Dedicated External Deliverables Bar (Zero-Repo-Bloat) */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Gekoppelde Externe Deliverables & Links (OneDrive / YouTube / GitHub)
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Geen bestanden in repo • directe cloud links
              </span>
            </div>

            {sprintExternalLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {sprintExternalLinks.map(({ parentItem, media }, idx) => {
                  const isOneDrive = media.url.includes('sharepoint') || media.url.includes('onedrive') || parentItem.toolsUsed.includes('OneDrive');
                  const isYouTube = media.url.includes('youtube') || media.url.includes('youtu.be') || media.type === 'video';
                  const isGitHub = media.url.includes('github');

                  return (
                    <div
                      key={idx}
                      className="group flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all text-xs"
                    >
                      <div className="flex items-center gap-2 overflow-hidden min-w-0">
                        {isOneDrive && (
                          <div className="w-7 h-7 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                            <Cloud className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {isYouTube && (
                          <div className="w-7 h-7 rounded-md bg-red-100 text-red-700 flex items-center justify-center flex-shrink-0">
                            <Video className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {isGitHub && (
                          <div className="w-7 h-7 rounded-md bg-slate-800 text-white flex items-center justify-center flex-shrink-0">
                            <Github className="w-3.5 h-3.5" />
                          </div>
                        )}
                        {!isOneDrive && !isYouTube && !isGitHub && (
                          <div className="w-7 h-7 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <Link2 className="w-3.5 h-3.5" />
                          </div>
                        )}

                        <div className="truncate min-w-0">
                          <p className="font-semibold text-slate-900 truncate">
                            {media.title || parentItem.title}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {parentItem.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-md bg-white hover:bg-slate-100 text-slate-600 hover:text-emerald-700 border border-slate-200 transition-colors cursor-pointer"
                          title="Open externe link in nieuw tabblad"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-3 px-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Nog geen externe link geregistreerd voor Sprint {currentSprint.id}.
                </p>
                {onOpenQuickLinkModal && (
                  <button
                    onClick={() => onOpenQuickLinkModal(currentSprint.id)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                  >
                    + Voeg OneDrive of YouTube link toe
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Show & Tell and Feedback row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {currentSprint.showAndTellSummary && (
              <div className="bg-white/90 rounded-xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Users className="w-4 h-4 text-emerald-600" />
                    Show & Tell Uitkomst
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {currentSprint.showAndTellDate}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {currentSprint.showAndTellSummary}
                </p>
              </div>
            )}

            {(currentSprint.peerFeedback || currentSprint.coachFeedback) && (
              <div className="bg-white/90 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Feedback Leerteam & Coach
                </div>
                {currentSprint.peerFeedback && (
                  <p className="text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800">Peers:</span> {currentSprint.peerFeedback}
                  </p>
                )}
                {currentSprint.coachFeedback && (
                  <p className="text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-800">Coach:</span> {currentSprint.coachFeedback}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
