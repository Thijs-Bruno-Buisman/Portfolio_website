import React from 'react';
import { Sprint, EvidenceItem } from '../types';
import { 
  Calendar, 
  Users, 
  MessageSquare, 
  Plus, 
  ExternalLink, 
  Cloud, 
  Video, 
  Github, 
  FileText,
  Link2,
  Terminal
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
      {/* Technical Mission Timeline Bar */}
      <div className="bg-white border border-[#D5D5D0] p-1.5 sm:p-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            id="sprint-all-btn"
            onClick={() => onSelectSprint(null)}
            className={`px-3.5 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
              selectedSprintId === null
                ? 'bg-[#050505] text-white border-[#050505] font-bold'
                : 'text-[#6B6B6B] border-transparent hover:text-[#050505] hover:bg-[#F4F3EF]'
            }`}
          >
            [ ALLE SPRINTS 01 - 08 ]
          </button>

          <div className="h-5 w-px bg-[#D5D5D0] mx-1 flex-shrink-0" />

          {sprints.map((sprint) => {
            const isSelected = selectedSprintId === sprint.id;
            const count = evidenceItems.filter((e) => e.sprintId === sprint.id).length;
            return (
              <button
                key={sprint.id}
                id={`sprint-btn-${sprint.id}`}
                onClick={() => onSelectSprint(sprint.id)}
                className={`group flex items-center gap-2 px-3 py-2 text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                  isSelected
                    ? 'bg-[#050505] text-white border-[#050505] border-b-2 border-b-[#E32636] font-bold'
                    : 'text-[#6B6B6B] border-transparent hover:text-[#050505] hover:bg-[#F4F3EF]'
                }`}
              >
                <span>SPRINT 0{sprint.id}</span>
                <span
                  className={`text-[10px] px-1 py-0.2 rounded-none font-mono ${
                    isSelected
                      ? 'bg-[#E32636] text-white font-bold'
                      : 'bg-[#F4F3EF] text-[#6B6B6B] group-hover:text-[#050505]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Sprint Details & Deliverables Callout */}
      {currentSprint && (
        <div className="bg-white border border-[#D5D5D0] p-6 sm:p-8 space-y-6">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#D5D5D0]">
            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white bg-[#050505] px-2.5 py-0.5">
                  MISSION SPRINT // 0{currentSprint.id}
                </span>
                <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#6B6B6B]" />
                  PERIODE: {currentSprint.period}
                </span>
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-[#050505] leading-tight">
                {currentSprint.title}
              </h3>
              <p className="text-sm text-[#050505]/80 mt-2 max-w-3xl leading-relaxed">
                {currentSprint.focus}
              </p>
            </div>

            {/* Action buttons for this sprint */}
            {isOwner && (
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto flex-shrink-0">
                {onOpenQuickLinkModal && (
                  <button
                    id={`add-quick-link-sprint-${currentSprint.id}`}
                    onClick={() => onOpenQuickLinkModal(currentSprint.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    title="Direct een OneDrive of YouTube link toevoegen aan deze sprint"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Externe Link</span>
                  </button>
                )}

                {onOpenAddModal && (
                  <button
                    onClick={() => onOpenAddModal(currentSprint.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-transparent hover:bg-[#F4F3EF] text-[#050505] border border-[#D5D5D0] hover:border-[#050505] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#6B6B6B]" />
                    <span>Volledig Bewijs</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Dedicated External Deliverables Bar (Zero-Repo-Bloat) */}
          <div className="bg-[#F4F3EF] p-4 border border-[#D5D5D0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#050505]" />
                <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                  GEKOPPELDE CLOUD DELIVERABLES // ONEDRIVE, GITHUB & VIDEO
                </h4>
              </div>
              <span className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wider">
                Directe live links // zero-repo storage
              </span>
            </div>

            {sprintExternalLinks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {sprintExternalLinks.map(({ parentItem, media }, idx) => {
                  const isOneDrive = media.url.includes('sharepoint') || media.url.includes('onedrive') || parentItem.toolsUsed.includes('OneDrive');
                  const isYouTube = media.url.includes('youtube') || media.url.includes('youtu.be') || media.type === 'video';
                  const isGitHub = media.url.includes('github');

                  return (
                    <div
                      key={idx}
                      className="group flex items-center justify-between gap-2.5 p-3 bg-white border border-[#D5D5D0] hover:border-[#050505] transition-all text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
                        {isOneDrive && (
                          <div className="w-7 h-7 bg-[#050505] text-white flex items-center justify-center flex-shrink-0">
                            <Cloud className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        {isYouTube && (
                          <div className="w-7 h-7 bg-[#E32636] text-white flex items-center justify-center flex-shrink-0">
                            <Video className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        {isGitHub && (
                          <div className="w-7 h-7 bg-[#050505] text-white flex items-center justify-center flex-shrink-0">
                            <Github className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                        {!isOneDrive && !isYouTube && !isGitHub && (
                          <div className="w-7 h-7 bg-[#050505] text-white flex items-center justify-center flex-shrink-0">
                            <Link2 className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}

                        <div className="truncate min-w-0">
                          <p className="font-display font-bold text-[#050505] truncate">
                            {media.title || parentItem.title}
                          </p>
                          <p className="font-mono text-[10px] text-[#6B6B6B] uppercase tracking-wide truncate">
                            {parentItem.title}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        <a
                          href={media.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 border border-[#D5D5D0] hover:border-[#050505] text-[#050505] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
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
              <div className="py-4 px-4 bg-white border border-dashed border-[#D5D5D0] text-center flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="font-mono text-xs text-[#6B6B6B] uppercase tracking-wide">
                  Geen externe links geregistreerd voor Sprint 0{currentSprint.id}.
                </p>
                {onOpenQuickLinkModal && (
                  <button
                    onClick={() => onOpenQuickLinkModal(currentSprint.id)}
                    className="font-mono text-xs uppercase tracking-wider text-[#050505] hover:text-[#E32636] font-bold cursor-pointer transition-colors"
                  >
                    + Externe Link toevoegen
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Show & Tell and Feedback row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            {currentSprint.showAndTellSummary && (
              <div className="bg-[#F4F3EF] p-4 sm:p-5 border border-[#D5D5D0]">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#D5D5D0]">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
                    <Users className="w-3.5 h-3.5 text-[#050505]" />
                    SHOW & TELL BEVINDING
                  </div>
                  <span className="font-mono text-[10px] font-medium text-[#6B6B6B]">
                    {currentSprint.showAndTellDate}
                  </span>
                </div>
                <p className="text-[#050505]/80 leading-relaxed text-xs sm:text-sm">
                  {currentSprint.showAndTellSummary}
                </p>
              </div>
            )}

            {(currentSprint.peerFeedback || currentSprint.coachFeedback) && (
              <div className="bg-[#F4F3EF] p-4 sm:p-5 border border-[#D5D5D0] space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#050505] pb-2 border-b border-[#D5D5D0]">
                  <MessageSquare className="w-3.5 h-3.5 text-[#050505]" />
                  FEEDBACK PEERS & COACH
                </div>
                {currentSprint.peerFeedback && (
                  <p className="text-[#050505]/80 leading-relaxed text-xs sm:text-sm">
                    <span className="font-mono uppercase font-bold text-[11px] text-[#050505] tracking-wider mr-1.5">PEERS:</span>
                    {currentSprint.peerFeedback}
                  </p>
                )}
                {currentSprint.coachFeedback && (
                  <p className="text-[#050505]/80 leading-relaxed text-xs sm:text-sm">
                    <span className="font-mono uppercase font-bold text-[11px] text-[#050505] tracking-wider mr-1.5">COACH:</span>
                    {currentSprint.coachFeedback}
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
