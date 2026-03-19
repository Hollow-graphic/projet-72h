document.getElementById("loginBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("user", name);
            if (data.user.is_admin) {
                window.location.replace("/admin");
            } else {
                window.location.replace("/index");
            }
        }
    })
    .catch(error => console.error('Erreur:', error));
});

document.getElementById("registerBtn").addEventListener("click", () => {
    const name = document.getElementById("nameInput").value;
    const password = document.getElementById("passwordInput").value;

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("user", name);
            window.location.replace("/index");
        }
    })
    .catch(error => console.error('Erreur:', error));
});

//si le touche entrée en appuie dans les champs de login, ça clique sur le bouton de login
document.getElementById("nameInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const name = document.getElementById("nameInput").value;
        const password = document.getElementById("passwordInput").value;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("user", name);
                if (data.user.is_admin) {
                    window.location.replace("/admin");
                } else {
                    window.location.replace("/index");
                }
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});

document.getElementById("passwordInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        const name = document.getElementById("nameInput").value;
        const password = document.getElementById("passwordInput").value;

        fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, password: password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem("user", name);
                if (data.user.is_admin) {
                    window.location.replace("/admin");
                } else {
                    window.location.replace("/index");
                }
            }
        })
        .catch(error => console.error('Erreur:', error));
    }
});
