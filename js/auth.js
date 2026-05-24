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
    // Kiểm tra trống TRƯỚC
    if (!user || !pass) {
        alert("Vui lòng nhập đủ thông tin!");
        return;
    }
    // Kiểm tra tồn tại TRƯỚC
    let users = JSON.parse(localStorage.getItem('users')) || [];
    // Kiểm tra nếu username đã tồn tại
    if (users.find(u => u.username === user)) {
        alert("Tên đăng nhập đã tồn tại!");
        return;
    }
    // Thêm người dùng mới vào danh sách và lưu lại
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
    // Kiểm tra thông tin đăng nhập với danh sách người dùng đã đăng ký
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const foundUser = users.find(u => u.username === user && u.password === pass);
    // Nếu tìm thấy người dùng, lưu thông tin vào localStorage và chuyển về trang chủ
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
    // Nếu đã đăng nhập, hiển thị tên người dùng và nút đăng xuất; nếu chưa, giữ nguyên giao diện mặc định
    if (navContainer) {
        if (currentUser) {
            navContainer.innerHTML = `
                <span style="color: #fff; font-weight: bold; margin-right: 10px;">Chào, ${currentUser.username}</span>
                <a href="#" onclick="handleLogout()" style="margin-right: 15px; color: #ffeb3b;">Đăng xuất</a>
                <a href="cart.html" id="cart-link">Giỏ hàng (<span id="cart-count">0</span>)</a>
            `;
        // Nếu chưa đăng nhập: vẫn giữ cart-count trong nav mặc định
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
// Hàm xử lý đăng xuất
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Hàm xử lý đăng xuất
function handleLogout() {
    localStorage.removeItem('currentUser');
    alert("Bạn đã đăng xuất!");
    window.location.reload();
}

// Hiện form quên mật khẩu
function showForgotPassword(){

    document.getElementById('login-form').style.display = "none";

    document.getElementById('register-form').style.display = "none";

    document.getElementById('forgot-form').style.display = "block";
}


// Quay lại đăng nhập
function backToLogin(){

    document.getElementById('forgot-form').style.display = "none";

    document.getElementById('login-form').style.display = "block";
}


// Đổi mật khẩu
function resetPassword(){

    const username = document
        .getElementById('forgot-user')
        .value
        .trim();

    const newPassword = document
        .getElementById('new-pass')
        .value
        .trim();

    if(!username || !newPassword){

        alert("Vui lòng nhập đầy đủ thông tin!");

        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Tìm user
    let foundUser = users.find(u => u.username === username);

    if(foundUser){

        foundUser.password = newPassword;

        localStorage.setItem('users', JSON.stringify(users));

        alert("Đổi mật khẩu thành công!");

        backToLogin();

    }else{

        alert("Tên đăng nhập không tồn tại!");
    }
}