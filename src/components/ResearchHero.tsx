import React from 'react';
import { UserProfile, LearningOutcome, Sprint, EvidenceItem } from '../types';
import { 
  ArrowRight,
  ShieldCheck,
  Radio,
  ExternalLink,
  Sparkles
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

  const coveredLUsCount = learningOutcomes.filter((lu) =>
    evidenceItems.some((item) => item.learningOutcomeIds.includes(lu.id))
  ).length;

  // Active sprint (Sprint 3 in week 3-4, or fallback to first sprint)
  const currentSprint = sprints.find((s) => s.id === 3) || sprints[0];
  const nextSprint = sprints.find((s) => s.id === 4) || sprints[1] || sprints[0];

  return (
    <section 
      aria-label="NASA-stijl Research Hero"
      className="relative w-full text-white overflow-hidden mb-12 border-b border-[#1c1c1c] bg-[#050505]"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(5, 5, 5, 0.45) 0%, rgba(5, 5, 5, 0.75) 60%, rgba(5, 5, 5, 0.98) 100%), url('https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=2074&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 35%',
      }}
    >
      {/* Cinematic Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 relative z-10">
        <div className="max-w-3xl">
          {/* Institution & Lab Tag */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/60 border border-white/20 rounded-xs mb-4 text-xs font-mono tracking-widest uppercase text-gray-300 backdrop-blur-xs">
            <span className="w-2 h-2 bg-[#E03A3E] rounded-full animate-ping" />
            <span>{profile.institution || 'Hogeschool Utrecht'} // Minor {profile.minor || 'Future-proof met AI'}</span>
          </div>

          {/* NASA Bold Display Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white leading-[1.08] mb-5">
            Your Orbiting AI Laboratory
          </h1>

          {/* Subtitle Description */}
          <p className="text-base sm:text-xl text-gray-200 leading-relaxed font-sans max-w-2xl mb-8 drop-shadow-sm">
            Tijdens 8 sprints ontwikkelt Thijs Bruno Buisman een methodisch dossier van werkende AI-agents, API-integraties en verantwoorde implementaties verdeeld over de 5 officiële HU-leeruitkomsten.
          </p>

          {/* Prominent Red Action Button (Space Station Updates Style) */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onNavigateToSprints}
              className="px-7 py-4 bg-[#E03A3E] hover:bg-[#c82f33] text-white font-bold text-sm sm:text-base tracking-wide rounded-sm transition-all duration-200 transform hover:-translate-y-0.5 shadow-xl flex items-center gap-2.5 cursor-pointer active:translate-y-0"
            >
              <span>Sprint Updates & Dossiers</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onNavigateToStory}
              className="px-6 py-4 bg-black/50 hover:bg-black/80 text-white font-semibold text-sm sm:text-base border border-white/30 hover:border-white rounded-sm transition-all backdrop-blur-xs cursor-pointer"
            >
              <span>Over de Onderzoeker</span>
            </button>
          </div>
        </div>
      </div>

      {/* NASA 3-Column Mission Ticker Strip at the Bottom */}
      <div className="border-t border-white/15 bg-black/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-center">
            
            {/* Mission Strip Col 1: Current Sprint */}
            <div 
              onClick={onNavigateToSprints}
              className="group cursor-pointer border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 pr-4"
            >
              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                CURRENT SPRINT
              </span>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm sm:text-base font-bold text-white group-hover:text-[#E03A3E] transition-colors truncate">
                  Sprint 0{currentSprint.id}: {currentSprint.title}
                </span>
                <span className="w-5 h-5 rounded-full bg-[#E03A3E] text-white flex items-center justify-center text-xs font-bold ml-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                  →
                </span>
              </div>
            </div>

            {/* Mission Strip Col 2: Future / Focus */}
            <div 
              onClick={onNavigateToSprints}
              className="group cursor-pointer border-b md:border-b-0 md:border-r border-white/10 pb-3 md:pb-0 pr-4"
            >
              <span className="font-mono text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                FOCUS GEBIED
              </span>
              <div className="flex items-center justify-between">
                <span className="font-display text-sm sm:text-base font-bold text-white group-hover:text-[#E03A3E] transition-colors truncate">
                  {currentSprint.focus || "Autonome Agents & API Tool-Use"}
                </span>
                <span className="w-5 h-5 rounded-full bg-[#E03A3E] text-white flex items-center justify-center text-xs font-bold ml-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                  →
                </span>
              </div>
            </div>

            {/* Mission Strip Col 3: Bewijsdekking (For the Benefit of All Style) */}
            <div 
              onClick={onNavigateToOutcomes}
              className="group cursor-pointer pr-2 flex items-center justify-between"
            >
              <div>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-1">
                  BEWIJSDEKKING HU MINOR
                </span>
                <span className="font-display text-sm sm:text-base font-bold text-white group-hover:text-[#E03A3E] transition-colors truncate">
                  {coveredLUsCount} / {learningOutcomes.length} Leeruitkomsten Gedekt
                </span>
              </div>
              <span className="w-5 h-5 rounded-full bg-[#E03A3E] text-white flex items-center justify-center text-xs font-bold ml-2 flex-shrink-0 group-hover:scale-110 transition-transform">
                →
              </span>
            </div>

          </div>

          {/* Owner Telemetry indicator if active */}
          {isOwner && (
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-white">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E03A3E]" />
                <span>Eigenaarsmodus Actief // Supabase Cloud Sync Online</span>
              </span>
              <span>{totalEvidenceCount} dossiers in database</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

