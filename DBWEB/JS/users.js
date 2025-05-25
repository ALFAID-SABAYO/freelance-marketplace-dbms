const users_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user"; // GET all users
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/users"; // POST new user
const put_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/users"; // PUT update user

let usersData = [];

const tbody = document.querySelector("#usersTable tbody");
const formSection = document.getElementById("formSection");
const userForm = document.getElementById("userForm");

// Render users table
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
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const span = document.getElementById(`pwd-${index}`);
      const actualPassword = btn.dataset.password;

      if (span.innerText === "********") {
        span.innerText = actualPassword;
        btn.innerText = "🙈";
        btn.title = "Hide Password";
      } else {
        span.innerText = "********";
        btn.innerText = "👁️";
        btn.title = "Show Password";
      }
    });
  });

  // Upgrade button click event
  document.querySelectorAll(".upgrade-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const user = usersData.find(u => u.user_id == id);
      if (!user) return;

      showForm("upgrade");
      // Fill form with user data
      document.getElementById("user_id").value = user.user_id;
      document.getElementById("username").value = user.username;
      document.getElementById("email").value = user.email;
      document.getElementById("password").value = user.password;
      document.getElementById("full_name").value = user.full_name;
      document.getElementById("user_type").value = user.user_type;
    });
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

// Show form for insert or upgrade
function showForm(mode) {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = mode === "insert" ? "Insert User" : "Upgrade User";
  userForm.dataset.mode = mode;

  if (mode === "insert") {
    userForm.reset();
    document.getElementById("user_id").disabled = false;
  } else {
    document.getElementById("user_id").disabled = true;
  }
}

// Hide form and reset
function hideForm() {
  userForm.reset();
  formSection.classList.add("d-none");
}

// Insert button event — assumes your HTML button calls this
document.querySelector("button.btn-success")?.addEventListener("click", () => {
  showForm("insert");
});

// Form submit handler
userForm.addEventListener("submit", e => {
  e.preventDefault();

  const mode = userForm.dataset.mode;
  const id = document.getElementById("user_id").value.trim();
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const full_name = document.getElementById("full_name").value.trim();
  const user_type = document.getElementById("user_type").value.trim();
  const created_at = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD

  if (!id || !username || !email || !password || !full_name || !user_type) {
    alert("⚠️ All fields are required.");
    return;
  }

  if (mode === "insert") {
    // Check duplicate ID
    if (usersData.some(u => u.user_id == id)) {
      alert("⚠️ User ID already exists! Please use a different one.");
      return;
    }

    const newUser = { user_id: id, username, email, password, full_name, user_type, created_at };

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
  } else if (mode === "upgrade") {
    const updatedUser = { user_id: id, username, email, password, full_name, user_type, created_at };

    fetch(`${put_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser),
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to update user.");
        return res.json();
      })
      .then(updated => {
        // Update local usersData
        const index = usersData.findIndex(u => u.user_id == id);
        if (index !== -1) usersData[index] = updated;

        renderTable();
        hideForm();
        alert("✅ User upgraded successfully!");
      })
      .catch(err => {
        console.error(err);
        alert("❌ Failed to upgrade user.");
      });
  }
});
document.querySelector("button.btn-success")?.addEventListener("click", () => {
  showForm("insert");
});
document.getElementById("cancelFormBtn").addEventListener("click", function () {
  document.getElementById("formSection").classList.add("d-none");
});
