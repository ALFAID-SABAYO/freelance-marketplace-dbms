const users_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user"; // GET all users
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/users"; // POST new user

let usersData = [];

const tbody = document.querySelector("#usersTable tbody");
const formSection = document.getElementById("formSection");
const userForm = document.getElementById("userForm");

// Render users table
function renderTable() {
  tbody.innerHTML = "";

  usersData.forEach((user) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.user_id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>********</td>  <!-- Password always shown as asterisks -->
      <td>${user.full_name}</td>
      <td>${user.user_type}</td>
      <td>${user.created_at}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all users on page load
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

// Show form for insert only
function showForm() {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert User";
  userForm.dataset.mode = "insert";
  userForm.reset();
}

// Hide form and reset
function hideForm() {
  userForm.reset();
  formSection.classList.add("d-none");
}

// Insert button event — assumes your HTML button calls this
document.querySelector("button.btn-success")?.addEventListener("click", () => {
  showForm();
});

// Form submit handler
userForm.addEventListener("submit", e => {
  e.preventDefault();

  // Remove user_id since backend handles it
  // const id = document.getElementById("user_id").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const full_name = document.getElementById("full_name").value.trim();
  const user_type = document.getElementById("user_type").value.trim();
  const created_at = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

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

document.getElementById("cancelFormBtn").addEventListener("click", function () {
  formSection.classList.add("d-none");
});
