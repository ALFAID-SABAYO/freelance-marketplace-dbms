// URL Constants
const getURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/pro";
const postURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/projects";
const putURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/projects";

// DOM Elements
const tableBody = document.querySelector("#projectsTable tbody");
const formSection = document.getElementById("formSection");
const projectForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");

const projectIdInput = document.getElementById("project_id");
const clientIdInput = document.getElementById("client_id");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categoryIdInput = document.getElementById("category_id");
const budgetInput = document.getElementById("budget");

let projectData = [];

// Fetch all projects on page load
function fetchProjects() {
  fetch(getURL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch projects.");
      return res.json();
    })
    .then(data => {
      projectData = data;
      renderTable();
    })
    .catch(err => {
      console.error("❌ Fetch Error:", err);
      alert(`❌ Error: ${err.message}`);
    });
}

// Render data into the table
function renderTable() {
  tableBody.innerHTML = "";

  projectData.forEach(project => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${project.project_id}</td>
      <td>${project.client_id}</td>
      <td>${project.title}</td>
      <td>${project.description}</td>
      <td>${project.category_id}</td>
      <td>${project.budget}</td>
      <td>${project.posted_at || "N/A"}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn"
          data-id="${project.project_id}"
          data-client="${project.client_id}"
          data-title="${project.title}"
          data-description="${project.description}"
          data-category="${project.category_id}"
          data-budget="${project.budget}">
          ✏️
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Attach edit button handlers
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      showForm("update", {
        id: button.dataset.id,
        client: button.dataset.client,
        title: button.dataset.title,
        description: button.dataset.description,
        category: button.dataset.category,
        budget: button.dataset.budget
      });
    });
  });
}

// Show the insert/update form
function showForm(mode, data = {}) {
  formSection.classList.remove("d-none");
  formTitle.innerText = mode === "insert" ? "Insert Project" : "Update Project";
  projectForm.dataset.mode = mode;
  projectForm.dataset.id = data.id || "";

  projectForm.reset();

  if (mode === "update") {
    projectIdInput.value = data.id;
    clientIdInput.value = data.client;
    titleInput.value = data.title;
    descriptionInput.value = data.description;
    categoryIdInput.value = data.category;
    budgetInput.value = data.budget;
    projectIdInput.disabled = true;
  } else {
    projectIdInput.disabled = false;
  }
}

// Hide and reset the form
function hideForm() {
  projectForm.reset();
  projectIdInput.disabled = false;
  formSection.classList.add("d-none");
  delete projectForm.dataset.id;
}

// Handle form submission
projectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mode = projectForm.dataset.mode;
  const project_id = projectIdInput.value.trim();
  const client_id = clientIdInput.value.trim();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const category_id = categoryIdInput.value.trim();
  const budget = budgetInput.value.trim();

  if (!project_id || !client_id || !title || !description || !category_id || !budget) {
    alert("⚠️ All fields are required.");
    return;
  }

  const payload = {
    project_id,
    client_id,
    title,
    description,
    category_id,
    budget
  };

  let url = postURL;
  let method = "POST";

  if (mode === "update") {
    const id = projectForm.dataset.id;
    if (!id) {
      alert("❌ Error: Missing project_id for update.");
      return;
    }
    url = `${putURL}/${id}`;
    method = "PUT";
  }

  const submitBtn = projectForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to ${mode} project.`);
      return res.json();
    })
    .then(data => {
      if (mode === "insert") {
        projectData.push(data);
        alert("✅ Project inserted successfully!");
      } else {
        const index = projectData.findIndex(p => p.project_id == data.project_id);
        if (index !== -1) projectData[index] = data;
        alert("✅ Project updated successfully!");
      }

      renderTable();
      hideForm();
    })
    .catch(err => {
      console.error("❌ Submit Error:", err);
      alert(`❌ Error: ${err.message}`);
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});

// Insert button logic
document.querySelector("button.btn-success").addEventListener("click", () => {
  showForm("insert");
});

// Initialize
hideForm();
fetchProjects();
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});
