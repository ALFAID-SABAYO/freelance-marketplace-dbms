const reviews_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/rev"; // GET all reviews
const post_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/reviews"; // POST new review

let reviewsData = [];

const tbody = document.querySelector("#reviewsTable tbody");
const formSection = document.getElementById("formSection");
const reviewForm = document.getElementById("userForm"); // Still uses userForm id
const addReviewBtn = document.getElementById("addReviewBtn");
const cancelReviewFormBtn = document.getElementById("cancelReviewFormBtn");

// Render reviews table
function renderReviews() {
  tbody.innerHTML = "";

  reviewsData.forEach((review) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${review.review_id}</td>
      <td>${review.contract_id}</td>
      <td>${review.rating}</td>
      <td>${review.comment}</td>
      <td>${review.review_date}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Fetch all reviews on page load
function fetchReviews() {
  fetch(reviews_URL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json();
    })
    .then(data => {
      reviewsData = data;
      renderReviews();
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Could not load reviews.");
    });
}
fetchReviews();

// Show form for insert only
function showReviewForm() {
  formSection.classList.remove("d-none");
  document.getElementById("formTitle").innerText = "Insert Review";
  reviewForm.dataset.mode = "insert";
  reviewForm.reset();
}

// Hide form and reset
function hideReviewForm() {
  reviewForm.reset();
  formSection.classList.add("d-none");
}

// Add Review button handler
addReviewBtn?.addEventListener("click", () => {
  showReviewForm();
});

// Cancel Review form handler
cancelReviewFormBtn?.addEventListener("click", () => {
  hideReviewForm();
});

// Form submit handler
reviewForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const contract_id = parseInt(document.getElementById("contract_id").value.trim());
  const rating = parseInt(document.getElementById("rating").value.trim());
  const comment = document.getElementById("comment").value.trim();
  const review_date = new Date().toISOString().split("T")[0];

  if (!contract_id || !rating || !comment) {
    alert("⚠️ All fields are required.");
    return;
  }

  const newReview = { contract_id, rating, comment, review_date };

  fetch(post_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newReview),
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to submit review.");
      return res.json();
    })
    .then(addedReview => {
      reviewsData.push(addedReview);
      renderReviews();
      hideReviewForm();
      alert("✅ Review submitted!");
    })
    .catch(err => {
      console.error(err.message);
      alert("❌ Failed to submit review.");
    });
});
