const projects_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/pro";

fetch(projects_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Projects Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#projectsTable tbody");

        data.forEach(projects => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${projects.project_id}</td>
                <td>${projects.client_id}</td>
                <td>${projects.title}</td>
                <td>${projects.description}</td>
                <td>${projects.category_id}</td>
                <td>${projects.budget}</td>
                <td>${projects.posted_at}</td>
            `;
            tbody.appendChild(row);
        });
}).catch(err=>{
    console.log(err.message);
})
