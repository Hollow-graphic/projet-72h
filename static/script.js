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
            if (!item.status && item.account) {
                const info = document.createElement("div");
                info.className = "borrow-info";
                info.textContent = `Emprunté par ${item.account}${item.date ? ' le ' + item.date : ''}`;
                label.appendChild(info);
            }
            statusButton.addEventListener("click", () => {
                const newStatus = !item.status;
                let account = item.account || "";
                let date = item.date || "";

                if (!newStatus) {
                    const user = document.getElementById("AccountInput").value
                    account = user ? user.trim() : "";
                    date = new Date().toISOString().split('T')[0];
                } else {
                    account = "";
                    date = new Date().toISOString().split('T')[0];
                }

                fetch('/api/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id, status: newStatus, account: account, date: date })
                })
                .then(response => response.json())
                .then(() => {
                    item.status = newStatus;
                    item.account = account;
                    item.date = date;
                    statusButton.className = newStatus ? "available" : "unavailable";
                    statusButton.classList.add("status-button");
                    statusButton.classList.add(newStatus ? "available" : "unavailable");
                    statusButton.textContent = newStatus ? "Disponible" : "Emprunté";
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
            account.textContent = "pris par " + (item.account || "inconnu") + (item.date ? ' le ' + item.date : '');
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
                const newStatus = !item.status;
                let account = item.account || "";
                let date = item.date || "";

                if (!newStatus) {
                    // admin marking as borrowed
                    const user = prompt("Nom de l'emprunteur :", account);
                    account = user ? user.trim() : "";
                    date = new Date().toISOString().split('T')[0];
                } else {
                    // admin marking as returned
                    // preserve previous account/date if needed or clear
                    account = "";
                    date = new Date().toISOString().split('T')[0];
                }

                fetch('/api/status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: item.id, 
                        status: newStatus,
                        account: account,
                        date: date
                    })
                })
                .then(response => response.json())
                .then(() => {
                    item.status = newStatus;
                    item.account = account;
                    item.date = date;
                    statusButton.className = newStatus ? "returned" : "waiting-return";
                    statusButton.classList.add("status-button");
                    statusButton.classList.add(newStatus ? "returned" : "waiting-return");
                    statusButton.textContent = newStatus ? "Rendu" : "Rendre";
                })
            });
            label.appendChild(statusButton);
        });
    })
    .catch(error => console.error('Erreur:', error));
});