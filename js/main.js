// 1. Hàm hiển thị danh sách sản phẩm ra trang chủ
// 1. Hàm hiển thị lại sản phẩm (có thêm onclick)
function renderProducts() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    productList.innerHTML = ""; 
    products.forEach(product => {
        productList.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" onclick="openProductModal(${product.id})" style="cursor:pointer">
                <h3 onclick="openProductModal(${product.id})" style="cursor:pointer">${product.name}</h3>
                <p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>`;
    });
}

// 2. Hàm mở bảng nhỏ
function openProductModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    let modal = document.getElementById('product-modal');
    if(!modal) return;

    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-name').innerText = product.name;
    document.getElementById('modal-price').innerText = product.price.toLocaleString('vi-VN') + " đ";
    document.getElementById('modal-desc').innerText = product.description || "Chưa có mô tả";
    
    // Gán sự kiện cho nút thêm vào giỏ ngay trong modal
    // Thêm dòng này để điều khiển nút trong bảng nhỏ
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.onclick = function() {
        addToCart(product.id);
    };

    modal.style.display = "block";
}

// 3. Hàm đóng bảng
function closeModal() {
    document.getElementById('product-modal').style.display = "none";
}

// 2. Hàm xử lý thêm vào giỏ hàng (Đã cập nhật kiểm tra đăng nhập)
function addToCart(id) {
    // BƯỚC 1: KIỂM TRA TRẠNG THÁI ĐĂNG NHẬP
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Nếu chưa đăng nhập, thông báo và đẩy sang trang login
        alert("Vui lòng đăng nhập để có thể mua hàng!");
        window.location.href = "login.html";
        return; // Thoát hàm ngay lập tức, không chạy code phía dưới
    }

    // BƯỚC 2: XỬ LÝ THÊM HÀNG (Nếu đã đăng nhập)
    // Lấy giỏ hàng từ LocalStorage hoặc tạo mới nếu chưa có
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
    let itemExisted = cart.find(item => item.id === id);
    
    if (itemExisted) {
        // Nếu có rồi thì tăng thêm 1
        itemExisted.quantity += 1;
    } else {
        // Nếu chưa có thì thêm mới với số lượng là 1
        cart.push({ id: id, quantity: 1 });
    }
    
    // Gọi hàm cập nhật số lượng hiển thị trên icon giỏ hàng ở header
    updateCartCount();

    // BƯỚC 3: LƯU LẠI VÀ CẬP NHẬT GIAO DIỆN
    localStorage.setItem('cart', JSON.stringify(cart));
    alert("Sản phẩm đã được thêm vào giỏ hàng thành công!");
    
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



