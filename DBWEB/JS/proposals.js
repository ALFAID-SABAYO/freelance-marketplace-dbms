// URLs
const getProposalURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/prop"; // GET proposals
const postProposalURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/proposals"; // POST new proposal
const userURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user"; // GET users

// DOM Elements
const tableBody = document.querySelector("#proposalsTable tbody");
const formSection = document.getElementById("formSection");
const proposalForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");
const tableSection = document.getElementById("tableSection");

const proposalIdInput = document.getElementById("proposal_id");
const projectIdInput = document.getElementById("project_id");
const freelancerIdInput = document.getElementById("freelancer_id");
const bidAmountInput = document.getElementById("bid_amount");
const messageInput = document.getElementById("message");
const chartSection = document.getElementById("chartSection");
const proposalChartCanvas = document.getElementById("proposalChart");

let proposalData = [];
let freelancerUserIds = new Set(); // Store valid freelancer user IDs
let proposalChartInstance = null;

// Get current logged-in user (from localStorage or auth system)
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

/**
 * Fetch all users and filter freelancer IDs for validation
 */
async function fetchFreelancerUsers() {
  try {
    const res = await fetch(userURL);
    if (!res.ok) throw new Error(`Failed to fetch users. Status: ${res.status}`);
    const users = await res.json();

    freelancerUserIds.clear();
    users.forEach(user => {
      if (user.user_type === "freelancer") {
        freelancerUserIds.add(Number(user.user_id));
      }
    });

    console.log("Valid freelancer IDs:", Array.from(freelancerUserIds));
  } catch (error) {
    console.error("Error fetching users:", error);
    alert("❌ Unable to load user data for freelancer validation.");
  }
}

/**
 * Fetch all proposals from API and render table
 */
async function fetchProposals() {
  try {
    const res = await fetch(getProposalURL);
    if (!res.ok) throw new Error(`Failed to fetch proposals. Status: ${res.status}`);
    proposalData = await res.json();
    renderTable();
  } catch (error) {
    console.error("Error fetching proposals:", error);
    alert("❌ Failed to load proposals.");
  }
}

/**
 * Render proposals into the table
 */
function renderTable() {
  tableBody.innerHTML = "";

  proposalData.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td >${p.proposal_id}</td>
      <td>${p.project_id}</td>
      <td>${p.freelancer_id}</td>
      <td>${p.bid_amount}</td>
      <td>${p.message}</td>
      <td>${p.submitted_at ? new Date(p.submitted_at).toLocaleString() : "N/A"}</td>
    `;
    tableBody.appendChild(row);
  });
}

/**
 * Show insert form only (no update mode)
 */
function showForm() {
  formSection.classList.remove("d-none");
  formTitle.innerText = "Submit Proposal";
  proposalForm.dataset.mode = "insert";
  chartSection.classList.add("d-none");
  tableSection.classList.remove("d-none");
  proposalForm.reset();
 

  proposalIdInput.disabled = true;

  // Check if current user is a freelancer
  if (currentUser && currentUser.user_type === "freelancer") {
    freelancerIdInput.value = currentUser.user_id;
    freelancerIdInput.disabled = true;
  } else {
    freelancerIdInput.value = "";
    freelancerIdInput.disabled = false;

    // Only alert once per show
    if (!freelancerIdInput.classList.contains("alerted")) {
      alert("⚠️ You must be logged in as a freelancer to submit a proposal.");
      freelancerIdInput.classList.add("alerted");
    }
  }
}
function showChart() {
  formSection.classList.add("d-none");
  chartSection.classList.remove("d-none");
  tableSection.classList.add("d-none");


  const ctx = document.getElementById('proposalChart').getContext('2d');

  // If a chart already exists, destroy it first
  if (proposalChartInstance) {
    proposalChartInstance.destroy();
  }

  // Sample logic: Count number of proposals per project
  const rows = document.querySelectorAll("#proposalsTable tbody tr");
  const proposalCount = {};

  rows.forEach(row => {
    const projectId = row.children[1].textContent;
    proposalCount[projectId] = (proposalCount[projectId] || 0) + 1;
  });

  const labels = Object.keys(proposalCount);
  const data = Object.values(proposalCount);

  proposalChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of Proposals per Project',
        data: data,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}
function hideChart() {                  
  chartSection.classList.add("d-none");
  tableSection.classList.remove("d-none");
}

/**
 * Hide form and reset inputs
 */
function hideForm() {
  proposalForm.reset();
  // proposalIdInput.disabled = false;
  freelancerIdInput.disabled = false;
  freelancerIdInput.classList.remove("alerted");
  formSection.classList.add("d-none");
  delete proposalForm.dataset.mode;
}

/**
 * Handle form submission (only insert mode)
 */
proposalForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const project_id = projectIdInput.value.trim();
  const freelancer_id = freelancerIdInput.value.trim();
  const bid_amount = bidAmountInput.value.trim();
  const message = messageInput.value.trim();
  const submitted_at = new Date().toISOString();

  if (!project_id || !freelancer_id || !bid_amount || !message) {
    alert("⚠️ Please fill all required fields.");
    return;
  }

  const freelancerIdNum = Number(freelancer_id);
  if (!freelancerUserIds.has(freelancerIdNum)) {
    alert("⚠️ Freelancer ID is not valid or does not belong to a freelancer user.");
    return;
  }

  if (isNaN(bid_amount) || Number(bid_amount) <= 0) {
    alert("⚠️ Bid amount must be a positive number.");
    return;
  }

  const payload = {
    project_id: Number(project_id),
    freelancer_id: freelancerIdNum,
    bid_amount: Number(bid_amount),
    message,
    submitted_at
  };

  const submitBtn = proposalForm.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  try {
    const res = await fetch(postProposalURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`Server responded with status ${res.status}`);

    const data = await res.json();
    proposalData.push(data);
    alert("✅ Proposal submitted successfully!");
    renderTable();
    hideForm();
  } catch (error) {
    console.error("Error submitting proposal:", error);
    alert("❌ Error submitting proposal. Please try again.");
  } finally {
    submitBtn.disabled = false;
  }
});

// Cancel button
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

// Safe event listener attachment using DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const insertBtn = document.querySelector("button.btn-success");
  if (insertBtn) {
    insertBtn.addEventListener("click", showForm);
  }

  // Initialize
  hideForm();
  fetchFreelancerUsers().then(fetchProposals).catch(error => {
    console.error("Initialization error:", error);
    alert("❌ Initialization failed.");
  });
});
