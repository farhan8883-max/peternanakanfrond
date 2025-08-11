const API_URL = 'http://localhost:3000'; // sesuaikan API-mu

document.getElementById('loginForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) {
    alert('Username dan password harus diisi');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({username, password})
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Login gagal');
      return;
    }

    const token = data.token;
    localStorage.setItem('token', token);

    // Fungsi decode token untuk baca isi (payload)
    function parseJwt(token) {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join(''));
      return JSON.parse(jsonPayload);
    }

    const user = parseJwt(token);

    // Arahkan sesuai akses user
    if (user.akses === 'admin') {
      window.location.href = 'dashboard_admin.html';
    } else if (user.akses === 'petugas') {
      window.location.href = 'dashboard_petugas.html';
    } else if (user.akses === 'peternak') {
      window.location.href = 'dashboard_peternak.html';
    } else {
      alert('Role user tidak dikenal');
      localStorage.removeItem('token');
    }

  } catch (error) {
    alert('Terjadi kesalahan saat login');
    console.error(error);
  }
});


