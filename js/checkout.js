// Hiển thị tóm tắt sản phẩm trong giỏ hàng
// Hàm lấy key giỏ hàng theo user
function getCartKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `cart_${user.username}` : null;
}

// Hàm tạo HTML cho modal đăng nhập/đăng ký
window.onload = function() {
    const key = getCartKey();
    let cart = key ? JSON.parse(localStorage.getItem(key)) || [] : [];

    const reviewList = document.getElementById('review-list');
    const totalEl = document.getElementById('checkout-total');
    let total = 0;

    if (cart.length === 0) {
        alert("Giỏ hàng trống!");
        window.location.href = "index.html";
        return;
    }

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
                            ${p.name} <br>
                            <small>SL: ${item.quantity}</small>
                        </div>
                        <span>${subtotal.toLocaleString('vi-VN')} đ</span>
                    </div>
                </div>`;
        }
    });

    totalEl.innerText = total.toLocaleString('vi-VN') + " đ";
};

// Hàm xử lý khi nhấn nút "Đặt hàng"
function confirmOrder() {
    const name = document.getElementById('fullname').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (!name || !phone || !address) {
        alert("Vui lòng điền đầy đủ thông tin giao hàng!");
        return;
    }

    alert(`Chúc mừng ${name}!\nĐơn hàng của bạn đang được xử lý.\nChúng tôi sẽ giao đến: ${address}`);
    
    const key = getCartKey();
    if (key) localStorage.removeItem(key);
    
    window.location.href = "index.html";
}