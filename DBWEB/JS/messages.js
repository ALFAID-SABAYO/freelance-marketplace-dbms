const messages_URL = "Yhttps://miniature-computing-machine-v6rgxgqx6wg2xj96-5249.app.github.dev/mess";

fetch(messages_URL)
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch Messages Data");
        return response.json();
    })
    .then(data => {
        const tbody = document.querySelector("#messagesTable tbody");

        data.forEach(message => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${message.message_id}</td>
                <td>${message.sender_id}</td>
                <td>${message.receiver_id}</td>
                <td>${message.content}</td>
                <td>${message.sent_at}</td>
            `;
            tbody.appendChild(row);
        });
    })
    .catch(err => console.log(err.message));
