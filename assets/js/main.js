document.addEventListener('DOMContentLoaded', function () {

  // ── Hamburger menu ──────────────────────────────
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  if (toggle && navLinks) {
    toggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  // ── Category filter (recipes page) ─────────────
  const filterBtns = document.querySelectorAll('#category-filter .filter-btn');
  const cards = document.querySelectorAll('.recipe-card-wrapper');

  if (filterBtns.length === 0) return;

  const urlParams = new URLSearchParams(window.location.search);
  const urlCategory = urlParams.get('category');
  if (urlCategory) {
    filterBtns.forEach(b => b.classList.remove('active'));
    const matching = [...filterBtns].find(b => b.dataset.category === urlCategory);
    if (matching) {
      matching.classList.add('active');
      filterCards(urlCategory);
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterCards(this.dataset.category);
    });
  });

  function filterCards(category) {
    cards.forEach(card => {
      card.style.display =
        (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
    });
  }

});
