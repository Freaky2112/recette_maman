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
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
    document.addEventListener('click', function (e) {
      if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      }
    });
  }

  // ── Two-level category + subcategory filter ─────
  const categoryBtns = document.querySelectorAll('#category-filter .filter-btn');
  const subFilter    = document.getElementById('subcategory-filter');
  const cards        = document.querySelectorAll('.recipe-card-wrapper');

  if (categoryBtns.length === 0) return;

  let activeCategory = 'all';
  let activeTag      = 'all';

  // ── Category click ──────────────────────────────
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      categoryBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeCategory = this.dataset.category;
      activeTag = 'all';
      updateSubfilter(activeCategory);
      applyFilters();
    });
  });

  // ── Build & show subcategory buttons ───────────
  function updateSubfilter(category) {
    if (category === 'all') {
      subFilter.style.display = 'none';
      return;
    }

    // Collect all tags from cards matching this category
    const tags = new Set();
    cards.forEach(card => {
      if (card.dataset.category === category) {
        const cardTags = card.dataset.tags.split(',').map(t => t.trim()).filter(Boolean);
        cardTags.forEach(t => tags.add(t));
      }
    });

    // Hide subfilter if no tags exist for this category
    if (tags.size === 0) {
      subFilter.style.display = 'none';
      return;
    }

    // Build buttons
    subFilter.innerHTML = '<span class="subcategory-label">Affiner :</span>';
    const allBtn = makeSubBtn('Tout', 'all', true);
    subFilter.appendChild(allBtn);

    tags.forEach(tag => {
      subFilter.appendChild(makeSubBtn(tag, tag, false));
    });

    subFilter.style.display = 'flex';
  }

  function makeSubBtn(label, tag, isActive) {
    const btn = document.createElement('button');
    btn.className = 'sub-btn' + (isActive ? ' active' : '');
    btn.dataset.tag = tag;
    btn.textContent = label;
    btn.addEventListener('click', function () {
      subFilter.querySelectorAll('.sub-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      activeTag = this.dataset.tag;
      applyFilters();
    });
    return btn;
  }

  // ── Apply both filters ──────────────────────────
  function applyFilters() {
    cards.forEach(card => {
      const catMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
      const cardTags = card.dataset.tags.split(',').map(t => t.trim());
      const tagMatch = activeTag === 'all' || cardTags.includes(activeTag);
      card.style.display = (catMatch && tagMatch) ? 'block' : 'none';
    });
  }

});
