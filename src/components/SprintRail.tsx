import React from 'react';
import { Sprint, EvidenceItem } from '../types';
import { Calendar, Plus, Layers, Filter } from 'lucide-react';

interface SprintRailProps {
  sprints: Sprint[];
  selectedSprintId: number | null;
  onSelectSprint: (id: number | null) => void;
  evidenceItems: EvidenceItem[];
  isOwner?: boolean;
  onOpenQuickLinkModal?: (sprintId: number) => void;
  onOpenAddModal?: (sprintId: number) => void;
}

export const SprintRail: React.FC<SprintRailProps> = ({
  sprints,
  selectedSprintId,
  onSelectSprint,
  evidenceItems,
  isOwner = false,
  onOpenQuickLinkModal,
  onOpenAddModal,
}) => {
  return (
    <aside 
      aria-label="Sprintnavigatie en Tijdlijn"
      className="w-full lg:w-72 flex-shrink-0"
    >
      {/* Mobile & Tablet Accessible Selector (<select> without forced horizontal swipe) */}
      <div className="lg:hidden bg-white border border-[#D5D5D0] p-4 mb-4">
        <label 
          htmlFor="mobile-sprint-select"
          className="block font-mono text-xs font-bold uppercase tracking-wider text-[#050505] mb-2 flex items-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-[#E32636]" />
          Kies Sprint Tijdlijn
        </label>
        <select
          id="mobile-sprint-select"
          value={selectedSprintId === null ? 'all' : selectedSprintId}
          onChange={(e) => onSelectSprint(e.target.value === 'all' ? null : Number(e.target.value))}
          className="w-full px-3 py-2.5 bg-[#F4F3EF] border border-[#D5D5D0] font-mono text-xs text-[#050505] focus:outline-none focus:border-[#050505] cursor-pointer"
        >
          <option value="all">
            [ Alle Sprints 01 t/m 08 ] ({evidenceItems.length} dossiers)
          </option>
          {sprints.map((sprint) => {
            const count = evidenceItems.filter((e) => e.sprintId === sprint.id).length;
            return (
              <option key={sprint.id} value={sprint.id}>
                Sprint 0{sprint.id}: {sprint.title} ({count} bewijzen)
              </option>
            );
          })}
        </select>
      </div>

      {/* Desktop Vertical Command Rail (Sticky) */}
      <div className="hidden lg:block sticky top-24 bg-white border border-[#D5D5D0] divide-y divide-[#D5D5D0]">
        {/* Rail Header */}
        <div className="p-4 bg-[#F4F3EF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#050505]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505]">
              Sprint Navigatie
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#6B6B6B] uppercase">
            8 Sprints
          </span>
        </div>

        {/* All Sprints Button */}
        <button
          onClick={() => onSelectSprint(null)}
          className={`w-full text-left p-3.5 font-mono text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-between border-l-4 ${
            selectedSprintId === null
              ? 'bg-[#050505] text-white border-l-[#E32636]'
              : 'text-[#6B6B6B] hover:text-[#050505] hover:bg-[#F4F3EF] border-l-transparent'
          }`}
        >
          <span className="font-bold">[ Alle Sprints ]</span>
          <span className={`text-[10px] px-1.5 py-0.5 font-mono ${
            selectedSprintId === null ? 'bg-[#E32636] text-white' : 'bg-[#F4F3EF] text-[#6B6B6B]'
          }`}>
            {evidenceItems.length}
          </span>
        </button>

        {/* Vertical Sprint Buttons 01 to 08 */}
        <div className="divide-y divide-[#D5D5D0]">
          {sprints.map((sprint) => {
            const isSelected = selectedSprintId === sprint.id;
            const count = evidenceItems.filter((e) => e.sprintId === sprint.id).length;
            return (
              <button
                key={sprint.id}
                onClick={() => onSelectSprint(sprint.id)}
                className={`w-full text-left p-3.5 transition-all cursor-pointer flex flex-col gap-1 border-l-4 ${
                  isSelected
                    ? 'bg-[#050505] text-white border-l-[#E32636]'
                    : 'text-[#050505] hover:bg-[#F4F3EF] border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-mono text-xs font-bold tracking-wider ${
                    isSelected ? 'text-white' : 'text-[#050505]'
                  }`}>
                    Sprint 0{sprint.id}
                  </span>
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 ${
                    isSelected ? 'bg-[#E32636] text-white font-bold' : 'bg-[#F4F3EF] text-[#6B6B6B]'
                  }`}>
                    {count} {count === 1 ? 'dossier' : 'dossiers'}
                  </span>
                </div>

                <span className={`text-xs font-heading font-medium truncate ${
                  isSelected ? 'text-[#D5D5D0]' : 'text-[#6B6B6B]'
                }`}>
                  {sprint.title}
                </span>

                <span className={`font-mono text-[10px] flex items-center gap-1 ${
                  isSelected ? 'text-[#A0A09C]' : 'text-[#6B6B6B]'
                }`}>
                  <Calendar className="w-3 h-3" />
                  {sprint.period}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls for Owner */}
        {isOwner && selectedSprintId !== null && (
          <div className="p-3 bg-[#F4F3EF] space-y-2">
            <span className="font-mono text-[10px] uppercase text-[#6B6B6B] block">
              Beheer Sprint 0{selectedSprintId}
            </span>
            <div className="flex flex-col gap-1.5">
              {onOpenQuickLinkModal && (
                <button
                  onClick={() => onOpenQuickLinkModal(selectedSprintId)}
                  className="w-full text-center px-3 py-1.5 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  + Externe Link
                </button>
              )}
              {onOpenAddModal && (
                <button
                  onClick={() => onOpenAddModal(selectedSprintId)}
                  className="w-full text-center px-3 py-1.5 bg-white hover:bg-[#F4F3EF] text-[#050505] border border-[#D5D5D0] font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  + Volledig Bewijs
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
