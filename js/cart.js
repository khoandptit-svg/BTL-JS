// 1. Hàm hiển thị danh sách trong trang cart.html
function renderCart() {
    const cartTableBody = document.getElementById('cart-table-body');
    if (!cartTableBody) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
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
                </tr>
            `;
        }
    });

    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) {
        totalPriceEl.innerText = total.toLocaleString('vi-VN') + " đ";
    }
}

// 2. Hàm thay đổi số lượng sản phẩm
function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart[index].quantity + delta >= 1) {
        cart[index].quantity += delta;
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// 3. Hàm xóa sản phẩm khỏi giỏ
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// 4. Hàm thanh toán đơn giản
function checkout() {
    alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.");
    localStorage.removeItem('cart');
    location.reload();
}

// Chỉ chạy renderCart ở đây, KHÔNG gọi renderProducts (đã có trong main.js)
window.onload = function() {
    createModalHTML();
    renderProducts();
    renderCart();
    updateCartCount();
};