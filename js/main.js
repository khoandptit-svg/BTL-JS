//hàm hiển thị sản phẩm
function renderProducts(data = products) { 
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = ""; 

    data.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                ${product.oldPrice ? `<span class="discount-badge">-${Math.round((1 - product.price/product.oldPrice)*100)}%</span>` : ''}
                <img src="${product.image}" alt="${product.name}" onclick="openProductModal(${product.id})" style="cursor:pointer;">
                <h3>${product.name}</h3>
                <p class="price">
                    ${product.price.toLocaleString('vi-VN')} đ
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString('vi-VN')} đ</span>` : ''}
                </p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    });
}

// ===== MODAL =====
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-img').alt = product.name;
    document.getElementById('modal-name').textContent = product.name;
    document.getElementById('modal-desc').textContent = product.description;
    document.getElementById('modal-price').textContent = product.price.toLocaleString('vi-VN') + ' đ';

    const oldPriceEl = document.getElementById('modal-old-price');
    if (product.oldPrice) {
        oldPriceEl.textContent = product.oldPrice.toLocaleString('vi-VN') + ' đ';
        oldPriceEl.style.display = 'inline';
    } else {
        oldPriceEl.style.display = 'none';
    }

    document.getElementById('modal-add-btn').onclick = function() {
        addToCart(product.id);
        closeProductModal();
    };

    const overlay = document.getElementById('product-modal-overlay');
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('show'), 10);
}

// Đóng modal khi nhấn nút đóng hoặc click ra ngoài modal
function closeProductModal() {
    const overlay = document.getElementById('product-modal-overlay');
    overlay.classList.remove('show');
    setTimeout(() => { overlay.style.display = 'none'; }, 280);
}

// Tạo HTML cho modal nếu chưa có
function createModalHTML() {
    if (document.getElementById('product-modal-overlay')) return;
    document.body.insertAdjacentHTML('beforeend', `
    <div id="product-modal-overlay" onclick="if(event.target===this)closeProductModal()" style="display:none;">
        <div class="product-modal">
            <button class="modal-close-btn" onclick="closeProductModal()">✕</button>
            <div class="modal-body">
                <div class="modal-img-wrap">
                    <img id="modal-img" src="" alt="">
                </div>
                <div class="modal-info">
                    <h3 id="modal-name"></h3>
                    <p id="modal-desc"></p>
                    <div class="modal-pricing">
                        <span id="modal-old-price"></span>
                        <span id="modal-price"></span>
                    </div>
                    <button id="modal-add-btn" class="modal-add-cart-btn">🛒 Thêm vào giỏ hàng</button>
                </div>
            </div>
        </div>
    </div>`);
}
// ===== HẾT MODAL =====

// Lấy key giỏ hàng theo user
function getCartKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `cart_${user.username}` : null;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng ở Header
function updateCartCount() {
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) {
        const key = getCartKey();
        let cart = key ? JSON.parse(localStorage.getItem(key)) || [] : [];
        let total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.innerText = total;
    }
}

// thêm sản phẩm vào giỏ hàng
function addToCart(id) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert("Vui lòng đăng nhập để mua hàng!");
        window.location.href = "login.html";
        return;
    }

    const key = getCartKey();
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    let itemExisted = cart.find(item => item.id === id);

    if (itemExisted) {
        itemExisted.quantity += 1;
    } else {
        cart.push({ id: id, quantity: 1 });
    }

    localStorage.setItem(key, JSON.stringify(cart));
    updateCartCount();

    // Loading state cho nút bấm
    const btns = document.querySelectorAll(`.add-to-cart-btn[onclick="addToCart(${id})"], button[onclick="addToCart(${id})"]`);
    btns.forEach(btn => {
        const original = btn.textContent;
        btn.textContent = "✓ Đã thêm!";
        btn.style.background = "var(--green-dark)";
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.style.background = "";
            btn.disabled = false;
        }, 1200);
    });
}


// ===== Lọc sản phẩm theo danh mục =====
function filterProducts(category) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// ===== GIỎ HÀNG =====
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    const keyword = searchInput.value.trim();
    if (keyword !== "") {
        window.location.href = `search.html?query=${encodeURIComponent(keyword)}`;
    }
}

document.getElementById('search-btn')?.addEventListener('click', handleSearch);
document.getElementById('search-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') handleSearch();
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeProductModal();
});

document.addEventListener('DOMContentLoaded', function() {
    createModalHTML();
    renderProducts(); 
    updateCartCount();
});