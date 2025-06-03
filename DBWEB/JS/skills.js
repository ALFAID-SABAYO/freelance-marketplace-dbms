// URL Constants
const Skills_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/ski";
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/skills";

// Global Skills Data
let skillsData = [];

// DOM Elements
const tbody = document.querySelector("#skillsTable tbody");
const formSection = document.getElementById("formSection");
const skillForm = document.getElementById("skillForm");
const nameInput = document.getElementById("name");
const formTitle = document.getElementById("formTitle");

// Render table
function renderTable() {
  tbody.innerHTML = "";
  skillsData.forEach((skill) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${skill.skill_id}</td>
      <td>${skill.name}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all skills
function fetchSkills() {
  fetch(Skills_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch skills");
      return res.json();
    })
    .then(data => {
      skillsData = data;
      renderTable();
    })
    .catch(err => console.error("❌ Error:", err.message));
}

// Show form for insert
function showForm() {
  formSection.classList.remove("d-none");
  formTitle.innerText = "Insert Skill";
  skillForm.reset();
}

// Hide form
function hideForm() {
  skillForm.reset();
  formSection.classList.add("d-none");
}

// Handle form submission (only insert)
skillForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();

  if (!name) {
    alert("⚠️ Skill name is required.");
    return;
  }

  const newSkill = { name };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newSkill)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert skill.");
      return res.json();
    })
    .then(data => {
      skillsData.push(data);
      alert("✅ Skill inserted successfully!");
      renderTable();
      hideForm();
    })
    .catch(err => {
      console.error("❌ Submit Error:", err.message);
      alert(`❌ Error: ${err.message}`);
    });
});

// Insert button
document.querySelector("button.btn-success").addEventListener("click", () => {
  showForm();
});

// Cancel button
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

// Initialize
hideForm();
fetchSkills();
