// cart.js - Xử lý trang giỏ hàng

// Render danh sách sản phẩm trong giỏ hàng
function renderCart() {
    const cartTableBody = document.getElementById('cart-table-body');
    if (!cartTableBody) return;
    // Lấy giỏ hàng từ localStorage
    const key = getCartKey();
    let cart = key ? JSON.parse(localStorage.getItem(key)) || [] : [];
    cartTableBody.innerHTML = "";
    let total = 0;
    // Nếu giỏ hàng trống, hiển thị thông báo
    if (cart.length === 0) {
        cartTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding:40px; color:#999; font-size:16px;">
                    Giỏ hàng của bạn đang trống
                    <br><br>
                    <a href="index.html" style="color:#38a149; font-weight:bold;">← Tiếp tục mua sắm</a>
                </td>
            </tr>`;
            // Đặt tổng tiền về 0 khi giỏ hàng trống
        const totalPriceEl = document.getElementById('total-price');
        if (totalPriceEl) totalPriceEl.innerText = "0 đ";
        return;
    }
    // Nếu có sản phẩm, hiển thị danh sách
    cart.forEach((item, index) => {
        // Tìm thông tin sản phẩm từ mảng products
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
    // Cập nhật tổng tiền
    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) totalPriceEl.innerText = total.toLocaleString('vi-VN') + " đ";
}

// Thay đổi số lượng sản phẩm
function changeQuantity(index, delta) {
    const key = getCartKey();
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    if (cart[index].quantity + delta >= 1) cart[index].quantity += delta;
    localStorage.setItem(key, JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// Xóa sản phẩm khỏi giỏ hàng
function removeFromCart(index) {
    const key = getCartKey();
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    cart.splice(index, 1);
    localStorage.setItem(key, JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// FIX: Chỉ render giỏ hàng, không gọi createModalHTML/renderProducts (không cần ở trang cart)
document.addEventListener('DOMContentLoaded', function() {
    renderCart();
    updateCartCount();
});