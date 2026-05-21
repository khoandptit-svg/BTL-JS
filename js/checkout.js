// Hiển thị tóm tắt sản phẩm trong giỏ hàng
        window.onload = function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const reviewList = document.getElementById('review-list');
    const totalEl = document.getElementById('checkout-total');
    let total = 0;

    if(cart.length === 0) {
        alert("Giỏ hàng trống!");
        window.location.href = "index.html";
        return;
    }

    reviewList.innerHTML = ""; // Làm sạch danh sách trước khi lặp

    cart.forEach(item => {
        const p = products.find(product => product.id === item.id);
        if(p) {
            const subtotal = p.price * item.quantity;
            total += subtotal;
            
            // Cấu trúc mới có thêm thẻ img
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
                </div>
            `;
        }
    });
    totalEl.innerText = total.toLocaleString('vi-VN') + " đ";
};

        // Hàm xác nhận đặt hàng
        function confirmOrder() {
            const name = document.getElementById('fullname').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;

            if(!name || !phone || !address) {
                alert("Vui lòng điền đầy đủ thông tin giao hàng!");
                return;
            }

            alert(`Chúc mừng ${name}!\nĐơn hàng của bạn đang được xử lý.\nChúng tôi sẽ giao đến: ${address}`);
            localStorage.removeItem('cart'); // Xóa giỏ hàng
            window.location.href = "index.html"; // Quay về trang chủ
        }