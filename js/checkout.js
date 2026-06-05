// checkout.js - Xử lý trang thanh toán

document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert("Vui lòng đăng nhập để thanh toán!");
        window.location.href = "login.html";
        return;
    }

    const key = getCartKey();
    let cart = key ? JSON.parse(localStorage.getItem(key)) || [] : [];

    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        window.location.href = "index.html";
        return;
    }

    const reviewList = document.getElementById('review-list');
    const totalEl = document.getElementById('checkout-total');
    if (!reviewList || !totalEl) return;

    let total = 0;
    reviewList.innerHTML = "";

    cart.forEach(item => {
        const p = products.find(product => product.id === item.id);
        if (p) {
            const subtotal = p.price * item.quantity;
            total += subtotal;
            reviewList.innerHTML += `
                <div class="review-item">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="review-info">
                        <div class="review-name">
                            ${p.name}<br>
                            <small>SL: ${item.quantity}</small>
                        </div>
                        <span>${subtotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>`;
        }
    });

    totalEl.innerText = total.toLocaleString('vi-VN') + " đ";
    updateCartCount();
});

// Xác nhận đặt hàng
function confirmOrder() {
    const name = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();

    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    alert(`Chúc mừng ${name}!\nĐơn hàng của bạn đang được xử lý.\nChúng tôi sẽ giao đến: ${address}`);

    const key = getCartKey();
    if (key) localStorage.removeItem(key);
    window.location.href = "index.html";
}