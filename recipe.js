// --- Parse recipe ID from URL ---
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const recipe = recipes.find(r => r.id === id);

if (!recipe) {
  document.getElementById("recipe-content").textContent = "המתכון לא נמצא.";
} else {

  // Update page title
  document.title = `${recipe.name} — סבא איציק אופה`;

  // Hero content
  document.getElementById("recipe-title").textContent = recipe.name;
  document.getElementById("recipe-image").src = "images/" + recipe.image;
  document.getElementById("recipe-image").alt = recipe.name;
  document.getElementById("recipe-category-badge").textContent = recipe.category;

  // Load recipe text
  fetch("recipes/" + id + ".txt")
    .then(response => response.text())
    .then(text => {
      document.getElementById("recipe-content").textContent = text;
    })
    .catch(() => {
      document.getElementById("recipe-content").textContent = "שגיאה בטעינת המתכון.";
    });

  // Share button
  const shareBtn = document.getElementById("share-btn");
  shareBtn.addEventListener("click", () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name + " — סבא איציק אופה",
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        shareBtn.textContent = "✓ הקישור הועתק!";
        setTimeout(() => {
          shareBtn.textContent = "שיתוף";
        }, 2000);
      });
    }
  });

  // --- Build "Similar Recipes" section ---
  const similar = recipes.filter(r => r.category === recipe.category && r.id !== recipe.id);

  if (similar.length > 0) {
    document.getElementById("similar-section").style.display = "";
    const grid = document.getElementById("similar-grid");

    // Show up to 4 similar recipes, shuffled
    const shuffled = similar.sort(() => 0.5 - Math.random()).slice(0, 4);

    shuffled.forEach((r, i) => {
      const card = document.createElement("a");
      card.href = `recipe.html?id=${r.id}`;
      card.className = "similar-card";
      card.style.animationDelay = `${i * 0.1}s`;

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
}

// Back navigation
function goBack() {
  window.location.href = "index.html";
}
