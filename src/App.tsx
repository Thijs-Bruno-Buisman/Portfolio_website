import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserProfile, 
  LearningOutcome, 
  Sprint, 
  EvidenceItem, 
  UserStory 
} from './types';
import { 
  initialProfile, 
  learningOutcomes, 
  sprints 
} from './data/initialData';
import { Header } from './components/Header';
import { PersonalStory } from './components/PersonalStory';
import { SprintNav } from './components/SprintNav';
import { EvidenceCard } from './components/EvidenceCard';
import { EvidenceModal } from './components/EvidenceModal';
import { AddEvidenceModal } from './components/AddEvidenceModal';
import { AddQuickLinkModal } from './components/AddQuickLinkModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { AuthModal } from './components/AuthModal';
import { LearningOutcomesOverview } from './components/LearningOutcomesOverview';
import { Chatbot } from './components/Chatbot';
import {
  supabase,
  subscribeProfile, 
  saveProfileToSupabase,
  subscribeEvidence, 
  saveEvidenceToSupabase,
  deleteEvidenceFromSupabase,
  logoutUser 
} from './lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  FileText, 
  Plus, 
  ExternalLink,
  GraduationCap,
  Sparkles,
  Cloud,
  Globe,
  ShieldCheck,
  Eye,
  Lock
} from 'lucide-react';

export default function App() {
  // Navigation & View State - Default to 'profile' (Homepage: Wie ben ik?)
  const [activeTab, setActiveTab] = useState<'profile' | 'evidence' | 'outcomes'>('profile');
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(null);
  const [selectedLUFilter, setSelectedLUFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [activeEvidenceModalItem, setActiveEvidenceModalItem] = useState<EvidenceItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isQuickLinkModalOpen, setIsQuickLinkModalOpen] = useState<boolean>(false);
  const [quickLinkSprintId, setQuickLinkSprintId] = useState<number>(1);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Authentication & Ownership State
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [isOwnerPasscode, setIsOwnerPasscode] = useState<boolean>(() => {
    return localStorage.getItem('hu_portfolio_owner_mode') === 'true';
  });

  const isOwner = useMemo(() => {
    // Owner is authenticated user (or passcode unlocked)
    return !!currentUser || isOwnerPasscode;
  }, [currentUser, isOwnerPasscode]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setCurrentUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Profile state with Firestore sync + local cache fallback
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hu_portfolio_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse profile from localStorage', e);
      }
    }
    return initialProfile;
  });

  // Evidence state with Firestore sync + local cache fallback
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(() => {
    const saved = localStorage.getItem('hu_portfolio_evidence');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out deprecated initial example data (ev-1 through ev-6)
          const cleanUserItems = parsed.filter(
            (p) => !['ev-1', 'ev-2', 'ev-3', 'ev-4', 'ev-5', 'ev-6'].includes(p.id)
          );
          if (cleanUserItems.length !== parsed.length) {
            localStorage.setItem('hu_portfolio_evidence', JSON.stringify(cleanUserItems));
          }
          return cleanUserItems;
        }
      } catch (e) {
        console.error('Failed to parse evidence from localStorage', e);
      }
    }
    return [];
  });

  // Real-time Firestore subscriptions
  useEffect(() => {
    const unsubscribeProfile = subscribeProfile((remoteProfile) => {
      setProfile(remoteProfile);
      localStorage.setItem('hu_portfolio_profile', JSON.stringify(remoteProfile));
    });

    const unsubscribeEvidence = subscribeEvidence((remoteItems) => {
      setEvidenceItems(remoteItems);
      localStorage.setItem('hu_portfolio_evidence', JSON.stringify(remoteItems));
    });

    return () => {
      unsubscribeProfile();
      unsubscribeEvidence();
    };
  }, []);

  // Handlers
  const handleUpdateProfile = async (updated: UserProfile): Promise<void> => {
    // Ensure nested objects are never undefined
    const cleanProfile: UserProfile = {
      ...updated,
      socials: {
        github: updated.socials?.github ?? '',
        linkedin: updated.socials?.linkedin ?? '',
        email: updated.socials?.email ?? '',
      },
      photos: updated.photos || [],
    };

    setProfile(cleanProfile);
    try {
      localStorage.setItem('hu_portfolio_profile', JSON.stringify(cleanProfile));
    } catch (storageErr) {
      console.warn('LocalStorage quota limit reached, relying on Firestore cloud sync:', storageErr);
    }

    try {
      await saveProfileToSupabase(cleanProfile);
    } catch (err) {
      console.warn('Supabase write failed, saved locally:', err);
      throw err;
    }
  };

  const handleAddEvidence = async (item: EvidenceItem) => {
    const updated = [item, ...evidenceItems];
    setEvidenceItems(updated);
    localStorage.setItem('hu_portfolio_evidence', JSON.stringify(updated));
    try {
      await saveEvidenceToSupabase(item);
    } catch (err) {
      console.warn('Supabase write failed, saved locally:', err);
    }
  };

  const handleDeleteEvidence = async (id: string) => {
    if (window.confirm('Weet je zeker dat je dit bewijsstuk of deze link wilt verwijderen?')) {
      const updated = evidenceItems.filter((e) => e.id !== id);
      setEvidenceItems(updated);
      localStorage.setItem('hu_portfolio_evidence', JSON.stringify(updated));
      if (activeEvidenceModalItem?.id === id) {
        setActiveEvidenceModalItem(null);
      }
      try {
        await deleteEvidenceFromSupabase(id);
      } catch (err) {
        console.warn('Supabase delete failed, deleted locally:', err);
      }
    }
  };

  const handleUpdateStatus = async (
    id: string, 
    newStatus: 'voldoende' | 'in_behandeling' | 'zelfevaluatie_klaar'
  ) => {
    const targetItem = evidenceItems.find((e) => e.id === id);
    if (!targetItem) return;

    const updatedItem: EvidenceItem = { ...targetItem, evaluationStatus: newStatus };
    const updatedList = evidenceItems.map((e) => (e.id === id ? updatedItem : e));
    
    setEvidenceItems(updatedList);
    localStorage.setItem('hu_portfolio_evidence', JSON.stringify(updatedList));

    if (activeEvidenceModalItem?.id === id) {
      setActiveEvidenceModalItem(updatedItem);
    }

    try {
      await saveEvidenceToSupabase(updatedItem);
    } catch (err) {
      console.warn('Supabase write failed, updated locally:', err);
    }
  };

  const handleResetToCleanState = async () => {
    if (window.confirm('Weet je zeker dat je alle bewijzen wilt wissen om met een schone start te beginnen?')) {
      setEvidenceItems([]);
      localStorage.removeItem('hu_portfolio_evidence');
      try {
        for (const item of evidenceItems) {
          await deleteEvidenceFromSupabase(item.id);
        }
      } catch (e) {
        console.warn('Reset sync warning:', e);
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
    setIsOwnerPasscode(false);
    localStorage.removeItem('hu_portfolio_owner_mode');
  };

  const handleOpenQuickLink = (sprintId: number) => {
    if (!isOwner) {
      setIsAuthModalOpen(true);
      return;
    }
    setQuickLinkSprintId(sprintId);
    setIsQuickLinkModalOpen(true);
  };

  const handleOpenAddModalForSprint = (sprintId: number) => {
    if (!isOwner) {
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedSprintId(sprintId);
    setIsAddModalOpen(true);
  };

  // Filtered evidence items
  const filteredEvidence = useMemo(() => {
    return evidenceItems.filter((item) => {
      // Sprint filter
      if (selectedSprintId !== null && item.sprintId !== selectedSprintId) {
        return false;
      }
      // Learning outcome filter
      if (selectedLUFilter !== 'all' && !item.learningOutcomeIds.includes(selectedLUFilter)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesInvestigated = item.investigated.toLowerCase().includes(query);
        const matchesCreated = item.created.toLowerCase().includes(query);
        const matchesLearned = item.learned.toLowerCase().includes(query);
        const matchesTools = item.toolsUsed.some((t) => t.toLowerCase().includes(query));
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(query));

        if (!matchesTitle && !matchesInvestigated && !matchesCreated && !matchesLearned && !matchesTools && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [evidenceItems, selectedSprintId, selectedLUFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddModal={() => {
          if (!isOwner) {
            setIsAuthModalOpen(true);
          } else {
            setIsAddModalOpen(true);
          }
        }}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        currentUser={currentUser}
        isOwner={isOwner}
        onLogin={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Cloud Synchronization & Access Status Banner */}
      <div className="bg-slate-900 text-white text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-slate-200">
                  <strong className="text-emerald-400">Firebase Firestore Verbonden:</strong> Je bewerkt nu als eigenaar. Alles wat je aanpast of toevoegt wordt direct permanent in de cloud opgeslagen.
                </span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                <span className="text-slate-300">
                  <strong className="text-white">Leesmodus voor Docent & Bezoekers:</strong> Je bekijkt de live cloud-versie van dit portfolio. Wijzigingen zijn vergrendeld om ongewenste aanpassingen te voorkomen.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isOwner ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Inloggen als Thijs</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400 hidden md:inline">
                Ingelogd als eigenaar • Beheerdersrechten actief
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Tab 1: Homepage (Wie ben ik? Persoonlijk verhaal & Foto's) */}
        {activeTab === 'profile' && (
          <PersonalStory
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToSprints={() => {
              setActiveTab('evidence');
              setSelectedSprintId(1);
            }}
            isOwner={isOwner}
          />
        )}

        {/* Tab 2: Sprints & Links (Bewijzen per Sprint) */}
        {activeTab === 'evidence' && (
          <div className="space-y-6">
            {/* Sprint Navigation Bar with Dedicated External Deliverables & Quick Link */}
            <SprintNav
              sprints={sprints}
              selectedSprintId={selectedSprintId}
              onSelectSprint={setSelectedSprintId}
              evidenceItems={evidenceItems}
              onOpenQuickLinkModal={handleOpenQuickLink}
              onOpenAddModal={handleOpenAddModalForSprint}
              onOpenEvidenceDetails={setActiveEvidenceModalItem}
              isOwner={isOwner}
            />

            {/* Filter Bar: Learning Outcomes & Search */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* LU Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  Filter LU:
                </span>

                <button
                  onClick={() => setSelectedLUFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedLUFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Alle LU's
                </button>

                {learningOutcomes.map((lu) => {
                  const isSelected = selectedLUFilter === lu.id;
                  return (
                    <button
                      key={lu.id}
                      onClick={() => setSelectedLUFilter(lu.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {lu.code}: {lu.title.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek in bewijzen, tools of links..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-emerald-500 focus:bg-white text-slate-900"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-600 absolute right-2.5 top-1/2 -translate-y-1/2"
                  >
                    Wissen
                  </button>
                )}
              </div>
            </div>

            {/* Evidence Count and Active Filter Indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <div>
                Getoond: <span className="font-bold text-slate-800">{filteredEvidence.length}</span>{' '}
                {filteredEvidence.length === 1 ? 'item' : 'items'}
                {selectedSprintId !== null && (
                  <span className="ml-1.5 px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium">
                    Sprint {selectedSprintId}
                  </span>
                )}
                {selectedLUFilter !== 'all' && (
                  <span className="ml-1.5 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                    {learningOutcomes.find((lu) => lu.id === selectedLUFilter)?.code}
                  </span>
                )}
              </div>

              {(selectedSprintId !== null || selectedLUFilter !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSprintId(null);
                    setSelectedLUFilter('all');
                    setSearchQuery('');
                  }}
                  className="text-emerald-700 hover:underline font-semibold cursor-pointer"
                >
                  Alle filters wissen
                </button>
              )}
            </div>

            {/* Evidence Cards Grid */}
            {filteredEvidence.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredEvidence.map((item) => (
                  <EvidenceCard
                    key={item.id}
                    item={item}
                    learningOutcomes={learningOutcomes}
                    onOpenDetails={setActiveEvidenceModalItem}
                    onDelete={isOwner ? handleDeleteEvidence : undefined}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Geen bewijzen of links gevonden
                </h3>
                <p className="text-xs text-slate-500 mb-6">
                  {selectedSprintId 
                    ? `Er zijn nog geen items geregistreerd voor Sprint ${selectedSprintId}.` 
                    : 'Er zijn nog geen bewijsstukken die voldoen aan de huidige filters.'}
                </p>
                {isOwner && (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenQuickLink(selectedSprintId || 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      + Externe Link toevoegen (OneDrive / YouTube)
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Volledig Bewijs
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Learning Outcomes & Progress */}
        {activeTab === 'outcomes' && (
          <LearningOutcomesOverview
            learningOutcomes={learningOutcomes}
            evidenceItems={evidenceItems}
            onSelectLUFilter={(luId) => {
              setSelectedLUFilter(luId);
              setActiveTab('evidence');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            <span>
              Hogeschool Utrecht • Minor <span className="font-semibold text-slate-800">Future-proof met AI</span> • Bewijzenportfolio
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              Hosting & Deploy Gids
            </button>
            {isOwner && (
              <>
                <span className="text-slate-300">|</span>
                <button
                  onClick={handleResetToCleanState}
                  className="text-slate-400 hover:text-rose-600 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  title="Wis alle opgeslagen bewijzen voor een schone start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Schone start (bewijzen wissen)
                </button>
              </>
            )}
            <span className="text-slate-300">|</span>
            <button
              onClick={() => setActiveTab('stories')}
              className="hover:text-emerald-700 font-medium transition-colors cursor-pointer"
            >
              User Stories bekijken
            </button>
          </div>
        </div>
      </footer>

      <Chatbot />

      {/* Modals */}
      {activeEvidenceModalItem && (
        <EvidenceModal
          item={activeEvidenceModalItem}
          learningOutcomes={learningOutcomes}
          onClose={() => setActiveEvidenceModalItem(null)}
          onUpdateStatus={isOwner ? handleUpdateStatus : undefined}
        />
      )}

      {isAddModalOpen && (
        <AddEvidenceModal
          isOpen={isAddModalOpen}
          learningOutcomes={learningOutcomes}
          onClose={() => setIsAddModalOpen(false)}
          onAddEvidence={handleAddEvidence}
          defaultSprintId={selectedSprintId}
        />
      )}

      {isQuickLinkModalOpen && (
        <AddQuickLinkModal
          isOpen={isQuickLinkModalOpen}
          sprintId={quickLinkSprintId}
          learningOutcomes={learningOutcomes}
          onClose={() => setIsQuickLinkModalOpen(false)}
          onAddEvidence={handleAddEvidence}
        />
      )}

      {isDeployGuideOpen && (
        <DeployGuideModal
          isOpen={isDeployGuideOpen}
          onClose={() => setIsDeployGuideOpen(false)}
          profile={profile}
          evidenceItems={evidenceItems}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onOwnerAuthenticated={() => {
            setIsOwnerPasscode(true);
            localStorage.setItem('hu_portfolio_owner_mode', 'true');
          }}
        />
      )}
    </div>
  );
}
