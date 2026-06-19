// search.js - Xử lý tìm kiếm sản phẩm

document.addEventListener('DOMContentLoaded', () => {
    // Lấy từ khóa tìm kiếm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('query');
    const titleEl = document.getElementById('search-title');
    const resultsContainer = document.getElementById('search-results');

    // Xử lý tìm kiếm tiếp theo từ trang search
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', () => {
            const kw = searchInput.value.trim();
            if (kw) window.location.href = `search.html?query=${encodeURIComponent(kw)}`;
        });
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const kw = searchInput.value.trim();
                if (kw) window.location.href = `search.html?query=${encodeURIComponent(kw)}`;
            }
        });
    }
    // Nếu không có từ khóa, hiển thị thông báo
    if (!searchQuery || searchQuery.trim() === "") {
        if (titleEl) titleEl.innerText = "Bạn chưa nhập từ khóa tìm kiếm.";
        return;
    }
    // Hiển thị tiêu đề tìm kiếm và kết quả
    if (titleEl) titleEl.innerText = `Kết quả tìm kiếm cho: "${searchQuery}"`;
    performSearch(searchQuery.toLowerCase().trim(), resultsContainer);

    updateCartCount();
});

// Hiển thị kết quả tìm kiếm
function performSearch(keyword, container) {
    if (!container) return;
    if (typeof products === 'undefined') {
        container.innerHTML = "<p>Lỗi: Không thể kết nối dữ liệu sản phẩm.</p>";
        return;
    }
    // Lọc sản phẩm theo từ khóa
    const filteredResults = products.filter(product =>
        product.name.toLowerCase().includes(keyword)
    );
    renderItems(filteredResults, container);
}

// Render danh sách sản phẩm ra HTML
function renderItems(list, container) {
    container.innerHTML = "";
    if (list.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding: 50px;">
                <p style="font-size:18px; color:#666;">Không tìm thấy sản phẩm nào phù hợp.</p>
                <a href="index.html" style="color: #38a149; font-weight: bold;">← Tiếp tục mua sắm</a>
            </div>`;
        return;
    }
    list.forEach(product => {
        container.innerHTML += `
            <div class="product-card">
                ${product.oldPrice ? `<span class="discount-badge">-${Math.round((1 - product.price/product.oldPrice)*100)}%</span>` : ''}
                <img src="${product.image}" alt="${product.name}" onclick="openProductModal(${product.id})" style="cursor:pointer;">
                <h3>${product.name}</h3>
                <p class="price">
                    ${product.price.toLocaleString('vi-VN')} đ
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toLocaleString('vi-VN')} đ</span>` : ''}
                </p>
                <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
            </div>`;
    });
}