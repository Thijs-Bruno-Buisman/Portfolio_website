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
  Terminal
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  activeTab: 'evidence' | 'profile' | 'outcomes';
  onTabChange: (tab: 'evidence' | 'profile' | 'outcomes') => void;
  onOpenAddModal: () => void;
  onOpenDeployGuide?: () => void;
  currentUser: SupabaseUser | null;
  isOwner: boolean;
  onLogin: () => void;
  onLogout: () => void;
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
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#D5D5D0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar: Brand identity and actions */}
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Identity & Research Lab Branding */}
          <div 
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-[#050505] text-white flex items-center justify-center font-mono font-bold text-sm tracking-widest border border-[#050505] group-hover:bg-[#E32636] group-hover:border-[#E32636] transition-colors">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#6B6B6B] font-medium">
                  {profile.institution || 'HU UTRECHT'} // {profile.minor || 'FUTURE-PROOF MET AI'}
                </span>
              </div>
              <h1 className="font-display text-base sm:text-lg font-black tracking-tight text-[#050505] leading-tight">
                {profile.name || 'Thijs Buisman'}{' '}
                <span className="font-mono text-xs font-normal text-[#6B6B6B] tracking-normal">
                  — Research Portfolio
                </span>
              </h1>
            </div>
          </div>

          {/* Action Zone: Mode Indicators & Key Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
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
                  <span className="hidden md:inline">Leesmodus (Docent)</span>
                </span>
                <button
                  onClick={onLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#050505] text-[#050505] hover:bg-[#050505] hover:text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  title="Inloggen als eigenaar"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Inloggen<span className="hidden sm:inline"> als Thijs</span></span>
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
                <span><span className="hidden sm:inline">Nieuw </span>Dossier / Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Editorial Navigation Tabs */}
        <nav 
          aria-label="Hoofdnavigatie"
          className="flex space-x-6 sm:space-x-8 border-t border-[#D5D5D0] overflow-x-auto scrollbar-none"
        >
          <button
            id="tab-profile"
            onClick={() => onTabChange('profile')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'profile'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">01.</span>
            <span>Overzicht & Persoonlijk Verhaal</span>
          </button>

          <button
            id="tab-evidence"
            onClick={() => onTabChange('evidence')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'evidence'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">02.</span>
            <span>Sprints & Onderzoeksdossiers (1 - 8)</span>
          </button>

          <button
            id="tab-outcomes"
            onClick={() => onTabChange('outcomes')}
            className={`py-3 font-mono text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 border-b-2 ${
              activeTab === 'outcomes'
                ? 'border-[#E32636] text-[#050505] font-bold'
                : 'border-transparent text-[#6B6B6B] hover:text-[#050505]'
            }`}
          >
            <span className="text-[#E32636] font-bold">03.</span>
            <span>Leeruitkomsten Assessment (LU 1 - 5)</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
