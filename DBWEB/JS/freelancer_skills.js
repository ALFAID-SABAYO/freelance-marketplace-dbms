const freelancerSkills_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/fskill";

fetch(freelancerSkills_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Freelancer Skills Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#freelancerSkillsTable tbody");
        data.forEach(fs => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${fs.user_id}</td>
                <td>${fs.skill_id}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => {
        console.error("Error fetching data:", err.message);
    });
