
const API_URL = 'https://fakestoreapi.com/products';
let products = [];

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');
  const productDetailModal = document.getElementById('product-detail-modal');
  const closeBtn = document.querySelector('.product-detail-close-btn');

  if (productsContainer) {
    fetchAndRenderProducts(productsContainer);
  }

  if (closeBtn && productDetailModal) {
    closeBtn.addEventListener('click', () => hideProductModal(productDetailModal));
    window.addEventListener('click', (event) => {
      if (event.target === productDetailModal) {
        hideProductModal(productDetailModal);
      }
    });
  }
});


// --- API e manipulação dos Dados ---

function saveProducts(products) {
  localStorage.setItem('fakely', JSON.stringify(products));
}

function getProductsFromStorage() {
  const storedProducts = localStorage.getItem('fakely');
  return storedProducts ? JSON.parse(storedProducts) : [];
}

async function fetchAndRenderProducts(container) {
  const cachedProducts = getProductsFromStorage();

  if (cachedProducts.length > 0) {
    products = cachedProducts;
  } else {
    try {
      const response = await fetch(API_URL);
      products = await response.json();
      saveProducts(products);
    } catch (error) {
      console.error('Failed to fetch products from API:', error);
      container.innerHTML = '<p style="color:red; text-align:center;">Failed to load products. Please try again later.</p>';
      return; // Interrompe a execução se a API falhar
    }
  }
  renderProducts(products, container);
}

// --- Renderização Modal e Produtos ---

function showProductModal(product, productDetailModal) {
  const modalBodyContent = document.getElementById('modal-body-content');
  if (!productDetailModal || !modalBodyContent) return;

  modalBodyContent.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="modal-product-image">
    <h2 class="modal-product-title">${product.title}</h2>
    <p class="modal-product-price">$ ${product.price}</p>
    <p class="modal-product-description">${product.description}</p>
    <div class="modal-actions">
      <button class="modal-buy-btn">Buy</button>
    </div>
  `;
  productDetailModal.style.display = 'block';

  modalBodyContent.querySelector('.modal-buy-btn').addEventListener('click', () => {
    // TODO: Implementar lógica de adicionar ao carrinho
    console.log(`Produto ${product.id} - ${product.title} adicionado ao carrinho!`);
    hideProductModal(productDetailModal);
  });
}

function hideProductModal(productDetailModal) {
  if (!productDetailModal) return;
  productDetailModal.style.display = 'none';
}

function renderProducts(productsToRender, container) {
  if (!container) return;
  container.innerHTML = '';
  const productDetailModal = document.getElementById('product-detail-modal');

  productsToRender.forEach((product) => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">$ ${product.price.toFixed(2)}</p>
      <button class="buy-now-btn">Buy Now</button>
    `;

    card.querySelector('.buy-now-btn').addEventListener('click', () => showProductModal(product, productDetailModal));
    container.appendChild(card);
  });
}
