const Categories_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/cat";
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/categories";

let categoriesData = [];
const tbody = document.querySelector("#categoriesTable tbody");
const formSection = document.getElementById("formSection");
const categoryForm = document.getElementById("categoryForm");
const tableSection = document.getElementById("tableSection");
// Render categories table
function renderTable() {
  tbody.innerHTML = "";
  categoriesData.forEach((category) => {
    const tr = document.createElement("tr");
    tr.classList.add("text-center");
    tr.innerHTML = `
      <td>${category.category_id}</td>
      <td>${category.name}</td>
      <td>${category.description}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all categories
function fetchCategories() {
  fetch(Categories_URL)
    .then(res => res.json())
    .then(data => {
      categoriesData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Fetch error:", err.message));
}
fetchCategories();

// Show insert form
function showForm() {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert Category";
  categoryForm.reset();
  categoryForm.classList.remove("was-validated");
  tableSection.classList.add("d-none");
}

// Hide insert form
function hideForm() {
  categoryForm.reset();
  formSection.classList.add("d-none");
  tableSection.classList.remove("d-none");
}

// Handle form submission
categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  categoryForm.classList.add("was-validated");

  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name || !description) return;

  const newCategory = { name, description };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCategory),
  })
    .then(res => res.json())
    .then(addedCategory => {
      categoriesData.push(addedCategory);
      renderTable();
      hideForm();
      alert("✅ Category inserted successfully!");
    })
    .catch(err => {
      console.error("❌ Insert failed:", err);
      alert("❌ Failed to insert category.");
    });
});

// Cancel form button
document.getElementById("cancelFormBtn").addEventListener("click", hideForm);
