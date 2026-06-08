// orders.js - Xử lý trang đơn hàng của tôi

// ===== Lấy key đơn hàng theo user =====
function getOrdersKey() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? `orders_${user.username}` : null;
}

// ===== Render danh sách đơn hàng =====
function renderOrders() {
    const container = document.getElementById('orders-container');
    const key = getOrdersKey();

    if (!key) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="empty-icon">🔐</div>
                <h3>Bạn chưa đăng nhập</h3>
                <p>Vui lòng đăng nhập để xem đơn hàng của bạn.</p>
                <a href="login.html" class="btn-shop">Đăng nhập ngay</a>
            </div>`;
        return;
    }

    const orders = JSON.parse(localStorage.getItem(key)) || [];

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="empty-orders">
                <div class="empty-icon">📭</div>
                <h3>Chưa có đơn hàng nào</h3>
                <p>Hãy khám phá các sản phẩm và đặt hàng ngay hôm nay!</p>
                <a href="index.html" class="btn-shop">Mua sắm ngay</a>
            </div>`;
        return;
    }

    // Hiển thị đơn mới nhất trước
    const sorted = [...orders].reverse();
    container.innerHTML = sorted
        .map((order, idx) => buildOrderCard(order, orders.length - 1 - idx))
        .join('');
}

// ===== Build HTML một thẻ đơn hàng =====
function buildOrderCard(order, realIdx) {
    const statusMap = {
        'processing': { label: 'Đang xử lý',    cls: 'status-processing', icon: '⏳' },
        'shipping':   { label: 'Đang giao hàng', cls: 'status-shipping',   icon: '🚚' },
        'delivered':  { label: 'Đã giao hàng',   cls: 'status-delivered',  icon: '✅' },
        'cancelled':  { label: 'Đã hủy',          cls: 'status-cancelled',  icon: '✕'  },
    };
    const st = statusMap[order.status] || statusMap['processing'];

    // Render từng sản phẩm
    const itemsHTML = order.items.map(item => `
        <div class="order-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-qty">Số lượng: ${item.quantity}</div>
            </div>
            <div class="order-item-price">${(item.price * item.quantity).toLocaleString('vi-VN')} đ</div>
        </div>`).join('');

    // Phương thức thanh toán
    const payLabel = order.paymentMethod || 'Tiền mặt khi nhận hàng';

    // Nút / tag footer theo trạng thái
    let footerAction = '';
    if (order.status === 'processing' || order.status === 'shipping') {
        footerAction = `<button class="btn-cancel-order" onclick="openCancelModal(${realIdx}, '${order.code}')">✕ Hủy đơn hàng</button>`;
    } else if (order.status === 'delivered') {
        footerAction = `<span class="completed-tag">✅ Đã hoàn thành</span>`;
    } else if (order.status === 'cancelled') {
        footerAction = `<span class="cancelled-tag">✕ Đã hủy${order.cancelReason ? ' — ' + order.cancelReason : ''}</span>`;
    }

    const totalClass = order.status === 'cancelled'
        ? 'order-total-value strikethrough'
        : 'order-total-value';

    // Thông tin giao hàng
    const deliveryInfo = order.status === 'delivered'
        ? `<span class="meta-label">Đã giao lúc</span>
           <span class="meta-value">${order.deliveredAt || order.estimatedDelivery || '—'}</span>`
        : `<span class="meta-label">Dự kiến giao</span>
           <span class="meta-value">${order.estimatedDelivery || '—'}</span>`;

    // Lý do hủy (nếu có)
    const cancelRow = (order.status === 'cancelled' && order.cancelReason) ? `
        <div class="meta-row">
            <span class="meta-icon">🚫</span>
            <div class="meta-text">
                <span class="meta-label">Lý do hủy</span>
                <span class="meta-value">${order.cancelReason}</span>
            </div>
        </div>` : '';

    // Ghi chú (nếu có)
    const noteRow = order.note ? `
        <div class="meta-row">
            <span class="meta-icon">📝</span>
            <div class="meta-text">
                <span class="meta-label">Ghi chú</span>
                <span class="meta-value">${order.note}</span>
            </div>
        </div>` : '';

    return `
    <div class="order-card" id="order-card-${realIdx}">
        <div class="order-card-header">
            <div class="order-id-label">
                Mã đơn: <strong>#${order.code}</strong>
                <span style="color:var(--text-muted);font-size:12px;margin-left:10px">📅 ${order.createdAt}</span>
            </div>
            <span class="status-badge ${st.cls}">${st.icon} ${st.label}</span>
        </div>

        <div class="order-card-body">
            <div class="order-items">${itemsHTML}</div>
            <div class="order-meta">
                <div class="meta-row">
                    <span class="meta-icon">👤</span>
                    <div class="meta-text">
                        <span class="meta-label">Người nhận</span>
                        <span class="meta-value">${order.fullname}</span>
                    </div>
                </div>
                <div class="meta-row">
                    <span class="meta-icon">📞</span>
                    <div class="meta-text">
                        <span class="meta-label">Điện thoại</span>
                        <span class="meta-value">${order.phone}</span>
                    </div>
                </div>
                <div class="meta-row">
                    <span class="meta-icon">📍</span>
                    <div class="meta-text">
                        <span class="meta-label">Địa chỉ giao hàng</span>
                        <span class="meta-value">${order.address}</span>
                    </div>
                </div>
                <div class="meta-row">
                    <span class="meta-icon">💳</span>
                    <div class="meta-text">
                        <span class="meta-label">Phương thức thanh toán</span>
                        <span class="meta-value">${payLabel}</span>
                    </div>
                </div>
                <div class="meta-row">
                    <span class="meta-icon">🕐</span>
                    <div class="meta-text">${deliveryInfo}</div>
                </div>
                ${noteRow}
                ${cancelRow}
            </div>
        </div>

        <div class="order-card-footer">
            <div>
                <div class="order-total-label">Tổng cộng đơn hàng</div>
                <div class="${totalClass}">${order.total.toLocaleString('vi-VN')} đ</div>
            </div>
            ${footerAction}
        </div>
    </div>`;
}

// ===== Modal hủy đơn =====
let cancelTargetIdx = null;

function openCancelModal(idx, code) {
    cancelTargetIdx = idx;
    document.getElementById('modal-order-code').textContent = '#' + code;
    document.querySelectorAll('.reason-item').forEach(el => el.classList.remove('selected'));
    document.querySelectorAll('input[name="cancel-reason"]').forEach(r => r.checked = false);
    document.getElementById('cancel-modal-overlay').classList.add('active');
}

function closeCancelModal() {
    document.getElementById('cancel-modal-overlay').classList.remove('active');
    cancelTargetIdx = null;
}

function selectReason(el) {
    document.querySelectorAll('.reason-item').forEach(r => r.classList.remove('selected'));
    el.classList.add('selected');
    el.querySelector('input').checked = true;
}

function confirmCancel() {
    const selected = document.querySelector('input[name="cancel-reason"]:checked');
    if (!selected) {
        alert('Vui lòng chọn lý do hủy đơn!');
        return;
    }

    const key = getOrdersKey();
    if (!key || cancelTargetIdx === null) return;

    let orders = JSON.parse(localStorage.getItem(key)) || [];
    if (orders[cancelTargetIdx]) {
        orders[cancelTargetIdx].status = 'cancelled';
        orders[cancelTargetIdx].cancelReason = selected.value;
        localStorage.setItem(key, JSON.stringify(orders));
    }

    closeCancelModal();
    renderOrders();
}

// ===== Sự kiện =====
document.getElementById('cancel-modal-overlay').addEventListener('click', function(e) {
    if (e.target === this) closeCancelModal();
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCancelModal();
});

// ===== Khởi động =====
document.addEventListener('DOMContentLoaded', function() {
    renderOrders();
    if (typeof updateCartCount === 'function') updateCartCount();
});