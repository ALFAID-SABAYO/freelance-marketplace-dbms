const payments_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/pay"; // GET all payments
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/payments"; // POST new payment

let paymentsData = [];

const tbody = document.querySelector("#paymentsTable tbody");
const formSection = document.getElementById("formSection");
const paymentForm = document.getElementById("userForm");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const insertBtn = document.querySelector("button.btn-success"); // Insert button

// Render payments in table
function renderPayments() {
  tbody.innerHTML = "";
  paymentsData.forEach((payment) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${payment.payment_id}</td>
      <td>${payment.contract_id}</td>
      <td>${payment.amount}</td>
      <td>${payment.paid_on}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch payments on page load
function fetchPayments() {
  fetch(payments_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch payments");
      return res.json();
    })
    .then(data => {
      paymentsData = data;
      renderPayments();
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Could not load payments.");
    });
}
fetchPayments();

// Show the insert form and focus on first input
function showForm(mode) {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert Payment";
  paymentForm.dataset.mode = "insert";
  paymentForm.reset();
  // Focus contract_id input for better UX
  document.getElementById("contract_id").focus();
}

// Hide form and return focus to Insert button
function hideForm() {
  paymentForm.reset();
  formSection.classList.add("d-none");
  insertBtn.focus();
}

// Cancel button handler
cancelFormBtn?.addEventListener("click", () => {
  hideForm();
});

// Handle form submission
paymentForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const contract_id = parseInt(document.getElementById("contract_id").value.trim());
  const amount = parseFloat(document.getElementById("amount").value.trim());
  const paid_on = new Date().toISOString().split("T")[0]; // today's date

  if (!contract_id || isNaN(amount)) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newPayment = { contract_id, amount, paid_on };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPayment),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to submit payment.");
      return res.json();
    })
    .then(addedPayment => {
      paymentsData.push(addedPayment);
      renderPayments();
      hideForm();
      alert("✅ Payment added!");
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Failed to submit payment.");
    });
});
