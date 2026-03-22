/* ════════════════════════════════════════════════════════════════
   AbGradE — Content Loader
   Lädt Inhalte aus /_data/*.json (vom CMS verwaltet)
   Fällt auf statische Fallback-Inhalte zurück wenn nötig.
   ════════════════════════════════════════════════════════════════ */

/* ── Fallback-Inhalte (werden gezeigt wenn JSON nicht ladbar) ── */
const FALLBACK = {
  stats: [
    { value: 245, suffix: "+", label: "Network Members" },
    { value: 43,  suffix: "",  label: "Countries Represented" },
    { value: 12,  suffix: "",  label: "Events Held" },
    { value: 502, suffix: "",  label: "Total Participants" },
  ],
  calendar: [
    { name: "AbGradE 2026",  date: "Aug 31, 2026", link: "" },
    { name: "EANA 2026",     date: "Sep 1 – Sep 4, 2026", link: "https://www.eana-net.eu/" },
  ],
  jobs: [
    { title: "Call for Candidates: MSCA Postdoctoral Fellowship on Lipids of Halophiles", tag: "Fellowship", date: "Mar 20, 2026", link: "https://abgrade.eu/2026/03/20/call-for-candidates-interested-in-preparing-a-msca-postdoctoral-fellowship-on-lipids-of-halophiles/" },
    { title: "Internal Research Fellow (Postdoc) in Planetary Protection at the European Space Agency", tag: "Postdoc", date: "Mar 19, 2026", link: "https://abgrade.eu/2026/03/19/internal-research-fellow-postdoc-in-planetary-protection-at-the-european-space-agency/" },
  ],
  events: [
    { title: "5th Interdisciplinary Origin of Life Meeting (OoLEN) — Tokyo, Japan", tag: "Conference", date: "Feb 18, 2026", link: "https://abgrade.eu/2026/02/18/5th-interdisciplinary-origin-of-life-meeting-from-oolen-in-tokyo-japan/" },
  ],
  seminars: [
    { title: "Save the Date – ESA–NASA Omics Data Sharing Seminar", tag: "Seminar", date: "Mar 6, 2026", link: "https://abgrade.eu/2026/03/06/save-the-date-esa-nasa-omics-data-sharing-seminar/" },
  ],
};

/* ── JSON-Dateien laden ── */
async function loadData() {
  const keys = ['stats', 'calendar', 'jobs', 'events', 'seminars'];
  const data = {};
  await Promise.all(keys.map(async key => {
    try {
      const res = await fetch(`/_data/${key}.json`);
      if (!res.ok) throw new Error('not found');
      const json = await res.json();
      // Decap CMS wraps list in { items: [...] } when using file collections
      data[key] = Array.isArray(json) ? json : (json.items || FALLBACK[key]);
    } catch {
      data[key] = FALLBACK[key];
    }
  }));
  return data;
}

/* ── Rendering ── */
function renderContent(c) {

  /* Stats */
  const statEls = document.querySelectorAll('.stat-val[data-target]');
  statEls.forEach((el, i) => {
    if (c.stats[i]) {
      el.dataset.target = c.stats[i].value;
      el.dataset.suffix = c.stats[i].suffix || '';
    }
  });
  const statLabels = document.querySelectorAll('.stat-label');
  statLabels.forEach((el, i) => { if (c.stats[i]) el.textContent = c.stats[i].label; });

  /* Calendar */
  const calContainer = document.querySelector('.sidebar .s-card:first-child');
  if (calContainer && c.calendar.length) {
    calContainer.querySelectorAll('.cal-item').forEach(e => e.remove());
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

  /* News cards */
  function renderCards(containerId, items, defaultTag, tagClass) {
    const panel = document.getElementById(containerId);
    if (!panel) return;
    const container = panel.querySelector('.news-list') || panel;
    if (!container) return;
    container.innerHTML = '';
    if (!items || !items.length) {
      container.innerHTML = `<p style="font-family:var(--ff-mono);font-size:.65rem;color:var(--text-dim);letter-spacing:.1em;">No entries yet.</p>`;
      return;
    }
    items.forEach(item => {
      const tag = item.tag || defaultTag;
      const tc  = tag === 'Conference' || tag === 'Workshop' || tag === 'Meeting' ? 'ev'
                : tag === 'Seminar'    || tag === 'Webinar'                        ? 'sem'
                : tag === 'PhD'                                                     ? 'phd' : '';
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

    /* "View all" link */
    const viewAllMap = { 'tab-jobs': ['opportunities.html','All Positions'], 'tab-events': ['events.html','All Events'], 'tab-seminars': ['events.html','All Seminars'] };
    if (viewAllMap[containerId]) {
      const [href, label] = viewAllMap[containerId];
      const link = document.createElement('a');
      link.className = 'news-card reveal';
      link.href = href;
      link.innerHTML = `
        <div class="card-icon"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg></div>
        <div>
          <div class="card-meta"><span class="card-tag">${label}</span></div>
          <div class="card-title">View all → dedicated page</div>
        </div>`;
      container.appendChild(link);
    }
  }

  renderCards('tab-jobs',     c.jobs,     'Position', '');
  renderCards('tab-events',   c.events,   'Event',    'ev');
  renderCards('tab-seminars', c.seminars, 'Seminar',  'sem');
}

/* ── Make dynamically added .reveal elements visible ── */
/* content.js runs async so main.js IntersectionObserver already ran —  */
/* just immediately reveal all elements that aren't visible yet.         */
function reobserveReveal() {
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
      el.classList.add('visible');
    });
  });
}

/* ── Start ── */
async function init() {
  const data = await loadData();
  renderContent(data);
  reobserveReveal();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
