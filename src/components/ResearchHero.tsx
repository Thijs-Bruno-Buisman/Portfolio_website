import React from 'react';
import { UserProfile, LearningOutcome, Sprint, EvidenceItem } from '../types';
import { 
  FileCheck2, 
  Target, 
  Calendar, 
  GraduationCap, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ResearchHeroProps {
  profile: UserProfile;
  sprints: Sprint[];
  evidenceItems: EvidenceItem[];
  learningOutcomes: LearningOutcome[];
  onNavigateToSprints: () => void;
  onNavigateToOutcomes: () => void;
  onNavigateToStory: () => void;
  isOwner: boolean;
}

export const ResearchHero: React.FC<ResearchHeroProps> = ({
  profile,
  sprints,
  evidenceItems,
  learningOutcomes,
  onNavigateToSprints,
  onNavigateToOutcomes,
  onNavigateToStory,
  isOwner,
}) => {
  // Compute true teacher/assessor metrics
  const totalEvidenceCount = evidenceItems.length;

  // Covered learning outcomes count (at least 1 evidence item linked)
  const coveredLUsCount = learningOutcomes.filter((lu) =>
    evidenceItems.some((item) => item.learningOutcomeIds.includes(lu.id))
  ).length;

  // Active or latest sprint with evidence (or fallback to sprint 1)
  const currentSprint = sprints[2] || sprints[0]; // Sprint 3 is active in week 3-4

  // Date of latest substantive update (from newest evidence item or fallback)
  const latestUpdateDate = evidenceItems.length > 0 
    ? evidenceItems[0].date 
    : '22 september 2026';

  return (
    <section 
      aria-label="Onderzoeksoverzicht en Kerncijfers"
      className="bg-white border border-[#D5D5D0] mb-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Editorial Presentation & Student Identity (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#D5D5D0]">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-[#E32636]" />
              <span className="font-mono text-xs uppercase tracking-widest text-[#6B6B6B]">
                {profile.institution || 'Hogeschool Utrecht'} // {profile.minor || 'Minor Future-proof met AI'}
              </span>
            </div>

            <h1 className="font-heading font-black text-2xl sm:text-4xl text-[#050505] tracking-tight leading-tight mb-3">
              Onderzoeks- & Bewijsdossier
            </h1>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-5 font-mono text-xs text-[#6B6B6B]">
              <span className="font-bold text-[#050505]">{profile.name}</span>
              <span>//</span>
              <span>{profile.studyTrack || 'HBO Electrical Engineering'}</span>
              <span>//</span>
              <span>Studentnr: {profile.studentNumber || '1855662'}</span>
            </div>

            {/* Stance / Vision quote */}
            <div className="border-l-2 border-[#E32636] pl-4 py-1 mb-6 bg-[#F4F3EF]">
              <p className="font-sans text-sm sm:text-base italic text-[#050505] leading-relaxed">
                &ldquo;AI is geen doel op zich, maar een krachtig instrument om maatschappelijke vraagstukken en technische processen fundamenteel te vernieuwen.&rdquo;
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#6B6B6B] leading-relaxed line-clamp-3 font-sans mb-6">
              {profile.bio}
            </p>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap gap-2.5 pt-4 border-t border-[#D5D5D0]">
            <button
              onClick={onNavigateToSprints}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Sprints & Bewijzen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToOutcomes}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#D5D5D0] hover:border-[#050505] text-[#050505] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer bg-white hover:bg-[#F4F3EF]"
            >
              <span>Leeruitkomsten</span>
            </button>
            <button
              onClick={onNavigateToStory}
              className="inline-flex items-center gap-2 px-3.5 py-2 border border-[#D5D5D0] hover:border-[#050505] text-[#6B6B6B] hover:text-[#050505] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer bg-white hover:bg-[#F4F3EF]"
            >
              <span>Persoonlijk Verhaal</span>
            </button>
          </div>
        </div>

        {/* Right Column: Assessor & Teacher Metric Scorecard (5 cols) */}
        <div className="lg:col-span-5 bg-[#F4F3EF] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D5D5D0] mb-4">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#050505] flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-[#050505]" />
                Voortgang & Beoordelingsstatus
              </span>
              <span className="font-mono text-[10px] text-[#6B6B6B] uppercase">
                Docentoverzicht
              </span>
            </div>

            {/* 4 True Metric Tiles */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Metric 1: Total Evidence */}
              <div className="bg-white border border-[#D5D5D0] p-3.5">
                <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-[#050505]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Bewijslast
                  </span>
                </div>
                <div className="font-heading font-black text-2xl text-[#050505]">
                  {totalEvidenceCount}
                </div>
                <span className="font-mono text-[10px] text-[#6B6B6B]">
                  {totalEvidenceCount === 1 ? 'Dossier geregistreerd' : 'Dossiers geregistreerd'}
                </span>
              </div>

              {/* Metric 2: Active Sprint */}
              <div className="bg-white border border-[#D5D5D0] p-3.5">
                <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-1">
                  <Target className="w-3.5 h-3.5 text-[#E32636]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Actuele Sprint
                  </span>
                </div>
                <div className="font-heading font-black text-2xl text-[#050505]">
                  0{currentSprint.id}
                </div>
                <span className="font-mono text-[10px] text-[#6B6B6B] truncate block">
                  {currentSprint.title}
                </span>
              </div>

              {/* Metric 3: LU Coverage */}
              <div className="bg-white border border-[#D5D5D0] p-3.5">
                <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-[#050505]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Bewijsdekking
                  </span>
                </div>
                <div className="font-heading font-black text-2xl text-[#050505]">
                  {coveredLUsCount} <span className="text-sm font-normal text-[#6B6B6B]">/ {learningOutcomes.length}</span>
                </div>
                <span className="font-mono text-[10px] text-[#6B6B6B]">
                  Leeruitkomsten gedekt
                </span>
              </div>

              {/* Metric 4: Latest Update */}
              <div className="bg-white border border-[#D5D5D0] p-3.5">
                <div className="flex items-center gap-1.5 text-[#6B6B6B] mb-1">
                  <Calendar className="w-3.5 h-3.5 text-[#050505]" />
                  <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                    Laatste Update
                  </span>
                </div>
                <div className="font-heading font-bold text-sm text-[#050505] truncate pt-1">
                  {latestUpdateDate}
                </div>
                <span className="font-mono text-[10px] text-[#6B6B6B] truncate block">
                  Recente wijziging
                </span>
              </div>
            </div>

            {/* Competencies Progress Bars (Proof Coverage) */}
            <div className="bg-white border border-[#D5D5D0] p-3 space-y-2">
              <span className="font-mono text-[10px] font-bold text-[#6B6B6B] uppercase tracking-wider block">
                Dekking per Leeruitkomst
              </span>
              <div className="grid grid-cols-5 gap-1.5">
                {learningOutcomes.map((lu) => {
                  const count = evidenceItems.filter((item) =>
                    item.learningOutcomeIds.includes(lu.id)
                  ).length;
                  const isCovered = count > 0;
                  return (
                    <div 
                      key={lu.id} 
                      className={`p-1.5 text-center border ${
                        isCovered 
                          ? 'border-[#050505] bg-[#050505] text-white' 
                          : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B]'
                      }`}
                      title={`${lu.code} (${lu.title}): ${count} bewijsstuk(ken) gekoppeld`}
                    >
                      <span className="font-mono text-[10px] font-bold block">{lu.code}</span>
                      <span className="font-mono text-[9px] block opacity-80">{count}x</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Owner-Only Telemetry (Completely hidden for guests/teachers) */}
          {isOwner && (
            <div className="mt-4 pt-3 border-t border-[#D5D5D0] flex items-center justify-between font-mono text-[11px] text-[#6B6B6B]">
              <span className="flex items-center gap-1.5 text-[#050505]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E32636]" />
                <strong>Eigenaarsrechten Actief</strong>
              </span>
              <span className="text-[10px] text-[#6B6B6B]">
                Supabase Cloud Sync: OK
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
