const productsContainer = document.getElementById('products-container');
let products = [];
const API_URL = 'https://fakestoreapi.com/products';

function getProducts() {
  products = localStorage.getItem('fakely');
  return products ? JSON.parse(products) : [];
}

function renderProducts(products) {
  productsContainer.innerHTML = '';
  products.forEach((product) => {
    const card = document.createElement('div');
    card.innerHTML = ` 
    <div class="product-card">
    <img src="${product.image}">
    <h3>${product.title}</h3>
    <p>$ ${product.price}</p>
    <button>Buy Now</button>
    </div>  
  `;

    productsContainer.appendChild(card);
  });
}

function saveProducts(products) {
  localStorage.setItem('fakely', JSON.stringify(products));
}

async function fetchProducts() {
  const cachedProducts = getProducts();

  if (cachedProducts.length > 0) {
    console.log('Loading products from localStorage.');
    products = cachedProducts;
    renderProducts(products);
  } else {
    console.log('localStorage is empty. Fetching from API...');
    const response = await fetch(API_URL);
    products = await response.json();
    renderProducts(products);
    saveProducts(products);
  }
}

window.onload = fetchProducts;
