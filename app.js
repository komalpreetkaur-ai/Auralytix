/**
 * Auralytix Dashboard Application Logic
 * Interactive state management, table filtering, live credit calculations, and audit modal
 */

// Initial Dataset exactly from the screenshot provided
let auditRecords = [
  {
    id: 'bajaj-akurdi',
    site: 'shourya-bajaj-akurdi-pune.com',
    client: 'Bajaj Dealer',
    status: 'Complete',
    aio: 66.8,
    geo: 27.6,
    when: '2026-11-17 08:57',
    pages: 1,
    issues: [
      { priority: 'High', title: 'Question headings missing (0 of 15 headings are questions)', weight: '-14.9 pts' },
      { priority: 'High', title: 'Only 61% of visible content readable without JS', weight: '-7.0 pts' },
      { priority: 'Medium', title: 'Missing datePublished / dateModified metadata', weight: '-4.2 pts' },
      { priority: 'Medium', title: 'Missing /llms.txt navigation file', weight: '-2.0 pts' }
    ]
  },
  {
    id: 1,
    site: 'suzuki.com.ph',
    client: '-',
    status: 'Complete',
    aio: 12.5,
    geo: null,
    when: '2026-10-23 09:23',
    pages: 10,
    issues: [
      { priority: 'High', title: 'Missing Schema.org Product / Organization markup', weight: '+18.5 AIO' },
      { priority: 'Medium', title: 'Low entity-to-DOM ratio in main navigational templates', weight: '+10.2 AIO' },
      { priority: 'Low', title: 'H1 & H2 semantic heading nesting discontinuous', weight: '+4.0 AIO' }
    ]
  },
  {
    id: 2,
    site: 'suzuki.com.ph',
    client: '-',
    status: 'Complete',
    aio: 51.4,
    geo: 60.5,
    when: '2026-10-21 10:12',
    pages: 25,
    issues: [
      { priority: 'High', title: 'Gemini grounded queries cite competitor pricing tables', weight: '+14.0 GEO' },
      { priority: 'Medium', title: 'FAQ JSON-LD missing contextual anchor targets', weight: '+8.3 AIO' }
    ]
  },
  {
    id: 3,
    site: 'suzuki.com.ph',
    client: '-',
    status: 'Failed',
    aio: 51.4,
    geo: null,
    when: '2026-10-21 09:50',
    pages: 10,
    issues: [
      { priority: 'Critical', title: 'Crawl timeout: Bot protection triggered on cloud CDN', weight: 'Blocked' }
    ]
  },
  {
    id: 4,
    site: 'suzuki-digital.com',
    client: '-',
    status: 'Complete',
    aio: 58.3,
    geo: null,
    when: '2026-10-16 08:10',
    pages: 10,
    issues: [
      { priority: 'Medium', title: 'Client-rendered JS content obscures initial SSR pass', weight: '+12.4 AIO' },
      { priority: 'Low', title: 'Missing OpenGraph and Twitter meta cards', weight: '+3.1 AIO' }
    ]
  },
  {
    id: 5,
    site: 'example.com',
    client: '-',
    status: 'Complete',
    aio: 33.5,
    geo: null,
    when: '2026-10-14 10:14',
    pages: 10,
    issues: [
      { priority: 'High', title: 'Generic boilerplate placeholder text reduces entity confidence', weight: '+22.0 AIO' }
    ]
  },
  {
    id: 6,
    site: 'suzuki-digital.com',
    client: '-',
    status: 'Complete',
    aio: 58.3,
    geo: null,
    when: '2026-10-14 10:01',
    pages: 10,
    issues: [
      { priority: 'Medium', title: 'Metadata description exceeds recommended token length', weight: '+4.5 AIO' }
    ]
  },
  {
    id: 7,
    site: 'glocal360.ai',
    client: '-',
    status: 'Complete',
    aio: 55.1,
    geo: 26.0,
    when: '2026-10-14 10:00',
    pages: 10,
    issues: [
      { priority: 'High', title: 'Low brand authority citation across regional Gemini searches', weight: '+25.0 GEO' },
      { priority: 'Medium', title: 'Technical terms missing canonical link relationships', weight: '+9.1 AIO' }
    ]
  },
  {
    id: 8,
    site: 'example.com',
    client: '-',
    status: 'Complete',
    aio: 33.5,
    geo: null,
    when: '2026-10-14 09:58',
    pages: 10,
    issues: [
      { priority: 'Medium', title: 'Single H1 tag absent on homepage', weight: '+8.0 AIO' }
    ]
  },
  {
    id: 9,
    site: 'adglobal360.com',
    client: '-',
    status: 'Complete',
    aio: 60.0,
    geo: null,
    when: '2026-10-14 09:56',
    pages: 10,
    issues: [
      { priority: 'Low', title: 'Optimize alt attributes for AI multimodal vision crawlers', weight: '+6.2 AIO' }
    ]
  },
  {
    id: 10,
    site: 'example.com',
    client: '-',
    status: 'Complete',
    aio: 33.5,
    geo: null,
    when: '2026-10-13 11:13',
    pages: 10,
    issues: [
      { priority: 'Low', title: 'Duplicate meta descriptions detected', weight: '+3.0 AIO' }
    ]
  }
];

let currentCredits = 888;

// App Initialization
function initApp() {
  if (window.lucide) {
    lucide.createIcons();
  }

  // Setup components
  initThemeToggle();
  initPagePills();
  initGeoToggle();
  initCompetitorChips();
  initTableFilters();
  initAuditForm();
  initCollapsibleForm();
  initModal();
  renderAuditsTable(auditRecords);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/* ==========================================================================
   THEME SETUP
   ========================================================================== */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlEl = document.documentElement;

  // Default to clean Light mode
  htmlEl.setAttribute('data-theme', 'light');

  if (themeToggle && themeIcon) {
    const savedTheme = localStorage.getItem('auralytix-theme') || 'light';
    htmlEl.setAttribute('data-theme', savedTheme);
    themeIcon.setAttribute('data-lucide', savedTheme === 'dark' ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();

    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlEl.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', newTheme);
      localStorage.setItem('auralytix-theme', newTheme);
      themeIcon.setAttribute('data-lucide', newTheme === 'light' ? 'moon' : 'sun');
      if (window.lucide) lucide.createIcons();
    });
  }
}

/* ==========================================================================
   MAX PAGES PILLS
   ========================================================================== */
function initPagePills() {
  const pillBtns = document.querySelectorAll('.pill-option');
  const maxPagesInput = document.getElementById('max-pages');
  const customPagesInput = document.getElementById('custom-pages-input');
  const pagesDisplay = document.getElementById('pages-label-display');

  // Preset pill clicks
  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.getAttribute('data-pages');
      maxPagesInput.value = val;
      if (customPagesInput) customPagesInput.value = '';
      pagesDisplay.textContent = `${val} pages`;
    });
  });

  // Custom pages input
  if (customPagesInput) {
    customPagesInput.addEventListener('input', () => {
      let val = parseInt(customPagesInput.value);
      if (val && val > 0) {
        let matchedPill = false;
        pillBtns.forEach(btn => {
          if (btn.getAttribute('data-pages') === String(val)) {
            btn.classList.add('active');
            matchedPill = true;
          } else {
            btn.classList.remove('active');
          }
        });
        maxPagesInput.value = val;
        pagesDisplay.textContent = `${val} pages${matchedPill ? '' : ' (custom)'}`;
      } else if (!customPagesInput.value) {
        // Reset to default 10 if input is cleared
        pillBtns.forEach(btn => {
          if (btn.getAttribute('data-pages') === '10') {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
        maxPagesInput.value = '10';
        pagesDisplay.textContent = '10 pages';
      }
    });

    customPagesInput.addEventListener('focus', () => {
      if (customPagesInput.value) {
        pillBtns.forEach(b => b.classList.remove('active'));
      }
    });
  }
}

/* ==========================================================================
   GEO TOGGLE & COST CALCULATION
   ========================================================================== */
function initGeoToggle() {
  const geoToggle = document.getElementById('measure-geo-toggle');
  const marketInput = document.getElementById('geo-markets');

  function updateCost() {
    let cost = 10; // Base AIO crawl
    if (geoToggle && geoToggle.checked) {
      cost += 100;
      // Extra market cost check
      if (marketInput && marketInput.value.trim() && !marketInput.value.toLowerCase().includes('india')) {
        cost += 50;
      }
    }
    
    const badge = document.getElementById('calculated-cost-badge');
    if (badge) badge.textContent = `${cost} credits`;
    const btnText = document.getElementById('start-btn-text');
    if (btnText) btnText.textContent = `Start Audit • ${cost} credits`;
  }

  if (geoToggle) {
    geoToggle.addEventListener('change', updateCost);
  }
  if (marketInput) {
    marketInput.addEventListener('input', updateCost);
  }
}

/* ==========================================================================
   COMPETITOR DOMAINS CHIPS
   ========================================================================== */
function initCompetitorChips() {
  const competitorInput = document.getElementById('competitor-input');
  const chipBox = document.getElementById('chip-box');
  if (!competitorInput || !chipBox) return;

  competitorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      let val = competitorInput.value.trim().toLowerCase();
      val = val.replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (val) {
        addChip(val);
        competitorInput.value = '';
      }
    }
  });
}

function addChip(domain) {
  const chipBox = document.getElementById('chip-box');
  const competitorInput = document.getElementById('competitor-input');

  const chip = document.createElement('span');
  chip.className = 'chip';
  chip.setAttribute('data-domain', domain);
  chip.innerHTML = `${domain} <span class="chip-remove" onclick="removeChip(this)">&times;</span>`;
  chipBox.insertBefore(chip, competitorInput);
}

function removeChip(btn) {
  const chip = btn.closest('.chip');
  if (chip) chip.remove();
}

/* ==========================================================================
   TABLE RENDERING & FILTERING
   ========================================================================== */
function renderAuditsTable(records) {
  const tbody = document.getElementById('audits-tbody');
  tbody.innerHTML = '';

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-10 text-[var(--text-muted)]">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="search-x" class="w-8 h-8 opacity-40"></i>
            <p class="text-sm font-medium">No matching audits found.</p>
            <p class="text-xs">Try adjusting your search query or status filter.</p>
          </div>
        </td>
      </tr>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  records.forEach(item => {
    const tr = document.createElement('tr');
    tr.className = 'group';

    // AIO Score Badge
    let aioBadge = '';
    if (item.aio >= 60) {
      aioBadge = `<span class="score-badge score-high"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>${item.aio.toFixed(1)}</span>`;
    } else if (item.aio >= 40) {
      aioBadge = `<span class="score-badge score-mid"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>${item.aio.toFixed(1)}</span>`;
    } else {
      aioBadge = `<span class="score-badge score-low"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>${item.aio.toFixed(1)}</span>`;
    }

    // GEO Score Badge
    let geoBadge = '';
    if (item.geo !== null) {
      if (item.geo >= 60) {
        geoBadge = `<span class="score-badge score-high"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>${item.geo.toFixed(1)}</span>`;
      } else if (item.geo >= 40) {
        geoBadge = `<span class="score-badge score-mid"><span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>${item.geo.toFixed(1)}</span>`;
      } else {
        geoBadge = `<span class="score-badge score-low"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>${item.geo.toFixed(1)}</span>`;
      }
    } else {
      geoBadge = `<span class="score-badge score-na">n/a</span>`;
    }

    // Status Badge
    let statusClass = item.status === 'Complete' ? 'status-complete' : 'status-failed';

    tr.innerHTML = `
      <td>
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono text-xs font-semibold">
            ${item.site.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <span class="font-medium text-[var(--text-primary)] hover:text-blue-400 transition-colors">${item.site}</span>
            <div class="text-[11px] text-[var(--text-muted)] font-mono">${item.pages} pages crawled</div>
          </div>
        </div>
      </td>
      <td>
        <span class="text-xs text-[var(--text-muted)] font-mono">${item.client}</span>
      </td>
      <td>
        <span class="status-indicator ${statusClass}">
          <span class="status-dot"></span>
          <span>${item.status}</span>
        </span>
      </td>
      <td>${aioBadge}</td>
      <td>${geoBadge}</td>
      <td>
        <span class="text-xs font-mono text-[var(--text-secondary)]">${item.when}</span>
      </td>
      <td class="text-right">
        <div class="flex items-center justify-end">
          <a href="report.html?site=${encodeURIComponent(item.site)}&id=${item.id}" onclick="event.stopPropagation();" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 transition-all shadow-2xs hover:shadow-xs active:scale-95" title="Review Full Report">
            <i data-lucide="file-text" class="w-3.5 h-3.5"></i>
            <span>Review</span>
          </a>
        </div>
      </td>
    `;

    // Row click navigates to report
    tr.style.cursor = 'pointer';
    tr.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        window.location.href = `report.html?site=${encodeURIComponent(item.site)}&id=${item.id}`;
      }
    });

    tbody.appendChild(tr);
  });

  document.getElementById('audits-count-badge').textContent = `${records.length} shown`;
  document.getElementById('pagination-info').textContent = `Showing ${records.length} of ${auditRecords.length} audits`;

  if (window.lucide) lucide.createIcons();
}

function initTableFilters() {
  const searchInput = document.getElementById('table-search');
  const statusFilter = document.getElementById('status-filter');
  const sortFilter = document.getElementById('sort-filter');

  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const sort = sortFilter.value;

    let filtered = auditRecords.filter(item => {
      const matchesSearch = item.site.toLowerCase().includes(query) || (item.client && item.client.toLowerCase().includes(query));
      const matchesStatus = status === 'all' || item.status === status;
      return matchesSearch && matchesStatus;
    });

    // Sorting
    if (sort === 'highest-aio') {
      filtered.sort((a, b) => b.aio - a.aio);
    } else if (sort === 'highest-geo') {
      filtered.sort((a, b) => (b.geo || 0) - (a.geo || 0));
    } else {
      // Default: Newest first based on ID
      filtered.sort((a, b) => b.id - a.id);
    }

    renderAuditsTable(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);

  // CSV Export
  document.getElementById('export-btn').addEventListener('click', () => {
    let csv = 'Site,Client,Status,AIO,GEO,When\n';
    auditRecords.forEach(r => {
      csv += `${r.site},${r.client},${r.status},${r.aio},${r.geo || 'N/A'},${r.when}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `auralytix-audits-${Date.now()}.csv`);
    a.click();
  });
}

/* ==========================================================================
   AUDIT SUBMISSION SIMULATION
   ========================================================================== */
function initAuditForm() {
  const form = document.getElementById('audit-form');
  const siteInput = document.getElementById('site-url');
  const maxPagesInput = document.getElementById('max-pages');
  const clientInput = document.getElementById('client-label');
  const competitorInput = document.getElementById('competitor-domains');
  const marketInput = document.getElementById('geo-markets');
  const geoToggle = document.getElementById('measure-geo-toggle');
  const startBtn = document.getElementById('start-audit-btn');
  const startBtnText = document.getElementById('start-btn-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let siteVal = siteInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!siteVal) return;

    let cost = 10;
    if (geoToggle && geoToggle.checked) {
      cost += 100;
      if (marketInput && marketInput.value.trim() && !marketInput.value.toLowerCase().includes('india')) {
        cost += 50;
      }
    }

    if (currentCredits < cost) {
      alert('Insufficient credits to run this audit.');
      return;
    }

    // Set loading state
    startBtn.disabled = true;
    startBtn.classList.add('opacity-75', 'cursor-not-allowed');
    startBtnText.innerHTML = `<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Crawling site & probing AI...</span>`;

    setTimeout(() => {
      // Deduct credits
      currentCredits -= cost;
      const kpiCredits = document.getElementById('kpi-credits');
      if (kpiCredits) kpiCredits.textContent = currentCredits;
      document.getElementById('sidebar-credits').textContent = currentCredits;

      // Generate realistic scores
      const generatedAio = +(Math.random() * 40 + 35).toFixed(1);
      const generatedGeo = (geoToggle && geoToggle.checked) ? +(Math.random() * 50 + 30).toFixed(1) : null;

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newAudit = {
        id: Date.now(),
        site: siteVal,
        client: clientInput.value.trim() || '-',
        status: 'Complete',
        aio: generatedAio,
        geo: generatedGeo,
        when: dateStr,
        pages: parseInt(maxPagesInput.value) || 10,
        issues: [
          { priority: 'High', title: 'Structured data entities verified by Gemini parser', weight: '+15.2 AIO' },
          { priority: 'Medium', title: 'Header hierarchy canonical audit completed', weight: '+6.5 AIO' }
        ]
      };

      auditRecords.unshift(newAudit);
      const kpiTotal = document.getElementById('kpi-total-audits');
      if (kpiTotal) kpiTotal.textContent = auditRecords.length;

      // Reset form & button
      startBtn.disabled = false;
      startBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      startBtnText.textContent = `Start Audit • ${cost} credits`;
      siteInput.value = '';
      clientInput.value = '';
      if (competitorInput) competitorInput.value = '';
      if (marketInput) marketInput.value = '';

      renderAuditsTable(auditRecords);
    }, 1200);
  });
}

/* ==========================================================================
   COLLAPSIBLE AUDIT FORM
   ========================================================================== */
function initCollapsibleForm() {
  const header = document.getElementById('audit-section-header');
  const collapse = document.getElementById('audit-form-collapse');
  const toggleBtn = document.getElementById('toggle-audit-btn');
  const cancelBtn = document.getElementById('cancel-audit-btn');

  if (!header || !collapse) return;

  function toggleCollapse(expand) {
    const isCurrentlyHidden = collapse.style.display === 'none' || collapse.classList.contains('hidden');
    const shouldOpen = expand !== undefined ? expand : isCurrentlyHidden;

    if (shouldOpen) {
      collapse.style.display = 'block';
      collapse.classList.remove('hidden');
      if (toggleBtn) {
        toggleBtn.innerHTML = `<span>Collapse</span><i data-lucide="chevron-up" class="w-4 h-4"></i>`;
        toggleBtn.className = 'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-[var(--border-subtle)] transition-all active:scale-95';
      }
      header.setAttribute('aria-expanded', 'true');
    } else {
      collapse.style.display = 'none';
      collapse.classList.add('hidden');
      if (toggleBtn) {
        toggleBtn.innerHTML = `<i data-lucide="plus" class="w-3.5 h-3.5"></i><span>New Audit</span><i data-lucide="chevron-down" class="w-4 h-4"></i>`;
        toggleBtn.className = 'flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/20 transition-all active:scale-95';
      }
      header.setAttribute('aria-expanded', 'false');
    }
    if (window.lucide) {
      lucide.createIcons();
    }
  }

  header.addEventListener('click', (e) => {
    toggleCollapse();
  });

  if (cancelBtn) {
    cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCollapse(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  header.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleCollapse();
    }
  });

  window.expandAuditForm = () => toggleCollapse(true);
  window.collapseAuditForm = () => toggleCollapse(false);
}

function rerunAudit(domain) {
  if (window.expandAuditForm) {
    window.expandAuditForm();
  }
  document.getElementById('site-url').value = domain;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function copySiteDomain(site, btn) {
  navigator.clipboard.writeText(`https://${site}`).then(() => {
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>`;
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      if (window.lucide) lucide.createIcons();
    }, 1500);
  }).catch(() => {
    // Fallback if clipboard API is restricted
    const input = document.createElement('input');
    input.value = `https://${site}`;
    document.body.appendChild(input);
    input.select();
    document.execCommand('copy');
    document.body.removeChild(input);
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>`;
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
      btn.innerHTML = originalHtml;
      if (window.lucide) lucide.createIcons();
    }, 1500);
  });
}

/* ==========================================================================
   MODAL DEEP DIVE REPORT
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('audit-modal');
  const closeBtn = document.getElementById('close-modal-btn');
  const closeAction = document.getElementById('modal-close-action');

  function closeModal() {
    modal.classList.remove('active');
  }

  closeBtn.addEventListener('click', closeModal);
  closeAction.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

function openAuditModal(id) {
  const record = auditRecords.find(r => r.id === id);
  if (!record) return;

  document.getElementById('modal-site-title').textContent = record.site;
  document.getElementById('modal-audit-date').textContent = `Audited on ${record.when} • ${record.pages} pages analyzed`;
  document.getElementById('modal-aio-score').textContent = record.aio.toFixed(1);
  document.getElementById('modal-geo-score').textContent = record.geo ? `${record.geo.toFixed(1)}%` : 'N/A';

  const roadmapContainer = document.getElementById('modal-roadmap');
  roadmapContainer.innerHTML = '';

  record.issues.forEach(issue => {
    const item = document.createElement('div');
    item.className = 'p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between text-xs';
    
    let priorityBadge = '';
    if (issue.priority === 'Critical') {
      priorityBadge = '<span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">Critical</span>';
    } else if (issue.priority === 'High') {
      priorityBadge = '<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">High</span>';
    } else {
      priorityBadge = '<span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">Medium</span>';
    }

    item.innerHTML = `
      <div class="flex items-center gap-2.5">
        ${priorityBadge}
        <span class="text-[var(--text-primary)] font-medium">${issue.title}</span>
      </div>
      <span class="font-mono text-emerald-400 font-semibold">${issue.weight}</span>
    `;
    roadmapContainer.appendChild(item);
  });

  document.getElementById('audit-modal').classList.add('active');
}
