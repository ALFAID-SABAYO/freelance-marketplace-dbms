const messages_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/mess"; // GET
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/messages"; // POST

let messagesData = [];

const tbody = document.querySelector("#messagesTable tbody");
const formSection = document.getElementById("formSection");
const messageForm = document.getElementById("userForm");
const cancelReviewFormBtn = document.getElementById("cancelReviewFormBtn");

// Render messages into the table
function renderMessages() {
  tbody.innerHTML = "";
  messagesData.forEach((msg) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${msg.message_id}</td>
      <td>${msg.sender_id}</td>
      <td>${msg.receiver_id}</td>
      <td>${msg.content}</td>
      <td>${msg.sent_at}</td>
    `;
    tbody.appendChild(row);
  });
}

// Fetch messages on page load
function fetchMessages() {
  fetch(messages_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch Messages Data");
      return res.json();
    })
    .then(data => {
      messagesData = data;
      renderMessages();
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Could not load messages.");
    });
}
fetchMessages();

// Show the insert form
function showReviewForm() {
  formSection.classList.remove("d-none");
  messageForm.reset();
}

// Hide the form
function hideReviewForm() {
  formSection.classList.add("d-none");
  messageForm.reset();
}

// Cancel/Close button logic
cancelReviewFormBtn?.addEventListener("click", () => {
  hideReviewForm();
});

// Handle form submission (POST)
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const sender_id = document.getElementById("sender_id").value.trim();
  const receiver_id = document.getElementById("receiver_id").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!sender_id || !receiver_id || !content) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newMessage = {
    sender_id,
    receiver_id,
    content
  };

  fetch(post_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newMessage)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to submit message.");
      return res.json();
    })
    .then(addedMsg => {
      messagesData.push(addedMsg);
      renderMessages();
      hideReviewForm();
      alert("✅ Message submitted!");
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Could not submit message.");
    });
});
