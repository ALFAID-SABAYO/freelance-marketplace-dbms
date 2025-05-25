const Skills_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/ski"; // Adjust URL if needed
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/skills";
const put_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/skills";

let skillsData = [];

const tbody = document.querySelector("#skillsTable tbody");
const formSection = document.getElementById("formSection");
const skillForm = document.getElementById("skillForm");

// Render skills in the table
function renderTable() {
  tbody.innerHTML = "";
  skillsData.forEach((skill) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${skill.skill_id}</td>
      <td>${skill.name}</td>
      <td>
        <button class="btn btn-sm btn-warning upgrade-btn" data-id="${skill.skill_id}">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Add click events to Upgrade buttons
  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const skill = skillsData.find(s => s.skill_id == id);
      if (!skill) return;

      showForm("upgrade");
      document.getElementById("skill_id").value = skill.skill_id;
      document.getElementById("name").value = skill.name;
    });
  });
}

// Fetch all skills on page load
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
    .catch(err => console.error(err.message));
}

fetchSkills();

// Show form for insert or upgrade
function showForm(mode) {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = mode === "insert" ? "Insert Skill" : "Upgrade Skill";
  skillForm.dataset.mode = mode;

  if (mode === "insert") {
    skillForm.reset();
    document.getElementById("skill_id").disabled = false;
  } else {
    document.getElementById("skill_id").disabled = true;
  }
}

// Hide form and reset
function hideForm() {
  skillForm.reset();
  formSection.classList.add("d-none");
}

// Handle form submit
skillForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const mode = this.dataset.mode;
  const id = document.getElementById("skill_id").value.trim();
  const name = document.getElementById("name").value.trim();

  if (!id || !name) {
    alert("⚠️ All fields are required.");
    return;
  }

  const requestBody = mode === "insert"
    ? { skill_id: id, name }
    : { name };

  const url = mode === "insert" ? post_URL : `${put_URL}/${id}`;
  const method = mode === "insert" ? "POST" : "PUT";

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
    .then(res => {
      if (!res.ok) throw new Error(`Failed to ${mode} skill.`);
      return res.json();
    })
    .then(response => {
      if (mode === "insert") {
        skillsData.push(response);
        alert("✅ Skill inserted!");
      } else {
        const index = skillsData.findIndex(s => s.skill_id == id);
        if (index !== -1) skillsData[index] = response;
        alert("✅ Skill upgraded!");
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
document.querySelector("button.btn-success").addEventListener("click", () => {
  showForm("insert");
});

// Initially hide form
hideForm();
document.getElementById("cancelFormBtn").addEventListener("click", function () {
  document.getElementById("formSection").classList.add("d-none");
});