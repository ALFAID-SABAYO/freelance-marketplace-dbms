const users_URL = "https://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/user";

fetch(users_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Users Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#usersTable tbody");

        data.forEach(users => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${users.user_id}</td>
                <td>${users.username}</td>
                <td>${users.email}</td>
                <td>${users.password}</td>
                <td>${users.full_name}</td>
                <td>${users.user_type}</td>
                <td>${users.created_at}</td>
            `;
            tbody.appendChild(row);
        });
    }).catch(err=>{
    console.log(err.message);
})