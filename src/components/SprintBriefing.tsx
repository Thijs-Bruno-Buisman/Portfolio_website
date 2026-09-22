import React from 'react';
import { Sprint, EvidenceItem } from '../types';
import { 
  Calendar, 
  Terminal, 
  ExternalLink, 
  Video, 
  Github, 
  FileText, 
  Users, 
  MessageSquare 
} from 'lucide-react';

interface SprintBriefingProps {
  sprint: Sprint;
  evidenceItems: EvidenceItem[];
  onOpenEvidenceDetails?: (item: EvidenceItem) => void;
}

export const SprintBriefing: React.FC<SprintBriefingProps> = ({
  sprint,
  evidenceItems,
  onOpenEvidenceDetails,
}) => {
  // Extract external links for current sprint
  const currentSprintItems = evidenceItems.filter((e) => e.sprintId === sprint.id);

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
    <div className="bg-white border border-[#D5D5D0] p-6 sm:p-8 space-y-6 mb-6">
      {/* Header Row */}
      <div className="pb-5 border-b border-[#D5D5D0]">
        <div className="flex flex-wrap items-center gap-2.5 mb-2">
          <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white bg-[#050505] px-2.5 py-0.5">
            Sprint // 0{sprint.id}
          </span>
          <span className="font-mono text-xs text-[#6B6B6B] flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-[#6B6B6B]" />
            Periode: {sprint.period}
          </span>
        </div>
        <h2 className="font-heading font-black text-2xl sm:text-3xl tracking-tight text-[#050505] leading-tight">
          {sprint.title}
        </h2>
        {sprint.focus && (
          <p className="text-xs sm:text-sm text-[#6B6B6B] mt-2 max-w-3xl leading-relaxed font-sans">
            {sprint.focus}
          </p>
        )}
      </div>

      {/* External Deliverables Strip */}
      {sprintExternalLinks.length > 0 && (
        <div className="bg-[#F4F3EF] p-4 border border-[#D5D5D0]">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-4 h-4 text-[#050505]" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
              Gekoppelde Externe Deliverables & Bronnen
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {sprintExternalLinks.map(({ parentItem, media }, idx) => {
              const isYouTube = media.url.includes('youtube') || media.url.includes('youtu.be') || media.type === 'video';
              const isGitHub = media.url.includes('github');

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-2 p-2.5 bg-white border border-[#D5D5D0] text-xs hover:border-[#050505] transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden min-w-0">
                    {isYouTube ? (
                      <Video className="w-3.5 h-3.5 text-[#E32636] flex-shrink-0" />
                    ) : isGitHub ? (
                      <Github className="w-3.5 h-3.5 text-[#050505] flex-shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-[#050505] flex-shrink-0" />
                    )}
                    <span className="font-sans font-medium text-[#050505] truncate">
                      {media.title || parentItem.title}
                    </span>
                  </div>
                  <a
                    href={media.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#6B6B6B] hover:text-[#E32636] flex-shrink-0 transition-colors"
                    title="Open bron"
                    aria-label={`Open ${media.title || 'bron'}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Show & Tell & Assessor Feedback Panels if available */}
      {(sprint.showAndTellSummary || sprint.coachFeedback || sprint.peerFeedback) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sprint.showAndTellSummary && (
            <div className="bg-[#F4F3EF] border border-[#D5D5D0] p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
                    Presentatie & Review
                  </span>
                  {sprint.showAndTellDate && (
                    <span className="font-mono text-[10px] text-[#6B6B6B]">
                      {sprint.showAndTellDate}
                    </span>
                  )}
                </div>
                <h4 className="font-heading font-bold text-sm text-[#050505] mb-2 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#050505]" />
                  Show & Tell Sessie
                </h4>
                <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                  {sprint.showAndTellSummary}
                </p>
              </div>
            </div>
          )}

          {(sprint.coachFeedback || sprint.peerFeedback) && (
            <div className="bg-[#F4F3EF] border border-[#D5D5D0] p-4 flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] block mb-1">
                  Beoordeling & Feedback
                </span>
                <h4 className="font-heading font-bold text-sm text-[#050505] mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#E32636]" />
                  Feedback van Coach & Peers
                </h4>
                {sprint.coachFeedback && (
                  <p className="text-xs text-[#050505] leading-relaxed font-sans mb-2">
                    <strong className="font-bold">Coach:</strong> {sprint.coachFeedback}
                  </p>
                )}
                {sprint.peerFeedback && (
                  <p className="text-xs text-[#6B6B6B] leading-relaxed font-sans">
                    <strong className="font-bold">Peers:</strong> {sprint.peerFeedback}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
