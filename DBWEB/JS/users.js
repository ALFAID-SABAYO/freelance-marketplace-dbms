const users_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";

fetch(users_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Users Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#usersTable tbody");

        data.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.user_id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.password}</td>
                <td>${user.full_name}</td>
                <td>${user.user_type}</td>
                <td>${user.created_at}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
