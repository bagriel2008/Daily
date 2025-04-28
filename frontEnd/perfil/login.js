const formLogin = document.getElementById('loginForm')


formLogin.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const password = document.getElementById('password').value

    const response = await fetch('http://localhost:3030/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password })
    })
    const result = await response.json();


    if (result.success) {
        alert('login bem sucedido')
        window.location.href = ''
    } else {
        alert('Falta alguma informação')
    }

})
