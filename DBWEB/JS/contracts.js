const contracts_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/con";

fetch(contracts_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Contracts Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#contractsTable tbody");

        data.forEach(contracts => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${contracts.contract_id}</td>
                <td>${contracts.project_id}</td>
                <td>${contracts.freelancer_id}</td>
                <td>${contracts.start_date}</td>
                <td>${contracts.end_date}</td>
                <td>${contracts.status}</td>
            `;
            tbody.appendChild(row);
        });
   }).catch(err=>{
    console.log(err.message);
})
