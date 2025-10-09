const formLogin = document.getElementById('login-form');
const errorModal = document.getElementById('error-modal');
const errorMessage = document.getElementById('error-message');
const closeBtn = document.querySelector('.close-btn');

function showErrorModal(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

function hideErrorModal() {
    errorModal.style.display = 'none';
}

closeBtn.addEventListener('click', hideErrorModal);
window.addEventListener('click', (event) => {
    if (event.target == errorModal) hideErrorModal();
});

formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('https://fakestoreapi.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('username', username);
            if (username === 'johnd') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html'
            }
        } else {
            showErrorModal('Please check your username and password.');
        }

    } catch (error) {
        console.error('Error:', error);
        showErrorModal('A login error occurred! Please try again later.');
    }
});
