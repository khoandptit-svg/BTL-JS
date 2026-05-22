// 1. Hàm hiển thị danh sách sản phẩm ra trang chủ
// 1. Hàm hiển thị lại sản phẩm (có thêm onclick)
function renderProducts(data = products) { 
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = ""; 
    
    data.forEach(product => {
        // Tạo chuỗi HTML cho mỗi thẻ sản phẩm
        // Thay đổi onclick thành thẻ <a> trỏ đến trang chi tiết kèm ID
        productList.innerHTML += `
            <div class="product-card">
                <a href="product-detail.html?id=${product.id}" style="text-decoration: none; color: inherit;">
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                </a>
                <p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>`;
    });
}

// 3. Cập nhật số lượng hiển thị trên icon giỏ hàng ở Menu
// Hàm cập nhật số lượng hiển thị trên icon giỏ hàng
function updateCartCount() {
    // Luôn luôn tìm thẻ cart-count mới nhất trên giao diện
    const cartCountEl = document.getElementById('cart-count');
    
    if (cartCountEl) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Tính tổng số lượng
        let total = cart.reduce((sum, item) => sum + item.quantity, 0);
        // Cập nhật số
        cartCountEl.innerText = total;
        console.log("Đã cập nhật giỏ hàng lên số:", total);
    } else {
        console.error("Lỗi: Không tìm thấy thẻ id='cart-count' trên giao diện!");
    }
}

// Hàm addToCart phải gọi updateCartCount sau khi lưu
function addToCart(id) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        alert("Vui lòng đăng nhập để mua hàng!");
        window.location.href = "login.html";
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let itemExisted = cart.find(item => item.id === id);
    
    if (itemExisted) {
        itemExisted.quantity += 1;
    } else {
        cart.push({ id: id, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // GỌI CẬP NHẬT NGAY TẠI ĐÂY
    updateCartCount();
    alert("Đã thêm vào giỏ hàng!");
}


//4. Hàm lọc sản phẩm theo danh mục
function filterProducts(category) {
    // 1. Cập nhật trạng thái nút bấm (đổi màu nút đang chọn)
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 2. Lọc dữ liệu
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

//5. Chức năng tìm kiếm sản phẩm
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;

    const keyword = searchInput.value.trim();
    if (keyword !== "") {
        // Chuyển hướng sang trang search.html kèm theo từ khóa trên URL
        window.location.href = `search.html?query=${encodeURIComponent(keyword)}`;
    }
}

// Gán sự kiện cho nút tìm kiếm
document.getElementById('search-btn')?.addEventListener('click', handleSearch);

// Nhấn Enter cũng tìm kiếm
document.getElementById('search-input')?.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// THÊM 2 DÒNG NÀY ĐỂ CHẠY CHƯƠNG TRÌNH
// Gọi hàm để hiện sản phẩm ngay khi load trang
renderProducts(); 
updateCartCount();



