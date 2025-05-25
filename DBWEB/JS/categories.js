const Categories_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/cat";
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/categories";
const put_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/categories";

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
      <td>
        <button class="btn btn-sm btn-warning upgrade-btn" data-id="${category.category_id}">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Add click events to Upgrade buttons
  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const category = categoriesData.find(c => c.category_id == id);
      if (!category) return;

      showForm("upgrade");
      document.getElementById("category_id").value = category.category_id;
      document.getElementById("name").value = category.name;
      document.getElementById("description").value = category.description;
    });
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

// Show form for insert or upgrade
function showForm(mode) {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = mode === "insert" ? "Insert Category" : "Upgrade Category";
  categoryForm.dataset.mode = mode;

  if (mode === "insert") {
    categoryForm.reset();
    document.getElementById("category_id").disabled = false;
  } else {
    document.getElementById("category_id").disabled = true;
  }
}

// Hide form and reset
function hideForm() {
  categoryForm.reset();
  formSection.classList.add("d-none");
}

// Handle form submit
categoryForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mode = this.dataset.mode;
  const id = document.getElementById("category_id").value.trim();
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!id || !name || !description) {
    alert("⚠️ All fields are required.");
    return;
  }

  const requestBody = mode === "insert"
    ? { category_id: id, name, description }
    : { name, description };

  const url = mode === "insert" ? post_URL : `${put_URL}/${id}`;// checking to get the correct URL 
  const method = mode === "insert" ? "POST" : "PUT";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to ${mode} category.`);
      return res.json();
    })
    .then(response => {
      if (mode === "insert") {
        categoriesData.push(response);
        alert("✅ Category inserted!");
      } else {
        const index = categoriesData.findIndex(c => c.category_id == id);
        if (index !== -1) categoriesData[index] = response;
        alert("✅ Category upgraded!");
      }
      renderTable();
      hideForm();
    })
    .catch(err => {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    });
});

// Insert button click event
document.getElementById("insertCategoryBtn").addEventListener("click", () => {
  showForm("insert");
});
document.getElementById("cancelFormBtn").addEventListener("click", function () {
  document.getElementById("formSection").classList.add("d-none");
});