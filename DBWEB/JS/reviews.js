const reviews_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/rev";

fetch(reviews_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Reviews Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#reviewsTable tbody");

        data.forEach(reviews => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${reviews.review_id}</td>
                <td>${reviews.contract_id}</td>
                <td>${reviews.rating}</td>
                <td>${reviews.comment}</td>
                <td>${reviews.review_date}</td>
            `;
            tbody.appendChild(row);
        });
  }).catch(err=>{
    console.log(err.message);
})
