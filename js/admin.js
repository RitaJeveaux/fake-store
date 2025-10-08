// Proteção de rota
const username = localStorage.getItem('username');
if (username !== 'johnd') {
    window.location.href = 'index.html';
}

const API_URL = 'https://fakestoreapi.com/products';
const productsTableBody = document.getElementById('products-table-body');
const productForm = document.getElementById('product-form');
const productModalElement = document.getElementById('productModal');
const productModal = new bootstrap.Modal(productModalElement);
const productModalLabel = document.getElementById('productModalLabel');
const deleteConfirmModalElement = document.getElementById('deleteConfirmModal');
const deleteConfirmModal = new bootstrap.Modal(deleteConfirmModalElement);

let products = [];
let currentProductId = null;

// Carrega os produtos do localStorage ou busca na API como fallback
async function fetchProducts() {
    const cachedProducts = getProducts();

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
            console.error('Error fetching products from API:', error);
        }
    }
}

// Renderizar produtos na tabela
function renderProducts() {
    productsTableBody.innerHTML = '';
    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.id}</td>
                <td>${product.title}</td>
                <td>$ ${product.price}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="openEditModal(${product.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${product.id})">Delete</button>
                </td>
            </tr>
        `;
        productsTableBody.innerHTML += row;
    });
}

function saveProducts(products) {
    localStorage.setItem('fakely', JSON.stringify(products));
}

function getProducts() {
    const products = localStorage.getItem('fakely');
    return products ? JSON.parse(products) : [];
}

// Abrir modal de edição
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

// Abrir modal de deleção
function openDeleteModal(id) {
    currentProductId = id;
    deleteConfirmModal.show();
}

// Limpar formulário ao abrir modal para adicionar novo produto
document.getElementById('add-product-btn').addEventListener('click', () => {
    currentProductId = null;
    productModalLabel.textContent = 'Add Product';
    productForm.reset();
    document.getElementById('product-id').value = '';
});


// Lidar com o submit do formulário (Adicionar/Editar)
productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const id = document.getElementById('product-id').value;
    const productData = {
        title: document.getElementById('product-title').value,
        price: parseFloat(document.getElementById('product-price').value),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value,
        category: document.getElementById('product-category').value
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
        console.log('Product saved:', result);

        // A API de teste não atualiza o servidor, então vamos simular
        if (id) { // Edição
            const index = products.findIndex(p => p.id == id);
            products[index] = { ...products[index], ...productData, id: parseInt(id) };
        } else { // Adição
            products.push({ ...productData, id: result.id || (products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1) });
        }
        renderProducts();
        saveProducts(products);
        document.activeElement.blur();
        productModal.hide();

    } catch (error) {
        console.error('Error saving product:', error);
    }
});

// Lidar com a confirmação de exclusão
document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    try {
        await fetch(`${API_URL}/${currentProductId}`, { method: 'DELETE' });

        // A API de teste não atualiza o servidor, então vamos simular
        products = products.filter(p => p.id !== currentProductId);
        renderProducts();
        document.activeElement.blur();
        saveProducts(products);
        deleteConfirmModal.hide();
        currentProductId = null;
    } catch (error) {
        console.error('Error deleting product:', error);
    }
});


fetchProducts();