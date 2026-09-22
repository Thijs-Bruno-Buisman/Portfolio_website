import React from 'react';
import { UserProfile } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  Search,
  Compass,
  Lock,
  LogOut,
  ShieldCheck,
  Plus,
  Globe,
  LayoutTemplate,
  ChevronDown
} from 'lucide-react';

export type TabType = 'overview' | 'evidence' | 'outcomes' | 'profile';

interface HeaderProps {
  profile: UserProfile;
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenAddModal: () => void;
  onOpenDeployGuide?: () => void;
  currentUser: SupabaseUser | null;
  isOwner: boolean;
  onLogin: () => void;
  onLogout: () => void;
  viewMode: 'editorial' | 'classic';
  onViewModeChange: (mode: 'editorial' | 'classic') => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const NasaMeatballEmblem = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 select-none drop-shadow-md" aria-hidden="true">
    {/* Deep NASA Blue Circle */}
    <circle cx="50" cy="50" r="46" fill="#0B3D91" />
    {/* White Starlight Dots */}
    <circle cx="28" cy="30" r="1.5" fill="#ffffff" opacity="0.9" />
    <circle cx="72" cy="25" r="1.3" fill="#ffffff" opacity="0.8" />
    <circle cx="36" cy="65" r="1.3" fill="#ffffff" opacity="0.9" />
    <circle cx="76" cy="68" r="1.5" fill="#ffffff" opacity="0.8" />
    <circle cx="58" cy="78" r="1.1" fill="#ffffff" opacity="0.7" />
    <circle cx="22" cy="52" r="1.2" fill="#ffffff" opacity="0.8" />
    <circle cx="82" cy="42" r="1.4" fill="#ffffff" opacity="0.9" />
    {/* White Orbital Ring */}
    <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="#FFFFFF" strokeWidth="2.5" transform="rotate(-28 50 50)" opacity="0.95" />
    {/* Red Vector Wing */}
    <path d="M 22 72 L 50 18 L 62 48 L 78 74 L 54 58 Z" fill="#E03A3E" opacity="0.95" />
    {/* Center Typography */}
    <text x="50" y="55" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="15" letterSpacing="1">
      HU•AI
    </text>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  onTabChange,
  onOpenAddModal,
  onOpenDeployGuide,
  currentUser,
  isOwner,
  onLogin,
  onLogout,
  viewMode,
  onViewModeChange,
  searchQuery = '',
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#000000] border-b border-[#1c1c1c] text-white">
      {/* Skip to Main Content Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Spring naar inhoud
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Left: Explore & Minimalist NASA Search Bar */}
          <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-sm">
            <button
              onClick={() => onTabChange('evidence')}
              className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#E03A3E] transition-colors cursor-pointer whitespace-nowrap"
              title="Verken Sprints en Dossiers"
            >
              <span className="text-sm font-semibold tracking-wide">Explore</span>
              <Compass className="w-3.5 h-3.5 text-gray-400" />
            </button>

            {/* NASA Pill Search Box */}
            <div className="relative w-full max-w-[200px] sm:max-w-[240px]">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search dossiers..."
                className="w-full bg-[#111111] hover:bg-[#161616] focus:bg-[#1a1a1a] text-xs text-white placeholder-gray-400 pl-8 pr-3 py-1.5 rounded-full border border-[#2a2a2a] focus:border-white focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Center: Iconic NASA Meatball Emblem & Student Identification */}
          <div 
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
            title="Naar Hoofdpagina"
          >
            <div className="transform group-hover:scale-105 transition-transform">
              <NasaMeatballEmblem />
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="font-display font-black text-sm text-white tracking-tight leading-none group-hover:text-[#E03A3E] transition-colors">
                {profile.name || 'Thijs Buisman'}
              </span>
              <span className="font-mono text-[10px] text-gray-400 tracking-wider uppercase mt-0.5">
                AI RESEARCH LAB // HU
              </span>
            </div>
          </div>

          {/* Right: Clean Navigation Links, Live Badge & Actions */}
          <div className="flex items-center gap-3 sm:gap-6 justify-end flex-1">
            <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold tracking-wide" aria-label="Hoofdnavigatie">
              <button
                onClick={() => onTabChange('overview')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'overview' ? 'text-[#E03A3E] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Overzicht
              </button>
              <button
                onClick={() => onTabChange('evidence')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'evidence' ? 'text-[#E03A3E] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Sprints & Bewijzen
              </button>
              <button
                onClick={() => onTabChange('outcomes')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'outcomes' ? 'text-[#E03A3E] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Leeruitkomsten
              </button>
              <button
                onClick={() => onTabChange('profile')}
                className={`transition-colors cursor-pointer ${
                  activeTab === 'profile' ? 'text-[#E03A3E] font-bold' : 'text-gray-300 hover:text-white'
                }`}
              >
                Verhaal
              </button>
            </nav>

            {/* NASA+ LIVE style badge */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#111111] border border-[#2a2a2a] rounded-sm font-mono text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-[#E03A3E] rounded-full animate-pulse" />
              <span>AI LAB</span>
            </div>

            {/* Owner / Guest controls */}
            {isOwner ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddModal}
                  className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-[#E03A3E] hover:bg-[#c92f33] text-white font-mono text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer rounded-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Uitloggen"
                  aria-label="Uitloggen"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLogin}
                className="inline-flex items-center gap-1.5 px-3 py-1 border border-white/30 hover:border-white text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer rounded-xs hover:bg-white hover:text-black"
                title="Inloggen als student/eigenaar"
              >
                <Lock className="w-3 h-3" />
                <span>Inloggen</span>
              </button>
            )}

            {/* View Mode Toggle (kept available) */}
            <button
              onClick={() => onViewModeChange(viewMode === 'editorial' ? 'classic' : 'editorial')}
              className="p-1.5 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={`Wissel naar ${viewMode === 'editorial' ? 'klassieke' : 'redactionele'} weergave`}
              aria-label="Wissel weergave"
            >
              <LayoutTemplate className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Sub-Navigation Strip */}
        <div className="lg:hidden flex items-center justify-between border-t border-[#1c1c1c] py-2.5 overflow-x-auto scrollbar-none text-xs font-medium text-gray-300 gap-4">
          <button
            onClick={() => onTabChange('overview')}
            className={`whitespace-nowrap ${activeTab === 'overview' ? 'text-[#E03A3E] font-bold' : 'hover:text-white'}`}
          >
            01. Overzicht
          </button>
          <button
            onClick={() => onTabChange('evidence')}
            className={`whitespace-nowrap ${activeTab === 'evidence' ? 'text-[#E03A3E] font-bold' : 'hover:text-white'}`}
          >
            02. Sprints
          </button>
          <button
            onClick={() => onTabChange('outcomes')}
            className={`whitespace-nowrap ${activeTab === 'outcomes' ? 'text-[#E03A3E] font-bold' : 'hover:text-white'}`}
          >
            03. Leeruitkomsten
          </button>
          <button
            onClick={() => onTabChange('profile')}
            className={`whitespace-nowrap ${activeTab === 'profile' ? 'text-[#E03A3E] font-bold' : 'hover:text-white'}`}
          >
            04. Verhaal
          </button>
        </div>
      </div>
    </header>
  );
};
