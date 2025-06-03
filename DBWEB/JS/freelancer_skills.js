// === API URLs ===
const getURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/fskill";
const postURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/freelancer_skills";
const userURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";

// === DOM Content Loaded ===
document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
  const tableBody = document.querySelector("#freelancerSkillsTable tbody");
  const formSection = document.getElementById("formSection");
  const freelancerSkillForm = document.getElementById("freelancerSkillForm");
  const formTitle = document.getElementById("formTitle");
  const userInput = document.getElementById("user_id");
  const skillInput = document.getElementById("skill_id");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const insertBtn = document.querySelector("button.btn-success");

  let freelancerSkillsData = [];
  let freelancerUserIds = new Set();

  // === Fetch Freelancer Users ===
  function fetchFreelancerUsers() {
    return fetch(userURL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch users.");
        return res.json();
      })
      .then(users => {
        freelancerUserIds.clear();
        users.forEach(user => {
          if (user.user_type === "freelancer") {
            freelancerUserIds.add(user.user_id);
          }
        });
        console.log("Freelancer IDs:", [...freelancerUserIds]);
      });
  }

  // === Fetch Freelancer Skills ===
  function fetchFreelancerSkills() {
    return fetch(getURL)
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch freelancer skills.");
        return res.json();
      })
      .then(data => {
        freelancerSkillsData = data;
        renderTable();
      });
  }

  // === Render Table ===
  function renderTable() {
    tableBody.innerHTML = "";
    freelancerSkillsData.forEach(skill => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${skill.freelancer_skill_id}</td>
        <td>${skill.user_id}</td>
        <td>${skill.skill_id}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // === Show Form ===
  function showForm() {
    formSection.classList.remove("d-none");
    formTitle.innerText = "Insert Freelancer Skill";
    freelancerSkillForm.dataset.mode = "insert";
    freelancerSkillForm.reset();
    userInput.disabled = false;
  }

  // === Hide Form ===
  function hideForm() {
    freelancerSkillForm.reset();
    userInput.disabled = false;
    formSection.classList.add("d-none");
    delete freelancerSkillForm.dataset.id;
  }

  // === Form Submit ===
  freelancerSkillForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user_id = userInput.value.trim();
    const skill_id = skillInput.value.trim();

    if (!user_id || !skill_id) {
      alert("⚠️ All fields are required.");
      return;
    }

    const userIdNum = parseInt(user_id);

    if (!freelancerUserIds.has(userIdNum)) {
      alert("⚠️ User ID does not belong to a freelancer.");
      return;
    }

    const payload = {
      user_id: userIdNum,
      skill_id: parseInt(skill_id)
    };

    const submitBtn = freelancerSkillForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    fetch(postURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to insert freelancer skill.");
        return res.json();
      })
      .then(data => {
        freelancerSkillsData.push(data);
        alert("✅ Skill inserted successfully!");
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

  // === Insert Button Click ===
  insertBtn.addEventListener("click", () => {
    showForm();
  });

  // === Cancel Button Click ===
  cancelFormBtn.addEventListener("click", () => {
    hideForm();
  });

  // === Initialize ===
  hideForm();
  fetchFreelancerUsers()
    .then(fetchFreelancerSkills)
    .catch(err => {
      console.error("❌ Initialization Error:", err);
      alert(`❌ Error: ${err.message}`);
    });
});
