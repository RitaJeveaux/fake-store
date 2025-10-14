
const API_URL = 'https://fakestoreapi.com/products';
let products = [];

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
      return;
    }
  }
  renderProducts(products, container);
}


async function showProductModal(productId, productDetailModal) {
  const modalBodyContent = document.getElementById('modal-body-content');
  if (!productDetailModal || !modalBodyContent) return;

  modalBodyContent.innerHTML = '<p>Loading product details...</p>';
  productDetailModal.style.display = 'block';

  try {
    const response = await fetch(`${API_URL}/${productId}`);
    if (!response.ok) throw new Error('Product not found');
    const product = await response.json();

    modalBodyContent.innerHTML = `
      <img src="${product.image}" alt="${product.title}" class="modal-product-image">
      <h2 class="modal-product-title">${product.title}</h2>
      <p class="modal-product-category">${product.category}</p>
      <div class="modal-product-rating">
        <span>⭐ ${product.rating.rate.toFixed(1)}</span>
        <span>(${product.rating.count} reviews)</span>
      </div>
      <p class="modal-product-price">$ ${product.price.toFixed(2)}</p>
      <p class="modal-product-description">${product.description}</p>
    `;
  } catch (error) {
    console.error('Error fetching product details:', error);
    modalBodyContent.innerHTML = '<p style="color:red;">Could not load product details. Please try again.</p>';
  }
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

    card.querySelector('.buy-now-btn').addEventListener('click', () => showProductModal(product.id, productDetailModal));
    container.appendChild(card);
  });
}
