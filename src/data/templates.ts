export interface EvidenceTemplate {
  id: string;
  name: string;
  badge: string;
  description: string;
  defaultLU: string[];
  suggestedTitle: string;
  investigatedText: string;
  createdText: string;
  learnedText: string;
  suggestedTools: string;
  suggestedTags: string;
}

export const EVIDENCE_TEMPLATES: EvidenceTemplate[] = [
  {
    id: 'star',
    name: 'STAR-Reflectie (Algemeen)',
    badge: 'Standaard',
    description: 'Gestructureerde reflectie op basis van Situatie, Taak, Actie, Resultaat en Inzichten.',
    defaultLU: ['lu1', 'lu5'],
    suggestedTitle: 'Onderzoek & Ontwikkeling: [Onderwerp]',
    investigatedText: `[Situatie & Leervraag]:\nWelke vraag of uitdaging stond centraal in deze sprint? Welke theorie, kaders of literatuur heb ik bestudeerd?\n\n[Aanpak]:\nHoe heb ik de verkenning aangepakt en wie waren de belanghebbenden?`,
    createdText: `[Actie & Uitvoering]:\nWelke concrete stappen heb ik ondernomen?\n\n[Opgeleverd Artefact]:\nWat is het tastbare resultaat (rapport, document, prototype, presentatie, testdata)?`,
    learnedText: `[Belangrijkste Inzichten]:\nWat heb ik geleerd over AI en mijn eigen handelen?\n\n[Reflectie & Volgende Stap]:\nWat ging goed, wat bleek lastiger dan verwacht en wat neem ik mee naar de volgende sprint?`,
    suggestedTools: 'ChatGPT, Notion, Miro',
    suggestedTags: 'Onderzoek, Reflectie, Minor AI',
  },
  {
    id: 'tools-prototype',
    name: 'LU 2 & 4: Tool & Prototype (Oplossing & Tools)',
    badge: 'LU 2 & 4',
    description: 'Ideaal voor het testen van AI-modellen, prompts, API\'s en het bouwen van een werkend prototype.',
    defaultLU: ['lu2', 'lu4'],
    suggestedTitle: 'Werkend Prototype: [Naam van toepassing/tool]',
    investigatedText: `[Tool- & Modelverkenning]:\nWelke AI-tools, frameworks, modellen of API's heb ik onderzocht en met elkaar vergeleken?\n\n[Prompting & Randvoorwaarden]:\nWelke prompttechnieken of parameters zijn getest op betrouwbaarheid en outputkwaliteit?`,
    createdText: `[Gerealiseerd Artefact]:\nEen werkende applicatie / script / promptketen / workflow die het probleem oplost.\n\n[Deliverable Link]:\n(Plak hieronder de link naar de code repository, demo of OneDrive documentatie)`,
    learnedText: `[Technische Inzichten]:\nWat zijn de sterke kanten en de beperkingen (latency, hallucinaties, kosten) van de gekozen tool?\n\n[Praktische Bruikbaarheid]:\nIn hoeverre is dit direct inzetbaar in het werkveld?`,
    suggestedTools: 'Claude 3.5 Sonnet, Cursor, Python, Streamlit',
    suggestedTags: 'Prototype, AI Tools, Prompt Engineering, Oplossing',
  },
  {
    id: 'impact-ethics',
    name: 'LU 1 & 3: Impact & Ethiek (Impact & Verantwoordelijkheid)',
    badge: 'LU 1 & 3',
    description: 'Voor onderzoek naar maatschappelijke impact, EU AI Act, privacy (AVG) en bias.',
    defaultLU: ['lu1', 'lu3'],
    suggestedTitle: 'Ethische Analyse & Impact: [Onderwerp/Sector]',
    investigatedText: `[Onderzoek naar AI-Impact]:\nHoe transformeert AI de werkprocessen en rollen in dit specifieke domein?\n\n[Ethische Toetsing & Kaders]:\nWelke risico's rondom vooringenomenheid (bias), privacy (AVG), auteursrechten of de EU AI Act spelen een rol?`,
    createdText: `[Geleverd Verslag / Artefact]:\nEen ethisch afwegingskader, impactanalyse, checklist of interviewrapportage met domeindeskundigen.`,
    learnedText: `[Ethisch Inzicht & Standpunt]:\nWat is mijn beargumenteerde visie op verantwoorde toepassing in deze context?\n\n[Aanbevelingen]:\nWelke waarborgen en menselijke controle (human-in-the-loop) zijn noodzakelijk?`,
    suggestedTools: 'EU AI Act kaders, FRAIA framework, Google Docs',
    suggestedTags: 'Impact, Ethiek, EU AI Act, Privacy, Verantwoordelijkheid',
  },
  {
    id: 'self-direction',
    name: 'LU 5: Zelfsturing & Show & Tell (Regie & Feedback)',
    badge: 'LU 5',
    description: 'Voor Show & Tell presentaties, ontvangen peer-/coachfeedback en persoonlijke groei.',
    defaultLU: ['lu5'],
    suggestedTitle: 'Show & Tell & Feedbackloop Sprint [X]',
    investigatedText: `[Persoonlijke Leervraag]:\nWelk specifiek leerdoel had ik mijzelf gesteld voor deze sprint en hoe sluit dit aan bij mijn minor-doelen?\n\n[Voorbereiding]:\nHoe heb ik mijn werk gestructureerd en klaargezet voor de Show & Tell?`,
    createdText: `[Presentatie & Deliverables]:\nShow & Tell presentatie / live demonstratie aan het leerteam en de leercoach.\n\n[Ontvangen Feedback]:\n• Feedback van peers:\n• Feedback van de coach:`,
    learnedText: `[Zelfevaluatie]:\nHoe kijk ik terug op mijn eigen inzet, voortgang en samenwerking in het leerteam?\n\n[Aanpassing Leerroute]:\nHoe verwerk ik de ontvangen feedback in mijn volgende sprintplanning en leervragen?`,
    suggestedTools: 'Miro, PowerPoint, Show & Tell sessie',
    suggestedTags: 'Zelfsturing, Show and Tell, Feedback, Reflectie',
  },
];
