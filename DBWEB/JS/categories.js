const Categories_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/cat";       // GET
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/categories";  // POST base
const put_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/categories";   // PUT base (with :id appended)

let categoriesData = [];

const tbody = document.querySelector("#categoriesTable tbody");

// Render categories table rows
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

  // Attach event listeners to upgrade buttons
  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const category = categoriesData.find(c => c.category_id == id);
      if (!category) return;

      showForm("upgrade");

      // Fill form with existing data
      document.getElementById("category_id").value = category.category_id;
      document.getElementById("name").value = category.name;
      document.getElementById("description").value = category.description;
    });
  });
}

// Initial fetch categories data (GET /cat)
fetch(Categories_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch categories data");
    return res.json();
  })
  .then(data => {
    categoriesData = data;
    renderTable();
  })
  .catch(err => console.error(err.message));

// Show Insert/Upgrade form
function showForm(mode) {
  document.getElementById("formTitle").innerText = mode === "insert" ? "Insert Category" : "Upgrade Category";
  document.getElementById("categoryForm").dataset.mode = mode;
  document.getElementById("formSection").style.display = "block";
}

// Hide form initially
document.getElementById("formSection").style.display = "none";

// Cancel button to hide form
document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("categoryForm").reset();
  document.getElementById("formSection").style.display = "none";
});

// Form submit handler
document.getElementById("categoryForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const mode = this.dataset.mode;
  const id = document.getElementById("category_id").value.trim();
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!name) {
    alert("⚠️ Name is required");
    return;
  }

  const updatedCategory = { name, description };

  if (mode === "insert") {
    //--------------------------------------------------------- POST /categories ---------------------------------------------------------//
    fetch(post_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCategory),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to insert category.");
        return res.json();
      })
      .then(newCategory => {
        categoriesData.push(newCategory);
        renderTable();
        alert("✅ New category inserted!");
        document.getElementById("categoryForm").reset();
        document.getElementById("formSection").style.display = "none";
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to insert category.");
      });

    }

     if (mode === "upgrade") {
    //------------------------------------------------------------------------ PUT /categories/:id   ------------------------------------------------------------------------ //
    fetch(`${put_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCategory),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update category.");
        return res.json();
      })
      .then(result => {
        // result should contain updated category info (like your PUT API)
        const index = categoriesData.findIndex(c => c.category_id == id);
        if (index !== -1) categoriesData[index] = updatedCategory ;

        renderTable();
        alert("✅ Category upgraded successfully!");
        document.getElementById("categoryForm").reset();
        document.getElementById("formSection").style.display = "none";
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to upgrade category.");
      });
  }
});

// // Add button to open insert form
// document.getElementById("insertCategoryBtn").addEventListener("click", () => {
//   document.getElementById("categoryForm").reset();
//   showForm("insert");
// });
