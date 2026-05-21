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

<<<<<<< HEAD
// 7. Hàm thanh toán đơn giản
function checkout() {
    alert("Cảm ơn bạn đã đặt hàng! Chúng tôi sẽ liên hệ sớm.");
    localStorage.removeItem('cart'); // Xóa giỏ hàng sau khi đặt
    location.reload();
}

// Cập nhật lại window.onload để chạy cả renderCart
=======
// 4. Hàm lọc sản phẩm theo mặt hàng
function filterProducts(category) {

    const productList = document.getElementById('product-list');

    if (!productList) return;

    // Xóa sản phẩm cũ
    productList.innerHTML = "";

    // Lọc sản phẩm theo category
    const filteredProducts = products.filter(product => 
        product.category === category
    );

    // Hiển thị sản phẩm sau khi lọc
    filteredProducts.forEach(product => {

        productList.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <h3>${product.name}</h3>

                <p class="price">
                    ${product.price.toLocaleString('vi-VN')} đ

                    <span class="old-price">
                        ${product.oldPrice.toLocaleString('vi-VN')} đ
                    </span>
                </p>

                <button onclick="addToCart(${product.id})">
                    Thêm vào giỏ
                </button>

            </div>
        `;
    });
}

// Chạy các hàm khi trang web tải xong
>>>>>>> a61a7b55d67202c21b00110bfcd5b94fae8eb4d9
window.onload = function() {
    renderProducts();
    renderCart(); // Thêm dòng này
    updateCartCount();
};``