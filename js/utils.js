// utils.js - Shared utilities for KTA Shop
// Lấy key giỏ hàng theo user hiện tại
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