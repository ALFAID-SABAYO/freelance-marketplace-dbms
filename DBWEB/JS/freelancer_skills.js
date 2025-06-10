// === API URLs ===
const getURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/fskill";
const postURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/freelancer_skills";
const userURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";

// === Chart Variable ===
let skillChartInstance = null;

// === DOM Content Loaded ===
document.addEventListener("DOMContentLoaded", () => {
  const tableSection = document.getElementById("tableSection");
  const tableBody = document.querySelector("#freelancerSkillsTable tbody");
  const formSection = document.getElementById("formSection");
  const freelancerSkillForm = document.getElementById("freelancerSkillForm");
  const formTitle = document.getElementById("formTitle");
  const userInput = document.getElementById("user_id");
  const skillInput = document.getElementById("skill_id");
  const cancelFormBtn = document.getElementById("cancelFormBtn");
  const chartSection = document.getElementById("chartSection");
  const chartCanvas = document.getElementById("skillChart");

  let freelancerSkillsData = [];
  let freelancerUserIds = new Set();

  // === Fetch Freelancer Users ===
  function fetchFreelancerUsers() {
    return fetch(userURL)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch users."))
      .then(users => {
        freelancerUserIds.clear();
        users.forEach(user => {
          if (user.user_type === "freelancer") {
            freelancerUserIds.add(user.user_id);
          }
        });
      });
  }

  // === Fetch Freelancer Skills ===
  function fetchFreelancerSkills() {
    return fetch(getURL)
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch freelancer skills."))
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
        <td class="text-center">${skill.freelancer_skill_id}</td>
        <td class="text-center">${skill.user_id}</td>
        <td class="text-center">${skill.skill_id}</td>
      `;
      tableBody.appendChild(row);
    });
  }

  // === Show Form ===
  window.showForm = function () {
    formSection.classList.remove("d-none");
    formTitle.innerText = "Insert Freelancer Skill";
    freelancerSkillForm.dataset.mode = "insert";
    tableSection.classList.add("d-none");
    chartSection.classList.add("d-none");
    freelancerSkillForm.reset();
    userInput.disabled = false;
    
  }

  // === Hide Form ===
  function hideForm() {
    freelancerSkillForm.reset();
    userInput.disabled = false;
    formSection.classList.add("d-none");
    delete freelancerSkillForm.dataset.id;
    tableSection.classList.remove("d-none");
  }

  // === Show Chart ===
  window.showChart = function () {
    chartSection.classList.remove("d-none");
    tableSection.classList.add("d-none");
    formSection.classList.add("d-none");

    const skillCounts = {};
    freelancerSkillsData.forEach(entry => {
      const skillId = entry.skill_id;
      skillCounts[skillId] = (skillCounts[skillId] || 0) + 1;
    });

    const labels = Object.keys(skillCounts);
    const data = Object.values(skillCounts);
    const ctx = chartCanvas.getContext("2d");

    if (skillChartInstance) {
      skillChartInstance.destroy();
    }

    skillChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Number of Freelancers per Skill",
          data,
          backgroundColor: "skyblue",
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { precision: 0 },
            title: { display: true, text: "Number of Freelancers" }
          },
          x: {
            title: { display: true, text: "Skill ID" }
          }
        }
      }
    });
  }

  // === Hide Chart ===
  window.hideChart = function () {
    chartSection.classList.add("d-none");
    tableSection.classList.remove("d-none");
  }

  // === Form Submit Handler ===
  freelancerSkillForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const user_id = userInput.value.trim();
    const skill_id = skillInput.value.trim();

    if (!user_id || !skill_id) {
      alert("⚠️ All fields are required.");
      return;
    }

    const userIdNum = parseInt(user_id);
    const skillIdNum = parseInt(skill_id);

    if (!freelancerUserIds.has(userIdNum)) {
      alert("⚠️ User ID does not belong to a freelancer.");
      return;
    }

    const payload = { user_id: userIdNum, skill_id: skillIdNum };
    const submitBtn = freelancerSkillForm.querySelector("button[type='submit']");
    submitBtn.disabled = true;

    fetch(postURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to insert freelancer skill."))
      .then(data => {
        freelancerSkillsData.push(data);
        alert("✅ Skill inserted successfully!");
        renderTable();
        hideForm();
      })
      .catch(err => {
        console.error("❌ Submit Error:", err);
        alert(`❌ Error: ${err}`);
      })
      .finally(() => {
        submitBtn.disabled = false;
      });
  });

  cancelFormBtn.addEventListener("click", () => {
    hideForm();
  });

  // === Init ===
  hideForm();
  fetchFreelancerUsers()
    .then(fetchFreelancerSkills)
    .catch(err => {
      console.error("❌ Initialization Error:", err);
      alert(`❌ Error: ${err}`);
    });
});
