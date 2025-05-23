const skills_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/ski";

fetch(skills_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Skills Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#skillsTable tbody");

        data.forEach(skill => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${skill.skill_id}</td>
                <td>${skill.name}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
