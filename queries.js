/**
 * Auralytix - Query Checks Logic
 * Interactive multi-engine selection, dynamic credit calculation, market tagging, and AI response modal
 */

// Dataset directly from the user's uploaded screenshots
let queryChecks = [
  {
    id: 1,
    brand: 'Suzuki',
    domain: 'suzuki.com.ph',
    queries: 1,
    engines: ['gemini'],
    status: 'Complete',
    index: 0.0,
    credits: 2,
    when: '2026-10-21 09:47',
    queryText: 'Which are the best automobile service providers in Philippines?',
    competitorsNamed: 'Toyota Philippines, Honda PH, Mitsubishi Motors',
    aiResponses: [
      {
        engine: 'Gemini (Search Grounded)',
        cited: false,
        summary: 'Toyota and Honda were prioritized due to higher Schema.org parts warranty citations and official service network indexing. Suzuki was omitted from the top 3 recommended providers.',
        recommendation: 'Add structured ServiceCenter schema and claim localized dealership entity citations.'
      }
    ]
  },
  {
    id: 2,
    brand: 'Glocal360',
    domain: 'glocal360.ai',
    queries: 1,
    engines: ['gemini', 'chatgpt', 'perplexity', 'claude'],
    status: 'Complete',
    index: 0.0,
    credits: '-',
    when: '2026-10-16 09:48',
    queryText: 'Top AI localization and cultural adaptation agencies',
    competitorsNamed: 'Smartling, Transifex, Phrase, Lokalise',
    aiResponses: [
      {
        engine: 'Gemini',
        cited: false,
        summary: 'Smartling and Phrase dominated answer citations due to high press coverage and G2 review aggregator groundings.',
        recommendation: 'Increase presence on G2/Capterra software review aggregators.'
      },
      {
        engine: 'Claude (Sonnet 3.5)',
        cited: false,
        summary: 'Generated recommendations focused on enterprise localization suites with comprehensive API documentation.',
        recommendation: 'Publish technical prompt localization whitepapers with open access.'
      }
    ]
  },
  {
    id: 3,
    brand: 'Glocal360',
    domain: 'glocal360.ai',
    queries: 1,
    engines: ['gemini', 'chatgpt', 'perplexity', 'claude'],
    status: 'Complete',
    index: 0.0,
    credits: '-',
    when: '2026-10-16 09:33',
    queryText: 'Which AI agency handles cross-cultural prompt engineering?',
    competitorsNamed: 'Vellum, Humanloop, Langfuse',
    aiResponses: [
      {
        engine: 'Perplexity',
        cited: false,
        summary: 'Cited GitHub developer repositories and HackerNews threads where prompt engineering frameworks are discussed.',
        recommendation: 'Publish open-source prompt evaluation benchmarks on GitHub.'
      }
    ]
  }
];

let queryCredits = 787;

// DOM Initialization
function initQueriesApp() {
  if (window.lucide) lucide.createIcons();

  initTheme();
  initCompetitorChips();
  initMarketChips();
  initEnginePills();
  initRunsStepper();
  initQueryCostCalculator();
  initTemplateHelper();
  initTableControls();
  initCheckForm();
  initModal();

  renderChecksTable(queryChecks);
  calculateQueryCost();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQueriesApp);
} else {
  initQueriesApp();
}

/* ==========================================================================
   THEME SETUP
   ========================================================================== */
function initTheme() {
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
   COMPETITOR CHIPS
   ========================================================================== */
function initCompetitorChips() {
  const competitorInput = document.getElementById('competitor-input');
  const chipBox = document.getElementById('competitor-chip-box');

  competitorInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      let val = competitorInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
      if (val) {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.setAttribute('data-domain', val);
        chip.innerHTML = `${val} <span class="chip-remove" onclick="removeChip(this)">&times;</span>`;
        chipBox.insertBefore(chip, competitorInput);
        competitorInput.value = '';
      }
    }
  });
}

function removeChip(btn) {
  const chip = btn.closest('.chip');
  if (chip) chip.remove();
}

/* ==========================================================================
   BUYER MARKETS CHIPS
   ========================================================================== */
function initMarketChips() {
  const select = document.getElementById('add-market-select');
  const box = document.getElementById('market-chips-box');

  const flagMap = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Japan': '🇯🇵',
    'Philippines': '🇵🇭',
    'Germany': '🇩🇪',
    'India': '🇮🇳'
  };

  select.addEventListener('change', () => {
    const market = select.value;
    if (!market) return;

    // Check if already added or limit reached (max 5)
    const existing = box.querySelectorAll('.market-chip');
    if (existing.length >= 5) {
      alert('You can select up to 5 buyer markets.');
      select.value = '';
      return;
    }

    let alreadyExists = false;
    existing.forEach(chip => {
      if (chip.getAttribute('data-market') === market) alreadyExists = true;
    });

    if (alreadyExists) {
      select.value = '';
      return;
    }

    const chip = document.createElement('span');
    chip.className = 'market-chip';
    chip.setAttribute('data-market', market);
    chip.innerHTML = `<span>${flagMap[market] || '🌐'} ${market}</span> <span class="remove-market text-xs" onclick="removeMarket(this)">&times;</span>`;
    
    // Insert before select dropdown
    select.parentElement.before(chip);
    select.value = '';

    calculateQueryCost();
  });
}

function removeMarket(btn) {
  const chip = btn.closest('.market-chip');
  if (chip) {
    chip.remove();
    calculateQueryCost();
  }
}

/* ==========================================================================
   AI ENGINE PILLS TOGGLE
   ========================================================================== */
function initEnginePills() {
  const pills = document.querySelectorAll('.engine-pill');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      const icon = pill.querySelector('i');

      if (pill.classList.contains('active')) {
        icon.setAttribute('data-lucide', 'check-square');
        if (pill.getAttribute('data-engine') === 'gemini') icon.className = 'w-4 h-4 text-blue-600';
        else if (pill.getAttribute('data-engine') === 'chatgpt') icon.className = 'w-4 h-4 text-emerald-600';
        else if (pill.getAttribute('data-engine') === 'perplexity') icon.className = 'w-4 h-4 text-cyan-600';
        else if (pill.getAttribute('data-engine') === 'claude') icon.className = 'w-4 h-4 text-amber-500';
      } else {
        icon.setAttribute('data-lucide', 'square');
        icon.className = 'w-4 h-4 text-slate-400';
      }

      if (window.lucide) lucide.createIcons();
      calculateQueryCost();
    });
  });
}

/* ==========================================================================
   RUNS STEPPER
   ========================================================================== */
function initRunsStepper() {
  const input = document.getElementById('runs-per-query');
  const decBtn = document.getElementById('decrement-runs');
  const incBtn = document.getElementById('increment-runs');

  decBtn.addEventListener('click', () => {
    let val = parseInt(input.value) || 1;
    if (val > 1) {
      input.value = val - 1;
      calculateQueryCost();
    }
  });

  incBtn.addEventListener('click', () => {
    let val = parseInt(input.value) || 1;
    if (val < 10) {
      input.value = val + 1;
      calculateQueryCost();
    }
  });

  input.addEventListener('input', calculateQueryCost);
}

/* ==========================================================================
   DYNAMIC QUERY COST CALCULATOR
   ========================================================================== */
function initQueryCostCalculator() {
  const textarea = document.getElementById('queries-textarea');
  textarea.addEventListener('input', calculateQueryCost);
}

function calculateQueryCost() {
  const textarea = document.getElementById('queries-textarea');
  const counterBadge = document.getElementById('query-counter-badge');
  const costBadge = document.getElementById('calculated-cost-badge');
  const formulaDisplay = document.getElementById('credit-formula-display');
  const runBtnText = document.getElementById('run-btn-text');

  // Count lines
  const lines = textarea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const queriesCount = lines.length;

  counterBadge.textContent = queriesCount === 1 ? '1 query entered' : `${queriesCount} queries entered`;

  // Count active markets
  const marketsCount = document.querySelectorAll('#market-chips-box .market-chip').length || 1;

  // Count active engines
  const enginesCount = document.querySelectorAll('.engine-pill.active').length || 1;

  // Runs
  const runsInput = document.getElementById('runs-per-query');
  const runsCount = parseInt(runsInput.value) || 1;

  if (queriesCount === 0) {
    if (costBadge) costBadge.textContent = '0 credits';
    formulaDisplay.innerHTML = 'Add queries to see the credits this check will use.';
    runBtnText.textContent = 'Add queries to run';
    return;
  }

  const totalCredits = queriesCount * marketsCount * enginesCount * runsCount;
  if (costBadge) costBadge.textContent = `${totalCredits} credits`;
  formulaDisplay.innerHTML = `Formula: ${queriesCount} query × ${marketsCount} market × ${enginesCount} engines × ${runsCount} runs = <strong>${totalCredits} credits</strong>`;
  runBtnText.textContent = `Run check • ${totalCredits} credits`;
}

/* ==========================================================================
   TEMPLATE QUERIES INSERTER
   ========================================================================== */
function initTemplateHelper() {
  const helperBtn = document.getElementById('template-helper-btn');
  const textarea = document.getElementById('queries-textarea');

  if (helperBtn && textarea) {
    helperBtn.addEventListener('click', () => {
      textarea.value = `Which are the best automobile service providers in Philippines?\nWhat should I look for when choosing a certified vehicle service center?`;
      calculateQueryCost();
    });
  }
}

/* ==========================================================================
   TABLE RENDERING & CONTROLS
   ========================================================================== */
function renderChecksTable(records) {
  const tbody = document.getElementById('checks-tbody');
  tbody.innerHTML = '';

  if (records.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-10 text-[var(--text-muted)]">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="search-x" class="w-8 h-8 opacity-40"></i>
            <p class="text-sm font-medium">No matching query checks found.</p>
            <p class="text-xs">Adjust your search or engine filters above.</p>
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

    // Engine mini badges
    let engineBadges = item.engines.map(eng => {
      if (eng === 'gemini') return '<span class="engine-badge text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-200">Gemini</span>';
      if (eng === 'chatgpt') return '<span class="engine-badge text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200">ChatGPT</span>';
      if (eng === 'perplexity') return '<span class="engine-badge text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200">Perplexity</span>';
      if (eng === 'claude') return '<span class="engine-badge text-amber-600 bg-amber-50 dark:bg-amber-500/10 border-amber-200">Claude</span>';
      return `<span class="engine-badge">${eng}</span>`;
    }).join(' ');

    // Citation Index Badge
    let indexBadge = `<span class="score-badge score-low"><span class="w-1.5 h-1.5 rounded-full bg-rose-400"></span>${item.index.toFixed(1)}</span>`;

    tr.innerHTML = `
      <td>
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xs">
            ${item.brand.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <span class="font-bold text-[var(--text-primary)] hover:text-blue-600 transition-colors">${item.brand}</span>
            <span class="text-xs text-[var(--text-muted)] font-mono ml-1.5">${item.domain}</span>
          </div>
        </div>
      </td>
      <td>
        <span class="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
          ${item.queries}
        </span>
      </td>
      <td>
        <div class="flex flex-wrap items-center gap-1">
          ${engineBadges}
        </div>
      </td>
      <td>
        <span class="status-indicator status-complete">
          <span class="status-dot"></span>
          <span>${item.status}</span>
        </span>
      </td>
      <td>${indexBadge}</td>
      <td>
        <span class="font-mono text-xs font-semibold text-[var(--text-secondary)]">${item.credits}</span>
      </td>
      <td>
        <span class="text-xs font-mono text-[var(--text-secondary)]">${item.when}</span>
      </td>
      <td class="text-right">
        <div class="flex items-center justify-end">
          <button onclick="openQueryModal(${item.id})" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 transition-all shadow-2xs hover:shadow-xs active:scale-95" title="View Full Report">
            <i data-lucide="eye" class="w-3.5 h-3.5"></i>
            <span>Report</span>
          </button>
        </div>
      </td>
    `;

    tr.addEventListener('click', (e) => {
      if (!e.target.closest('button')) {
        openQueryModal(item.id);
      }
    });

    tbody.appendChild(tr);
  });

  document.getElementById('checks-count-badge').textContent = `${records.length} shown`;
  document.getElementById('pagination-info').textContent = `Showing ${records.length} of ${queryChecks.length} checks`;

  if (window.lucide) lucide.createIcons();
}

function initTableControls() {
  const searchInput = document.getElementById('table-search');
  const engineFilter = document.getElementById('engine-filter');
  const sortFilter = document.getElementById('sort-filter');
  const exportBtn = document.getElementById('export-csv-btn');

  function applyFilters() {
    const q = searchInput.value.trim().toLowerCase();
    const eng = engineFilter.value;
    const sort = sortFilter.value;

    let filtered = queryChecks.filter(item => {
      const matchSearch = item.brand.toLowerCase().includes(q) || item.domain.toLowerCase().includes(q);
      const matchEngine = eng === 'all' || item.engines.includes(eng);
      return matchSearch && matchEngine;
    });

    if (sort === 'highest-index') {
      filtered.sort((a, b) => b.index - a.index);
    } else if (sort === 'most-queries') {
      filtered.sort((a, b) => b.queries - a.queries);
    } else {
      filtered.sort((a, b) => b.id - a.id);
    }

    renderChecksTable(filtered);
  }

  searchInput.addEventListener('input', applyFilters);
  engineFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);

  exportBtn.addEventListener('click', () => {
    let csv = 'Brand,Domain,Queries,Engines,Status,Index,Credits,When\n';
    queryChecks.forEach(c => {
      csv += `${c.brand},${c.domain},${c.queries},"${c.engines.join(', ')}",${c.status},${c.index},${c.credits},${c.when}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `auralytix-query-checks-${Date.now()}.csv`);
    a.click();
  });
}

/* ==========================================================================
   SUBMIT NEW CHECK SIMULATION
   ========================================================================== */
function initCheckForm() {
  const form = document.getElementById('query-check-form');
  const brandInput = document.getElementById('brand-name');
  const domainInput = document.getElementById('website-domain');
  const textarea = document.getElementById('queries-textarea');
  const runsInput = document.getElementById('runs-per-query');
  const runBtn = document.getElementById('run-check-btn');
  const runBtnText = document.getElementById('run-btn-text');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const brand = brandInput.value.trim();
    let domain = domainInput.value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const lines = textarea.value.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (!brand || !domain || lines.length === 0) return;

    // Active engines
    const activeEngines = [];
    document.querySelectorAll('.engine-pill.active').forEach(p => {
      activeEngines.push(p.getAttribute('data-engine'));
    });
    if (activeEngines.length === 0) {
      alert('Please select at least one AI engine.');
      return;
    }

    const marketsCount = document.querySelectorAll('#market-chips-box .market-chip').length || 1;
    const runs = parseInt(runsInput.value) || 1;
    const totalCost = lines.length * marketsCount * activeEngines.length * runs;

    if (queryCredits < totalCost) {
      alert('Insufficient credits to run this query check.');
      return;
    }

    // Set loading state
    runBtn.disabled = true;
    runBtn.classList.add('opacity-75', 'cursor-not-allowed');
    runBtnText.innerHTML = `<span class="flex items-center gap-2"><svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg> Probing AI models...</span>`;

    setTimeout(() => {
      // Deduct credits
      queryCredits -= totalCost;
      const kpiCredits = document.getElementById('kpi-credits');
      if (kpiCredits) kpiCredits.textContent = queryCredits;
      document.getElementById('sidebar-credits').textContent = queryCredits;

      const now = new Date();
      const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      const newCheck = {
        id: Date.now(),
        brand: brand,
        domain: domain,
        queries: lines.length,
        engines: activeEngines,
        status: 'Complete',
        index: +(Math.random() * 25).toFixed(1),
        credits: totalCost,
        when: dateStr,
        queryText: lines[0],
        competitorsNamed: 'Market leaders in selected category',
        aiResponses: [
          {
            engine: activeEngines[0].toUpperCase(),
            cited: false,
            summary: `Evaluated ${lines.length} prompt(s). Brand entity was recognized but outranked by dominant directory citations.`,
            recommendation: 'Optimize knowledge graph entities and author profiles.'
          }
        ]
      };

      queryChecks.unshift(newCheck);
      const kpiTotalChecks = document.getElementById('kpi-total-checks');
      if (kpiTotalChecks) kpiTotalChecks.textContent = queryChecks.length;

      // Reset
      runBtn.disabled = false;
      runBtn.classList.remove('opacity-75', 'cursor-not-allowed');
      runBtnText.textContent = `Run check • ${totalCost} credits`;
      brandInput.value = '';
      domainInput.value = '';

      renderChecksTable(queryChecks);
    }, 1200);
  });
}

/* ==========================================================================
   QUERY DETAIL MODAL
   ========================================================================== */
function initModal() {
  const modal = document.getElementById('query-modal');
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

function openQueryModal(id) {
  const record = queryChecks.find(r => r.id === id);
  if (!record) return;

  document.getElementById('modal-brand-title').textContent = `${record.brand} (${record.domain})`;
  document.getElementById('modal-query-date').textContent = `Checked on ${record.when} • ${record.queries} query prompt(s)`;
  document.getElementById('modal-index-score').textContent = `${record.index.toFixed(1)}%`;
  document.getElementById('modal-queries-count').textContent = record.queries;
  document.getElementById('modal-engines-count').textContent = record.engines.length;
  document.getElementById('modal-engines-names').textContent = record.engines.join(', ');

  const container = document.getElementById('modal-engine-responses');
  container.innerHTML = `
    <div class="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1.5">
      <div class="text-[11px] font-bold text-[var(--text-muted)] uppercase">Buyer Prompt Evaluated</div>
      <p class="text-xs font-mono text-[var(--text-primary)] bg-[var(--bg-secondary)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
        "${record.queryText}"
      </p>
      <div class="text-[11px] text-[var(--text-secondary)] pt-1">
        <strong>Competitors Named Instead:</strong> <span class="text-rose-600 font-semibold">${record.competitorsNamed}</span>
      </div>
    </div>
  `;

  record.aiResponses.forEach(resp => {
    const card = document.createElement('div');
    card.className = 'p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2';
    card.innerHTML = `
      <div class="flex items-center justify-between text-xs">
        <span class="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
          <i data-lucide="bot" class="w-3.5 h-3.5 text-blue-600"></i>
          ${resp.engine}
        </span>
        <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
          Not Cited
        </span>
      </div>
      <p class="text-xs text-[var(--text-secondary)] leading-relaxed">
        ${resp.summary}
      </p>
      <div class="p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[11px] text-emerald-800 dark:text-emerald-300">
        <strong>Actionable Fix:</strong> ${resp.recommendation}
      </div>
    `;
    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
  document.getElementById('query-modal').classList.add('active');
}
