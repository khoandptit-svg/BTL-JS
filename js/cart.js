// 1. Hàm hiển thị danh sách trong trang cart.html
function renderCart() {
    const cartTableBody = document.getElementById('cart-table-body');
    if (!cartTableBody) return; // Nếu không phải trang giỏ hàng thì dừng

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartTableBody.innerHTML = ""; // Làm trống bảng trước khi vẽ lại
    let total = 0;

    cart.forEach((item, index) => {
        // Tìm thông tin chi tiết sản phẩm từ mảng products (trong data.js) dựa vào id
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

    // Cập nhật tổng tiền
    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) {
        totalPriceEl.innerText = total.toLocaleString('vi-VN') + " đ";
    }
}


// 2. Hàm thay đổi số lượng sản phẩm
function changeQuantity(index, delta) {

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Chỉ cho giảm khi số lượng > 1
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
    localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi đặt
    location.reload();
}

// Cập nhật lại window.onload để chạy cả renderCart
window.onload = function() {
    renderProducts();
    renderCart(); // Thêm dòng này
    updateCartCount();
};

// Hàm hiển thị sản phẩm (Cập nhật để nhận mảng sản phẩm tùy biến)
function renderProducts(productsToDisplay = products) {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = "";
    
    productsToDisplay.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString('vi-VN')} đ 
                    <span class="old-price">${product.oldPrice.toLocaleString('vi-VN')} đ</span>
                </p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    });
}