import React from 'react';
import { UserProfile } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  Plus, 
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  Eye,
  Terminal,
  LayoutTemplate
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
}

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
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#D5D5D0]">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a href="#main-content" className="skip-link">
        Spring naar inhoud (Skip to content)
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand identity and actions */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Identity & Research Lab Branding */}
          <div 
            onClick={() => onTabChange('overview')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#050505] text-white flex items-center justify-center font-mono font-bold text-sm tracking-widest border border-[#050505] group-hover:bg-[#E32636] group-hover:border-[#E32636] transition-colors">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6B6B6B] font-medium">
                  {profile.institution || 'Hogeschool Utrecht'} // {profile.minor || 'Future-proof met AI'}
                </span>
              </div>
              <h1 className="font-display text-base sm:text-lg font-black tracking-tight text-[#050505] leading-tight">
                {profile.name || 'Thijs Buisman'}{' '}
                <span className="font-mono text-xs font-normal text-[#6B6B6B] tracking-normal">
                  — Portfolio
                </span>
              </h1>
            </div>
          </div>

          {/* Action Zone: Controls, Layout Switcher & Mode Indicators */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* View Mode Toggle (Fase A requirement: keep classic layout available) */}
            <button
              onClick={() => onViewModeChange(viewMode === 'editorial' ? 'classic' : 'editorial')}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-[#D5D5D0] hover:border-[#050505] text-[#6B6B6B] hover:text-[#050505] font-mono text-[11px] uppercase tracking-wider transition-colors cursor-pointer"
              title="Schakel tussen de nieuwe redactionele lay-out en de klassieke tabweergave"
              aria-label="Wissel weergavemodus"
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              <span>Weergave: {viewMode === 'editorial' ? 'Redactioneel' : 'Klassiek'}</span>
            </button>

            {isOwner ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#050505] text-white font-mono text-[11px] tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#E32636]" />
                  <span className="hidden sm:inline">Eigenaar</span>
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 border border-[#D5D5D0] hover:border-[#050505] text-[#050505] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
                  title="Uitloggen"
                  aria-label="Uitloggen"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] font-mono text-[11px] tracking-wider uppercase">
                  <Eye className="w-3.5 h-3.5 text-[#050505]" />
                  <span className="hidden md:inline">Leesmodus</span>
                </span>
                <button
                  onClick={onLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#050505] text-[#050505] hover:bg-[#050505] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  title="Inloggen als eigenaar"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Inloggen</span>
                </button>
              </div>
            )}

            {onOpenDeployGuide && (
              <button
                id="deploy-guide-btn"
                onClick={onOpenDeployGuide}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#D5D5D0] hover:border-[#050505] text-[#6B6B6B] hover:text-[#050505] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                title="Instructies voor hosting op GitHub Pages en Vercel"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Hosting</span>
              </button>
            )}

            {isOwner && (
              <button
                id="add-evidence-header-btn"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span><span className="hidden sm:inline">Nieuw </span>Bewijsstuk</span>
              </button>
            )}
          </div>
        </div>

        {/* Clear Dutch Main Navigation */}
        <nav 
          aria-label="Hoofdnavigatie"
          className="flex space-x-6 sm:space-x-8 border-t border-[#D5D5D0] overflow-x-auto scrollbar-none"
        >
          <button
            id="nav-overview"
            onClick={() => onTabChange('overview')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'overview'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">01.</span>
            <span>Overzicht</span>
          </button>

          <button
            id="nav-evidence"
            onClick={() => onTabChange('evidence')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'evidence'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">02.</span>
            <span>Sprints & Bewijzen</span>
          </button>

          <button
            id="nav-outcomes"
            onClick={() => onTabChange('outcomes')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'outcomes'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">03.</span>
            <span>Leeruitkomsten</span>
          </button>

          <button
            id="nav-profile"
            onClick={() => onTabChange('profile')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">04.</span>
            <span>Persoonlijk Verhaal</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
