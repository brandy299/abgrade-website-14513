# AbGradE Website — Projektkontext für Claude

## Was ist das?

Statische Website für **AbGradE** (Astrobiology Graduates in Europe), ein Netzwerk für
Nachwuchswissenschaftler:innen in der Astrobiologie. Deployed auf Netlify via GitHub.

- **Live-URL:** https://fabulous-cajeta-4e159b.netlify.app
- **GitHub-Repo:** brandy299/abgrade-website-14513
- **CMS:** Decap CMS (ehemals Netlify CMS) unter `/admin/`
- **Branch:** main (direktes Deployment)

## Tech-Stack

Plain HTML + CSS + Vanilla JS. Kein Build-Step, kein Framework.

```
abgrade/
├── index.html          # Landing Page
├── opportunities.html  # Jobs (Postdoc, PhD, Fellowships)
├── events.html         # Events & Seminars
├── about.html
├── astrobiology.html
├── contact.html
├── resources.html
├── style.css           # Alles in einer Datei
├── main.js             # Animations, IntersectionObserver, Scroll-Reveal
├── content.js          # CMS-Daten laden & rendern  ← WICHTIG
├── logo.svg
├── _data/              # Von Decap CMS beschrieben
│   ├── jobs.json
│   ├── events.json
│   ├── seminars.json
│   ├── calendar.json
│   └── stats.json
└── admin/
    ├── config.yml      # Decap CMS Konfiguration
    └── index.html
```

## CMS-Architektur (`content.js`)

Decap CMS schreibt in `_data/*.json` mit dem Format `{ "items": [...] }`.

`content.js` lädt alle 5 JSON-Dateien asynchron via `fetch('/_data/<key>.json')`.
Fällt auf `FALLBACK`-Objekt zurück wenn die Datei nicht erreichbar ist.

```
loadData() → fetch /_data/jobs.json etc.
           → renderContent(data)
           → renderCards() für index.html-Tabs
           → renderOpportunities() für opportunities.html
           → reobserveReveal()
```

**Wichtig:** `content.js` muss **vor** `main.js` geladen werden (bereits so eingebunden).

## Bekannter Bug & Fix: Scroll-Reveal

`main.js` setzt beim Seitenload einen `IntersectionObserver` auf alle `.reveal`-Elemente.
`content.js` fügt Karten **asynchron** hinzu — diese werden vom Observer nie erfasst.

**Fix:** `reobserveReveal()` in `content.js` nutzt `requestAnimationFrame()` um alle
`.reveal:not(.visible)` Elemente sofort sichtbar zu machen, nachdem der DOM aktualisiert wurde.
Kein neuer Observer nötig.

## CMS Job-Tags → Opportunities-Tabs

| CMS-Tag | Tab auf opportunities.html |
|---------|---------------------------|
| `Postdoc` oder `Position` | `#tab-postdoc` |
| `PhD` | `#tab-phd` |
| `Fellowship` | `#tab-fellowships` |

Der Fellowships-Tab hat **permanente statische Links** (MSCA, ESA Programme),
die beim Rerender erhalten bleiben. Siehe `renderOpportunities()` in `content.js`.

## Deployment-Workflow

1. Änderungen in `abgrade/`-Ordner machen
2. `git add ... && git commit -m "..." && git push origin main`
3. Netlify deployed automatisch innerhalb ~1 Minute
4. Falls `git push` rejected → `git pull --rebase origin main` dann erneut pushen
   (passiert wenn CMS direkt auf GitHub committed hat)

## Design / Branding

- **Stil:** Dark Space Theme
- **Primärfarbe:** teal/cyan `#00b4d8` als Akzent auf dunklem Hintergrund
- **Schriften:** Oxanium (Headings), Inter/system (Body)
- **Font-Loading:** Google Fonts

## V2 Design-Vorschlag

Ein zweiter lokaler Designvorschlag existiert in `/outputs/abgrade-v2/index.html`.
- **Stil:** Hell & Clean, akademisch
- **Farben:** Waldgrün `#1B5730`, Amber `#B84718`, Warm-White `#F6F3EC`
- **Schriften:** Cormorant Garamond (Display) + Jost (Body)
- **Hero:** Split-Layout mit animierter SVG-Zellillustration (Eukaryotische Zelle)
- Lokal vorschaubar via Python HTTP Server auf Port 8092
- **Noch nicht deployed** — nur lokaler Vorschlag

## Lokale Vorschau

```bash
# Im abgrade/-Ordner:
python3 -m http.server 8080
# Dann http://localhost:8080 im Browser öffnen
```

Mac: Via osascript starten, da der Python-Server im Linux-VM nicht vom Mac erreichbar ist.
