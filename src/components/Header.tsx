import React from 'react';
import { UserProfile } from '../types';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  Sparkles, 
  Plus, 
  FileCheck2, 
  User, 
  Target, 
  ListChecks, 
  Globe,
  Lock,
  LogOut,
  ShieldCheck,
  Eye
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
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Minor Identification */}
          <div 
            onClick={() => onTabChange('profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm group-hover:bg-emerald-700 transition-colors">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  HU Minor
                </span>
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {profile.institution}
                </span>
              </div>
              <h1 className="text-sm sm:text-base md:text-lg font-bold text-slate-900 leading-tight truncate max-w-[170px] sm:max-w-none">
                {profile.minor} <span className="font-normal text-slate-300">|</span> <span className="text-slate-700 font-semibold">{profile.name}</span>
              </h1>
            </div>
          </div>

          {/* Actions: Auth Mode, Deploy Guide & Add Evidence */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {isOwner ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden md:inline">Beheerdersmodus</span>
                </span>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Uitloggen"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span className="hidden sm:inline">Leesmodus (Docent)</span>
                </span>
                <button
                  onClick={onLogin}
                  className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Inloggen om portfolio aan te passen"
                >
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Inloggen<span className="hidden sm:inline"> als Eigenaar</span></span>
                </button>
              </div>
            )}

            {onOpenDeployGuide && (
              <button
                id="deploy-guide-btn"
                onClick={onOpenDeployGuide}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                title="Instructies voor hosting op GitHub Pages en Vercel"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hosting</span>
              </button>
            )}

            {isOwner && (
              <button
                id="add-evidence-header-btn"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span><span className="hidden sm:inline">Nieuw </span>Bewijs / Link</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-2 border-t border-slate-100 py-1.5 overflow-x-auto scrollbar-none">
          <button
            id="tab-profile"
            onClick={() => onTabChange('profile')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <User className="w-4 h-4" />
            Homepage (Wie ben ik?)
          </button>

          <button
            id="tab-evidence"
            onClick={() => onTabChange('evidence')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'evidence'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck2 className="w-4 h-4" />
            Sprints & Links (1 t/m 8)
          </button>

          <button
            id="tab-outcomes"
            onClick={() => onTabChange('outcomes')}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'outcomes'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Target className="w-4 h-4" />
            Leeruitkomsten (LU 1 - 5)
          </button>
        </nav>
      </div>
    </header>
  );
};
