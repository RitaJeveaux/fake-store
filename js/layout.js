document.addEventListener('DOMContentLoaded', () => {

  const loadComponent = (url, selector) => {
    const element = document.querySelector(selector);
    if (element) {
      return fetch(url) // Retornar a promise
        .then(response => {
          if (!response.ok) {
            throw new Error(`Network response was not ok for ${url}`);
          }
          return response.text();
        })
        .then(data => {
          element.innerHTML = data;
        })
        .catch(error => {
          console.error('Error loading component:', error);
          element.innerHTML = `<p style="color:red; text-align:center;">Error loading content.</p>`;
        });
    }
  };


  loadComponent('header.html', 'header.header')
    .then(() => {
      // Aplica a classe .fixed-top apenas na página de admin para corrigir o "pulo" do modal
      if (window.location.pathname.endsWith('admin.html')) {
        const header = document.querySelector('header.header');
        if (header) header.classList.add('fixed-top');
      }

      const username = localStorage.getItem('username');
      const boasVindas = document.getElementById('welcome-msg');
      if (boasVindas && username) {
        boasVindas.value = `Welcome, ${username}!`;
      }

      const botaoLogout = document.getElementById('logout-btn');
      if (botaoLogout) {
        botaoLogout.addEventListener('click', () => {
          localStorage.removeItem('username');
          window.location.href = 'login.html';
        });
      }
    });

  loadComponent('footer.html', 'footer');
});