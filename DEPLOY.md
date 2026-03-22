# AbGradE — Netlify Deployment Guide

## Schritt 1: GitHub Repository erstellen

1. Gehe zu https://github.com/new
2. Repository name: `abgrade-website` (oder ähnlich)
3. Sichtbarkeit: **Private** oder Public — beides funktioniert
4. Klicke **Create repository**

## Schritt 2: Dateien hochladen

**Option A — per Drag & Drop (einfach):**
1. Öffne das neue Repository auf GitHub
2. Klicke **uploading an existing file**
3. Alle Dateien aus dem `abgrade/` Ordner in das Fenster ziehen
4. Auch den `admin/` Unterordner mit hochladen
5. Klicke **Commit changes**

**Option B — per Terminal (falls Git installiert):**
```bash
cd /pfad/zum/abgrade-ordner
git init
git add .
git commit -m "Initial AbGradE website"
git remote add origin https://github.com/DEIN-USERNAME/abgrade-website.git
git push -u origin main
```

## Schritt 3: Netlify verbinden

1. Gehe zu https://app.netlify.com → **Add new site → Import an existing project**
2. Wähle **GitHub**
3. Wähle dein `abgrade-website` Repository
4. Build settings:
   - Build command: *(leer lassen)*
   - Publish directory: `.`
5. Klicke **Deploy site**

→ Die Seite ist jetzt live unter einer zufälligen URL wie `https://amazing-name-123.netlify.app`

## Schritt 4: Netlify Identity aktivieren

1. Im Netlify Dashboard: **Site configuration → Identity**
2. Klicke **Enable Identity**
3. Unter **Registration**: wähle **Invite only** (damit nicht jeder sich anmelden kann)
4. Unter **Services → Git Gateway**: Klicke **Enable Git Gateway**

## Schritt 5: Ersten Admin-User einladen

1. Gehe zu **Identity → Invite users**
2. Gib deine E-Mail-Adresse ein
3. Du bekommst eine E-Mail mit einem Einladungslink
4. Klicke den Link → setze dein Passwort

## Schritt 6: CMS aufrufen

1. Gehe zu `https://deine-seite.netlify.app/admin/`
2. Melde dich mit deiner E-Mail + Passwort an
3. Du siehst jetzt das CMS mit: Job Positions, Events, Seminars, Calendar, Site Settings

---

## CMS benutzen

Im CMS kannst du:
- **Job Positions** → neue Stellen eintragen (Titel, Tag, Datum, Link)
- **Meetings & Events** → Konferenzen und Workshops eintragen
- **Seminars** → Seminare und Webinare eintragen
- **Calendar Events** → die Sidebar-Einträge verwalten

Nach dem Speichern im CMS wird automatisch ein GitHub Commit erstellt und Netlify deployed die Änderung innerhalb von ~30 Sekunden.

---

## Eigene Domain verbinden (optional)

1. Netlify Dashboard → **Domain management → Add custom domain**
2. Gib `abgrade.eu` ein (oder eine Subdomain wie `new.abgrade.eu`)
3. Folge den DNS-Anweisungen

---

*Alle Schritte kosten nichts — Netlify Free Plan reicht für diese Seite vollständig aus.*
