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

