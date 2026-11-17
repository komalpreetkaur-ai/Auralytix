/**
 * Auralytix Audit Report Page Controller
 * Handles 13-tab navigation, URL parameter routing, dynamic site telemetry, and re-run simulation
 */

(function () {
  'use strict';

  // Audit dataset for dynamic routing
  const AUDIT_PROFILES = {
    'shourya-bajaj-akurdi-pune.com': {
      domain: 'shourya-bajaj-akurdi-pune.com',
      url: 'https://shourya-bajaj-akurdi-pune.com/',
      date: '2026-11-17 08:57 UTC',
      duration: '487.66s',
      pages: 1,
      aioScore: 66.8,
      aioGrade: 'D',
      geoScore: 27.6,
      geoGrade: 'F · 26.4 - 28.8',
      projected: 98.7,
      recoverable: '+31.9',
      findingsCount: 11
    },
    'suzuki.com.ph': {
      domain: 'suzuki.com.ph',
      url: 'https://suzuki.com.ph/',
      date: '2026-10-21 10:12 UTC',
      duration: '142.18s',
      pages: 25,
      aioScore: 51.4,
      aioGrade: 'C',
      geoScore: 60.5,
      geoGrade: 'B · 58.2 - 62.0',
      projected: 89.2,
      recoverable: '+28.7',
      findingsCount: 8
    },
    'glocal360.ai': {
      domain: 'glocal360.ai',
      url: 'https://glocal360.ai/',
      date: '2026-10-14 10:00 UTC',
      duration: '88.42s',
      pages: 10,
      aioScore: 55.1,
      aioGrade: 'C',
      geoScore: 26.0,
      geoGrade: 'F',
      projected: 85.0,
      recoverable: '+29.9',
      findingsCount: 9
    },
    'example.com': {
      domain: 'example.com',
      url: 'https://example.com/',
      date: '2026-10-14 10:14 UTC',
      duration: '18.15s',
      pages: 10,
      aioScore: 33.5,
      aioGrade: 'F',
      geoScore: 12.0,
      geoGrade: 'F',
      projected: 92.4,
      recoverable: '+58.9',
      findingsCount: 14
    }
  };

  /**
   * Switch active tab pane
   * @param {string} tabId 
   */
  window.switchTab = function (tabId) {
    if (!tabId) return;

    // Update tab bar active classes
    const tabs = document.querySelectorAll('.report-tab');
    let tabFound = false;
    tabs.forEach(tab => {
      if (tab.getAttribute('data-tab') === tabId) {
        tab.classList.add('active');
        tabFound = true;
      } else {
        tab.classList.remove('active');
      }
    });

    // Hide all tab panes
    const panes = document.querySelectorAll('.tab-pane');
    panes.forEach(pane => pane.classList.add('hidden'));

    // Show target pane or generic fallback
    const targetPane = document.getElementById(`tab-pane-${tabId}`);
    if (targetPane) {
      targetPane.classList.remove('hidden');
    } else {
      const genericPane = document.getElementById('tab-pane-generic');
      if (genericPane) {
        const titleEl = document.getElementById('generic-tab-title');
        if (titleEl) {
          titleEl.textContent = formatTabTitle(tabId);
        }
        genericPane.classList.remove('hidden');
      }
    }

    // Update URL hash without scroll jumping
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, null, `#${tabId}`);
    }

    // Sync quick jump dropdown if present
    const quickSelect = document.getElementById('tab-quick-select');
    if (quickSelect && quickSelect.value !== tabId) {
      quickSelect.value = tabId;
    }

    // Refresh Lucide icons
    if (window.lucide) {
      lucide.createIcons();
    }
  };

  /**
   * Filter report tabs pills by high-level category
   * @param {string} category 
   */
  window.filterReportTabs = function(category) {
    const catButtons = document.querySelectorAll('.tab-category-btn');
    catButtons.forEach(btn => {
      if (btn.getAttribute('data-category') === category) {
        btn.classList.remove('bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]', 'border', 'border-[var(--border-subtle)]');
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        btn.classList.add('bg-[var(--bg-secondary)]', 'text-[var(--text-secondary)]', 'border', 'border-[var(--border-subtle)]');
      }
    });

    const tabs = document.querySelectorAll('.report-tab');
    tabs.forEach(tab => {
      const tabCat = tab.getAttribute('data-category');
      if (category === 'all' || tabCat === category) {
        tab.style.display = 'inline-flex';
      } else {
        tab.style.display = 'none';
      }
    });
  };

  function formatTabTitle(tabId) {
    return tabId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Display floating toast notification
   */
  function showToast(message, type = 'info') {
    const existing = document.getElementById('report-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'report-toast';
    toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold backdrop-blur-md transition-all duration-300 transform translate-y-2 opacity-0 ${
      type === 'success' 
        ? 'bg-emerald-500/90 text-white border-emerald-400' 
        : type === 'warn'
        ? 'bg-amber-500/90 text-white border-amber-400'
        : 'bg-slate-900/90 dark:bg-white/90 text-white dark:text-slate-900 border-white/20'
    }`;
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'info'}" class="w-4 h-4 shrink-0"></i>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    }, 10);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  /**
   * Initialize dynamic parameters from URL
   */
  function initUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const siteParam = urlParams.get('site');
    const profile = (siteParam && AUDIT_PROFILES[siteParam]) 
      ? AUDIT_PROFILES[siteParam] 
      : (siteParam ? {
          domain: siteParam,
          url: `https://${siteParam}/`,
          date: '2026-11-17 08:57 UTC',
          duration: '312.40s',
          pages: 10,
          aioScore: 66.8,
          aioGrade: 'D',
          geoScore: 27.6,
          geoGrade: 'F',
          projected: 98.7,
          recoverable: '+31.9',
          findingsCount: 11
        } : AUDIT_PROFILES['shourya-bajaj-akurdi-pune.com']);

    // Update Header and DOM
    const titleDomain = document.getElementById('report-title-domain');
    const breadcrumbSite = document.getElementById('breadcrumb-site');
    const siteLink = document.getElementById('report-site-link');
    const crawlDate = document.getElementById('report-crawl-date');
    const crawlDuration = document.getElementById('report-crawl-duration');
    const aioKpi = document.getElementById('kpi-aio-score');
    const geoKpi = document.getElementById('kpi-geo-score');
    const pagesKpi = document.getElementById('kpi-pages-count');

    if (titleDomain) titleDomain.textContent = profile.domain;
    if (breadcrumbSite) breadcrumbSite.textContent = profile.domain;
    if (siteLink) {
      siteLink.href = profile.url;
      const textSpan = siteLink.querySelector('span');
      if (textSpan) textSpan.textContent = profile.url;
    }
    if (crawlDate) crawlDate.textContent = profile.date;
    if (crawlDuration) crawlDuration.textContent = profile.duration;
    if (aioKpi) aioKpi.textContent = profile.aioScore.toFixed(1);
    if (geoKpi) geoKpi.textContent = profile.geoScore.toFixed(1);
    if (pagesKpi) pagesKpi.textContent = profile.pages;

    document.title = `Auralytix | ${profile.domain} Report`;
  }

  /**
   * Setup Interactive Re-run and Export Handlers
   */
  function initActionHandlers() {
    const rerunPagesInput = document.getElementById('rerun-pages-input');
    const rerunAioBtn = document.getElementById('rerun-aio-btn');
    const rerunAioGeoBtn = document.getElementById('rerun-aio-geo-btn');
    const exportPdfTop = document.getElementById('export-pdf-top-btn');
    const exportPdfSide = document.getElementById('download-pdf-sidebar');
    const refreshBtn = document.getElementById('refresh-report-btn');
    const creditsEl = document.getElementById('sidebar-credits');

    // Re-run AIO Only
    if (rerunAioBtn) {
      rerunAioBtn.addEventListener('click', () => {
        const pages = parseInt(rerunPagesInput ? rerunPagesInput.value : '50', 10) || 50;
        let currentCredits = parseInt(creditsEl.textContent, 10) || 659;
        
        if (currentCredits < pages) {
          showToast('Insufficient credits. Please top up your account.', 'warn');
          return;
        }

        rerunAioBtn.disabled = true;
        rerunAioBtn.innerHTML = `<span class="inline-block animate-spin mr-1">⟳</span> Running...`;

        setTimeout(() => {
          currentCredits -= pages;
          creditsEl.textContent = currentCredits;
          rerunAioBtn.disabled = false;
          rerunAioBtn.textContent = 'AIO only';
          showToast(`AIO crawl complete (${pages} pages). Used ${pages} credits.`, 'success');
        }, 1200);
      });
    }

    // Re-run AIO + GEO
    if (rerunAioGeoBtn) {
      rerunAioGeoBtn.addEventListener('click', () => {
        const pages = parseInt(rerunPagesInput ? rerunPagesInput.value : '50', 10) || 50;
        const totalCost = pages + 100;
        let currentCredits = parseInt(creditsEl.textContent, 10) || 659;

        if (currentCredits < totalCost) {
          showToast(`Requires ${totalCost} credits. Insufficient balance.`, 'warn');
          return;
        }

        rerunAioGeoBtn.disabled = true;
        rerunAioGeoBtn.innerHTML = `<span class="inline-block animate-spin mr-1">⟳</span> Probing Gemini...`;

        setTimeout(() => {
          currentCredits -= totalCost;
          creditsEl.textContent = currentCredits;
          rerunAioGeoBtn.disabled = false;
          rerunAioGeoBtn.textContent = 'AIO + GEO';
          showToast(`Full AIO + GEO re-audit finished! Used ${totalCost} credits.`, 'success');
        }, 1800);
      });
    }

    // PDF Export
    function handlePdfExport(e) {
      if (e) e.preventDefault();
      showToast('Generating printable PDF report...', 'info');
      setTimeout(() => {
        window.print();
      }, 500);
    }

    if (exportPdfTop) exportPdfTop.addEventListener('click', handlePdfExport);
    if (exportPdfSide) exportPdfSide.addEventListener('click', handlePdfExport);

    // Refresh Button
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        const icon = refreshBtn.querySelector('i');
        if (icon) icon.classList.add('animate-spin');
        showToast('Refreshing telemetry and report data...', 'info');
        setTimeout(() => {
          if (icon) icon.classList.remove('animate-spin');
          showToast('Audit report up to date.', 'success');
        }, 600);
      });
    }

    // Tab buttons event binding
    document.querySelectorAll('.report-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabId = tab.getAttribute('data-tab');
        window.switchTab(tabId);
      });
    });
  }

  /**
   * Filter opportunities cards by team
   */
  function initOpportunitiesFilter() {
    const filterPills = document.querySelectorAll('.opp-filter-pill');
    const cards = document.querySelectorAll('.opp-card');

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const team = pill.getAttribute('data-team');

        // Update active styles
        filterPills.forEach(p => {
          p.classList.remove('border-blue-500/40', 'bg-blue-50/70', 'dark:bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400', 'shadow-xs');
          p.classList.add('border-[var(--border-subtle)]', 'bg-[var(--bg-surface)]', 'text-[var(--text-primary)]');
        });

        pill.classList.remove('border-[var(--border-subtle)]', 'bg-[var(--bg-surface)]', 'text-[var(--text-primary)]');
        pill.classList.add('border-blue-500/40', 'bg-blue-50/70', 'dark:bg-blue-500/10', 'text-blue-600', 'dark:text-blue-400', 'shadow-xs');

        // Filter cards
        cards.forEach(card => {
          const cardTeam = card.getAttribute('data-team');
          if (team === 'all' || cardTeam === team) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Copy code to clipboard from code box
   */
  window.copyCode = function(button) {
    if (!button) return;
    const codeBox = button.closest('.code-box');
    if (!codeBox) return;
    const codeEl = codeBox.querySelector('code');
    if (!codeEl) return;
    
    navigator.clipboard.writeText(codeEl.innerText).then(() => {
      const originalText = button.innerText;
      button.innerText = 'Copied!';
      button.classList.add('text-emerald-600', 'font-semibold');
      setTimeout(() => {
        button.innerText = originalText;
        button.classList.remove('text-emerald-600', 'font-semibold');
      }, 1500);
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  };

  /**
   * Filter prompts table rows by intent
   */
  window.filterPrompts = function(intent) {
    const buttons = document.querySelectorAll('.prompt-filter-btn');
    buttons.forEach(btn => {
      if (btn.getAttribute('data-filter') === intent) {
        btn.classList.remove('bg-[var(--bg-surface)]', 'text-[var(--text-secondary)]', 'border', 'border-[var(--border-subtle)]');
        btn.classList.add('bg-blue-600', 'text-white', 'shadow-xs');
      } else {
        btn.classList.remove('bg-blue-600', 'text-white', 'shadow-xs');
        btn.classList.add('bg-[var(--bg-surface)]', 'text-[var(--text-secondary)]', 'border', 'border-[var(--border-subtle)]');
      }
    });

    const rows = document.querySelectorAll('.prompt-row');
    rows.forEach(row => {
      const rowIntent = row.getAttribute('data-intent');
      if (intent === 'all' || rowIntent === intent) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  };

  // DOM Content Loaded Execution
  document.addEventListener('DOMContentLoaded', () => {
    initUrlParams();
    initActionHandlers();
    initOpportunitiesFilter();

    // Check URL hash for initial tab
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      window.switchTab(hash);
    } else {
      window.switchTab('overview');
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  });

})();
