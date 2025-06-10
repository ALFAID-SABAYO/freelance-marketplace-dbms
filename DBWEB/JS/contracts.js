const contracts_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/con";
const posts_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/contracts";
const user_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";

// DOM Elements
const tableBody = document.querySelector("#contractsTable tbody");
const formSection = document.getElementById("formSection");
const contractForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");
const tableSection = document.getElementById("tableSection");

const projectIdInput = document.getElementById("project_id");
const freelancerIdInput = document.getElementById("freelancer_id");
const startDateInput = document.getElementById("start_date");
const endDateInput = document.getElementById("end_date");
const statusSelect = document.getElementById("status");
const chartSection = document.getElementById("chartSection");
const contractChartCanvas = document.getElementById("contractChart");

let contractData = [];
let freelancerUserIds = new Set();
let contractChartInstance = null;

async function fetchFreelancerUsers() {
  try {
    const res = await fetch(user_URL);
    if (!res.ok) throw new Error(`Failed to fetch users. Status: ${res.status}`);
    const users = await res.json();

    freelancerUserIds.clear();
    users.forEach(user => {
      if (user.user_type === "freelancer") {
        freelancerUserIds.add(Number(user.user_id));
      }
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("❌ Unable to load user data for freelancer validation.");
  }
}

async function fetchContracts() {
  try {
    const res = await fetch(contracts_URL);
    if (!res.ok) throw new Error(`Failed to fetch contracts. Status: ${res.status}`);
    contractData = await res.json();
    renderTable();
  } catch (error) {
    console.error("Error fetching contracts:", error);
    alert("❌ Failed to load contracts.");
  }
}

function renderTable() {
  tableBody.innerHTML = "";

  if (contractData.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No contracts available.</td></tr>`;
    return;
  }

  contractData.forEach(contract => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${contract.contract_id}</td>
      <td>${contract.project_id}</td>
      <td>${contract.freelancer_id}</td>
      <td>${contract.start_date}</td>
      <td>${contract.end_date || "N/A"}</td>
      <td>${contract.status}</td>
    `;
    tableBody.appendChild(row);
  });
}

function showForm() {
  formSection.classList.remove("d-none");
  formTitle.innerText = "Insert Contract";
  contractForm.dataset.mode = "insert";
  chartSection.classList.add("d-none");
  tableSection.classList.add("d-none");
  contractForm.reset();

  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;
  if (currentUser && currentUser.user_type === "freelancer") {
    freelancerIdInput.value = currentUser.user_id;
    freelancerIdInput.disabled = true;
  } else {
    freelancerIdInput.value = "";
    freelancerIdInput.disabled = false;
  }

  statusSelect.disabled = false;
  statusSelect.value = "";
}

function showChart() {
  const statusCount = {};
  contractData.forEach(c => {
    statusCount[c.status] = (statusCount[c.status] || 0) + 1;
  });

  const ctx = contractChartCanvas.getContext("2d");
  if (contractChartInstance) contractChartInstance.destroy();

  contractChartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(statusCount),
      datasets: [{
        data: Object.values(statusCount),
        backgroundColor: ["#00b4d8", "red", " #2CFF05", "black"]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: "Contracts by Status" }
      }
    }
  });

  chartSection.classList.remove("d-none");
  tableSection.classList.add("d-none");
}

function hideChart() {
  chartSection.classList.add("d-none");
  tableSection.classList.remove("d-none");
}

function hideForm() {
  contractForm.reset();
  freelancerIdInput.disabled = false;
  statusSelect.disabled = false;
  formSection.classList.add("d-none");
  delete contractForm.dataset.mode;
  tableSection.classList.remove("d-none");
}

contractForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const project_id = projectIdInput.value.trim();
  const freelancer_id = freelancerIdInput.value.trim();
  const start_date = startDateInput.value.trim();
  const end_date = endDateInput.value.trim();
  const status = statusSelect.value.trim();

  if (!project_id || !freelancer_id || !start_date || !status) {
    alert("⚠️ Please fill all required fields.");
    return;
  }

  const freelancerIdNum = Number(freelancer_id);
  if (!freelancerUserIds.has(freelancerIdNum)) {
    alert("⚠️ Freelancer ID is not valid or does not belong to a freelancer user.");
    return;
  }

  const payload = {
    project_id: Number(project_id),
    freelancer_id: freelancerIdNum,
    start_date,
    status
  };

  if (end_date) payload.end_date = end_date;

  const submitBtn = contractForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  try {
    const res = await fetch(posts_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

    const data = await res.json();
    contractData.push(data);
    alert("✅ Contract submitted successfully!");
    renderTable();
    hideForm();
  } catch (error) {
    console.error("Error submitting contract:", error);
    alert("❌ Error submitting contract. Please try again.");
  } finally {
    submitBtn.disabled = false;
  }
});

document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

document.querySelector("button.btn-success").addEventListener("click", () => {
  showForm();
});

endDateInput.addEventListener("change", () => {
  if (endDateInput.value) {
    statusSelect.value = "completed";
    statusSelect.disabled = true;
  } else {
    statusSelect.disabled = false;
    statusSelect.value = "";
  }
});

hideForm();
fetchFreelancerUsers().then(fetchContracts).catch(error => {
  console.error("Initialization error:", error);
  alert("❌ Initialization failed.");
});
