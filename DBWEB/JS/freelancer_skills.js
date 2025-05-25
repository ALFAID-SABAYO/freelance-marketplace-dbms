const getURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/fskill";
const postURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/freelancer_skills";
const putURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/freelancer_skills";

let freelancerSkillsData = [];

const tableBody = document.querySelector("#freelancerSkillsTable tbody");
const formSection = document.getElementById("formSection");
const freelancerSkillForm = document.getElementById("freelancerSkillForm");

// Render the freelancer skills table
function renderTable() {
  tableBody.innerHTML = "";
  freelancerSkillsData.forEach(entry => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.freelancer_skill_id}</td>
      <td>${entry.user_id}</td>
      <td>${entry.skill_id}</td>
      <td>
        <button class="btn btn-sm btn-warning edit-btn"
          data-id="${entry.freelancer_skill_id}"
          data-user="${entry.user_id}"
          data-skill="${entry.skill_id}">
          ✏️
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Attach event listeners for edit buttons
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const user_id = btn.dataset.user;
      const skill_id = btn.dataset.skill;

      showForm("upgrade");

      document.getElementById("user_id").value = user_id;
      document.getElementById("skill_id").value = skill_id;

      freelancerSkillForm.dataset.id = id;
      document.getElementById("user_id").disabled = true;
    });
  });
}

// Fetch data on load
function fetchFreelancerSkills() {
  fetch(getURL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch freelancer skills.");
      return res.json();
    })
    .then(data => {
      console.log("Fetched freelancer skills:", data);
      freelancerSkillsData = data;
      renderTable();
    })
    .catch(err => {
      console.error(err);
      alert(`❌ Failed to load data: ${err.message}`);
    });
}

// Show form for insert or update
function showForm(mode) {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = mode === "insert" ? "Insert Skill" : "Update Skill";
  freelancerSkillForm.dataset.mode = mode;
  freelancerSkillForm.reset();

  if (mode === "insert") {
    document.getElementById("user_id").disabled = false;
    delete freelancerSkillForm.dataset.id;
  }
}

// Hide form and reset it
function hideForm() {
  freelancerSkillForm.reset();
  formSection.classList.add("d-none");
  document.getElementById("user_id").disabled = false;
}

// Form submit logic
freelancerSkillForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const mode = freelancerSkillForm.dataset.mode;
  const user_id = document.getElementById("user_id").value.trim();
  const skill_id = document.getElementById("skill_id").value.trim();

  if (!user_id || !skill_id) {
    alert("⚠️ All fields are required.");
    return;
  }

  let url = postURL;
  let method = "POST";
  let body = { user_id: parseInt(user_id), skill_id: parseInt(skill_id) };

  if (mode === "upgrade") {
    const id = freelancerSkillForm.dataset.id;
    if (!id) {
      alert("❌ No ID specified for update.");
      return;
    }
    url = `${putURL}/${id}`;
    method = "PUT";
  }

  // Disable submit button temporarily
  const submitBtn = freelancerSkillForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to ${mode} freelancer skill.`);
      return res.json();
    })
    .then(response => {
      if (mode === "insert") {
        freelancerSkillsData.push(response);
        alert("✅ Freelancer Skill added!");
      } else {
        const index = freelancerSkillsData.findIndex(fs => fs.freelancer_skill_id == response.freelancer_skill_id);
        if (index !== -1) freelancerSkillsData[index] = response;
        alert("✅ Freelancer Skill updated!");
      }
      renderTable();
      hideForm();
    })
    .catch(err => {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
});

// Insert new skill button
document.querySelector("button.btn-success").addEventListener("click", () => {
  showForm("insert");
});

// Initial form state
hideForm();
fetchFreelancerSkills();
