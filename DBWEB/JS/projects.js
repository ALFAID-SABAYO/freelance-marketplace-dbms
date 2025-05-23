const projects_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/pro";

fetch(projects_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Projects Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#projectsTable tbody");

        data.forEach(project => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${project.project_id}</td>
                <td>${project.client_id}</td>
                <td>${project.title}</td>
                <td>${project.description}</td>
                <td>${project.category_id}</td>
                <td>${project.budget}</td>
                <td>${project.posted_at}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
