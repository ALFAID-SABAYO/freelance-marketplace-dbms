// URL Constants
const getURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/pro";
const postURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/projects";
const userURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";  // user API

// DOM Elements
const tableBody = document.querySelector("#projectsTable tbody");
const formSection = document.getElementById("formSection");
const projectForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");

const clientIdInput = document.getElementById("client_id");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categoryIdInput = document.getElementById("category_id");
const budgetInput = document.getElementById("budget");

let projectData = [];
let clientUserIds = new Set(); // Store valid client user IDs

// Fetch users and filter clients based on user_type === "client"
function fetchClientUsers() {
  return fetch(userURL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch users.");
      return res.json();
    })
    .then(users => {
      clientUserIds.clear();

      users.forEach(user => {
        if (user.user_type === "client") {
          clientUserIds.add(Number(user.user_id)); // Ensure numeric value
        }
      });

      console.log("Valid client IDs:", Array.from(clientUserIds)); // Debug
    });
}

// Fetch all projects on page load
function fetchProjects() {
  return fetch(getURL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch projects.");
      return res.json();
    })
    .then(data => {
      projectData = data;
      renderTable();
    });
}

// Render project data into the table
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
    `;
    tableBody.appendChild(row);
  });
}

// Show insert form
function showForm() {
  formSection.classList.remove("d-none");
  formTitle.innerText = "Insert Project";
  projectForm.dataset.mode = "insert";
  projectForm.reset();
}

// Hide and reset the form
function hideForm() {
  projectForm.reset();
  formSection.classList.add("d-none");
  delete projectForm.dataset.id;
}

// Handle form submission with strict client_id validation
projectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const client_id = clientIdInput.value.trim();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const category_id = categoryIdInput.value.trim();
  const budget = budgetInput.value.trim();

  if (!client_id || !title || !description || !category_id || !budget) {
    alert("⚠️ All fields are required.");
    return;
  }

  const clientIdNum = parseInt(client_id);

  // ✅ Validate against known client user IDs
  if (!clientUserIds.has(clientIdNum)) {
    alert("⚠️ Client ID does not belong to a valid client user. Please enter a valid client ID.");
    return;
  }

  const payload = {
    client_id: clientIdNum,
    title,
    description,
    category_id: parseInt(category_id),
    budget: parseFloat(budget)
  };

  const submitBtn = projectForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  fetch(postURL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert project.");
      return res.json();
    })
    .then(data => {
      projectData.push(data);
      alert("✅ Project inserted successfully!");
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
  showForm();
});

// Cancel button logic
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

// Initialization: first fetch client users, then fetch projects
hideForm();
fetchClientUsers()
  .then(fetchProjects)
  .catch(err => {
    console.error("❌ Initialization Error:", err);
    alert(`❌ Error: ${err.message}`);
  });
