/* ═══════════════════════════════════════════════════════
   PECHECOMPARATIF.FR — main.js
   → assets/js/main.js
   Sidebar verticale déroulante + filtres + comparaison
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sidebar verticale ─────────────────────────────── */
  const navToggle      = document.getElementById('nav-toggle');
  const sidebar        = document.getElementById('site-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  function openSidebar() {
    sidebar?.classList.add('open');
    sidebarOverlay?.classList.add('active');
    navToggle?.classList.add('open');
    document.body.style.overflow = ''; // pas de lock scroll — sidebar flotte
  }

  function closeSidebar() {
    sidebar?.classList.remove('open');
    sidebarOverlay?.classList.remove('active');
    navToggle?.classList.remove('open');
  }

  navToggle?.addEventListener('click', () => {
    const isOpen = sidebar?.classList.contains('open');
    isOpen ? closeSidebar() : openSidebar();
  });

  sidebarOverlay?.addEventListener('click', closeSidebar);

  // Fermer la sidebar au clic sur un lien de nav (navigation SPA)
  sidebar?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  // Fermeture avec Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });

  /* ── Lien actif dans la sidebar ───────────────────── */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  sidebar?.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Filtres produits ──────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      productCards.forEach(card => {
        const show = filter === 'all' || card.dataset.brand === filter;
        card.style.display = show ? '' : 'none';
        if (show) card.style.animation = 'fadeInUp .35s ease both';
      });
    });
  });

  /* ── Comparaison produits ──────────────────────────── */
  const compareBar     = document.getElementById('compare-bar');
  const compareCount   = document.getElementById('compare-count');
  const compareLaunch  = document.getElementById('compare-launch');
  const compareClear   = document.getElementById('compare-clear');
  const compareAddBtns = document.querySelectorAll('.btn-compare-add');

  let selected = [];

  compareAddBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('selected')) {
        btn.classList.remove('selected');
        btn.textContent = '+ Comparer';
        selected = selected.filter(i => i !== index);
      } else {
        if (selected.length >= 3) {
          alert('Vous pouvez comparer jusqu\'à 3 produits simultanément.');
          return;
        }
        btn.classList.add('selected');
        btn.textContent = '✓ Ajouté';
        selected.push(index);
      }
      updateCompareBar();
    });
  });

  function updateCompareBar() {
    const n = selected.length;
    if (compareCount) {
      compareCount.textContent = n === 0
        ? '0 produit sélectionné'
        : `${n} produit${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}`;
    }
    if (compareLaunch) compareLaunch.disabled = n < 2;
    compareBar?.classList.toggle('visible', n > 0);
  }

  compareClear?.addEventListener('click', () => {
    selected = [];
    compareAddBtns.forEach(btn => {
      btn.classList.remove('selected');
      btn.textContent = '+ Comparer';
    });
    updateCompareBar();
  });

  compareLaunch?.addEventListener('click', () => {
    alert('Comparaison de ' + selected.length + ' produits — fonctionnalité à brancher sur vos données !');
  });

  /* ── Barre de recherche (hero) ────────────────────── */
  const searchBtn   = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  function doSearch() {
    const q = (searchInput?.value || '').trim();
    if (!q) return;
    console.log('Recherche :', q);
    if (searchInput) searchInput.value = '';
    document.getElementById('comparateur')?.scrollIntoView({ behavior: 'smooth' });
  }

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

  /* ── Mini-recherche topbar ─────────────────────────── */
  const headerSearchInput = document.getElementById('header-search-input');
  headerSearchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const q = headerSearchInput.value.trim();
      if (!q) return;
      headerSearchInput.value = '';
      document.getElementById('comparateur')?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ── Scroll animation (Intersection Observer) ───────── */
  const animEls = document.querySelectorAll('.cat-card, .product-card, .why-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  /* ── Header shadow on scroll ───────────────────────── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

});