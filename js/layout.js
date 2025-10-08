document.addEventListener('DOMContentLoaded', () => {
  /**
   * Carrega um componente HTML de uma URL e o insere em um seletor de destino.
   * @param {string} url - A URL do arquivo HTML do componente.
   * @param {string} selector - O seletor CSS do elemento onde o componente será inserido.
   */

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

  // Carrega o cabeçalho e o rodapé em todas as páginas
  loadComponent('header.html', 'header.header')
    .then(() => {
      // Este código só executa DEPOIS que o header.html foi carregado
      const username = localStorage.getItem('username');
      const boasVindas = document.getElementById('welcome-msg');
      if (boasVindas && username) { // Verifica se o usuário está logado
        boasVindas.value = `Welcome, ${username}!`; // Isso é um input, então .value está correto.
      }

      // Adiciona o event listener para o botão de logout AQUI
      const botaoLogout = document.getElementById('logout-btn');
      if (botaoLogout) {
        botaoLogout.addEventListener('click', () => {
          localStorage.removeItem('username');
          window.location.href = 'index.html';
        });
      }
    });

  loadComponent('footer.html', 'footer');
});