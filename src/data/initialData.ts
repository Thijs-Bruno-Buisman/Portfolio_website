import { UserProfile, LearningOutcome, Sprint, EvidenceItem } from '../types';

/* ========================================================================= */
/* 1. HOMEPAGE: PERSOONLIJK VERHAAL (WIE BEN IK, TALENTEN, PASSIES, DROMEN)  */
/* ========================================================================= */
export const initialProfile: UserProfile = {
  name: 'Thijs Buisman',
  studentNumber: '1855662',
  institution: 'Hogeschool Utrecht',
  minor: 'Future-proof met AI',
  studyTrack: 'HBO Electrical Engineering',
  bio: 'Gepassioneerd door de kruising van menselijke creativiteit, maatschappelijke impact en toegepaste AI-technologieën. Tijdens de minor "Future-proof met AI" onderzoek ik hoe generatieve modellen en AI-agents workflows in mijn toekomstige werkveld fundamenteel vernieuwen.',
  talents: [
    'Snel doorgronden van nieuwe AI-tools & API workflows',
    'Kritisch en nieuwsgierig leervragen formuleren',
    'Complexe technische concepten tastbaar maken voor niet-techneuten',
    'Doelgericht experimenteren en snel itereren met prototypes',
  ],
  passions: [
    'De praktische inzet van LLM agents en automations',
    'Ethische vraagstukken rondom AI-bias, privacy en copyright',
    'Open-source technologie en community-driven innovatie',
    'Het ontwerpen van intuïtieve user experiences die mens en machine verbinden',
  ],
  dreams: [
    'Een AI-specialist of product lead worden die organisaties helpt AI verantwoord te implementeren',
    'Zelf een AI-gestuurde applicatie lanceren die repeterend werk wegneemt bij maatschappelijke organisaties',
    'Blijven pionieren aan de voorhoede van opkomende technologische doorbraken',
  ],
  avatarUrl: 'https://avatars.githubusercontent.com/u/190847957?v=4',
  photos: [],
  socials: {
    github: 'https://github.com/Thijs-Bruno-Buisman',
    linkedin: 'https://www.linkedin.com/in/thijs-buisman-612b933aa?',
    email: 'thijs.buisman@student.hu.nl',
  },
};

/* ========================================================================= */
/* 2. LEERUITKOMSTEN TOETSCRITERIA (LU 1 T/M 5)                              */
/* Exact afgestemd op de toetstabel van de HU Minor: 18 evaluaties in totaal */
/* ========================================================================= */
export const learningOutcomes: LearningOutcome[] = [
  {
    id: 'lu1',
    code: 'LU 1',
    title: 'Impact',
    shortDesc: 'Onderzoek naar de maatschappelijke, technologische en organisatorische impact van AI.',
    fullDesc: 'De student onderzoekt systematisch de actuele en verwachte invloed van AI op het eigen werkveld, formuleert scherpe onderzoeksvragen, analyseert trends en kansen, en identificeert benodigde competenties voor de toekomst.',
    color: 'emerald',
    minEvaluationsRequired: 2,
  },
  {
    id: 'lu2',
    code: 'LU 2',
    title: 'Oplossing',
    shortDesc: 'Ontwerpen, realiseren en valideren van een functionele AI-toepassing of werkende oplossing.',
    fullDesc: 'De student ontwikkelt en toetst zelfstandig of in teamverband een tastbare AI-oplossing (zoals een prototype, applicatie of integratie) voor een reëel praktijkprobleem en valideert de effectiviteit.',
    color: 'blue',
    minEvaluationsRequired: 4,
  },
  {
    id: 'lu3',
    code: 'LU 3',
    title: 'Ethiek',
    shortDesc: 'Ethische toetsing, verantwoorde AI, bias-detectie, privacy (AVG) en EU AI Act richtlijnen.',
    fullDesc: 'De student toetst AI-toepassingen kritisch op betrouwbaarheid, vooroordelen (bias), transparantie, privacy en gegevensbescherming en formuleert gefundeerde adviezen voor ethisch en verantwoord gebruik.',
    color: 'amber',
    minEvaluationsRequired: 2,
  },
  {
    id: 'lu4',
    code: 'LU 4',
    title: 'Tools',
    shortDesc: 'Hands-on beheersing en doelgericht toepassen van AI-tools, prompting-technieken en API\'s.',
    fullDesc: 'De student versterkt eigen digitale en technische vaardigheden door actief geavanceerde AI-tools, frameworks, prompt engineering en API-workflows te verkennen, vergelijken en toe te passen in de praktijk.',
    color: 'indigo',
    minEvaluationsRequired: 4,
  },
  {
    id: 'lu5',
    code: 'LU 5',
    title: 'Zelfsturing',
    shortDesc: 'Regie over het eigen leerproces, leervragen formuleren, Show & Tells en feedbackloops.',
    fullDesc: 'De student formuleert eigen leervragen per sprint, stuurt actief op feedback vanuit leercoaches en het leerteam, presenteert resultaten tijdens tweewekelijkse Show & Tells en reflecteert diepgaand op de eigen groei.',
    color: 'purple',
    minEvaluationsRequired: 6,
  },
];

export const sprints: Sprint[] = [
  {
    id: 1,
    title: 'Sprint 1: Oriëntatie & Het AI Landschap',
    period: 'Week 1 - 2',
    focus: 'Verkenning van het AI-landschap, leervragen formuleren en eerste experimenten met prompting.',
    showAndTellDate: 'Vrijdag Sprint 1',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 2,
    title: 'Sprint 2: Diepgang in AI Tools & Workflows',
    period: 'Week 3 - 4',
    focus: 'Integreren van multimodale tools (beeld, code, audio) in een specifieke werkstroom.',
    showAndTellDate: 'Vrijdag Sprint 2',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 3,
    title: 'Sprint 3: Ethische Toetsing & Privacy',
    period: 'Week 5 - 6',
    focus: 'Ethische kaders, de EU AI Act, bias-detectie en verantwoorde dataverwerking.',
    showAndTellDate: 'Vrijdag Sprint 3',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 4,
    title: 'Sprint 4: Midterm & Eerste AI Prototype',
    period: 'Week 7 - 8',
    focus: 'Realisatie van een eerste functioneel werkend AI-prototype voor het eigen vraagstuk.',
    showAndTellDate: 'Vrijdag Sprint 4 (Midterm)',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 5,
    title: 'Sprint 5: Validatie in het Beroepenveld',
    period: 'Week 9 - 10',
    focus: 'Toetsing van het prototype bij echte eindgebruikers en experts in het vakgebied.',
    showAndTellDate: 'Vrijdag Sprint 5',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 6,
    title: 'Sprint 6: Geavanceerde AI & Agents',
    period: 'Week 11 - 12',
    focus: 'Experimenteren met autonomous agents, tool-calling en multi-step reasoning.',
    showAndTellDate: 'Vrijdag Sprint 6',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 7,
    title: 'Sprint 7: Verfijning, Documentatie & Impact',
    period: 'Week 13 - 14',
    focus: 'Optimalisatie van de applicatie, opstellen van handleiding en impactrapportage.',
    showAndTellDate: 'Vrijdag Sprint 7',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
  {
    id: 8,
    title: 'Sprint 8: Eindassessment & Toekomstvisie',
    period: 'Week 15 - 16',
    focus: 'Eindpresentatie, portfolio afronding en formuleren van de persoonlijke visie op future-proof werken.',
    showAndTellDate: 'Eindevent & Assessment',
    showAndTellSummary: '',
    peerFeedback: '',
    coachFeedback: '',
  },
];

// Geen standaard mock voorbeelden in het portfolio; de student vult zijn eigen bewijsstukken in.
export const initialEvidenceItems: EvidenceItem[] = [];
