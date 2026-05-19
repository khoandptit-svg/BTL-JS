// 1. Hàm hiển thị danh sách sản phẩm ra trang chủ
function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Nếu không phải trang chủ thì dừng

    productList.innerHTML = ""; // Xóa dữ liệu cũ
    
    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString('vi-VN')} đ <span class="old-price">${product.oldPrice.toLocaleString('vi-VN')} đ</span></p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    });
}

// 2. Hàm xử lý thêm vào giỏ hàng (Dùng LocalStorage)
function addToCart(id) {
    // Lấy giỏ hàng hiện tại từ LocalStorage, nếu chưa có thì tạo mảng rỗng
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    let itemExisted = cart.find(item => item.id === id);
    
    if (itemExisted) {
        itemExisted.quantity += 1; // Có rồi thì tăng số lượng
    } else {
        cart.push({ id: id, quantity: 1 }); // Chưa có thì thêm mới vào mảng
    }
    
    // Lưu lại vào LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    updateCartCount();
}

// 3. Cập nhật số lượng hiển thị trên icon giỏ hàng ở Menu
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = total;
}

// 4. Hàm lọc sản phẩm theo mặt hàng
function filterProducts(category) {

    const productList = document.getElementById('product-list');

    if (!productList) return;

    // Xóa sản phẩm cũ
    productList.innerHTML = "";

    // Lọc sản phẩm theo category
    const filteredProducts = products.filter(product => 
        product.category === category
    );

    // Hiển thị sản phẩm sau khi lọc
    filteredProducts.forEach(product => {

        productList.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p class="price">
                    ${product.price.toLocaleString('vi-VN')} đ

                    <span class="old-price">
                        ${product.oldPrice.toLocaleString('vi-VN')} đ
                    </span>
                </p>

                <button onclick="addToCart(${product.id})">
                    Thêm vào giỏ
                </button>

            </div>
        `;
    });
}

// Chạy các hàm khi trang web tải xong
window.onload = function() {
    renderProducts();
    updateCartCount();
};