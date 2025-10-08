const formLogin = document.getElementById('login-form');

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('username', username);
            if (username === 'johnd'){
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html'
            }
        } else {
            alert('Erro nas informações de login!');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('Ocorreu um erro no login');
    }
})