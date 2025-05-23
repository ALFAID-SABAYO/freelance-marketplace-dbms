const payments_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/pay";

fetch(payments_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Payments Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#paymentsTable tbody");

        data.forEach(payment => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${payment.payment_id}</td>
                <td>${payment.contract_id}</td>
                <td>${payment.amount}</td>
                <td>${payment.paid_on}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
