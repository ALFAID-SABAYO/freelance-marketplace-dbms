const proposals_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/prop";

fetch(proposals_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Proposals Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#proposalsTable tbody");

        data.forEach(proposal => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${proposal.proposal_id}</td>
                <td>${proposal.project_id}</td>
                <td>${proposal.freelancer_id}</td>
                <td>${proposal.bid_amount}</td>
                <td>${proposal.message}</td>
                <td>${proposal.submitted_at}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
