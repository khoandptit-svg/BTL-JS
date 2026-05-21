// 1. Hàm hiển thị danh sách sản phẩm ra trang chủ
function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return; // Nếu không phải trang chủ thì dừng

    productList.innerHTML = ""; // Xóa dữ liệu cũ
    
    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString('vi-VN')} đ <span class="old-price">${product.oldPrice.toLocaleString('vi-VN')} đ</span></p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    });
}

// 2. Hàm xử lý thêm vào giỏ hàng (Dùng LocalStorage)
function addToCart(id) {
    // Lấy giỏ hàng hiện tại từ LocalStorage, nếu chưa có thì tạo mảng rỗng
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    let itemExisted = cart.find(item => item.id === id);
    
    if (itemExisted) {
        itemExisted.quantity += 1; // Có rồi thì tăng số lượng
    } else {
        cart.push({ id: id, quantity: 1 }); // Chưa có thì thêm mới vào mảng
    }
    
    // Lưu lại vào LocalStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    alert("Đã thêm sản phẩm vào giỏ hàng!");
    updateCartCount();
}

// 3. Cập nhật số lượng hiển thị trên icon giỏ hàng ở Menu
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = total;
}

// Chạy các hàm khi trang web tải xong
window.onload = function() {
    renderProducts();
    updateCartCount();
};



// 4. Hàm hiển thị danh sách trong trang cart.html
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

// 5. Hàm thay đổi số lượng sản phẩm
function changeQuantity(index, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += delta;

    // Nếu số lượng nhỏ hơn 1 thì xóa luôn sản phẩm
    if (cart[index].quantity < 1) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// 6. Hàm xóa sản phẩm khỏi giỏ
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

// 7. Hàm thanh toán đơn giản
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