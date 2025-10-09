let products = []; // Mantém a lista de produtos globalmente
const API_URL = 'https://fakestoreapi.com/products';

function getProducts() {
  const storedProducts = localStorage.getItem('fakely');
  return storedProducts ? JSON.parse(storedProducts) : [];
}

function renderProducts(products, productsContainer) {
  if (!productsContainer) return;
  productsContainer.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('div'); // Usamos um container para o card
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h3>${product.title}</h3>
      <p class="price">$ ${product.price}</p>
      <button class="buy-now-btn">Buy Now</button>
    `;

    const buyButton = card.querySelector('.buy-now-btn');
    buyButton.addEventListener('click', () => showProductModal(product, document.getElementById('product-detail-modal')));

    productsContainer.appendChild(card);
  });
}

function saveProducts(products) {
  localStorage.setItem('fakely', JSON.stringify(products));
}

async function fetchProducts(productsContainer) {
  const cachedProducts = getProducts();

  if (cachedProducts.length > 0) {
    console.log('Loading products from localStorage.');
    products = cachedProducts;
    renderProducts(products, productsContainer);
  } else {
    console.log('localStorage is empty. Fetching from API...');
    const response = await fetch(API_URL);
    products = await response.json();
    renderProducts(products, productsContainer);
    saveProducts(products);
  }
}

// Funções do Modal
function showProductModal(product, productDetailModal) {
  const modalBodyContent = document.getElementById('modal-body-content');
  if (!productDetailModal || !modalBodyContent) return;

  modalBodyContent.innerHTML = `
    <img src="${product.image}" alt="${product.title}" class="modal-product-image">
    <h2 class="modal-product-title">${product.title}</h2>
    <p class="modal-product-description">${product.description}</p>
    <p class="modal-product-price">$ ${product.price}</p>
    <div class="modal-actions">
      <button class="modal-buy-btn">Buy</button>
    </div>
  `;
  productDetailModal.style.display = 'block';

  // Adicionar evento ao botão "Buy" do modal
  const modalBuyBtn = modalBodyContent.querySelector('.modal-buy-btn');
  modalBuyBtn.addEventListener('click', () => {
    console.log(`Produto ${product.id} adicionado ao carrinho!`); // Lógica de compra aqui
    hideProductModal(productDetailModal);
  });
}

function hideProductModal(productDetailModal) {
  if (!productDetailModal) return;
  productDetailModal.style.display = 'none';
}

// Executa o código quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
  const productsContainer = document.getElementById('products-container');
  const productDetailModal = document.getElementById('product-detail-modal');
  const closeBtn = document.querySelector('.product-detail-close-btn');

  if (productsContainer) {
    fetchProducts(productsContainer);
  }

  if (closeBtn && productDetailModal) {
    closeBtn.addEventListener('click', () => hideProductModal(productDetailModal));
    window.addEventListener('click', (event) => {
      if (event.target == productDetailModal) hideProductModal(productDetailModal);
    });
  }
});
