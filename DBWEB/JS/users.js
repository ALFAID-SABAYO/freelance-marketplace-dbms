const users_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user"; // GET
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/users"; // POST
const put_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/users"; // PUT base URL (no :id)

let usersData = [];

const tbody = document.querySelector("#usersTable tbody");

// Render table rows
function renderTable() {
  tbody.innerHTML = "";
  usersData.forEach((user, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.user_id}</td>
      <td>${user.username}</td>
      <td>${user.email}</td>
      <td>
        <span id="pwd-${index}">********</span>
        <button class="btn btn-sm btn-outline-secondary toggle-btn"
                data-index="${index}" data-password="${user.password}" title="Show Password">👁️</button>
      </td>
      <td>${user.full_name}</td>
      <td>${user.user_type}</td>
      <td>${user.created_at}</td>
      <td>
        <button class="btn btn-sm btn-warning upgrade-btn" data-id="${user.user_id}">✏️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Toggle password visibility
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.dataset.index;
      const span = document.getElementById(`pwd-${index}`);
      const actualPassword = this.dataset.password;

      if (span.innerText === "********") {
        span.innerText = actualPassword;
        this.innerText = "🙈";
        this.title = "Hide Password";
      } else {
        span.innerText = "********";
        this.innerText = "👁️";
        this.title = "Show Password";
      }
    });
  });

  // Upgrade button logic
  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const user = usersData.find(u => u.user_id == id);
      if (!user) return;

      showForm("upgrade");

      // Fill form with existing data
      document.getElementById("user_id").value = user.user_id;
      document.getElementById("username").value = user.username;
      document.getElementById("email").value = user.email;
      document.getElementById("password").value = user.password;
      document.getElementById("full_name").value = user.full_name;
      document.getElementById("user_type").value = user.user_type;
    });
  });
}

// Initial fetch
fetch(users_URL)
  .then(res => {
    if (!res.ok) throw new Error("Failed to fetch Users Data");
    return res.json();
  })
  .then(data => {
    usersData = data;
    renderTable();
  })
  .catch(err => console.error(err.message));

// Show Insert/Upgrade form
function showForm(mode) {
  document.getElementById("formTitle").innerText = mode === "insert" ? "Insert User" : "Upgrade User";
  document.getElementById("userForm").dataset.mode = mode;
  document.getElementById("formSection").style.display = "block";
}

// Form submit handler
document.getElementById("userForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const mode = this.dataset.mode;
  const id = document.getElementById("user_id").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const full_name = document.getElementById("full_name").value.trim();
  const user_type = document.getElementById("user_type").value.trim();
  const created_at = new Date().toISOString().split("T")[0];

  const updatedUser = { user_id: id, username, email, password, full_name, user_type, created_at };

  if (mode === "insert") {
    const exists = usersData.some(u => u.user_id == id);
    if (exists) {
      alert("⚠️ User ID already exists! Please use a different one.");
      return;
    }
//-------------------------------------------------------   POST /user--------------------------------------//
    fetch(post_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to insert user.");
        return res.json();
      })
      .then(addedUser => {
        usersData.push(addedUser);
        renderTable();
        alert("✅ New user inserted!");
        document.getElementById("userForm").reset();
        document.getElementById("formSection").style.display = "none";
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to insert user.");
      });
  }
//-------------------------------------------------------   PUT /user/:id--------------------------------------//
  if (mode === "upgrade") {
    fetch(`${put_URL}/${id}`, {  // Correct URL without ':id'
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update user.");
        return res.json();
      })
      .then(() => {
        const index = usersData.findIndex(u => u.user_id == id);
        if (index !== -1) usersData[index] = updatedUser;

        renderTable();
        alert("✅ User upgraded successfully!");
        document.getElementById("userForm").reset();
        document.getElementById("formSection").style.display = "none";
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to upgrade user.");
      });
  }
});
// Cancel button to hide form
document.getElementById("cancelBtn").addEventListener("click", () => {
  document.getElementById("userForm").reset();
  document.getElementById("formSection").style.display = "none";
});