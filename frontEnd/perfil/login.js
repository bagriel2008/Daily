const formLogin = document.getElementById('loginForm');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameOfUser = document.getElementById('name').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:3030/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nameOfUser, password })
    });

    const result = await response.json();

    if (result.success && result.user) {
        // Armazena os dados do usuário no localStorage
        localStorage.setItem('usuarioLogado', JSON.stringify(result.user));
        alert('Login bem-sucedido');
        window.location.href = '../inicio/inicio.html';
    } else {
        alert('Nome de usuário ou senha inválidos');
    }
});