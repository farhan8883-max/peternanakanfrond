// auth-check.js
function cekAkses(allowedRole) {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));

        // Jika role tidak sesuai
        if (payload.akses !== allowedRole) {
            alert("Anda tidak memiliki akses ke halaman ini!");
            window.location.href = 'login.html';
        } else {
            // Tampilkan info user
            document.getElementById('userInfo').textContent =
                `Halo, ${payload.username} (email: ${payload.email})`;
            document.getElementById('userAccess').textContent =
                `Akses: ${payload.akses}`;
        }
    } catch (err) {
        console.error("Token tidak valid:", err);
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Logout
document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
});
