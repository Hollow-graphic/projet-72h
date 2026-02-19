document.getElementById("sendBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;

    fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("labelContainer");
        const input = document.getElementById("nameInput");
        container.innerHTML = '';
        if (input.value !== "") {
            const value = input.value.toLowerCase();
            data.items = data.items.filter(item =>
                item.name.toLowerCase().includes(value) || // ignore la casse sur le name
                item.id.toString() === input.value
            );
        }
        
        data.items.forEach(item => {
            const label = document.createElement("div");
            label.textContent = item.name;
            label.className = "block";
            container.appendChild(label);
            const image = document.createElement("img");
            image.src = `/image/${item.id}.png`;
            image.className = "book-image";
            label.appendChild(image);
            const statusButton = document.createElement("button");
            statusButton.textContent = item.status ? "Disponible" : "Emprunté";
            statusButton.className = item.status ? "available" : "unavailable";
            statusButton.classList.add("status-button");
            statusButton.classList.add(item.status ? "available" : "unavailable");
            //if (!item.status) {statusButton.disabled = true;}
            statusButton.addEventListener("click", () => {
                fetch('/api/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id, status: !item.status })
                })
                .then(response => response.json())
                .then(() => {
                    item.status = !item.status;
                    statusButton.className = item.status ? "available" : "unavailable";
                    statusButton.classList.add("status-button");
                    statusButton.classList.add(item.status ? "available" : "unavailable");
                    statusButton.textContent = item.status ? "Disponible" : "Emprunté";
                    //statusButton.disabled = true;
                })
            });
            label.appendChild(statusButton);
        });
    })
    .catch(error => console.error('Erreur:', error));
});

document.getElementById("adminBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;

    fetch('/api/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
    })
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById("labelContainer");
        const input = document.getElementById("nameInput");
        container.innerHTML = '';
        let search = false;
        if (input.value !== "") {
            const value = input.value.toLowerCase();
            data.items = data.items.filter(item =>
                item.name.toLowerCase().includes(value) || // ignore la casse sur le name
                item.id.toString() === input.value
            );
            search = true;
        }
        data.items.forEach(item => {
            if (item.status === true && !search) { return; }
            const label = document.createElement("div");
            label.textContent = item.name;
            label.className = "block";
            container.appendChild(label);
            const account = document.createElement("div");
            account.textContent = "pris par " + (item.account || "inconnu");
            account.className = "account";
            label.appendChild(account);
            const image = document.createElement("img");
            image.src = `/image/${item.id}.png`;
            image.className = "book-image";
            label.appendChild(image);
            /*
            const Title = document.createElement("div");
            Title.textContent = item.name;
            Title.className = "book-title";
            label.appendChild(Title);
            */
            const statusButton = document.createElement("button");
            statusButton.textContent = item.status ? "Rendu" : "Rendre";
            statusButton.className = item.status ? "returned" : "waiting-return";
            statusButton.classList.add("status-button");
            statusButton.classList.add(item.status ? "returned" : "waiting-return");
            statusButton.addEventListener("click", () => {
                fetch('/api/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: item.id, 
                        status: !item.status, 
                        account: item.account,
                        date: item.date
                    })
                })
                .then(response => response.json())
                .then(() => {
                    item.status = !item.status;
                    statusButton.className = item.status ? "returned" : "waiting-return";
                    statusButton.classList.add("status-button");
                    statusButton.classList.add(item.status ? "returned" : "waiting-return");
                    statusButton.textContent = item.status ? "Rendu" : "Rendre";
                })
            });
            label.appendChild(statusButton);
        });
    })
    .catch(error => console.error('Erreur:', error));
});