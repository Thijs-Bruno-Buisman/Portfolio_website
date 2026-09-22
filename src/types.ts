export interface ProfilePhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
}

export interface UserProfile {
  name: string;
  studentNumber: string;
  institution: string;
  minor: string;
  studyTrack: string;
  bio: string;
  talents: string[];
  passions: string[];
  dreams: string[];
  avatarUrl: string;
  photos?: ProfilePhoto[];
  socials: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface SprintExternalLink {
  id: string;
  sprintId: number;
  title: string;
  url: string;
  platform: 'onedrive' | 'youtube' | 'github' | 'figma' | 'other';
  learningOutcomeId?: string;
  description?: string;
  dateAdded?: string;
}

export interface LearningOutcome {
  id: string;
  code: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  color: string;
  minEvaluationsRequired: number;
}

export interface Sprint {
  id: number;
  title: string;
  period: string;
  focus: string;
  showAndTellDate: string;
  showAndTellSummary?: string;
  peerFeedback?: string;
  coachFeedback?: string;
}

export interface MediaItem {
  type: 'image' | 'video' | 'link' | 'file';
  url: string;
  title: string;
  caption?: string;
  storagePath?: string;
  mimeType?: string;
  size?: number;
}

export interface EvidenceItem {
  id: string;
  title: string;
  sprintId: number;
  learningOutcomeIds: string[];
  date: string;
  investigated: string; // Wat heb ik onderzocht?
  created: string;      // Wat heb ik gemaakt?
  learned: string;      // Wat heb ik geleerd?
  media: MediaItem[];
  evaluationStatus: 'voldoende' | 'in_behandeling' | 'zelfevaluatie_klaar';
  tags: string[];
  toolsUsed: string[];
  isFeatured?: boolean; // Expliciet beheerd veld voor uitgelichte hoofdbewijzen
}

export interface UserStory {
  id: string;
  category: 'Persoonlijk Verhaal' | 'Sprint Navigatie' | 'Bewijslast & Leeruitkomsten' | 'Media & Bewijsmateriaal' | 'Eenvoud & Assessment' | 'Externe Hosting & Links';
  role: string;
  want: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority: 'Must' | 'Should' | 'Could';
}
