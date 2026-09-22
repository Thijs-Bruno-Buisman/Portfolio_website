import React from 'react';
import { LearningOutcome, EvidenceItem } from '../types';
import { ArrowRight, Info } from 'lucide-react';

interface LearningOutcomesOverviewProps {
  learningOutcomes: LearningOutcome[];
  evidenceItems: EvidenceItem[];
  onSelectLUFilter: (luId: string) => void;
}

export const LearningOutcomesOverview: React.FC<LearningOutcomesOverviewProps> = ({
  learningOutcomes,
  evidenceItems,
  onSelectLUFilter,
}) => {
  // Richtlijn: 18 gekoppelde bewijsstukken verdeeld over de 5 Leeruitkomsten
  const totalEvaluationsTarget = learningOutcomes.reduce(
    (acc, lu) => acc + (lu.minEvaluationsRequired || 0),
    0
  ) || 18;
  
  // Aantal gekoppelde bewijsstukken (telt iedere toewijzing aan een LU)
  const totalLinkedCurrent = evidenceItems.reduce((acc, item) => {
    return acc + item.learningOutcomeIds.length;
  }, 0);

  const coveragePercentage = Math.min(
    100,
    Math.round((totalLinkedCurrent / totalEvaluationsTarget) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Assessment Matrix Dashboard Banner */}
      <div className="bg-white border border-[#D5D5D0] p-6 sm:p-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#D5D5D0]">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-white bg-[#050505] px-2.5 py-0.5">
                BEWIJSDEKKING // HU MINOR RICHTLIJN
              </span>
              <span className="font-mono text-xs text-[#6B6B6B]">
                Richtlijn: Minimaal {totalEvaluationsTarget} gekoppelde bewijzen over 5 Leeruitkomsten
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#050505] tracking-tight">
              Kwantitatieve Bewijsdekking per Leeruitkomst
            </h2>
            <p className="text-[#050505]/80 text-sm mt-2 max-w-2xl leading-relaxed">
              Tijdens de minor verzamel je methodische bewijslast verdeeld over de 5 officiële leeruitkomsten van de Hogeschool Utrecht. Onderstaand overzicht toont hoeveel bewijsstukken er tot nu toe per leeruitkomst zijn gekoppeld ten opzichte van de richtlijn (totaal 18).
            </p>
          </div>

          <div className="flex items-center gap-5 bg-[#F4F3EF] p-5 border border-[#D5D5D0] self-start md:self-auto font-mono">
            <div className="text-right">
              <span className="text-3xl font-black text-[#050505] block leading-none">
                {totalLinkedCurrent} <span className="text-sm font-normal text-[#6B6B6B]">/ {totalEvaluationsTarget}</span>
              </span>
              <span className="text-[11px] text-[#6B6B6B] uppercase tracking-wider mt-1 block">
                Gekoppelde Dossiers
              </span>
            </div>
            <div className="w-16 h-14 bg-[#050505] text-white flex flex-col items-center justify-center font-bold border border-[#050505]">
              <span className="text-sm text-[#E32636] leading-none">{coveragePercentage}%</span>
              <span className="text-[9px] text-[#D5D5D0] uppercase tracking-wider">DEKKING</span>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="pt-6">
          <div className="flex justify-between font-mono text-xs text-[#6B6B6B] mb-2 uppercase tracking-wide flex-wrap gap-2">
            <span>KWANTITATIEVE BEWIJSDEKKING</span>
            <span>{totalLinkedCurrent} VAN {totalEvaluationsTarget} DOSSIERS GEKOPPELD ({coveragePercentage}%)</span>
          </div>
          <div className="w-full bg-[#F4F3EF] h-2.5 border border-[#D5D5D0]">
            <div
              className="bg-[#050505] h-full transition-all duration-500"
              style={{ width: `${coveragePercentage}%` }}
            />
          </div>

          {/* Explicit pedagogical notice about what coverage represents */}
          <div className="mt-4 p-3 bg-[#F4F3EF] border-l-2 border-[#050505] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#050505] flex-shrink-0 mt-0.5" />
            <p className="font-mono text-xs text-[#050505]/80 leading-relaxed">
              <strong>Toelichting bewijsdekking:</strong> Dit percentage toont uitsluitend de kwantitatieve spreiding van ingeleverde dossiers over de 5 leeruitkomsten. Dit is een administratieve richtlijn en vormt geen docentoordeel of beheersingsniveau.
            </p>
          </div>
        </div>

        {/* Requirements Summary Matrix */}
        <div className="mt-8 pt-6 border-t border-[#D5D5D0] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {learningOutcomes.map((lu) => {
            const currentCount = evidenceItems
              .filter((item) => item.learningOutcomeIds.includes(lu.id))
              .length;
            const target = lu.minEvaluationsRequired || 1;
            const isTargetMet = currentCount >= target;

            return (
              <button
                key={lu.id}
                onClick={() => onSelectLUFilter(lu.id)}
                className={`p-3 border text-left transition-all cursor-pointer font-mono ${
                  isTargetMet 
                    ? 'bg-white border-[#050505] hover:border-[#E32636]' 
                    : 'bg-[#F4F3EF] border-[#D5D5D0] hover:border-[#050505]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-[#050505]">{lu.code}</span>
                  <span className={`text-[10px] px-1 py-0.2 ${
                    isTargetMet ? 'bg-[#050505] text-white' : 'bg-white border border-[#D5D5D0] text-[#6B6B6B]'
                  }`}>
                    {currentCount}/{target}
                  </span>
                </div>
                <div className="font-display text-xs font-bold text-[#050505] truncate">
                  {lu.title}
                </div>
                <div className="text-[10px] text-[#6B6B6B] mt-1 uppercase">
                  RICHTLIJN: {target}X
                </div>
              </button>
            );
          })}

          <div className="p-3 bg-[#050505] text-white border border-[#050505] flex flex-col justify-between font-mono">
            <div className="text-[10px] font-bold text-[#D5D5D0] uppercase tracking-wider">
              TOTAAL
            </div>
            <div className="text-xl font-black text-white leading-none my-1">
              {totalLinkedCurrent} / {totalEvaluationsTarget}
            </div>
            <div className="text-[10px] text-[#E32636] uppercase tracking-wider font-bold">
              18 RICHTLIJN
            </div>
          </div>
        </div>
      </div>

      {/* Grid of 5 Learning Outcomes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningOutcomes.map((lu) => {
          const matchingItems = evidenceItems.filter((item) =>
            item.learningOutcomeIds.includes(lu.id)
          );
          const linkedCount = matchingItems.length;
          const target = lu.minEvaluationsRequired || 1;
          const luPercent = Math.min(100, Math.round((linkedCount / target) * 100));

          return (
            <div
              key={lu.id}
              className="bg-white border border-[#D5D5D0] hover:border-[#050505] p-6 sm:p-7 flex flex-col justify-between transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 bg-[#050505] text-white font-mono font-bold text-xs uppercase tracking-widest">
                      {lu.code}
                    </span>
                    <h3 className="font-display text-lg font-bold text-[#050505]">
                      {lu.title}
                    </h3>
                  </div>

                  <span className={`font-mono text-[11px] px-2 py-0.5 border ${
                    linkedCount >= target
                      ? 'bg-[#050505] text-white border-[#050505] font-bold'
                      : 'bg-[#F4F3EF] text-[#6B6B6B] border-[#D5D5D0]'
                  }`}>
                    {linkedCount} / {target}
                  </span>
                </div>

                {/* Progress bar per LU */}
                <div className="mb-4">
                  <div className="w-full bg-[#F4F3EF] h-1.5 border border-[#D5D5D0]">
                    <div
                      className="bg-[#050505] h-full transition-all duration-300"
                      style={{ width: `${luPercent}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs font-mono text-[#050505] mb-4 bg-[#F4F3EF] p-3 border-l-2 border-[#E32636]">
                  {lu.shortDesc}
                </div>

                <p className="text-[#050505]/80 text-xs sm:text-sm leading-relaxed mb-6">
                  {lu.fullDesc}
                </p>
              </div>

              {/* Card Footer: Count & Filter Action */}
              <div className="pt-4 border-t border-[#D5D5D0] flex items-center justify-between font-mono text-xs">
                <div className="text-[#6B6B6B]">
                  BEWIJSLAST: <strong className="text-[#050505]">{linkedCount} DOSSIER{linkedCount === 1 ? '' : 'S'}</strong>
                </div>

                <button
                  onClick={() => onSelectLUFilter(lu.id)}
                  className="inline-flex items-center gap-1.5 font-bold text-[#050505] hover:text-[#E32636] uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>BEKIJK DOSSIERS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
