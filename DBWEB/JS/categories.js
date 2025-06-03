const Categories_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/cat";
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/categories";

let categoriesData = [];

const tbody = document.querySelector("#categoriesTable tbody");
const formSection = document.getElementById("formSection");
const categoryForm = document.getElementById("categoryForm");

// Render categories in the table
function renderTable() {
  tbody.innerHTML = "";
  categoriesData.forEach((category) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${category.category_id}</td>
      <td>${category.name}</td>
      <td>${category.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all categories on page load
function fetchCategories() {
  fetch(Categories_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    })
    .then(data => {
      categoriesData = data;
      renderTable();
    })
    .catch(err => console.error(err.message));
}
fetchCategories();

// Show form for insert only (category_id disabled)
function showForm() {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert Category";
  categoryForm.reset();
  categoryForm.dataset.mode = "insert";
  document.getElementById("category_id").disabled = true; // Locking the ID field
}

// Hide form and reset
function hideForm() {
  categoryForm.reset();
  formSection.classList.add("d-none");
}

// Insert button click event
document.getElementById("insertCategoryBtn").addEventListener("click", () => {
  showForm();
});

// Handle form submit (Insert Only)
categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !description) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newCategory = { name, description };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCategory),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert category.");
      return res.json();
    })
    .then(addedCategory => {
      categoriesData.push(addedCategory);
      renderTable();
      hideForm();
      alert("✅ New category inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert category.");
    });
});

// Cancel form button
document.getElementById("cancelFormBtn").addEventListener("click", function () {
  hideForm();
});
