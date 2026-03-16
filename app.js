// ============================================
// CATEGORY ORDER & SORTING
// ============================================
const categoryOrder = ["לחמניות", "לחמים", "בייגלס", "חלות", "מאפים", "מתוקים"];

const categories = [...new Set(recipes.map(r => r.category))];
categories.sort((a, b) => {
  const ai = categoryOrder.indexOf(a);
  const bi = categoryOrder.indexOf(b);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.localeCompare(b);
});

const sortedRecipes = [...recipes].sort((a, b) => {
  const ai = categoryOrder.indexOf(a.category);
  const bi = categoryOrder.indexOf(b.category);
  if (ai !== -1 && bi !== -1) return ai - bi;
  if (ai !== -1) return -1;
  if (bi !== -1) return 1;
  return a.name.localeCompare(b.name);
});

// ============================================
// FILTER CHIPS
// ============================================
const filterInner = document.querySelector(".filter-inner");

categories.forEach(cat => {
  const chip = document.createElement("button");
  chip.className = "filter-chip";
  chip.dataset.category = cat;
  chip.textContent = cat;
  filterInner.appendChild(chip);
});

// ============================================
// RENDER RECIPE CARDS
// ============================================
const container = document.getElementById("recipes-container");
let currentFilter = "all";
let filteredList = sortedRecipes;

function createCard(recipe, index) {
  const card = document.createElement("div");
  card.className = "recipe-card";
  card.style.animationDelay = `${index * 0.06}s`;

  const imageWrap = document.createElement("div");
  imageWrap.className = "card-image-wrap";

  const img = document.createElement("img");
  img.src = `images/${recipe.image}`;
  img.alt = recipe.name;
  img.loading = "lazy";

  const badge = document.createElement("span");
  badge.className = "card-category";
  badge.textContent = recipe.category;

  imageWrap.appendChild(img);
  imageWrap.appendChild(badge);

  const body = document.createElement("div");
  body.className = "card-body";

  const title = document.createElement("h3");
  title.className = "card-title";
  title.textContent = recipe.name;

  const cta = document.createElement("span");
  cta.className = "card-cta";
  cta.textContent = "לצפייה במתכון ";
  const arrow = document.createElement("span");
  arrow.className = "card-cta-arrow";
  arrow.textContent = "←";
  cta.appendChild(arrow);

  body.appendChild(title);
  body.appendChild(cta);
  card.appendChild(imageWrap);
  card.appendChild(body);

  card.addEventListener("click", () => openRecipe(recipe.id));
  return card;
}

function renderCards(filter) {
  currentFilter = filter;
  filteredList = filter === "all"
    ? sortedRecipes
    : sortedRecipes.filter(r => r.category === filter);

  container.replaceChildren();
  filteredList.forEach((recipe, i) => {
    container.appendChild(createCard(recipe, i));
  });
}

renderCards("all");

filterInner.addEventListener("click", e => {
  const chip = e.target.closest(".filter-chip");
  if (!chip) return;
  filterInner.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  renderCards(chip.dataset.category);
});

// ============================================
// MODAL SYSTEM
// ============================================
const overlay = document.getElementById("modal-overlay");
const backdrop = document.getElementById("modal-backdrop");
const modalContainer = document.getElementById("modal-container");
const closeBtn = document.getElementById("modal-close");
const prevBtn = document.getElementById("nav-prev");
const nextBtn = document.getElementById("nav-next");

let currentRecipeId = null;

function openRecipe(id) {
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return;

  currentRecipeId = id;
  window.location.hash = `recipe/${id}`;

  // Populate modal
  document.getElementById("modal-title").textContent = recipe.name;
  document.getElementById("modal-badge").textContent = recipe.category;

  const img = document.getElementById("modal-image");
  img.src = `images/${recipe.image}`;
  img.alt = recipe.name;

  // Load recipe text
  const contentEl = document.getElementById("modal-content");
  contentEl.textContent = "טוען מתכון...";

  fetch(`recipes/${id}.txt`)
    .then(r => r.text())
    .then(text => { contentEl.textContent = text; })
    .catch(() => { contentEl.textContent = "שגיאה בטעינת המתכון."; });

  // Similar recipes
  buildSimilar(recipe);

  // Update nav buttons
  updateNavButtons();

  // Show modal
  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalContainer.scrollTop = 0;

  // Animate in
  requestAnimationFrame(() => {
    overlay.classList.add("visible");
  });
}

function closeModal() {
  overlay.classList.remove("visible");
  document.body.classList.remove("modal-open");

  setTimeout(() => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    history.replaceState(null, "", window.location.pathname);
    currentRecipeId = null;
  }, 350);
}

function updateNavButtons() {
  const idx = filteredList.findIndex(r => r.id === currentRecipeId);
  prevBtn.style.display = idx > 0 ? "" : "none";
  nextBtn.style.display = idx < filteredList.length - 1 ? "" : "none";
}

function goNext() {
  const idx = filteredList.findIndex(r => r.id === currentRecipeId);
  if (idx < filteredList.length - 1) {
    modalContainer.scrollTop = 0;
    openRecipe(filteredList[idx + 1].id);
  }
}

function goPrev() {
  const idx = filteredList.findIndex(r => r.id === currentRecipeId);
  if (idx > 0) {
    modalContainer.scrollTop = 0;
    openRecipe(filteredList[idx - 1].id);
  }
}

function buildSimilar(recipe) {
  const section = document.getElementById("modal-similar-section");
  const grid = document.getElementById("modal-similar-grid");
  grid.replaceChildren();

  const similar = recipes.filter(r => r.category === recipe.category && r.id !== recipe.id);
  if (similar.length === 0) {
    section.style.display = "none";
    return;
  }

  section.style.display = "";
  const shuffled = similar.sort(() => 0.5 - Math.random()).slice(0, 4);

  shuffled.forEach((r, i) => {
    const card = document.createElement("a");
    card.href = "#";
    card.className = "similar-card";
    card.style.animationDelay = `${i * 0.1}s`;

    card.addEventListener("click", e => {
      e.preventDefault();
      modalContainer.scrollTop = 0;
      openRecipe(r.id);
    });

    const imgWrap = document.createElement("div");
    imgWrap.className = "similar-card-img-wrap";
    const img = document.createElement("img");
    img.src = `images/${r.image}`;
    img.alt = r.name;
    img.loading = "lazy";
    imgWrap.appendChild(img);

    const name = document.createElement("span");
    name.className = "similar-card-name";
    name.textContent = r.name;

    card.appendChild(imgWrap);
    card.appendChild(name);
    grid.appendChild(card);
  });
}

// ============================================
// EVENT LISTENERS
// ============================================
closeBtn.addEventListener("click", closeModal);
backdrop.addEventListener("click", closeModal);
prevBtn.addEventListener("click", goPrev);
nextBtn.addEventListener("click", goNext);

// Print from modal
document.getElementById("modal-print").addEventListener("click", () => {
  window.print();
});

// Share from modal
document.getElementById("modal-share").addEventListener("click", () => {
  const url = window.location.origin + window.location.pathname + `#recipe/${currentRecipeId}`;
  if (navigator.share) {
    const recipe = recipes.find(r => r.id === currentRecipeId);
    navigator.share({ title: (recipe ? recipe.name : "") + " — סבא איציק אופה", url });
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById("modal-share");
      btn.textContent = "✓ הקישור הועתק!";
      setTimeout(() => { btn.textContent = "שיתוף"; }, 2000);
    });
  }
});

// Keyboard navigation
document.addEventListener("keydown", e => {
  if (!overlay.classList.contains("open")) return;
  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") goPrev();
  if (e.key === "ArrowLeft") goNext();
});

// Swipe support for mobile
let touchStartX = 0;
modalContainer.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

modalContainer.addEventListener("touchend", e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 80) {
    if (diff > 0) goPrev();
    else goNext();
  }
}, { passive: true });

// Hash-based routing: open recipe on page load if hash present
function checkHash() {
  const match = window.location.hash.match(/^#recipe\/(\d+)$/);
  if (match) {
    openRecipe(parseInt(match[1]));
  }
}

window.addEventListener("hashchange", () => {
  const match = window.location.hash.match(/^#recipe\/(\d+)$/);
  if (match) {
    openRecipe(parseInt(match[1]));
  } else if (!window.location.hash || window.location.hash === "#") {
    closeModal();
  }
});

checkHash();
