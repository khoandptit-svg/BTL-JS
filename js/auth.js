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
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;
    
    if (!user || !pass) {
        alert("Vui lòng nhập đủ thông tin!");
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Kiểm tra tên đăng nhập đã tồn tại chưa
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
    const user = document.getElementById('login-user').value;
    const pass = document.getElementById('login-pass').value;
    
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
    const authLink = document.querySelector('.checkout-nav a[href="login.html"]');

    if (currentUser && authLink) {
        // Nếu đã đăng nhập: Thay chữ "Đăng nhập" bằng tên user và nút Đăng xuất
        authLink.parentElement.innerHTML = `
            <span style="color: #ffeb3b; font-weight: bold;">Chào, ${currentUser.username}</span>
            <a href="#" onclick="handleLogout()" style="margin-left: 15px;">Đăng xuất</a>
            <a href="cart.html">Giỏ hàng</a>
        `;
    }
}

// Hàm xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem('currentUser');
    alert("Bạn đã đăng xuất!");
    window.location.reload(); // Tải lại trang để cập nhật giao diện
}

// Chạy hàm kiểm tra ngay khi trang web tải xong
document.addEventListener('DOMContentLoaded', checkLoginStatus);