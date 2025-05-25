// URL Constants
const getURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/fskill";
const postURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/freelancer_skills";
const putURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/freelancer_skills";

// DOM Elements
const tableBody = document.querySelector("#freelancerSkillsTable tbody");
const formSection = document.getElementById("formSection");
const freelancerSkillForm = document.getElementById("freelancerSkillForm");
const formTitle = document.getElementById("formTitle");
const userInput = document.getElementById("user_id");
const skillInput = document.getElementById("skill_id");

let freelancerSkillsData = [];

// Fetch freelancer skills on page load
function fetchFreelancerSkills() {
  fetch(getURL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch freelancer skills.");
      return res.json();
    })
    .then(data => {
      freelancerSkillsData = data;
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

  freelancerSkillsData.forEach(skill => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${skill.freelancer_skill_id}</td>
      <td>${skill.user_id}</td>
      <td>${skill.skill_id}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn"
          data-id="${skill.freelancer_skill_id}"
          data-user="${skill.user_id}"
          data-skill="${skill.skill_id}">
          ✏️
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Attach edit button handlers
  document.querySelectorAll(".edit-btn").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.id;
      const user = button.dataset.user;
      const skill = button.dataset.skill;

      showForm("update", { id, user, skill });
    });
  });
}

// Show the insert/update form
function showForm(mode, data = {}) {
  formSection.classList.remove("d-none");
  formTitle.innerText = mode === "insert" ? "Insert Freelancer Skill" : "Update Freelancer Skill";
  freelancerSkillForm.dataset.mode = mode;
  freelancerSkillForm.dataset.id = data.id || "";
  
  freelancerSkillForm.reset();

  if (mode === "update") {
    userInput.value = data.user;
    skillInput.value = data.skill;
    userInput.disabled = true;
  } else {
    userInput.disabled = false;
  }
}

// Hide and reset the form
function hideForm() {
  freelancerSkillForm.reset();
  userInput.disabled = false;
  formSection.classList.add("d-none");
  delete freelancerSkillForm.dataset.id;
}

// Handle form submission
freelancerSkillForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mode = freelancerSkillForm.dataset.mode;
  const user_id = userInput.value.trim();
  const skill_id = skillInput.value.trim();

  if (!user_id || !skill_id) {
    alert("⚠️ All fields are required.");
    return;
  }

  const payload = {
    user_id: parseInt(user_id),
    skill_id: parseInt(skill_id)
  };

  let url = postURL;
  let method = "POST";

  if (mode === "update") {
    const id = freelancerSkillForm.dataset.id;
    if (!id) {
      alert("❌ Error: Missing freelancer_skill_id for update.");
      return;
    }
    url = `${putURL}/${id}`;
    method = "PUT";
  }

  const submitBtn = freelancerSkillForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to ${mode} freelancer skill.`);
      return res.json();
    })
    .then(data => {
      if (mode === "insert") {
        freelancerSkillsData.push(data);
        alert("✅ Skill inserted successfully!");
      } else {
        const index = freelancerSkillsData.findIndex(item => item.freelancer_skill_id == data.freelancer_skill_id);
        if (index !== -1) freelancerSkillsData[index] = data;
        alert("✅ Skill updated successfully!");
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
fetchFreelancerSkills();
