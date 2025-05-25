const getProposalURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/prop"; // GET
const postProposalURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/proposals"; // POST
const putProposalURL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/proposals"; // PUT

// DOM Elements
const tableBody = document.querySelector("#proposalsTable tbody");
const formSection = document.getElementById("formSection");
const proposalForm = document.getElementById("userForm");
const formTitle = document.getElementById("formTitle");

const proposalIdInput = document.getElementById("proposal_id");
const projectIdInput = document.getElementById("project_id");
const freelancerIdInput = document.getElementById("freelancer_id");  
const bidAmountInput = document.getElementById("bid_amount");
const messageInput = document.getElementById("message");

let proposalData = [];

// Simulating getting current logged-in user from localStorage or any auth system
const currentUser = JSON.parse(localStorage.getItem("currentUser")) || null;

// Fetch Proposals from API
async function fetchProposals() {
  try {
    const res = await fetch(getProposalURL);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    proposalData = await res.json();
    renderTable();
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    alert("Failed to load proposals.");
  }
}

// Render Table with proposalData
function renderTable() {
  tableBody.innerHTML = "";

  proposalData.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.proposal_id}</td>
      <td>${p.project_id}</td>
      <td>${p.freelancer_id}</td>
      <td>${p.bid_amount}</td>
      <td>${p.message}</td>
      <td>${p.submitted_at ? new Date(p.submitted_at).toLocaleString() : "N/A"}</td>
      <td>
        <button class="btn btn-warning btn-sm edit-btn"
          data-id="${p.proposal_id}"
          data-project="${p.project_id}"
          data-freelancer="${p.freelancer_id}"
          data-bid="${p.bid_amount}"
          data-message="${p.message}">✏️</button>
      </td>
    `;
    tableBody.appendChild(row);
  });

  // Attach event listeners for edit buttons
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      showForm("update", {
        proposal_id: btn.dataset.id,
        project_id: btn.dataset.project,
        freelancer_id: btn.dataset.freelancer,
        bid_amount: btn.dataset.bid,
        message: btn.dataset.message
      });
    });
  });
}

// Show Form for insert or update
function showForm(mode, data = {}) {
  formSection.classList.remove("d-none");
  formTitle.innerText = mode === "insert" ? "Insert Proposal" : "Update Proposal";
  proposalForm.dataset.mode = mode;
  proposalForm.dataset.id = data.proposal_id || "";
  proposalForm.reset();

  if (mode === "update") {
    proposalIdInput.value = data.proposal_id;
    projectIdInput.value = data.project_id;
    freelancerIdInput.value = data.freelancer_id;
    bidAmountInput.value = data.bid_amount;
    messageInput.value = data.message;
    proposalIdInput.disabled = true;
    freelancerIdInput.disabled = true; // Don't allow changing freelancer on update
  } else {
    proposalIdInput.disabled = false;

    // Auto-fill freelancer_id for insert if currentUser is freelancer
    if (currentUser && currentUser.user_type === "freelancer") {
      freelancerIdInput.value = currentUser.user_id;
      freelancerIdInput.disabled = true; // Prevent user changing this
    } else {
      freelancerIdInput.value = "";
      freelancerIdInput.disabled = false;
      alert("⚠️ You must be logged in as a freelancer to submit proposals.");
    }
  }
}

// Hide Form and reset state
function hideForm() {
  proposalForm.reset();
  proposalIdInput.disabled = false;
  freelancerIdInput.disabled = false;
  formSection.classList.add("d-none");
  delete proposalForm.dataset.id;
}

// Handle form submit (insert or update)
proposalForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const mode = proposalForm.dataset.mode;
  const proposal_id = proposalIdInput.value.trim();
  const project_id = projectIdInput.value.trim();
  const freelancer_id = freelancerIdInput.value.trim();
  const bid_amount = bidAmountInput.value.trim();
  const message = messageInput.value.trim();
  const submitted_at = new Date().toISOString();

  if (!proposal_id || !project_id || !freelancer_id || !bid_amount || !message) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  // Validate bid_amount is a positive number
  if (isNaN(bid_amount) || Number(bid_amount) < 0) {
    alert("⚠️ Bid amount must be a valid positive number.");
    return;
  }

  const payload = {
    proposal_id,
    project_id,
    freelancer_id,
    bid_amount: Number(bid_amount),
    message,
    submitted_at
  };

  let url = postProposalURL;
  let method = "POST";

  if (mode === "update") {
    const id = proposalForm.dataset.id;
    url = `${putProposalURL}/${id}`;
    method = "PUT";
  }

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const data = await res.json();

    if (mode === "insert") {
      proposalData.push(data);
      alert("✅ Proposal inserted.");
    } else {
      const index = proposalData.findIndex(p => p.proposal_id == data.proposal_id);
      if (index !== -1) proposalData[index] = data;
      alert("✅ Proposal updated.");
    }

    renderTable();
    hideForm();
  } catch (err) {
    console.error("❌ Submit Error:", err);
    alert("❌ Error submitting form.");
  }
});

// Cancel button event
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

// Initial load
hideForm();
fetchProposals();
