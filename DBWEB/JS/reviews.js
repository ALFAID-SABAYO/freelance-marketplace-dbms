const reviews_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/rev";

fetch(reviews_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Reviews Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#reviewsTable tbody");

        data.forEach(review => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${review.review_id}</td>
                <td>${review.contract_id}</td>
                <td>${review.rating}</td>
                <td>${review.comment}</td>
                <td>${review.review_date}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
