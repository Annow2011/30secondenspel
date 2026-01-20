# GitHub Upload Instructies (Zonder problemen)

Het klopt dat sommige mappen (zoals `node_modules`) niet gekopieerd kunnen worden naar GitHub. Dat hoort ook zo! Hier is hoe je het project simpel en foutloos op GitHub krijgt:

### Stap 1: Wat je WEL moet uploaden
Kopieer **alleen** deze mappen en bestanden naar je nieuwe GitHub repository:
- `client/` (deze map bevat al je schermen en code)
- `public/` (afbeeldingen en icoontjes)
- `index.html`
- `package.json`
- `vite.config.ts` (en andere .ts/.js bestanden in de hoofdmap)
- `tailwind.config.ts`
- `tsconfig.json`

### Stap 2: Wat je NIET moet uploaden
GitHub weigert vaak deze mappen, en dat is goed:
- `node_modules/` (deze is veel te groot, GitHub bouwt dit zelf)
- `.git/` (als die er al staat)
- `dist/` (dit is de tijdelijke bouwmap)

### Stap 3: De makkelijkste manier (Drag & Drop)
1. Ga naar je repository op GitHub.com.
2. Klik op **Add file** -> **Upload files**.
3. Selecteer alle bestanden uit de uitgepakte zip op je computer (behalve `node_modules`).
4. Sleep ze in het venster.

### Stap 4: De site live zetten (GitHub Actions)
Omdat je een domein wilt koppelen, moet GitHub de site voor je "bouwen". Ik heb een bestand klaargezet in het project (`.github/workflows/deploy.yml`) dat dit automatisch voor je doet zodra je de bestanden uploadt.

**Tip:** Als GitHub nog steeds klaagt over "te veel bestanden", probeer dan eerst alleen de `package.json` en de `client/` map te uploaden.
