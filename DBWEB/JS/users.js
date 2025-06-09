const users_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/users";

let usersData = [];
const tbody = document.querySelector("#usersTable tbody");
const formSection = document.getElementById("formSection");
const userForm = document.getElementById("userForm");
const tableSection = document.getElementById("tableSection");
const chartSection = document.getElementById("chartSection");
let chartInstance;

// Render users table
function renderTable() {
  tbody.innerHTML = "";
  usersData.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.user_id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>********</td>
      <td>${user.full_name}</td>
      <td>${user.user_type}</td>
      <td>${user.created_at}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all users
function fetchUsers() {
  fetch(users_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    })
    .then(data => {
      usersData = data;
      renderTable();
    })
    .catch(err => console.error(err.message));
}
fetchUsers();

// Show/hide form
function showForm() {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert User";
  userForm.dataset.mode = "insert";
  userForm.reset();
}

function hideForm() {
  userForm.reset();
  formSection.classList.add("d-none");
}

// Submit form
userForm.addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const full_name = document.getElementById("full_name").value.trim();
  const user_type = document.getElementById("user_type").value.trim();
  const created_at = new Date().toISOString().split("T")[0];

  if (!username || !email || !password || !full_name || !user_type) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newUser = { username, email, password, full_name, user_type, created_at };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newUser),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to insert user.");
      return res.json();
    })
    .then(addedUser => {
      usersData.push(addedUser);
      renderTable();
      hideForm();
      alert("✅ New user inserted!");
    })
    .catch(err => {
      console.error(err);
      alert("❌ Failed to insert user.");
    });
});

// Cancel form
document.getElementById("cancelFormBtn").addEventListener("click", () => {
  hideForm();
});

// Chart functions
function showChart() {
  tableSection.classList.add("d-none");
  formSection.classList.add("d-none");
  chartSection.classList.remove("d-none");

  const userTypeCount = {};
  usersData.forEach(user => {
    const type = user.user_type;
    userTypeCount[type] = (userTypeCount[type] || 0) + 1;
  });

  const labels = Object.keys(userTypeCount);
  const data = Object.values(userTypeCount);

  const ctx = document.getElementById("userChart").getContext("2d");

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [{
        label: "User Count",
        data,
        backgroundColor:["plum", "lightpink"],
        borderRadius: 5,
       
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

function hideChart() {
  chartSection.classList.add("d-none");
  tableSection.classList.remove("d-none");
}
