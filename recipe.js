// קריאת ה-ID מהכתובת
const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

// מציאת המתכון המתאים מתוך רשימת המתכונים
const recipe = recipes.find(r => r.id === id);

// אם לא נמצא — מציג הודעה
if (!recipe) {
    document.getElementById("recipe-content").innerHTML = "<p>המתכון לא נמצא.</p>";
} else {

    // הצגת שם המתכון
    document.getElementById("recipe-title").textContent = recipe.name;

    // הצגת תמונה
    document.getElementById("recipe-image").src = "images/" + recipe.image;

    // טעינת תוכן המתכון מתוך קובץ ה־txt
    fetch("recipes/" + id + ".txt")
        .then(response => response.text())
        .then(text => {
            document.getElementById("recipe-content").textContent = text;
        })
        .catch(err => {
            document.getElementById("recipe-content").innerHTML = "<p>שגיאה בטעינת המתכון.</p>";
        });
}

// פונקציית חזרה לדף הראשי
function goBack() {
    window.location.href = "index.html";
}
