# Portfolio "Future-proof met AI" (Hogeschool Utrecht)

Een modern, statisch bewijzenportfolio voor de HU-minor **"Future-proof met AI"**. Ontworpen volgens het **Zero-Repo-Bloat** principe: geen grote mediabestanden in GitHub of Vercel, maar gestructureerde externe links naar **OneDrive/SharePoint** (voor documenten & presentaties) en **YouTube/Loom** (voor video demo's en Show & Tells).

---

## Belangrijkste Eigenschappen

- 🏠 **Homepage (Persoonlijk Verhaal)**:
  - Wie ben ik?, opleiding en studentnummer.
  - De 3 kernpijlers: **Mijn Talenten**, **Mijn Passies** en **Mijn Dromen**.
  - **Ruimte voor Foto's**: Visuele fotogalerij (Show & Tells, prototyping sessies) inclusief lightbox vergroting.
  - Persoonlijke **AI-Visie** en startpunt in de minor.
- 🚀 **Sprints & Links (Sprint 1 t/m 8)**:
  - Tweewekelijkse navigatie met Show & Tell samenvattingen, peerfeedback en coachfeedback.
  - **Directe Externe Deliverables Bar**: Prominente koppeling naar OneDrive documenten, YouTube video's en GitHub code.
  - **"+ Externe Link toevoegen" knop**: Voeg in 3 klikken een nieuwe link toe aan een sprint.
  - De 3 HU-reflectievragen per bewijs:
    1. 🔍 *Wat heb ik onderzocht?*
    2. 🛠️ *Wat heb ik gemaakt?*
    3. 💡 *Wat heb ik geleerd?*
- 🎯 **Leeruitkomsten (LU 1 t/m 4)**:
  - Automatische evaluatieteller per leeruitkomst (voldoet ruim aan de 24 vereiste beoordelingsmomenten).
  - Interactieve filters per leeruitkomst.
- 📋 **Requirements & User Stories**:
  - Overzicht van alle geformuleerde user stories inclusief acceptatiecriteria.

---

## ✏️ Hoe pas ik mijn eigen teksten & foto's aan?

Alle teksten, naam, foto's, bio en links zijn overzichtelijk verzameld in één centraal bestand:
```
src/data/initialData.ts
```

In dit bestand vind je heldere Nederlandse commentaarregels:
1. **Homepage gegevens**: pas `initialProfile` aan met je eigen naam, studentnummer, bio, talenten, passies, dromen en foto-links (bijv. van Unsplash of je eigen GitHub avatar).
2. **Sprints & Feedback**: pas `sprints` aan met de planning van jouw leerteam.
3. **Bewijzen & Externe Links**: pas `initialEvidenceItems` aan met jouw eigen OneDrive-deellinks en YouTube-links.

> **Tip:** Je kunt ook direct in de browser op de site klikken op **"Profiel & Verhaal Bewerken"** of **"+ Externe Link toevoegen"**. Via de knop **"Hosting & Deploy Gids"** onderaan kun je de aangepaste JSON kopiëren en direct in `initialData.ts` plakken!

---

## 🚀 Publiceren & Hosten

De site is een statische Single-Page Application (HTML, CSS, JS) en kan gratis en zonder serverkosten worden gehost:

### Optie 1: Vercel (Aanbevolen, binnen 1 minuut)
1. Push de code naar je GitHub account.
2. Ga naar [vercel.com](https://vercel.com) en klik op **Add New Project**.
3. Kies je GitHub repository. Vercel herkent automatisch het Vite-framework:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Klik op **Deploy**. Je portfolio is direct live met HTTPS!

### Optie 2: GitHub Pages
1. Bouw de statische bestanden met:
   ```bash
   npm run build
   ```
2. De map `dist/` bevat de pure statische HTML-, CSS- en JS-bestanden die je direct via GitHub Actions of via een `gh-pages` branch kunt serveren.
