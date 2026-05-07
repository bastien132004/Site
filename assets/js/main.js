/* ═══════════════════════════════════════════════════════
   PECHECOMPARATIF.FR — main.js
   → assets/js/main.js
═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Nav mobile toggle ─────────────────────────────── */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav   = document.getElementById('main-nav');

  navToggle?.addEventListener('click', () => {
    mainNav.classList.toggle('open');
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
        if (filter === 'all' || card.dataset.brand === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp .35s ease both';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ── Comparaison produits ──────────────────────────── */
  const compareBar    = document.getElementById('compare-bar');
  const compareCount  = document.getElementById('compare-count');
  const compareLaunch = document.getElementById('compare-launch');
  const compareClear  = document.getElementById('compare-clear');
  const compareAddBtns = document.querySelectorAll('.btn-compare-add');

  let selected = [];

  compareAddBtns.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const name = card.querySelector('.product-name').textContent;

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
    compareCount.textContent = n === 0
      ? '0 produit sélectionné'
      : `${n} produit${n > 1 ? 's' : ''} sélectionné${n > 1 ? 's' : ''}`;

    compareLaunch.disabled = n < 2;
    compareBar.classList.toggle('visible', n > 0);
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

  /* ── Barre de recherche ────────────────────────────── */
  const searchBtn   = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  function doSearch() {
    const q = searchInput.value.trim();
    if (!q) return;
    // TODO : brancher sur votre système de données
    console.log('Recherche :', q);
    searchInput.value = '';
    document.getElementById('comparateur')?.scrollIntoView({ behavior: 'smooth' });
  }

  searchBtn?.addEventListener('click', doSearch);
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') doSearch();
  });

  /* ── Scroll animation (Intersection Observer) ──────── */
  const animEls = document.querySelectorAll('.cat-card, .product-card, .why-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  animEls.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(20px)';
    el.style.transition = `opacity .5s ease ${i * 0.07}s, transform .5s ease ${i * 0.07}s`;
    observer.observe(el);
  });

  /* ── Header shadow on scroll ───────────────────────── */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

});
