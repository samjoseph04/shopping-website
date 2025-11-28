/**
 * Shopping Website Application Logic
 * Handles LocalStorage, Authentication, and CRUD operations.
 */

// Constants
const DB_USERS = 'users';
const DB_PRODUCTS = 'products';
const DB_CART = 'cart';
const DB_SESSION = 'loggedInUser';

// Initial Data Seeding
function initDB() {
    if (!localStorage.getItem(DB_USERS)) {
        localStorage.setItem(DB_USERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(DB_PRODUCTS)) {
        const initialProducts = [
            { id: 1, name: 'Wireless Headphones', price: 99.99, description: 'High quality noise cancelling headphones.', image: 'https://via.placeholder.com/300' },
            { id: 2, name: 'Smart Watch', price: 199.50, description: 'Track your fitness and notifications.', image: 'https://via.placeholder.com/300' },
            { id: 3, name: 'Laptop Stand', price: 29.99, description: 'Ergonomic aluminum laptop stand.', image: 'https://via.placeholder.com/300' }
        ];
        localStorage.setItem(DB_PRODUCTS, JSON.stringify(initialProducts));
    }
    if (!localStorage.getItem(DB_CART)) {
        localStorage.setItem(DB_CART, JSON.stringify([])); // Cart is simple array of {productId, qty} for logged in user? 
        // Actually, cart should probably be keyed by user ID or just global for this simple assignment if single user session.
        // Let's make cart specific to the logged-in user in a real app, but for this assignment, we'll just store it in the user object or a separate key 'cart_{userId}'.
        // For simplicity as requested: "Cart items" in DB structure. Let's assume a global cart or session based.
        // Better: 'cart' key stores: { userId: [items] } or just a list of items and we filter by user. 
        // Let's stick to a simple 'cart' key that stores items for the *current* session/user to keep it simple as per "LocalStorage structure" request.
        // Actually, the prompt asks for "Cart items" structure. I'll make it an array of objects: { userId, productId, qty }.
        localStorage.setItem(DB_CART, JSON.stringify([]));
    }
}

// Utilities
function getStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function setStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getSession() {
    return JSON.parse(localStorage.getItem(DB_SESSION));
}

function showSnackbar(message) {
    let x = document.getElementById("snackbar");
    if (!x) {
        x = document.createElement('div');
        x.id = 'snackbar';
        document.body.appendChild(x);
    }
    x.innerText = message;
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
}

// Auth Functions
function register(name, email, password) {
    const users = getStorage(DB_USERS);
    if (users.find(u => u.email === email)) {
        showSnackbar('Email already exists!');
        return false;
    }
    const newUser = { id: Date.now(), name, email, password, role: 'user' };
    users.push(newUser);
    setStorage(DB_USERS, users);
    showSnackbar('Registration successful! Please login.');
    setTimeout(() => window.location.href = 'login.html', 1500);
    return true;
}

function login(email, password) {
    // Admin Check
    if (email === 'admin@gmail.com' && password === 'admin123') {
        const adminUser = { id: 'admin', name: 'Admin', email, role: 'admin' };
        setStorage(DB_SESSION, adminUser);
        window.location.href = 'index.html';
        return;
    }

    const users = getStorage(DB_USERS);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        setStorage(DB_SESSION, user);
        window.location.href = 'index.html';
    } else {
        showSnackbar('Invalid email or password');
    }
}

function logout() {
    localStorage.removeItem(DB_SESSION);
    window.location.href = 'login.html';
}

function checkAuth() {
    const user = getSession();
    if (!user) {
        window.location.href = 'login.html';
    }
    return user;
}

function checkAdmin() {
    const user = checkAuth();
    if (user.role !== 'admin') {
        alert('Access Denied');
        window.location.href = 'index.html';
    }
}

// Product Functions
function getProducts() {
    return getStorage(DB_PRODUCTS);
}

function renderProducts() {
    const products = getProducts();
    const container = document.getElementById('product-list');
    const user = getSession();
    const isAdmin = user && user.role === 'admin';

    if (!container) return;
    container.innerHTML = '';

    products.forEach(p => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${p.image}" class="card-img-top" alt="${p.name}">
                <div class="card-body">
                    <h5 class="card-title">${p.name}</h5>
                    <p class="card-text">${p.description}</p>
                    <p class="card-text fw-bold">$${p.price}</p>
                    <button class="btn btn-primary w-100 mb-2" onclick="addToCart(${p.id})">Add to Cart</button>
                    ${isAdmin ? `
                        <div class="d-flex justify-content-between">
                            <a href="edit-product.html?id=${p.id}" class="btn btn-warning btn-sm">Edit</a>
                            <button onclick="deleteProduct(${p.id})" class="btn btn-danger btn-sm">Delete</button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function addProduct(product) {
    const products = getProducts();
    product.id = Date.now();
    products.push(product);
    setStorage(DB_PRODUCTS, products);
    showSnackbar('Product added successfully');
    setTimeout(() => window.location.href = 'shop.html', 1000);
}

function updateProduct(id, updatedData) {
    const products = getProducts();
    const index = products.findIndex(p => p.id == id);
    if (index !== -1) {
        products[index] = { ...products[index], ...updatedData };
        setStorage(DB_PRODUCTS, products);
        showSnackbar('Product updated');
        setTimeout(() => window.location.href = 'shop.html', 1000);
    }
}

function deleteProduct(id) {
    if (!confirm('Are you sure?')) return;
    let products = getProducts();
    products = products.filter(p => p.id != id);
    setStorage(DB_PRODUCTS, products);
    renderProducts();
    showSnackbar('Product deleted');
}

// Cart Functions
function addToCart(productId) {
    const user = getSession();
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    let cart = getStorage(DB_CART);
    const existingItem = cart.find(item => item.userId === user.id && item.productId === productId);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ userId: user.id, productId, qty: 1 });
    }

    setStorage(DB_CART, cart);
    showSnackbar('Added to cart');
}

function renderCart() {
    const user = getSession();
    if (!user) return; // Should be handled by checkAuth

    const cart = getStorage(DB_CART);
    const products = getProducts();
    const userCart = cart.filter(item => item.userId === user.id);
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');

    if (!container) return;
    container.innerHTML = '';
    let total = 0;

    if (userCart.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center">Your cart is empty</td></tr>';
        totalEl.innerText = '0.00';
        return;
    }

    userCart.forEach(item => {
        const product = products.find(p => p.id === item.productId);
        if (!product) return; // Product might have been deleted

        const itemTotal = product.price * item.qty;
        total += itemTotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>
                <input type="number" class="form-control" value="${item.qty}" min="1" style="width: 80px" onchange="updateCartQty(${item.productId}, this.value)">
            </td>
            <td>$${itemTotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${item.productId})">Remove</button>
            </td>
        `;
        container.appendChild(tr);
    });

    totalEl.innerText = total.toFixed(2);
}

function updateCartQty(productId, qty) {
    const user = getSession();
    let cart = getStorage(DB_CART);
    const item = cart.find(i => i.userId === user.id && i.productId === productId);
    if (item) {
        item.qty = parseInt(qty);
        if (item.qty <= 0) {
            removeFromCart(productId);
            return;
        }
        setStorage(DB_CART, cart);
        renderCart();
    }
}

function removeFromCart(productId) {
    const user = getSession();
    let cart = getStorage(DB_CART);
    cart = cart.filter(i => !(i.userId === user.id && i.productId === productId));
    setStorage(DB_CART, cart);
    renderCart();
}

// Initialization on Load
document.addEventListener('DOMContentLoaded', () => {
    initDB();

    // Navbar Update
    const user = getSession();
    const navLogin = document.getElementById('nav-login');
    const navRegister = document.getElementById('nav-register');
    const navLogout = document.getElementById('nav-logout');
    const navAdmin = document.getElementById('nav-admin');

    if (user) {
        if (navLogin) navLogin.style.display = 'none';
        if (navRegister) navRegister.style.display = 'none';
        if (navLogout) navLogout.style.display = 'block';
        if (user.role === 'admin' && navAdmin) navAdmin.style.display = 'block';
    } else {
        if (navLogin) navLogin.style.display = 'block';
        if (navRegister) navRegister.style.display = 'block';
        if (navLogout) navLogout.style.display = 'none';
        if (navAdmin) navAdmin.style.display = 'none';
    }

    // Page Specific Logic
    const path = window.location.pathname;

    if (path.includes('shop.html')) {
        renderProducts();
    } else if (path.includes('cart.html')) {
        checkAuth();
        renderCart();
    } else if (path.includes('add-product.html')) {
        checkAdmin();
        document.getElementById('add-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = parseFloat(document.getElementById('p-price').value);
            const description = document.getElementById('p-desc').value;
            const image = document.getElementById('p-image').value;
            addProduct({ name, price, description, image });
        });
    } else if (path.includes('edit-product.html')) {
        checkAdmin();
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        const products = getProducts();
        const product = products.find(p => p.id == id);

        if (product) {
            document.getElementById('p-name').value = product.name;
            document.getElementById('p-price').value = product.price;
            document.getElementById('p-desc').value = product.description;
            document.getElementById('p-image').value = product.image;
        }

        document.getElementById('edit-product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('p-name').value;
            const price = parseFloat(document.getElementById('p-price').value);
            const description = document.getElementById('p-desc').value;
            const image = document.getElementById('p-image').value;
            updateProduct(id, { name, price, description, image });
        });
    } else if (path.includes('login.html')) {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            login(document.getElementById('email').value, document.getElementById('password').value);
        });
    } else if (path.includes('register.html')) {
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm-password').value;

            if (password !== confirm) {
                showSnackbar('Passwords do not match');
                return;
            }
            register(name, email, password);
        });
    }
});
