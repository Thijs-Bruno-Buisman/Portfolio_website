import React from 'react';
import { LearningOutcome, EvidenceItem } from '../types';
import { Target, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

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
  // Calculate statistics based on the 5 Learning Outcomes (Total target: 18)
  const totalEvaluationsTarget = learningOutcomes.reduce(
    (acc, lu) => acc + (lu.minEvaluationsRequired || 0),
    0
  ) || 18;
  
  // Count how many times an LU is evaluated / covered
  const totalEvaluationsCurrent = evidenceItems.reduce((acc, item) => {
    return acc + item.learningOutcomeIds.length;
  }, 0);

  const sufficientEvaluationsCurrent = evidenceItems
    .filter((item) => item.evaluationStatus === 'voldoende')
    .reduce((acc, item) => acc + item.learningOutcomeIds.length, 0);

  const progressPercentage = Math.min(
    100,
    Math.round((sufficientEvaluationsCurrent / totalEvaluationsTarget) * 100)
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Target Progress Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Assessment Voortgang
              </span>
              <span className="text-xs text-slate-500 font-medium">
                HU Minor Eis: Minimaal {totalEvaluationsTarget} evaluaties over 5 Leeruitkomsten
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Voortgang op Leeruitkomsten
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Tijdens de minor verzamel je bewijslast verdeeld over de 5 officiële leeruitkomsten. Hieronder zie je de exacte norm per leeruitkomst en jouw actuele voortgang.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 self-start md:self-auto">
            <div className="text-right">
              <span className="text-2xl font-extrabold text-slate-900 block leading-none">
                {sufficientEvaluationsCurrent} <span className="text-sm font-normal text-slate-500">/ {totalEvaluationsTarget}</span>
              </span>
              <span className="text-xs text-slate-500 font-medium mt-1 block">
                Beoordeeld: Voldoende
              </span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 bg-emerald-50 flex items-center justify-center font-bold text-xs text-emerald-800">
              {progressPercentage}%
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="pt-6">
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Totale Voortgang (Voldoende beoordelingen)</span>
            <span>{sufficientEvaluationsCurrent} van {totalEvaluationsTarget} vereiste evaluaties behaald</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Requirements Summary Table / Scorecard */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {learningOutcomes.map((lu) => {
            const currentCount = evidenceItems
              .filter((item) => item.learningOutcomeIds.includes(lu.id) && item.evaluationStatus === 'voldoende')
              .length;
            const target = lu.minEvaluationsRequired || 1;
            const isTargetMet = currentCount >= target;

            return (
              <button
                key={lu.id}
                onClick={() => onSelectLUFilter(lu.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isTargetMet 
                    ? 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/50' 
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1">
                  <span>{lu.code}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                    isTargetMet ? 'bg-emerald-200 text-emerald-900 font-bold' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {currentCount}/{target}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-900 truncate">
                  {lu.title}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Norm: {target}x
                </div>
              </button>
            );
          })}

          <div className="p-2.5 rounded-xl border border-slate-300 bg-slate-900 text-white flex flex-col justify-between">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Totaal
            </div>
            <div className="text-lg font-black text-white leading-none my-1">
              {sufficientEvaluationsCurrent} / {totalEvaluationsTarget}
            </div>
            <div className="text-[10px] text-slate-300">
              18 evaluaties
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
          const sufficientCount = matchingItems.filter(
            (item) => item.evaluationStatus === 'voldoende'
          ).length;
          const target = lu.minEvaluationsRequired || 1;
          const luPercent = Math.min(100, Math.round((sufficientCount / target) * 100));

          return (
            <div
              key={lu.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-bold text-xs">
                      {lu.code}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">
                      {lu.title}
                    </h3>
                  </div>

                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    sufficientCount >= target
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {sufficientCount} / {target} vereist
                  </span>
                </div>

                {/* Progress bar per LU */}
                <div className="mb-3">
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${luPercent}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs font-medium text-emerald-800 mb-3 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100/60">
                  {lu.shortDesc}
                </p>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
                  {lu.fullDesc}
                </p>
              </div>

              {/* Card Footer: Count & Filter Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="text-xs text-slate-500 font-medium">
                  Status: <span className="font-bold text-slate-800">{sufficientCount} voldoende</span> ({matchingItems.length} ingediend)
                </div>

                <button
                  onClick={() => onSelectLUFilter(lu.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
                >
                  Bekijk bewijzen
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
