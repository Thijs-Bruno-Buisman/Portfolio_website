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
import { Header, TabType } from './components/Header';
import { ResearchHero } from './components/ResearchHero';
import { SprintRail } from './components/SprintRail';
import { SprintBriefing } from './components/SprintBriefing';
import { PersonalStory } from './components/PersonalStory';
import { SprintNav } from './components/SprintNav';
import { EvidenceCard } from './components/EvidenceCard';
import { EvidenceLedger } from './components/EvidenceLedger';
import { EvidenceModal } from './components/EvidenceModal';
import { AddEvidenceModal } from './components/AddEvidenceModal';
import { AddQuickLinkModal } from './components/AddQuickLinkModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { AuthModal } from './components/AuthModal';
import { LearningOutcomesOverview } from './components/LearningOutcomesOverview';
import { Chatbot } from './components/Chatbot';
import {
  supabase,
  supabaseConfigurationError,
  isPortfolioOwner,
  subscribeProfile, 
  saveProfileToSupabase,
  subscribeEvidence, 
  saveEvidenceToSupabase,
  deleteEvidenceFromSupabase,
  deleteAllEvidenceFromSupabase,
  uploadEvidenceFiles,
  deleteEvidenceFiles,
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
  Lock,
  LayoutGrid,
  Table,
  Star
} from 'lucide-react';

function writeLocalCache(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Local cache could not be updated for ${key}:`, error);
  }
}

export default function App() {
  // Navigation & View State - Hash-driven deep linking
  const parseHash = (): { tab: TabType; sprintId?: number; itemId?: string } => {
    const hash = window.location.hash;
    const lowerHash = hash.toLowerCase();
    if (lowerHash.startsWith('#sprints') || lowerHash.startsWith('#bewijzen')) {
      const params = new URLSearchParams(hash.includes('?') ? hash.split('?')[1] : '');
      const sprintParam = params.get('sprint');
      const itemParam = params.get('item') || params.get('dossier');
      return { 
        tab: 'evidence', 
        sprintId: sprintParam ? Number(sprintParam) : undefined,
        itemId: itemParam || undefined
      };
    }
    if (lowerHash.startsWith('#leeruitkomsten') || lowerHash.startsWith('#outcomes')) {
      return { tab: 'outcomes' };
    }
    if (lowerHash.startsWith('#verhaal') || lowerHash.startsWith('#profiel') || lowerHash.startsWith('#story')) {
      return { tab: 'profile' };
    }
    return { tab: 'overview' };
  };

  const [activeTab, setActiveTab] = useState<TabType>(() => parseHash().tab);
  const [viewMode, setViewMode] = useState<'editorial' | 'classic'>('editorial');
  const [selectedSprintId, setSelectedSprintId] = useState<number | null>(() => parseHash().sprintId ?? null);
  const [selectedLUFilter, setSelectedLUFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [evidenceViewType, setEvidenceViewType] = useState<'grid' | 'ledger'>('grid');

  // Modals state
  const [activeEvidenceModalItem, setActiveEvidenceModalItem] = useState<EvidenceItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceItem | null>(null);

  const handleOpenEvidenceModal = (item: EvidenceItem) => {
    setActiveEvidenceModalItem(item);
    window.history.pushState(null, '', `#sprints?item=${encodeURIComponent(item.id)}`);
  };

  const handleCloseEvidenceModal = () => {
    setActiveEvidenceModalItem(null);
    const fallbackHash = selectedSprintId ? `#sprints?sprint=${selectedSprintId}` : '#sprints';
    if (window.location.hash.includes('item=')) {
      window.history.pushState(null, '', fallbackHash);
    }
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    let newHash = '#overzicht';
    if (tab === 'evidence') newHash = selectedSprintId ? `#sprints?sprint=${selectedSprintId}` : '#sprints';
    if (tab === 'outcomes') newHash = '#leeruitkomsten';
    if (tab === 'profile') newHash = '#verhaal';
    if (window.location.hash !== newHash) {
      window.history.pushState(null, '', newHash);
    }
  };

  const handleSelectSprint = (sprintId: number | null) => {
    setSelectedSprintId(sprintId);
    if (activeTab === 'evidence') {
      const newHash = sprintId !== null ? `#sprints?sprint=${sprintId}` : '#sprints';
      window.history.replaceState(null, '', newHash);
    }
  };
  const [isQuickLinkModalOpen, setIsQuickLinkModalOpen] = useState<boolean>(false);
  const [quickLinkSprintId, setQuickLinkSprintId] = useState<number>(1);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Authentication & Ownership State
  const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [databaseError, setDatabaseError] = useState<string | null>(supabaseConfigurationError);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setCurrentUser(data.session?.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setIsOwner(false);
      return;
    }
    void isPortfolioOwner()
      .then(setIsOwner)
      .catch((error) => {
        setIsOwner(false);
        setDatabaseError(`Eigenaarsrechten konden niet worden gecontroleerd: ${error.message}`);
      });
  }, [currentUser]);

  // Profile state with Supabase sync + local cache fallback
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

  // Evidence state with Supabase sync + local cache fallback
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

  // Real-time Supabase subscriptions. Read errors leave the local cache untouched.
  useEffect(() => {
    if (!supabase) return;
    const reportDatabaseError = (message: string) => setDatabaseError(message);
    const unsubscribeProfile = subscribeProfile((remoteProfile) => {
      setProfile(remoteProfile);
      writeLocalCache('hu_portfolio_profile', remoteProfile);
      setDatabaseError(null);
    }, reportDatabaseError);

    const unsubscribeEvidence = subscribeEvidence((remoteItems) => {
      setEvidenceItems(remoteItems);
      writeLocalCache('hu_portfolio_evidence', remoteItems);
      setDatabaseError(null);
    }, reportDatabaseError);

    return () => {
      unsubscribeProfile();
      unsubscribeEvidence();
    };
  }, []);

  // Handle browser back/forward and hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseHash();
      setActiveTab(route.tab);
      if (route.sprintId !== undefined) {
        setSelectedSprintId(route.sprintId);
      }
      if (route.itemId) {
        const item = evidenceItems.find((e) => e.id === route.itemId);
        if (item) {
          setActiveEvidenceModalItem(item);
        }
      } else if (!window.location.hash.includes('item=')) {
        setActiveEvidenceModalItem(null);
      }
    };

    window.addEventListener('popstate', handleHashChange);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('popstate', handleHashChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [evidenceItems]);

  // Deep-link initial load effect for specific dossier items
  useEffect(() => {
    const route = parseHash();
    if (route.itemId && evidenceItems.length > 0) {
      const item = evidenceItems.find((e) => e.id === route.itemId);
      if (item) setActiveEvidenceModalItem(item);
    }
  }, [evidenceItems]);

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

    try {
      await saveProfileToSupabase(cleanProfile);
      setProfile(cleanProfile);
      writeLocalCache('hu_portfolio_profile', cleanProfile);
      setDatabaseError(null);
    } catch (err) {
      setDatabaseError('Het profiel is niet opgeslagen in Supabase.');
      throw err;
    }
  };

  const handleAddEvidence = async (
    item: EvidenceItem,
    files: File[] = [],
    removedMedia: EvidenceItem['media'] = [],
  ) => {
    let uploadedMedia: EvidenceItem['media'] = [];
    try {
      uploadedMedia = files.length > 0 ? await uploadEvidenceFiles(item.id, files) : [];
      const savedItem = { ...item, media: [...item.media, ...uploadedMedia] };
      await saveEvidenceToSupabase(savedItem);
      if (removedMedia.length > 0) {
        try {
          await deleteEvidenceFiles(removedMedia);
        } catch (storageError) {
          console.warn('Evidence was updated, but one or more removed files remain in storage:', storageError);
        }
      }
      const exists = evidenceItems.some((e) => e.id === savedItem.id);
      const updated = exists
        ? evidenceItems.map((e) => e.id === savedItem.id ? savedItem : e)
        : [savedItem, ...evidenceItems];
      setEvidenceItems(updated);
      writeLocalCache('hu_portfolio_evidence', updated);
      if (activeEvidenceModalItem?.id === savedItem.id) setActiveEvidenceModalItem(savedItem);
      setEditingEvidence(null);
      setDatabaseError(null);
    } catch (err) {
      if (uploadedMedia.length > 0) {
        try {
          await deleteEvidenceFiles(uploadedMedia);
        } catch (cleanupError) {
          console.warn('Uploaded files could not be cleaned up after a failed save:', cleanupError);
        }
      }
      setDatabaseError('Het bewijsstuk is niet opgeslagen in Supabase.');
      throw err;
    }
  };

  const handleDeleteEvidence = async (id: string) => {
    if (window.confirm('Weet je zeker dat je dit bewijsstuk of deze link wilt verwijderen?')) {
      try {
        await deleteEvidenceFromSupabase(id);
        const removedItem = evidenceItems.find((e) => e.id === id);
        if (removedItem) {
          try {
            await deleteEvidenceFiles(removedItem.media);
          } catch (storageError) {
            console.warn('Evidence record was deleted, but one or more files could not be removed:', storageError);
          }
        }
        const updated = evidenceItems.filter((e) => e.id !== id);
        setEvidenceItems(updated);
        writeLocalCache('hu_portfolio_evidence', updated);
        if (activeEvidenceModalItem?.id === id) setActiveEvidenceModalItem(null);
        setDatabaseError(null);
      } catch (err) {
        setDatabaseError('Het bewijsstuk kon niet uit Supabase worden verwijderd.');
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
    
    try {
      await saveEvidenceToSupabase(updatedItem);
      setEvidenceItems(updatedList);
      writeLocalCache('hu_portfolio_evidence', updatedList);
      if (activeEvidenceModalItem?.id === id) setActiveEvidenceModalItem(updatedItem);
      setDatabaseError(null);
    } catch (err) {
      setDatabaseError('De beoordelingsstatus is niet opgeslagen in Supabase.');
    }
  };

  const handleResetToCleanState = async () => {
    if (window.confirm('Weet je zeker dat je alle bewijzen wilt wissen om met een schone start te beginnen?')) {
      try {
        await deleteAllEvidenceFromSupabase();
        setEvidenceItems([]);
        localStorage.removeItem('hu_portfolio_evidence');
        setDatabaseError(null);
      } catch (e) {
        setDatabaseError('De bewijsstukken konden niet uit Supabase worden verwijderd.');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
    setIsOwner(false);
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

  const handleEditEvidence = (item: EvidenceItem) => {
    setActiveEvidenceModalItem(null);
    setEditingEvidence(item);
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
    <div className="min-h-screen bg-[#F4F3EF] text-[#050505] flex flex-col font-sans selection:bg-[#050505] selection:text-white">
      {databaseError && (
        <div role="alert" className="bg-[#050505] border-b border-[#E32636] px-4 py-2.5 text-center font-mono text-xs text-[#E32636]">
          [SYSTEM ALERT] {databaseError} Lokale cache blijft actief.
        </div>
      )}
      {/* Top Header */}
      <Header
        profile={profile}
        activeTab={activeTab}
        onTabChange={handleTabChange}
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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (activeTab !== 'evidence' && activeTab !== 'overview') {
            handleTabChange('evidence');
          }
        }}
      />

      {/* Cloud Synchronization & Access Telemetry Strip (Visible for Owner Only) */}
      {isOwner && (
        <div className="bg-[#050505] text-[#D5D5D0] text-xs py-2 px-4 sm:px-6 border-b border-[#1F1F1F] font-mono">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E32636] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E32636]"></span>
              </span>
              <span className="tracking-wider text-[11px]">
                <strong className="text-white">TELEMETRY: SUPABASE ONLINE</strong> // SESSIE: EIGENAAR (SCHRIJFRECHTEN ACTIEF)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#6B6B6B] tracking-wider uppercase hidden md:inline">
                BEVEILIGD // AUTH ID: {currentUser?.email || 'THIJS'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cinematic Full-Width NASA Hero on Overview Tab */}
      {activeTab === 'overview' && (
        <ResearchHero
          profile={profile}
          sprints={sprints}
          evidenceItems={evidenceItems}
          learningOutcomes={learningOutcomes}
          onNavigateToSprints={() => {
            handleTabChange('evidence');
            handleSelectSprint(selectedSprintId ?? 3);
          }}
          onNavigateToOutcomes={() => handleTabChange('outcomes')}
          onNavigateToStory={() => handleTabChange('profile')}
          isOwner={isOwner}
        />
      )}

      {/* Main Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 outline-none">
        {/* Tab 0: Overzicht (Homepage Research Dispatch) */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            
            {/* Embedded & Systems Engineering Featured Dossiers Section */}
            <section aria-labelledby="featured-dossiers-heading" className="bg-white">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-4 mb-6 border-b-2 border-[#050505]">
                <div>
                  <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#E03A3E] block mb-1">
                    // ELEKTROTECHNIEK & APPLIED AI
                  </span>
                  <h2 id="featured-dossiers-heading" className="font-display font-black text-3xl sm:text-4xl text-[#050505] tracking-tight">
                    Featured Dossiers
                  </h2>
                </div>

                <button
                  onClick={() => {
                    handleTabChange('evidence');
                    handleSelectSprint(null);
                  }}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold text-[#050505] hover:text-[#E03A3E] transition-colors cursor-pointer group/btn self-start sm:self-auto"
                >
                  <span>Alle Sprints & Bewijzen</span>
                  <span className="w-5 h-5 rounded-full bg-[#E03A3E] text-white flex items-center justify-center text-xs group-hover/btn:translate-x-0.5 transition-transform">
                    →
                  </span>
                </button>
              </div>

              {/* 3-Column Visual Grid */}
              {evidenceItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(evidenceItems.filter((e) => e.isFeatured).length > 0
                    ? evidenceItems.filter((e) => e.isFeatured).slice(0, 3)
                    : evidenceItems.slice(0, 3)
                  ).map((item) => {
                    const firstImage = item.media.find((m) => m.type === 'image');
                    const firstLU = learningOutcomes.find((lu) => item.learningOutcomeIds.includes(lu.id));
                    return (
                      <article
                        key={item.id}
                        onClick={() => handleOpenEvidenceModal(item)}
                        className="group flex flex-col bg-white border border-[#E5E5E5] hover:border-[#050505] transition-all cursor-pointer overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)]"
                      >
                        {/* Card Image Banner */}
                        <div className="relative aspect-[16/10] bg-[#0c0d12] overflow-hidden">
                          {firstImage ? (
                            <img
                              src={firstImage.url}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col justify-between p-5 bg-gradient-to-br from-[#111218] to-[#1c1e28] text-white relative">
                              <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                              <div className="flex items-center justify-between relative z-10">
                                <span className="font-mono text-[10px] tracking-widest uppercase text-gray-400">
                                  SPRINT 0{item.sprintId}
                                </span>
                                <span className="w-2 h-2 rounded-full bg-[#00E5FF]" />
                              </div>
                              <div className="relative z-10">
                                <span className="font-mono text-xs text-[#00E5FF] font-bold tracking-wider block">
                                  {firstLU ? `${firstLU.code} • ${firstLU.title}` : 'EMBEDDED AI DOSSIER'}
                                </span>
                                <span className="font-display font-bold text-lg text-white/90 line-clamp-1">
                                  {item.title}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Category Tag pill */}
                          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1.5 border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#E03A3E]" />
                            <span>{item.isFeatured ? 'FEATURED' : 'DOSSIER'}</span>
                          </div>

                          <div className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-black/70 text-white flex items-center justify-center text-xs group-hover:bg-[#E03A3E] transition-colors">
                            →
                          </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center gap-2 text-[#6B6B6B] font-mono text-[11px] mb-2">
                              <span>SPRINT 0{item.sprintId}</span>
                              <span>•</span>
                              <span>{item.date}</span>
                            </div>

                            <h3 className="font-display font-black text-lg sm:text-xl text-[#050505] group-hover:text-[#E03A3E] transition-colors leading-snug mb-2 line-clamp-2">
                              {item.title}
                            </h3>

                            <p className="text-xs text-[#555] line-clamp-2 font-sans mb-4">
                              {item.investigated || item.created || item.learned || 'Bekijk het volledige onderzoeksrapport, methodologie en bewijslast.'}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#F0F0F0] flex items-center justify-between font-mono text-[11px]">
                            <span className="text-[#6B6B6B]">
                              {item.evaluationStatus === 'voldoende' ? 'Status: Gereed' : 'Status: In ontwikkeling'}
                            </span>
                            <span className="font-bold text-[#050505] group-hover:text-[#E03A3E] flex items-center gap-1">
                              Bekijk dossier →
                            </span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-dashed border-[#D5D5D0] p-10 text-center bg-[#FAFAF8]">
                  <div className="w-10 h-10 rounded-full bg-[#050505] text-white flex items-center justify-center mx-auto mb-3">
                    <Star className="w-5 h-5 text-[#E03A3E]" />
                  </div>
                  <h4 className="font-display font-bold text-base text-[#050505] mb-1">
                    Nog geen dossiers gepubliceerd
                  </h4>
                  <p className="text-xs font-mono text-[#6B6B6B] max-w-md mx-auto mb-4">
                    Zodra bewijsstukken worden geregistreerd in de sprint missies, verschijnen de belangrijkste dossiers hier als visuele research cards.
                  </p>
                  {isOwner && (
                    <button
                      onClick={() => handleOpenAddModalForSprint(selectedSprintId ?? 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#050505] text-white font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E03A3E] transition-colors"
                    >
                      + Eerste Dossier Toevoegen
                    </button>
                  )}
                </div>
              )}
            </section>

            {/* Sprints Tijdlijn & Dossiers (Split-Rail Layout or Classic) */}
            <div className="pt-8 border-t border-[#D5D5D0]">
              <div className="mb-6">
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#6B6B6B] block mb-1">
                  // TIJDLIJN (SPRINT 01 T/M 08)
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-[#050505] tracking-tight">
                  Sprint Missies & Dossier Ledger
                </h3>
              </div>

              {viewMode === 'editorial' ? (
                <div className="flex flex-col lg:flex-row gap-8 items-start">
                <SprintRail
                  sprints={sprints}
                  selectedSprintId={selectedSprintId}
                  onSelectSprint={handleSelectSprint}
                  evidenceItems={evidenceItems}
                  isOwner={isOwner}
                  onOpenQuickLinkModal={handleOpenQuickLink}
                  onOpenAddModal={handleOpenAddModalForSprint}
                />

                <div className="flex-1 min-w-0 w-full space-y-6">
                  {selectedSprintId !== null && (
                    <SprintBriefing
                      sprint={sprints.find((s) => s.id === selectedSprintId) || sprints[0]}
                      evidenceItems={evidenceItems}
                      onOpenEvidenceDetails={handleOpenEvidenceModal}
                    />
                  )}

                  {/* Filter Bar: Learning Outcomes & Search */}
                  <div className="bg-white border border-[#D5D5D0] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mr-1 flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5 text-[#050505]" />
                        FILTER:
                      </span>

                      <button
                        onClick={() => setSelectedLUFilter('all')}
                        className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                          selectedLUFilter === 'all'
                            ? 'bg-[#050505] text-white border-[#050505] font-bold'
                            : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                        }`}
                      >
                        ALLE LU'S
                      </button>

                      {learningOutcomes.map((lu) => {
                        const isSelected = selectedLUFilter === lu.id;
                        return (
                          <button
                            key={lu.id}
                            onClick={() => setSelectedLUFilter(lu.id)}
                            className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                              isSelected
                                ? 'bg-[#050505] text-white border-[#050505] border-b-2 border-b-[#E32636] font-bold'
                                : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                            }`}
                          >
                            {lu.code}: {lu.title.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative flex-1 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Zoek in dossiers, tools of tags..."
                          className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#F4F3EF] border border-[#D5D5D0] focus:border-[#050505] focus:bg-white text-[#050505] outline-none"
                        />
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="font-mono text-xs text-[#6B6B6B] hover:text-[#E32636] absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer uppercase"
                          >
                            Wissen
                          </button>
                        )}
                      </div>

                      {/* View mode switcher: Grid vs Ledger */}
                      <div className="flex items-center border border-[#D5D5D0] p-0.5 bg-[#F4F3EF]">
                        <button
                          type="button"
                          onClick={() => setEvidenceViewType('grid')}
                          className={`p-1.5 font-mono text-xs transition-colors cursor-pointer ${
                            evidenceViewType === 'grid' ? 'bg-[#050505] text-white' : 'text-[#6B6B6B] hover:text-[#050505]'
                          }`}
                          title="Rasterweergave (Dossierkaarten)"
                          aria-label="Rasterweergave"
                        >
                          <LayoutGrid className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEvidenceViewType('ledger')}
                          className={`p-1.5 font-mono text-xs transition-colors cursor-pointer ${
                            evidenceViewType === 'ledger' ? 'bg-[#050505] text-white' : 'text-[#6B6B6B] hover:text-[#050505]'
                          }`}
                          title="Tabeloverzicht (Evidence Ledger)"
                          aria-label="Tabeloverzicht"
                        >
                          <Table className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Evidence Count and Active Filter Indicator */}
                  <div className="flex items-center justify-between font-mono text-xs text-[#6B6B6B] px-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span>
                        DOSSIERS: <strong className="text-[#050505]">{filteredEvidence.length}</strong>{' '}
                        {filteredEvidence.length === 1 ? 'ITEM' : 'ITEMS'}
                      </span>
                      {selectedSprintId !== null && (
                        <span className="px-2 py-0.5 border border-[#D5D5D0] bg-white text-[#050505] text-[11px] font-bold">
                          SPRINT 0{selectedSprintId}
                        </span>
                      )}
                      {selectedLUFilter !== 'all' && (
                        <span className="px-2 py-0.5 border border-[#050505] bg-[#050505] text-white text-[11px] font-bold">
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
                        className="text-[#E32636] hover:underline font-bold uppercase tracking-wider cursor-pointer text-xs"
                      >
                        [ FILTERS RESETTEN ]
                      </button>
                    )}
                  </div>

                  {/* Evidence Display (Grid or Ledger) */}
                  {filteredEvidence.length > 0 ? (
                    evidenceViewType === 'ledger' ? (
                      <EvidenceLedger
                        items={filteredEvidence}
                        learningOutcomes={learningOutcomes}
                        onOpenDetails={handleOpenEvidenceModal}
                        onEdit={isOwner ? handleEditEvidence : undefined}
                        onDelete={isOwner ? handleDeleteEvidence : undefined}
                        isOwner={isOwner}
                      />
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredEvidence.map((item) => (
                          <EvidenceCard
                            key={item.id}
                            item={item}
                            learningOutcomes={learningOutcomes}
                            onOpenDetails={handleOpenEvidenceModal}
                            onDelete={isOwner ? handleDeleteEvidence : undefined}
                            onEdit={isOwner ? handleEditEvidence : undefined}
                          />
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="bg-white border border-[#D5D5D0] p-12 text-center max-w-lg mx-auto">
                      <div className="w-12 h-12 bg-[#050505] text-white flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-[#050505] mb-1">
                        Geen dossiers gevonden
                      </h3>
                      <p className="text-xs font-mono text-[#6B6B6B] mb-6">
                        {selectedSprintId 
                          ? `Nog geen geregistreerde items voor Sprint 0${selectedSprintId}.` 
                          : 'Er zijn geen bewijsstukken die voldoen aan het actieve filter.'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <SprintNav
                sprints={sprints}
                selectedSprintId={selectedSprintId}
                onSelectSprint={handleSelectSprint}
                evidenceItems={evidenceItems}
                onOpenQuickLinkModal={handleOpenQuickLink}
                onOpenAddModal={handleOpenAddModalForSprint}
                onOpenEvidenceDetails={handleOpenEvidenceModal}
                isOwner={isOwner}
              />
            )}
            </div>
          </div>
        )}

        {/* Tab 1: Homepage (Wie ben ik? Persoonlijk verhaal & Foto's) */}
        {activeTab === 'profile' && (
          <PersonalStory
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToSprints={() => {
              handleTabChange('evidence');
              handleSelectSprint(1);
            }}
            isOwner={isOwner}
          />
        )}

        {/* Tab 2: Sprints & Links (Bewijzen per Sprint) */}
        {activeTab === 'evidence' && (
          <div>
            {viewMode === 'editorial' ? (
              <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Left Sticky Vertical Command Rail */}
                <SprintRail
                  sprints={sprints}
                  selectedSprintId={selectedSprintId}
                  onSelectSprint={handleSelectSprint}
                  evidenceItems={evidenceItems}
                  isOwner={isOwner}
                  onOpenQuickLinkModal={handleOpenQuickLink}
                  onOpenAddModal={handleOpenAddModalForSprint}
                />

                {/* Right Editorial Evidence Area */}
                <div className="flex-1 min-w-0 w-full space-y-6">
                  {selectedSprintId !== null && (
                    <SprintBriefing
                      sprint={sprints.find((s) => s.id === selectedSprintId) || sprints[0]}
                      evidenceItems={evidenceItems}
                      onOpenEvidenceDetails={handleOpenEvidenceModal}
                    />
                  )}

                  {/* Filter Bar: Learning Outcomes & Search */}
            <div className="bg-white border border-[#D5D5D0] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* LU Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mr-1 flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-[#050505]" />
                  FILTER:
                </span>

                <button
                  onClick={() => setSelectedLUFilter('all')}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                    selectedLUFilter === 'all'
                      ? 'bg-[#050505] text-white border-[#050505] font-bold'
                      : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                  }`}
                >
                  ALLE LU'S
                </button>

                {learningOutcomes.map((lu) => {
                  const isSelected = selectedLUFilter === lu.id;
                  return (
                    <button
                      key={lu.id}
                      onClick={() => setSelectedLUFilter(lu.id)}
                      className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                        isSelected
                          ? 'bg-[#050505] text-white border-[#050505] border-b-2 border-b-[#E32636] font-bold'
                          : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                      }`}
                    >
                      {lu.code}: {lu.title.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Zoek in dossiers, tools of tags..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#F4F3EF] border border-[#D5D5D0] focus:border-[#050505] focus:bg-white text-[#050505] outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="font-mono text-xs text-[#6B6B6B] hover:text-[#E32636] absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer uppercase"
                    >
                      Wissen
                    </button>
                  )}
                </div>

                {/* View mode switcher: Grid vs Ledger */}
                <div className="flex items-center border border-[#D5D5D0] p-0.5 bg-[#F4F3EF]">
                  <button
                    type="button"
                    onClick={() => setEvidenceViewType('grid')}
                    className={`p-1.5 font-mono text-xs transition-colors cursor-pointer ${
                      evidenceViewType === 'grid' ? 'bg-[#050505] text-white' : 'text-[#6B6B6B] hover:text-[#050505]'
                    }`}
                    title="Rasterweergave (Dossierkaarten)"
                    aria-label="Rasterweergave"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEvidenceViewType('ledger')}
                    className={`p-1.5 font-mono text-xs transition-colors cursor-pointer ${
                      evidenceViewType === 'ledger' ? 'bg-[#050505] text-white' : 'text-[#6B6B6B] hover:text-[#050505]'
                    }`}
                    title="Tabeloverzicht (Evidence Ledger)"
                    aria-label="Tabeloverzicht"
                  >
                    <Table className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Evidence Count and Active Filter Indicator */}
            <div className="flex items-center justify-between font-mono text-xs text-[#6B6B6B] px-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span>
                  DOSSIERS: <strong className="text-[#050505]">{filteredEvidence.length}</strong>{' '}
                  {filteredEvidence.length === 1 ? 'ITEM' : 'ITEMS'}
                </span>
                {selectedSprintId !== null && (
                  <span className="px-2 py-0.5 border border-[#D5D5D0] bg-white text-[#050505] text-[11px] font-bold">
                    SPRINT 0{selectedSprintId}
                  </span>
                )}
                {selectedLUFilter !== 'all' && (
                  <span className="px-2 py-0.5 border border-[#050505] bg-[#050505] text-white text-[11px] font-bold">
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
                  className="text-[#E32636] hover:underline font-bold uppercase tracking-wider cursor-pointer text-xs"
                >
                  [ FILTERS RESETTEN ]
                </button>
              )}
            </div>

            {/* Evidence Display (Grid or Ledger) */}
            {filteredEvidence.length > 0 ? (
              evidenceViewType === 'ledger' ? (
                <EvidenceLedger
                  items={filteredEvidence}
                  learningOutcomes={learningOutcomes}
                  onOpenDetails={handleOpenEvidenceModal}
                  onEdit={isOwner ? handleEditEvidence : undefined}
                  onDelete={isOwner ? handleDeleteEvidence : undefined}
                  isOwner={isOwner}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvidence.map((item) => (
                    <EvidenceCard
                      key={item.id}
                      item={item}
                      learningOutcomes={learningOutcomes}
                      onOpenDetails={handleOpenEvidenceModal}
                      onDelete={isOwner ? handleDeleteEvidence : undefined}
                      onEdit={isOwner ? handleEditEvidence : undefined}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="bg-white border border-[#D5D5D0] p-12 text-center max-w-lg mx-auto">
                <div className="w-12 h-12 bg-[#050505] text-white flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display text-lg font-bold text-[#050505] mb-1">
                  Geen dossiers gevonden
                </h3>
                <p className="text-xs font-mono text-[#6B6B6B] mb-6">
                  {selectedSprintId 
                    ? `Nog geen geregistreerde items voor Sprint 0${selectedSprintId}.` 
                    : 'Er zijn geen bewijsstukken die voldoen aan het actieve filter.'}
                </p>
                {isOwner && (
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => handleOpenQuickLink(selectedSprintId || 1)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#050505] hover:bg-[#E32636] text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Externe Link toevoegen</span>
                    </button>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-transparent hover:bg-[#F4F3EF] text-[#050505] border border-[#D5D5D0] font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <span>Volledig Bewijs</span>
                    </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
              <div className="space-y-6">
                <SprintNav
                  sprints={sprints}
                  selectedSprintId={selectedSprintId}
                  onSelectSprint={handleSelectSprint}
                  evidenceItems={evidenceItems}
                  onOpenQuickLinkModal={handleOpenQuickLink}
                  onOpenAddModal={handleOpenAddModalForSprint}
                  onOpenEvidenceDetails={handleOpenEvidenceModal}
                  isOwner={isOwner}
                />

                {/* Classic Filter Bar */}
                <div className="bg-white border border-[#D5D5D0] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#6B6B6B] mr-1 flex items-center gap-1.5">
                      <Filter className="w-3.5 h-3.5 text-[#050505]" />
                      FILTER:
                    </span>
                    <button
                      onClick={() => setSelectedLUFilter('all')}
                      className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                        selectedLUFilter === 'all'
                          ? 'bg-[#050505] text-white border-[#050505] font-bold'
                          : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                      }`}
                    >
                      ALLE LU'S
                    </button>
                    {learningOutcomes.map((lu) => (
                      <button
                        key={lu.id}
                        onClick={() => setSelectedLUFilter(lu.id)}
                        className={`px-2.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border ${
                          selectedLUFilter === lu.id
                            ? 'bg-[#050505] text-white border-[#050505] border-b-2 border-b-[#E32636] font-bold'
                            : 'border-[#D5D5D0] bg-[#F4F3EF] text-[#6B6B6B] hover:text-[#050505] hover:border-[#050505]'
                        }`}
                      >
                        {lu.code}: {lu.title.split(' ')[0]}
                      </button>
                    ))}
                  </div>

                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-3.5 h-3.5 text-[#6B6B6B] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek in dossiers, tools of tags..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs font-mono bg-[#F4F3EF] border border-[#D5D5D0] focus:border-[#050505] focus:bg-white text-[#050505] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredEvidence.map((item) => (
                    <EvidenceCard
                      key={item.id}
                      item={item}
                      learningOutcomes={learningOutcomes}
                      onOpenDetails={handleOpenEvidenceModal}
                      onDelete={isOwner ? handleDeleteEvidence : undefined}
                      onEdit={isOwner ? handleEditEvidence : undefined}
                    />
                  ))}
                </div>
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

      {/* Technical Editorial Footer */}
      <footer className="bg-white border-t border-[#D5D5D0] mt-16 py-8 text-xs text-[#6B6B6B] font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-[#050505]" />
            <span className="tracking-wide">
              HOGESCHOOL UTRECHT // MINOR <span className="font-bold text-[#050505]">FUTURE-PROOF MET AI</span> // PORTFOLIO THIJS BUISMAN
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="text-[#050505] hover:text-[#E32636] inline-flex items-center gap-1.5 uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              Hosting & Deploy
            </button>
            {isOwner && (
              <>
                <span className="text-[#D5D5D0]">|</span>
                <button
                  onClick={handleResetToCleanState}
                  className="text-[#6B6B6B] hover:text-[#E32636] inline-flex items-center gap-1 uppercase tracking-wider transition-colors cursor-pointer"
                  title="Wis alle opgeslagen bewijzen voor een schone start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Schone start
                </button>
              </>
            )}
            <span className="text-[#D5D5D0]">|</span>
            <button
              onClick={() => handleTabChange('profile')}
              className="hover:text-[#050505] uppercase tracking-wider transition-colors cursor-pointer"
            >
              Persoonlijk Verhaal
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
          onClose={handleCloseEvidenceModal}
          onUpdateStatus={isOwner ? handleUpdateStatus : undefined}
          onEdit={isOwner ? handleEditEvidence : undefined}
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

      {editingEvidence && (
        <AddEvidenceModal
          isOpen={true}
          learningOutcomes={learningOutcomes}
          onClose={() => setEditingEvidence(null)}
          onAddEvidence={handleAddEvidence}
          initialItem={editingEvidence}
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
        />
      )}
    </div>
  );
}
