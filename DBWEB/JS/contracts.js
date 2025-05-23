const contracts_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/con";

fetch(contracts_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Contracts Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#contractsTable tbody");

        data.forEach(contract => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${contract.contract_id}</td>
                <td>${contract.project_id}</td>
                <td>${contract.freelancer_id}</td>
                <td>${contract.start_date}</td>
                <td>${contract.end_date}</td>
                <td>${contract.status}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
