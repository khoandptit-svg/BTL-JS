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

// ===== Tạo mã đơn hàng ngẫu nhiên =====
function generateOrderCode() {
    const now = new Date();
    const ymd = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `KTA-${ymd}-${rand}`;
}

// ===== Tính ngày giao dự kiến (+ 2 ngày) =====
function getEstimatedDelivery() {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy} — 18:00`;
}

// ===== Format ngày giờ hiện tại =====
function getNow() {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} — ${hh}:${min}`;
}

// ===== Lấy key lưu đơn hàng =====
function getOrdersKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `orders_${user.username}` : null;
}

// ===== Xác nhận đặt hàng =====
function confirmOrder() {
    const name    = document.getElementById('fullname').value.trim();
    const phone   = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const note    = document.getElementById('note') ? document.getElementById('note').value.trim() : '';

    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    // Lấy giỏ hàng
    const cartKey = getCartKey();
    let cart = cartKey ? JSON.parse(localStorage.getItem(cartKey)) || [] : [];
    if (cart.length === 0) { alert("Giỏ hàng trống!"); return; }

    // Tính tổng & build danh sách sản phẩm
    let total = 0;
    const orderItems = [];
    cart.forEach(item => {
        const p = products.find(pr => pr.id === item.id);
        if (p) {
            total += p.price * item.quantity;
            orderItems.push({
                id: p.id,
                name: p.name,
                image: p.image,
                price: p.price,
                quantity: item.quantity,
            });
        }
    });

    // Phương thức thanh toán (nếu có select trên trang)
    const paymentSelect = document.getElementById('payment-method');
    const paymentMethod = paymentSelect ? paymentSelect.value : 'Tiền mặt khi nhận hàng';

    // Tạo object đơn hàng
    const newOrder = {
        code: generateOrderCode(),
        status: 'processing',          // processing | shipping | delivered | cancelled
        createdAt: getNow(),
        estimatedDelivery: getEstimatedDelivery(),
        fullname: name,
        phone: phone,
        address: address,
        note: note,
        paymentMethod: paymentMethod,
        items: orderItems,
        total: total,
        cancelReason: null,
    };

    // Lưu vào localStorage
    const ordersKey = getOrdersKey();
    if (ordersKey) {
        let orders = JSON.parse(localStorage.getItem(ordersKey)) || [];
        orders.push(newOrder);
        localStorage.setItem(ordersKey, JSON.stringify(orders));
    }

    // Xoá giỏ hàng
    if (cartKey) localStorage.removeItem(cartKey);

    alert(`🎉 Đặt hàng thành công!\nMã đơn: #${newOrder.code}\nDự kiến giao: ${newOrder.estimatedDelivery}`);
    window.location.href = "orders.html";
}