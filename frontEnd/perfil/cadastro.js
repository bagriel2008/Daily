
document.getElementById('CadastrarMorador').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const nome = document.getElementById('nome').value;
    const usuario = document.getElementById('usuario').value;

    console.log({ email, senha, nome, usuario }); // ✅ Verificar os dados antes do envio

    const response = await fetch('http://localhost:3030/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, nome, usuario })
    });

    console.log(response); // ✅ Verificar a resposta do servidor

    const results = await response.json();

    if (results.success) {
        alert('cadastro bem sucedido')
        window.location.href = '/Daily/frontEnd/perfil/login.html'
    } else {
        alert('Falta alguma informação')
    }
});
