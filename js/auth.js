// Chuyển đổi giữa Đăng nhập và Đăng ký
function toggleAuth() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
}

// Xử lý Đăng Ký
function handleRegister() {
    const user = document.getElementById('reg-user').value.trim();
    const pass = document.getElementById('reg-pass').value.trim();
    
    if (!user || !pass) {
        alert("Vui lòng nhập đủ thông tin!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    if (users.find(u => u.username === user)) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
    }

    users.push({ username: user, password: pass });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Đăng ký thành công! Hãy đăng nhập.");
    toggleAuth();
}

// Xử lý Đăng Nhập
function handleLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    // Kiểm tra trống TRƯỚC
    if (!user || !pass) {
        alert("Vui lòng nhập thông tin đăng nhập!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.username === user && u.password === pass);

    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

// Hàm kiểm tra trạng thái đăng nhập và cập nhật giao diện Header
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navContainer = document.querySelector('.checkout-nav');

    if (navContainer) {
        if (currentUser) {
            navContainer.innerHTML = `
                <span style="color: #fff; font-weight: bold; margin-right: 10px;">Chào, ${currentUser.username}</span>
                <a href="#" onclick="handleLogout()" style="margin-right: 15px; color: #ffeb3b;">Đăng xuất</a>
                <a href="cart.html" id="cart-link">Giỏ hàng (<span id="cart-count">0</span>)</a>
            `;
        } else {
            // Chưa đăng nhập: vẫn giữ cart-count trong nav mặc định
            const cartCountEl = navContainer.querySelector('#cart-count');
            if (!cartCountEl) {
                const cartLink = navContainer.querySelector('#cart-link');
                if (cartLink) cartLink.innerHTML = `Giỏ hàng (<span id="cart-count">0</span>)`;
            }
        }

        // Luôn cập nhật số lượng sau khi nav đã render xong
        requestAnimationFrame(() => {
            if (typeof updateCartCount === "function") updateCartCount();
        });
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Hàm xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem('currentUser');
    alert("Bạn đã đăng xuất!");
    window.location.reload();
}