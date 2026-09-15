# Portfolio Future-proof met AI

Een React- en TypeScript-portfolio voor de HU-minor Future-proof met AI. Vite bouwt de website; Supabase verzorgt authenticatie, permanente opslag en live updates. Bewijsbestanden blijven als externe links naar bijvoorbeeld OneDrive, YouTube, GitHub of Figma opgeslagen.

## Lokaal starten

Vereisten: Node.js en npm.

1. Installeer de dependencies:

   ```bash
   npm install
   ```

2. Kopieer `.env.example` naar `.env`.
3. Vul in `.env` de Project URL en publishable key uit **Supabase > Project Settings > API** in:

   ```text
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```

   Gebruik in de browser nooit een Supabase secret key of `service_role` key. Bestanden met de naam `.env*` worden door Git genegeerd, behalve het veilige voorbeeldbestand `.env.example`.

4. Start de ontwikkelserver:

   ```bash
   npm run dev
   ```

Na een wijziging in `.env` moet de ontwikkelserver opnieuw worden gestart.

## Supabase inrichten

1. Open de SQL Editor van je Supabase-project.
2. Voer `supabase-schema.sql` uit. Dit maakt:
   - `profiles`: het publieke portfolio-profiel;
   - `evidence`: bewijsstukken en links;
   - `portfolio_owners`: de lijst met accounts die mogen schrijven;
   - de functie `is_portfolio_owner()`, beveiligingsregels en Realtime-configuratie.
3. Zet in **Authentication > Providers** de Google-provider aan.
4. Voeg bij **Authentication > URL Configuration** de lokale en gepubliceerde website-URL toe.
5. Log één keer via de website in en kopieer daarna je User UID uit **Authentication > Users**.
6. Voer de onderaan `supabase-schema.sql` beschreven owner-insert uit met die UID.

Bezoekers mogen `profiles` en `evidence` lezen. Alleen een gebruiker in `portfolio_owners` mag inhoud toevoegen, wijzigen of verwijderen.

## Projectinhoud aanpassen

De standaardinhoud staat in `src/data/initialData.ts`. Via de eigenaarsmodus kun je profielgegevens, bewijsstukken en externe links aanpassen. Een wijziging verschijnt pas in de interface nadat Supabase het opslaan heeft bevestigd.

## Controles en bouwen

```bash
npm run lint
npm run build
npm run preview
```

De productie-uitvoer komt in `dist/`. Vite verwerkt de `VITE_...`-variabelen tijdens de build; stel dezelfde variabelen daarom ook in bij je hostingprovider voordat je daar bouwt.

## AI-assisted development

Deze website is ontwikkeld met ondersteuning van AI-codegeneratie. GitHub Copilot is in een eerdere fase gebruikt. Codex is daarna gebruikt om de mislukte Firebase/Supabase-implementatie te analyseren, Firebase te verwijderen en de Supabase-koppeling te repareren. De uiteindelijke werking is handmatig gecontroleerd in de browser en in het Supabase-dashboard; AI-output is dus beoordeeld en getest voordat deze is geaccepteerd.
