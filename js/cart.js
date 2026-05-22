// 1. Hàm hiển thị danh sách trong trang cart.html
// Hàm lấy key giỏ hàng theo user
function getCartKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `cart_${user.username}` : null;
}

// Hàm tạo HTML cho modal đăng nhập/đăng ký
function renderCart() {
    const cartTableBody = document.getElementById('cart-table-body');
    if (!cartTableBody) return;

    const key = getCartKey();
    let cart = key ? JSON.parse(localStorage.getItem(key)) || [] : [];
    cartTableBody.innerHTML = "";
    let total = 0;

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

    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) totalPriceEl.innerText = total.toLocaleString('vi-VN') + " đ";
}

// Hàm thay đổi số lượng sản phẩm trong giỏ hàng
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

// 2. Hàm xử lý khi nhấn nút "Đặt hàng"
function checkout() {
    alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.");
    const key = getCartKey();
    if (key) localStorage.removeItem(key);
    location.reload();
}


// Chỉ chạy renderCart ở đây, KHÔNG gọi renderProducts (đã có trong main.js)
window.onload = function() {
    createModalHTML();
    renderProducts();
    renderCart();
    updateCartCount();
};