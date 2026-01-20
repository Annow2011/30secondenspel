# 30 Seconds Online - GitHub Pages Deployment Guide

Dit project is gebouwd met React, Vite en Tailwind CSS. Volg deze stappen om het gratis te hosten op GitHub Pages:

## 1. Voorbereiding
Download de projectbestanden van Replit naar je computer.

## 2. GitHub Repository
- Maak een nieuwe repository aan op GitHub (bijv. `30-seconds-online`).
- Upload je bestanden naar deze repository.

## 3. Aanpassingen voor GitHub Pages
Omdat GitHub Pages statische hosting is, moet het project als een "Static Site" worden gebouwd.

### Vite Config
Zorg dat `vite.config.ts` de juiste `base` path heeft:
```typescript
export default defineConfig({
  base: './', // Zorgt voor relatieve paden
  // ... rest van je config
})
```

### Routing
GitHub Pages ondersteunt geen 'Single Page Application' routing direct. Gebruik `HashRouter` of voeg een `404.html` trucje toe (kopieer `index.html` naar `404.html` in de `dist` map na het bouwen).

## 4. Bouwen en Deployen
Run de volgende commando's in je terminal:
```bash
npm install
npm run build
```
De inhoud van de map `dist/public` (of `dist` afhankelijk van je config) is wat je moet hosten.

### GitHub Actions (Aanbevolen)
Je kunt een GitHub Action instellen die automatisch je site bouwt en naar de `gh-pages` branch pusht wanneer je wijzigingen maakt.

## 5. Custom Domain (30secondenspel.nl)
- Ga in GitHub naar **Settings > Pages**.
- Vul onder **Custom domain** `30secondenspel.nl` in.
- Configureer je DNS bij je domein-provider (A records naar GitHub IP's en een CNAME record).

Veel succes met je lancering!
