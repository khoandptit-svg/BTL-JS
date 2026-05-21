/* ==========================================================
   SEARCH SCRIPT - KTA SHOP
   Xử lý tìm kiếm sản phẩm và hiển thị kết quả
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lấy từ khóa (query) từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');

    const titleEl = document.getElementById('search-title');
    const resultsContainer = document.getElementById('search-results');

    if (!searchQuery || searchQuery.trim() === "") {
        if (titleEl) titleEl.innerText = "Bạn chưa nhập từ khóa tìm kiếm.";
        return;
    }

    // Hiển thị tiêu đề kết quả
    if (titleEl) titleEl.innerText = `Kết quả tìm kiếm cho: "${searchQuery}"`;

    // 2. Tiến hành lọc sản phẩm
    performSearch(searchQuery.toLowerCase().trim(), resultsContainer);
});

// Hàm lọc và hiển thị
function performSearch(keyword, container) {
    if (!container) return;

    // Kiểm tra xem biến 'products' từ data.js có tồn tại không
    if (typeof products === 'undefined') {
        container.innerHTML = "<p>Lỗi: Không thể kết nối dữ liệu sản phẩm.</p>";
        return;
    }

    // Lọc danh sách (không phân biệt hoa thường)
    const filteredResults = products.filter(product => 
        product.name.toLowerCase().includes(keyword)
    );

    // 3. Render kết quả ra màn hình
    renderItems(filteredResults, container);
}

function renderItems(list, container) {
    container.innerHTML = ""; // Xóa nội dung cũ

    if (list.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 50px;">
                <p>Không tìm thấy sản phẩm nào phù hợp.</p>
                <a href="index.html" style="color: #38a149; font-weight: bold;">Tiếp tục mua sắm</a>
            </div>`;
        return;
    }

    list.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${product.price.toLocaleString('vi-VN')} đ</p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>
        `;
    });
}