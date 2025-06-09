// URL Constants
const Skills_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/ski";
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/skills";

// Global Variables
let skillsData = [];
let chartInstance = null;

// DOM Elements
const tbody = document.querySelector("#skillsTable tbody");
const formSection = document.getElementById("formSection");
const skillForm = document.getElementById("skillForm");
const nameInput = document.getElementById("name");
const formTitle = document.getElementById("formTitle");
const tableSection = document.getElementById("tableSection");
const chartSection = document.getElementById("chartSection");

// 🎨 Render Table
function renderTable() {
  tbody.innerHTML = "";
  skillsData.forEach(skill => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${skill.skill_id}</td>
      <td>${skill.name}</td>
    `;
    tbody.appendChild(tr);
  });
}

// 📡 Fetch Skills
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

// ➕ Show Insert Form
function showForm(mode = "insert") {
  formSection.classList.remove("d-none");
  formTitle.innerText = "Insert Skill";
  skillForm.reset();
  
}

// ❌ Hide Form
function hideForm() {
  skillForm.reset();
  formSection.classList.add("d-none");
  
}

// 💾 Handle Form Submit
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

// ❌ Cancel Button
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

// 📊 Show Chart
function showChart() {
  formSection.classList.add("d-none");
  chartSection.classList.remove("d-none");
  tableSection.classList.add("d-none");

  const skillCounts = {};

  skillsData.forEach(skill => {
    const skillName = skill.name;
    skillCounts[skillName] = (skillCounts[skillName] || 0) + 1;
  });

  const labels = Object.keys(skillCounts);
  const data = Object.values(skillCounts);

  const ctx = document.getElementById("skillChart").getContext("2d");

 if (chartInstance) chartInstance.destroy(); // Destroy existing chart

chartInstance = new Chart(ctx, {
  type: "pie",
  data: {
    labels,
    datasets: [{
      label: "Skill Frequency",
      data,
      backgroundColor: [
        "lightblue", "lightgreen", "lightcoral", "lightpink", 
        "khaki", "plum", "salmon", "skyblue", "gold", "orange"
      ],
      borderColor: "white",
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});
}

// 🔙 Hide Chart
function hideChart() {
  chartSection.classList.add("d-none");
  tableSection.classList.remove("d-none");
}

// 🚀 Initialize
hideForm();
fetchSkills();
