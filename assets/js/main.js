// Category filter on recipes page
document.addEventListener('DOMContentLoaded', function () {
  const filterBtns = document.querySelectorAll('#category-filter .filter-btn');
  const cards = document.querySelectorAll('.recipe-card-wrapper');

  if (filterBtns.length === 0) return;

  // Check URL param on load
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
      if (category === 'all' || card.dataset.category === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }
});
