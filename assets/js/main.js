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

  // ── Category + subcategory filter ──────────────
  const categoryBtns = document.querySelectorAll('#category-filter .filter-btn');
  const subFilter    = document.getElementById('subcategory-filter');
  const cards        = document.querySelectorAll('.recipe-card-wrapper');

  if (categoryBtns.length > 0) {
    let activeCategory = 'all';
    let activeTag      = 'all';

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

    function updateSubfilter(category) {
      if (category === 'all') { subFilter.style.display = 'none'; return; }
      const tags = new Set();
      cards.forEach(card => {
        if (card.dataset.category === category) {
          card.dataset.tags.split(',').map(t => t.trim()).filter(Boolean).forEach(t => tags.add(t));
        }
      });
      if (tags.size === 0) { subFilter.style.display = 'none'; return; }
      subFilter.innerHTML = '<span class="subcategory-label">Affiner :</span>';
      subFilter.appendChild(makeSubBtn('Tout', 'all', true));
      tags.forEach(tag => subFilter.appendChild(makeSubBtn(tag, tag, false)));
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

    function applyFilters() {
      cards.forEach(card => {
        const catMatch = activeCategory === 'all' || card.dataset.category === activeCategory;
        const cardTags = card.dataset.tags.split(',').map(t => t.trim());
        const tagMatch = activeTag === 'all' || cardTags.includes(activeTag);
        card.style.display = (catMatch && tagMatch) ? 'block' : 'none';
      });
    }
  }

  // ── Search engine ───────────────────────────────
  let searchData = null;

  // Get baseurl from a meta tag or infer it
  const base = document.querySelector('meta[name="baseurl"]')
    ? document.querySelector('meta[name="baseurl"]').content
    : (window.location.pathname.startsWith('/recette_maman') ? '/recette_maman' : '');

  function loadSearchData(callback) {
    if (searchData) { callback(searchData); return; }
    fetch(base + '/search.json')
      .then(r => r.json())
      .then(data => { searchData = data; callback(data); })
      .catch(() => { searchData = []; callback([]); });
  }

  function scoreMatch(recipe, query) {
    const q = query.toLowerCase().trim();
    const words = q.split(/\s+/);
    let score = 0;
    words.forEach(word => {
      if (recipe.title && recipe.title.toLowerCase().includes(word))       score += 10;
      if (recipe.category && recipe.category.toLowerCase().includes(word)) score += 6;
      if (recipe.tags && recipe.tags.toLowerCase().includes(word))         score += 5;
      if (recipe.description && recipe.description.toLowerCase().includes(word)) score += 4;
      if (recipe.ingredients && recipe.ingredients.toLowerCase().includes(word)) score += 3;
      if (recipe.content && recipe.content.toLowerCase().includes(word))   score += 1;
    });
    return score;
  }

  function searchRecipes(query, data) {
    if (!query || query.length < 2) return [];
    return data
      .map(r => ({ ...r, score: scoreMatch(r, query) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }

  // ── Header search (dropdown) ────────────────────
  const headerInput    = document.getElementById('search-input-header');
  const searchDropdown = document.getElementById('search-dropdown');

  if (headerInput && searchDropdown) {
    let debounceTimer;

    headerInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      const query = this.value.trim();
      if (query.length < 2) { searchDropdown.classList.remove('open'); return; }
      debounceTimer = setTimeout(() => {
        loadSearchData(data => {
          const results = searchRecipes(query, data).slice(0, 6);
          renderDropdown(results, query);
        });
      }, 200);
    });

    // Close dropdown on outside click
    document.addEventListener('click', e => {
      if (!headerInput.contains(e.target) && !searchDropdown.contains(e.target)) {
        searchDropdown.classList.remove('open');
      }
    });

    // Go to search page on Enter
    headerInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && this.value.trim()) {
        window.location.href = base + '/recherche/?q=' + encodeURIComponent(this.value.trim());
      }
    });

    function renderDropdown(results, query) {
      if (results.length === 0) {
        searchDropdown.innerHTML = '<div class="search-no-results">Aucun résultat pour "' + query + '"</div>';
        searchDropdown.classList.add('open');
        return;
      }
      let html = results.map(r => `
        <a class="search-result-item" href="${r.url}">
          <span class="result-emoji">🍽️</span>
          <div class="result-info">
            <div class="result-title">${r.title}</div>
            <div class="result-meta">${r.category}${r.tags ? ' · ' + r.tags : ''}</div>
          </div>
        </a>
      `).join('');
      html += `<div class="search-dropdown-footer">
        <a href="${base}/recherche/?q=${encodeURIComponent(query)}">Voir tous les résultats →</a>
      </div>`;
      searchDropdown.innerHTML = html;
      searchDropdown.classList.add('open');
    }
  }

  // ── Full search page ────────────────────────────
  const pageInput   = document.getElementById('search-input-page');
  const pageResults = document.getElementById('search-results');
  const pageEmpty   = document.getElementById('search-empty');
  const pageStatus  = document.getElementById('search-status');
  const emptyQuery  = document.getElementById('empty-query');

  if (pageInput && pageResults) {
    // Pre-fill from URL param
    const urlQ = new URLSearchParams(window.location.search).get('q');
    if (urlQ) { pageInput.value = urlQ; runPageSearch(urlQ); }

    let debounceTimer;
    pageInput.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => runPageSearch(this.value.trim()), 250);
    });

    function runPageSearch(query) {
      if (!query || query.length < 2) {
        pageResults.innerHTML = '';
        if (pageStatus) pageStatus.textContent = '';
        if (pageEmpty) pageEmpty.style.display = 'none';
        return;
      }
      loadSearchData(data => {
        const results = searchRecipes(query, data);
        if (results.length === 0) {
          pageResults.innerHTML = '';
          if (emptyQuery) emptyQuery.textContent = query;
          if (pageEmpty) pageEmpty.style.display = 'block';
          if (pageStatus) pageStatus.textContent = '';
        } else {
          if (pageEmpty) pageEmpty.style.display = 'none';
          if (pageStatus) pageStatus.textContent = results.length + ' recette(s) trouvée(s)';
          pageResults.innerHTML = results.map(r => `
            <a href="${r.url}" style="text-decoration:none;">
              <article class="recipe-card">
                <div class="card-image-placeholder">🍽️</div>
                <div class="card-body">
                  <span class="card-category">${r.category || ''}</span>
                  <h3 class="card-title">${r.title}</h3>
                  <p style="font-size:0.9rem;color:var(--text-light);">${r.description || ''}</p>
                  ${r.tags ? '<div class="card-tags">' + r.tags.split(',').map(t => `<span class="card-tag">${t.trim()}</span>`).join('') + '</div>' : ''}
                </div>
              </article>
            </a>
          `).join('');
        }
      });
    }
  }

});
