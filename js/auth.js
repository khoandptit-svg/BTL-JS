// auth.js - Xử lý đăng nhập, đăng ký, đăng xuất

// ===== Hash mật khẩu bằng SHA-256 (Web Crypto API) =====
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);// Chuyển chuỗi sang Uint8Array
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);// Tạo hash SHA-256
    const hashArray = Array.from(new Uint8Array(hashBuffer));// Chuyển ArrayBuffer sang mảng byte
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // Chuyển sang chuỗi hex
}

// ===== Chuyển đổi giữa form Đăng nhập / Đăng ký =====
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

// ===== Đăng Ký =====
async function handleRegister() {
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

    // Lưu mật khẩu đã hash thay vì plaintext
    const hashedPass = await hashPassword(pass);
    users.push({ username: user, password: hashedPass });
    localStorage.setItem('users', JSON.stringify(users));
    alert("Đăng ký thành công! Hãy đăng nhập.");
    toggleAuth();
}

// ===== Đăng Nhập =====
async function handleLogin() {
    const user = document.getElementById('login-user').value.trim();
    const pass = document.getElementById('login-pass').value.trim();

    if (!user || !pass) {
        alert("Vui lòng nhập thông tin đăng nhập!");
        return;
    }

    //: So sánh với mật khẩu đã hash trong localStorage
    const hashedPass = await hashPassword(pass);
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.username === user && u.password === hashedPass);

    if (foundUser) {
        localStorage.setItem('currentUser', JSON.stringify({ username: foundUser.username }));
        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
    } else {
        alert("Sai tên đăng nhập hoặc mật khẩu!");
    }
}

// ===== Kiểm tra trạng thái đăng nhập & cập nhật Header =====
// JSON.parse để lấy username thay vì chỉ lấy chuỗi (JSON.parse sẽ trả về object { username: "..." })
function checkLoginStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navContainer = document.querySelector('.checkout-nav');

    if (navContainer) {
        if (currentUser) {
            navContainer.innerHTML = `
                <span style="color: #fff; font-weight: bold; margin-right: 10px;">Chào, ${currentUser.username}</span>
                <a href="orders.html" id="orders-link">Đơn hàng</a>
                <a href="#" onclick="handleLogout()" style="color: #ffeb3b;">Đăng xuất</a>
                <a href="cart.html" id="cart-link">Giỏ hàng (<span id="cart-count">0</span>)</a>
            `;
        } else {
            // Chưa đăng nhập: đảm bảo cart-count có span
            const cartLink = navContainer.querySelector('#cart-link');
            if (cartLink && !cartLink.querySelector('#cart-count')) {
                cartLink.innerHTML = `Giỏ hàng (<span id="cart-count">0</span>)`;
            }
        }

        // Cập nhật số lượng sau khi nav render xong
        requestAnimationFrame(() => {
            if (typeof updateCartCount === "function") updateCartCount();
        });
    }
}

document.addEventListener('DOMContentLoaded', checkLoginStatus);

// ===== Đăng Xuất =====
// Xoá currentUser khi đăng xuất và reload trang để cập nhật header
function handleLogout() {
    localStorage.removeItem('currentUser');
    alert("Bạn đã đăng xuất!");
    window.location.reload();
}

// ===== Quên mật khẩu =====
// Hiển thị form quên mật khẩu
function showForgotPassword() {
    document.getElementById('login-form').style.display = "none";
    document.getElementById('register-form').style.display = "none";
    document.getElementById('forgot-form').style.display = "block";
}

// Quay lại form đăng nhập
function backToLogin() {
    document.getElementById('forgot-form').style.display = "none";
    document.getElementById('login-form').style.display = "block";
}

//Đổi mật khẩu cũng hash trước khi lưu
async function resetPassword() {
    const username = document.getElementById('forgot-user').value.trim();
    const newPassword = document.getElementById('new-pass').value.trim();

    if (!username || !newPassword) {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }
    // Tìm người dùng và cập nhật mật khẩu đã hash
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let foundUser = users.find(u => u.username === username);
    // Nếu tìm thấy, cập nhật mật khẩu đã hash và lưu lại vào localStorage
    if (foundUser) {
        foundUser.password = await hashPassword(newPassword);
        localStorage.setItem('users', JSON.stringify(users));
        alert("Đổi mật khẩu thành công!");
        backToLogin();
    } else {
        alert("Tên đăng nhập không tồn tại!");
    }
}