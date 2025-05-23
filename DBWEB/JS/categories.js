const category_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/cat"; 

fetch(category_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to fetch category data");
        }
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#categoriesTable tbody");

        data.forEach(category => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${category.category_id}</td>
                <td>${category.name}</td>
                <td>${category.description}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error loading categories:", err.message);
    });
