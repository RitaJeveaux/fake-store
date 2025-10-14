const API_URL = 'https://fakestoreapi.com/products';
const productsTableBody = document.getElementById('products-table-body');
const productForm = document.getElementById('product-form');
const productModalElement = document.getElementById('productModal');
const productModal = new bootstrap.Modal(productModalElement);
const productModalLabel = document.getElementById('productModalLabel');
const deleteConfirmModalElement = document.getElementById('deleteConfirmModal');
const deleteConfirmModal = new bootstrap.Modal(deleteConfirmModalElement);
const errorModalElement = document.getElementById('errorModal');
const errorModal = new bootstrap.Modal(errorModalElement);
const errorMessageText = document.getElementById('error-message-text');

let products = [];
let currentProductId = null;

function getProductsFromStorage() {
    const storedProducts = localStorage.getItem('fakely');
    return storedProducts ? JSON.parse(storedProducts) : [];
}

function saveProducts(products) {
    localStorage.setItem('fakely', JSON.stringify(products));
}

function getProducts() {
    const products = localStorage.getItem('fakely');
    return products ? JSON.parse(products) : [];
}

function renderProducts() {
    const tableRows = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.title}</td>
            <td>$ ${product.price}</td>
            <td>
                <button class="btn btn-sm btn-warning edit-btn" data-id="${product.id}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">Delete</button>
            </td>
        </tr>
    `).join('');
    productsTableBody.innerHTML = tableRows;
}

function showErrorModal(message) {
    errorMessageText.textContent = message;
    errorModal.show();
}

function openEditModal(id) {
    currentProductId = id;
    const product = products.find(p => p.id === id);
    productModalLabel.textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-title').value = product.title;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-category').value = product.category;
    productModal.show();
}

function openDeleteModal(id) {
    currentProductId = id;
    deleteConfirmModal.show();
}

function setupEventListeners() {
    document.getElementById('add-product-btn').addEventListener('click', () => {
        currentProductId = null;
        productModalLabel.textContent = 'Add Product';
        productForm.reset();
        document.getElementById('product-id').value = '';
    });

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const form = event.target;
        const id = form.elements['product-id'].value;
        const productData = {
            title: form.elements['product-title'].value,
            price: parseFloat(form.elements['product-price'].value.replace(',', '.')),
            description: form.elements['product-description'].value,
            image: form.elements['product-image'].value,
            category: form.elements['product-category'].value
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `${API_URL}/${id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            const result = await response.json();
            console.log('Product saved:', result); // Mantido para debug

            if (id) {
                // Atualiza um produto existente
                const index = products.findIndex(p => p.id == id);
                if (index !== -1) {
                    products[index] = { ...products[index], ...productData };
                }
            } else {
                // Adiciona um novo produto, garantindo um ID único
                products.push({ ...productData, id: result.id || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1) });
            }
            renderProducts();
            saveProducts(products);
            document.activeElement.blur();
            productModal.hide();

        } catch (error) {
            console.error('Error saving product:', error); // Mantido para debug
            showErrorModal('An error occurred while saving the product. Please try again.');
        }
    });

    document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
        try {
            await fetch(`${API_URL}/${currentProductId}`, { method: 'DELETE' });
            products = products.filter(p => p.id !== currentProductId);
            renderProducts();
            document.activeElement.blur();
            saveProducts(products);
            deleteConfirmModal.hide();
            currentProductId = null;
        } catch (error) {
            console.error('Error deleting product:', error); // Mantido para debug
            showErrorModal('An error occurred while deleting the product. Please try again.');
        }
    });

    productsTableBody.addEventListener('click', (event) => {
        const target = event.target;
        const productId = target.dataset.id;

        if (!productId) return;

        if (target.classList.contains('edit-btn')) {
            openEditModal(Number(productId));
        }

        if (target.classList.contains('delete-btn')) {
            openDeleteModal(Number(productId));
        }
    });
}

// --- Lógica Principal e de API ---

async function fetchProducts() {
    const cachedProducts = getProductsFromStorage();

    if (cachedProducts.length > 0) {
        console.log('Loading products from localStorage.');
        products = cachedProducts;
        renderProducts();
    } else {
        console.log('localStorage is empty. Fetching from API...');
        try {
            const response = await fetch(API_URL);
            products = await response.json();
            renderProducts();
            saveProducts(products);
        } catch (error) {
            console.error('Error fetching products from API:', error); // Mantido para debug
            showErrorModal('Failed to load products from the server. Please check your connection and try again.');
        }
    }
}

function initializeAdminPage() {
    const username = localStorage.getItem('username');
    if (username !== 'johnd') {
        window.location.href = 'index.html';
        return;
    }

    setupEventListeners();
    fetchProducts();
}

initializeAdminPage();
