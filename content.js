/* ════════════════════════════════════════════════════════════════
   AbGradE — CONTENT CONFIGURATION FILE
   ════════════════════════════════════════════════════════════════

   Diese Datei steuert den Inhalt der Startseite.
   Öffne sie in einem Text-Editor (z.B. Notepad, TextEdit, VS Code)
   und speichere nach jeder Änderung.

   REGELN:
   ✓  Texte in Anführungszeichen "..." ändern
   ✓  Datum, Titel, Links anpassen
   ✓  Neue Einträge OBEN in der Liste hinzufügen
   ✗  Kommas und geschweifte Klammern { } NICHT löschen

   ════════════════════════════════════════════════════════════════ */

const CONTENT = {

  /* ─────────────────────────────────────────────────────────────
     HERO SECTION (Startseite oben)
     ───────────────────────────────────────────────────────────── */
  hero: {
    eyebrow:  "Space Science & Biology · Early-Career European Network",
    title:    "AbGradE",
    subtitle: "Astrobiology Graduates in Europe",
    description: "Where space science meets the biology of life — connecting early-career researchers across Europe in the search for life beyond Earth.",
    ctaPrimary: { label: "Explore Opportunities", link: "opportunities.html" },
    ctaSecondary: { label: "Join the Network",    link: "about.html" },
  },


  /* ─────────────────────────────────────────────────────────────
     STATISTIKEN (die großen Zahlen unter dem Hero)
     ───────────────────────────────────────────────────────────── */
  stats: [
    { value: 245, suffix: "+", label: "Network Members"      },
    { value: 43,  suffix: "",  label: "Countries Represented" },
    { value: 12,  suffix: "",  label: "Events Held"           },
    { value: 502, suffix: "",  label: "Total Participants"    },
  ],


  /* ─────────────────────────────────────────────────────────────
     KALENDER (Sidebar — kommende Veranstaltungen)
     Neue Einträge oben einfügen.
     ───────────────────────────────────────────────────────────── */
  calendar: [
    {
      name: "AbGradE 2026",
      date: "Aug 31, 2026",
      link: "",  // optional: URL zur Veranstaltung
    },
    {
      name: "EANA 2026",
      date: "Sep 1 – Sep 4, 2026",
      link: "https://www.eana-net.eu/",
    },
  ],


  /* ─────────────────────────────────────────────────────────────
     JOB-POSITIONEN (Tab "Job Positions")
     Neue Stellen OBEN einfügen, ältere UNTEN entfernen.
     tag: "Fellowship" | "Postdoc" | "PhD" | "Position"
     ───────────────────────────────────────────────────────────── */
  jobs: [
    {
      title: "Call for Candidates: MSCA Postdoctoral Fellowship on Lipids of Halophiles",
      tag:   "Fellowship",
      date:  "Mar 20, 2026",
      link:  "https://abgrade.eu/2026/03/20/call-for-candidates-interested-in-preparing-a-msca-postdoctoral-fellowship-on-lipids-of-halophiles/",
    },
    {
      title: "Internal Research Fellow (Postdoc) in Planetary Protection at the European Space Agency",
      tag:   "Postdoc",
      date:  "Mar 19, 2026",
      link:  "https://abgrade.eu/2026/03/19/internal-research-fellow-postdoc-in-planetary-protection-at-the-european-space-agency/",
    },
  ],


  /* ─────────────────────────────────────────────────────────────
     MEETINGS & EVENTS (Tab "Meetings & Events")
     tag: "Conference" | "Workshop" | "Meeting" | "Online"
     ───────────────────────────────────────────────────────────── */
  events: [
    {
      title: "5th Interdisciplinary Origin of Life Meeting (OoLEN) — Tokyo, Japan",
      tag:   "Conference",
      date:  "Feb 18, 2026",
      link:  "https://abgrade.eu/2026/02/18/5th-interdisciplinary-origin-of-life-meeting-from-oolen-in-tokyo-japan/",
    },
  ],


  /* ─────────────────────────────────────────────────────────────
     SEMINARE (Tab "Seminars")
     tag: "Seminar" | "Webinar" | "Online"
     ───────────────────────────────────────────────────────────── */
  seminars: [
    {
      title: "Save the Date – ESA–NASA Omics Data Sharing Seminar",
      tag:   "Seminar",
      date:  "Mar 6, 2026",
      link:  "https://abgrade.eu/2026/03/06/save-the-date-esa-nasa-omics-data-sharing-seminar/",
    },
  ],

}; // ← dieses Semikolon NICHT entfernen


/* ════════════════════════════════════════════════════════════════
   AB HIER NICHT ÄNDERN — Rendering-Logik
   ════════════════════════════════════════════════════════════════ */

function renderContent() {
  const c = CONTENT;

  /* Hero */
  const eyebrow = document.querySelector('.hero-eyebrow');
  const heroDesc = document.querySelector('.hero-desc');
  const ctaPrimary = document.querySelector('.hero-cta .btn-primary');
  const ctaSecondary = document.querySelector('.hero-cta .btn-outline');
  if (eyebrow)     eyebrow.textContent = c.hero.eyebrow;
  if (heroDesc)    heroDesc.innerHTML  =
    `Where <span style="color:var(--cyan)">space science</span> meets <span style="color:var(--green)">the biology of life</span> — ${c.hero.description.split('—')[1] || c.hero.description}`;
  if (ctaPrimary)  { ctaPrimary.textContent = c.hero.ctaPrimary.label; ctaPrimary.href = c.hero.ctaPrimary.link; }
  if (ctaSecondary){ ctaSecondary.textContent = c.hero.ctaSecondary.label; ctaSecondary.href = c.hero.ctaSecondary.link; }

  /* Stats */
  const statEls = document.querySelectorAll('.stat-val[data-target]');
  statEls.forEach((el, i) => {
    if (c.stats[i]) {
      el.dataset.target = c.stats[i].value;
      el.dataset.suffix = c.stats[i].suffix;
    }
  });
  const statLabels = document.querySelectorAll('.stat-label');
  statLabels.forEach((el, i) => { if (c.stats[i]) el.textContent = c.stats[i].label; });

  /* Calendar */
  const calContainer = document.querySelector('.sidebar .s-card:first-child');
  if (calContainer && c.calendar.length) {
    const existing = calContainer.querySelectorAll('.cal-item');
    existing.forEach(e => e.remove());
    c.calendar.forEach(ev => {
      const item = document.createElement('div');
      item.className = 'cal-item reveal';
      const name = ev.link
        ? `<a href="${ev.link}" target="_blank" style="color:inherit;text-decoration:none;" class="cal-name"><span class="cal-dot"></span>${ev.name}</a>`
        : `<div class="cal-name"><span class="cal-dot"></span>${ev.name}</div>`;
      item.innerHTML = `${name}<div class="cal-date">${ev.date}</div>`;
      calContainer.appendChild(item);
    });
  }

  /* News cards renderer */
  function renderCards(containerId, items, defaultTag, tagClass) {
    const panel = document.getElementById(containerId);
    if (!panel) return;
    const container = panel.querySelector('.news-list') || panel;
    if (!container) return;
    container.innerHTML = '';
    if (!items.length) {
      container.innerHTML = `<p style="font-family:var(--ff-mono);font-size:.65rem;color:var(--text-dim);letter-spacing:.1em;">No entries yet. Add some in content.js!</p>`;
      return;
    }
    items.forEach(item => {
      const tag = item.tag || defaultTag;
      const tc  = tagClass || (tag === 'Conference' || tag === 'Workshop' || tag === 'Meeting' ? 'ev' : tag === 'Seminar' || tag === 'Webinar' ? 'sem' : tag === 'PhD' ? 'phd' : '');
      const card = document.createElement('a');
      card.className = 'news-card reveal';
      card.href   = item.link || '#';
      card.target = item.link ? '_blank' : '';
      card.innerHTML = `
        <div class="card-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
          </svg>
        </div>
        <div>
          <div class="card-meta">
            <span class="card-tag ${tc}">${tag}</span>
            ${item.date ? `<span class="card-date">${item.date}</span>` : ''}
          </div>
          <div class="card-title">${item.title}</div>
        </div>`;
      container.appendChild(card);
    });
  }

  renderCards('tab-jobs',     c.jobs,     'Position', '');
  renderCards('tab-events',   c.events,   'Event',    'ev');
  renderCards('tab-seminars', c.seminars, 'Seminar',  'sem');

  /* "View all" footer links */
  const viewAll = [
    { id: 'tab-jobs',     href: 'opportunities.html', label: 'All Positions' },
    { id: 'tab-events',   href: 'events.html',        label: 'All Events' },
    { id: 'tab-seminars', href: 'events.html',        label: 'All Seminars' },
  ];
  viewAll.forEach(({ id, href, label }) => {
    const panel = document.getElementById(id);
    const list  = panel && panel.querySelector('.news-list');
    if (!list) return;
    const link = document.createElement('a');
    link.className = 'news-card reveal';
    link.href = href;
    link.innerHTML = `
      <div class="card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
      <div>
        <div class="card-meta"><span class="card-tag">${label}</span></div>
        <div class="card-title">View all → dedicated page</div>
      </div>`;
    list.appendChild(link);
  });
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderContent);
} else {
  renderContent();
}
