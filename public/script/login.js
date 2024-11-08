document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token); // Armazena o token no Local Storage
            window.location.href = '/pages/admin-lepicardeau.html'; // Redireciona para o painel
        } else {
            document.getElementById('errorMessage').textContent = 'Credenciais inválidas';
        }
    })
    .catch(error => {
        console.error('Erro no login:', error);
    });
});

