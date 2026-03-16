// מיכל ראשי
const container = document.getElementById("recipes-container");

// סדר התצוגה שאתה ביקשת
const order = ["לחמניות", "לחמים", "בייגלס"];

// מיון כל המתכונים לפי הסדר
const sortedRecipes = recipes.sort((a, b) => {
  const aIndex = order.indexOf(a.category);
  const bIndex = order.indexOf(b.category);

  // אם שניהם ברשימה — לפי הסדר
  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;

  // אם רק אחד ברשימה — הוא קודם
  if (aIndex !== -1) return -1;
  if (bIndex !== -1) return 1;

  // שניהם לא ברשימה — לפי השם
  return a.name.localeCompare(b.name);
});

// יצירת גריד אחד של 5 בשורה
const grid = document.createElement("div");
grid.className = "category-grid";
container.appendChild(grid);

// יצירת כרטיסים
sortedRecipes.forEach(recipe => {
  const card = document.createElement("div");
  card.classList.add("recipe-card");

  card.innerHTML = `
    <div class="card-content">
      <img src="images/${recipe.image}" alt="${recipe.name}">
      <h3 class="recipe-name">${recipe.name}</h3>
    </div>
    <button class="open-btn">למתכון</button>
  `;

  // לחיצה על הכרטיס או על הכפתור
  card.addEventListener("click", () => {
window.location.href = `recipe.html?id=${recipe.id}`;
  });

  grid.appendChild(card);
});
