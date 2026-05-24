// checkout.js - Xử lý trang thanh toán
function getCartKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `cart_${user.username}` : null;
}

// Cập nhật số lượng sản phẩm trong giỏ hàng ở Header
function renderCart() {
    // Lấy phần tử tbody của bảng giỏ hàng
    const cartTableBody = document.getElementById('cart-table-body');
    if (!cartTableBody) return;
    // Lấy giỏ hàng của user hiện tại
    const key = getCartKey();
    let cart = key ? JSON.parse(localStorage.getItem(key)) || [] : [];
    cartTableBody.innerHTML = "";
    let total = 0;
    // Nếu giỏ hàng trống, hiển thị thông báo và link về trang chủ
    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:#999; font-size:16px;">
                    🛒 Giỏ hàng của bạn đang trống
                    <br><br>
                    <a href="index.html" style="color:#38a149; font-weight:bold;">← Tiếp tục mua sắm</a>
                </td>
            </tr>`;
        const totalPriceEl = document.getElementById('total-price');
        if (totalPriceEl) totalPriceEl.innerText = "0 đ";
        return;
    }
    // Hiển thị từng sản phẩm trong giỏ hàng
    cart.forEach((item, index) => {
        const productInfo = products.find(p => p.id === item.id);
        if (productInfo) {
            const subtotal = productInfo.price * item.quantity;
            total += subtotal;
            cartTableBody.innerHTML += `
                <tr>
                    <td><img src="${productInfo.image}" width="50"></td>
                    <td>${productInfo.name}</td>
                    <td>${productInfo.price.toLocaleString('vi-VN')} đ</td>
                    <td>
                        <button onclick="changeQuantity(${index}, -1)">-</button>
                        ${item.quantity}
                        <button onclick="changeQuantity(${index}, 1)">+</button>
                    </td>
                    <td>${subtotal.toLocaleString('vi-VN')} đ</td>
                    <td><button onclick="removeFromCart(${index})" class="delete-btn">Xóa</button></td>
                </tr>`;
        }
    });
    // Hiển thị tổng tiền
    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) totalPriceEl.innerText = total.toLocaleString('vi-VN') + " đ";
}

// Hàm xử lý khi nhấn nút "Xác nhận đơn hàng"
function changeQuantity(index, delta) {
    const key = getCartKey();
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    if (cart[index].quantity + delta >= 1) cart[index].quantity += delta;
    localStorage.setItem(key, JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Hàm xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    const key = getCartKey();
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    cart.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Hàm xử lý khi nhấn nút "Xác nhận đơn hàng"
function checkout() {
    alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.");
    const key = getCartKey();
    if (key) localStorage.removeItem(key);
    location.reload();
}

// Dùng DOMContentLoaded thay vì window.onload để không xung đột main.js
document.addEventListener('DOMContentLoaded', function() {
    createModalHTML();
    renderProducts();
    renderCart();
    updateCartCount();
});