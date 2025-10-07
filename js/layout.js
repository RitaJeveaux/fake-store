document.addEventListener('DOMContentLoaded', () => {
  /**
   * Carrega um componente HTML de uma URL e o insere em um seletor de destino.
   * @param {string} url - A URL do arquivo HTML do componente.
   * @param {string} selector - O seletor CSS do elemento onde o componente será inserido.
   */
  const loadComponent = (url, selector) => {
    const element = document.querySelector(selector);
    if (element) {
      fetch(url)
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
  loadComponent('header.html', 'header.header');
  loadComponent('footer.html', 'footer');
});