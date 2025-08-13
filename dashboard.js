
  const API_URL = "http://localhost:3000"; // ganti sesuai port backend
  // cekAkses('admin');

  const burger = document.getElementById('burgerMenu');
  const menuNav = document.getElementById('menuNav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menuNav.classList.toggle('active');
  });
  function openModal(id) {
  document.getElementById(id).style.display = 'block';
}

// ==================logout===========//

// Pastikan script ini dijalankan setelah elemen button ada di DOM
document.getElementById("logout").addEventListener("click", function () {
  // Konfirmasi dulu kalau mau keluar
  if (confirm("Yakin ingin logout?")) {
    // Hapus token / data sesi (sesuaikan key-nya)
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Bisa juga bersihkan sessionStorage
    sessionStorage.clear();

    // Redirect ke halaman login
    window.location.href = "index.html";
  }
});


// Fungsi tutup modal
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
}

// Tutup modal jika klik di luar kotak
window.onclick = function(event) {
  document.querySelectorAll('.modal').forEach(m => {
    if (event.target == m) {
      m.style.display = 'none';
    }
  });
}

   // =================== USER ===================
    // Ambil element modal dan form
const userModal = document.getElementById("modalUser");
const userForm = document.getElementById("userForm");
const userModalTitle = document.getElementById("userModalTitle");
const userFormBtn = document.getElementById("userFormBtn");

// Fetch users tetap sama
async function fetchUsers() {
  const res = await fetch(`${API_URL}/user`);
  const data = await res.json();
  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";
  data.forEach(user => {
    tbody.innerHTML += `
      <tr>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.hp}</td>
        <td>
          <button onclick='editUser(${JSON.stringify(user)})'>Edit</button>
          <button onclick="deleteUser(${user.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

// Open modal tambah user
function openUserModal() {
  editingUserId = null;
  userModalTitle.textContent = "Tambah User";
  userFormBtn.textContent = "Tambah";
  userForm.reset();
  userModal.style.display = "block";
}

// Edit user -> isi modal
function editUser(user) {
  editingUserId = user.id;
  userModalTitle.textContent = "Edit User";
  userFormBtn.textContent = "Update";

  // Isi form
  document.getElementById("username").value = user.username;
  document.getElementById("password").value = ""; // kosongkan password, opsional
  document.getElementById("email").value = user.email;
  document.getElementById("hp").value = user.hp;
  document.getElementById("akses").value = user.akses || "";

  userModal.style.display = "block";
}

// Submit form user (Tambah / Update)
async function submitUserForm(event) {
  event.preventDefault();

  const form = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value,
    email: document.getElementById("email").value,
    hp: document.getElementById("hp").value,
    akses: document.getElementById("akses").value,
  };

  if (editingUserId) {
    // Update user
    await fetch(`${API_URL}/user/${editingUserId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  } else {
    // Tambah user
    await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  }

  userModal.style.display = "none";
  fetchUsers();
}

// Delete tetap sama
async function deleteUser(id) {
  await fetch(`${API_URL}/user/${id}`, { method: "DELETE" });
  fetchUsers();
}

// Tutup modal
function closeUserModal() {
  userModal.style.display = "none";
  editingUserId = null;
}

// =================== TERNAK ===================
function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function loadTernakToForm(ternak) {
  document.getElementById("nama_peternak").value = ternak.nama_peternak || "";
  document.getElementById("id_peternak").value = ternak.id_peternak || "";
  document.getElementById("tanggal_kejadian").value = ternak.tanggal_kejadian || "";
  document.getElementById("jenis_laporan").value = ternak.jenis_laporan || "";
  document.getElementById("jumlah_ternak").value = ternak.jumlah_ternak || "";
  document.getElementById("lokasi_kejadian").value = ternak.lokasi_kejadian || "";
  document.getElementById("keterangan").value = ternak.keterangan || "";

  editingId = ternak.id;

  document.querySelector("#formTernakBtn").textContent = "Update";
  document.getElementById("modalTitle").textContent = "Edit Ternak";

  openModal("modalTernak");
}

async function fetchTernak() {
  const res = await fetch(`${API_URL}/ternak`);
  const data = await res.json();
  const tbody = document.querySelector("#ternakTable tbody");
  tbody.innerHTML = "";
  data.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.nama_peternak || "-"}</td>
        <td>${t.id_peternak || 0}</td>
        <td>${t.tanggal_kejadian}</td>
        <td>${t.jenis_laporan}</td>
        <td>${t.jumlah_ternak || 0}</td>
        <td>${t.lokasi_kejadian}</td>
        <td>${t.keterangan}</td>
        <td>
          <button onclick='loadTernakToForm(${JSON.stringify(t)})'>Edit</button>
          <button onclick="deleteTernak(${t.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

async function addTernak() {
  const form = {
    nama_peternak: document.getElementById("nama_peternak").value,
    id_peternak: document.getElementById("id_peternak").value,
    tanggal_kejadian: document.getElementById("tanggal_kejadian").value,
    jenis_laporan: document.getElementById("jenis_laporan").value,
    jumlah_ternak: document.getElementById("jumlah_ternak").value,
    lokasi_kejadian: document.getElementById("lokasi_kejadian").value,
    keterangan: document.getElementById("keterangan").value
  };

  if (editingId) {
    await fetch(`${API_URL}/ternak/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    editingId = null;
    document.querySelector("#formTernakBtn").textContent = "Tambah";
    document.getElementById("modalTitle").textContent = "Tambah Ternak";
  } else {
    await fetch(`${API_URL}/ternak`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
  }

  // Bersihkan form
  document.querySelectorAll("#nama_peternak, #id_peternak, #tanggal_kejadian, #jenis_laporan, #jumlah_ternak, #lokasi_kejadian, #keterangan").forEach(input => input.value = "");

  closeModal("modalTernak");
  fetchTernak();
}

    async function deleteTernak(id) {
      await fetch(`${API_URL}/ternak/${id}`, { method: "DELETE" });
      fetchTernak();
    }

    function editTernak(id) {
      alert(`Edit ternak ID ${id}`);
    }

// =================checklist==========//

async function fetchChecklist() {
  const res = await fetch(`${API_URL}/checklist`);
  const data = await res.json();
  const tbody = document.querySelector("#checklistTable tbody");
  tbody.innerHTML = "";
  
  data.forEach(c => {
    tbody.innerHTML += `
      <tr>
        <td>${c.id}</td>
        <td>${c.nama_peternak}</td>
        <td>${c.jumlah_ternak}</td>
        <td>${c.lokasi_kejadian}</td>
        <td>${c.nama_petugas}</td>
        <td>${c.status}</td>
        <td>
          <button onclick='loadChecklistToForm(${JSON.stringify(c)})'>Edit</button>
          <button onclick="deleteChecklist(${c.id})">Delete</button>
        </td>
      </tr>
    `;
  });
}

function loadChecklistToForm(c) {
  editingChecklistId = c.id;

  document.getElementById("edit_id_ternak").value = c.id_ternak;
  document.getElementById("edit_nama_petugas").value = c.nama_petugas;
  document.getElementById("edit_id_petugas").value = c.id_petugas;
  document.getElementById("edit_id_laporan").value = c.id_laporan;
  document.getElementById("edit_check_lokasi").value = c.check_lokasi;
  document.getElementById("edit_check_sesuai_jumlah").value = c.check_sesuai_jumlah;
  document.getElementById("edit_check_ada_foto").value = c.check_ada_foto;
  document.getElementById("edit_check_lengkap").value = c.check_lengkap;
  document.getElementById("edit_status").value = c.status;
  document.getElementById("edit_catatan_petugas").value = c.catatan_petugas;
  document.getElementById("edit_fotoLama").value = c.foto || "";

  // buka modal
  document.getElementById("editChecklistModal").style.display = "block";
}


    async function addChecklist() {
      const form = {
        id_ternak: document.getElementById("id_ternak").value,
        nama_petugas: document.getElementById("nama_petugas").value,
        id_petugas: document.getElementById("id_petugas").value,
        id_laporan: document.getElementById("id_laporan").value,
        check_lokasi: document.getElementById("check_lokasi").value,
        check_sesuai_jumlah: document.getElementById("check_sesuai_jumlah").value,
        check_ada_foto: document.getElementById("check_ada_foto").value,
        check_lengkap: document.getElementById("check_lengkap").value,
        status: document.getElementById("status").value,
        catatan_petugas: document.getElementById("catatan_petugas").value
      };
      await fetch(`${API_URL}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      fetchChecklist();
    }

    async function deleteChecklist(id) {
      await fetch(`${API_URL}/checklist/${id}`, { method: "DELETE" });
      fetchChecklist();
    }

    function loadChecklistToForm(c) {
  editingChecklistId = c.id;

  document.getElementById("edit_id_ternak").value = c.id_ternak;
  document.getElementById("edit_nama_petugas").value = c.nama_petugas;
  document.getElementById("edit_id_petugas").value = c.id_petugas;
  document.getElementById("edit_id_laporan").value = c.id_laporan;
  document.getElementById("edit_check_lokasi").value = c.check_lokasi;
  document.getElementById("edit_check_sesuai_jumlah").value = c.check_sesuai_jumlah;
  document.getElementById("edit_check_ada_foto").value = c.check_ada_foto;
  document.getElementById("edit_check_lengkap").value = c.check_lengkap;
  document.getElementById("edit_status").value = c.status;
  document.getElementById("edit_catatan_petugas").value = c.catatan_petugas;
  document.getElementById("edit_fotoLama").value = c.foto || "";

  document.getElementById("editChecklistModal").style.display = "block";
}

function closeEditModal() {
  document.getElementById("editChecklistModal").style.display = "none";
  editingChecklistId = null;
}

async function updateChecklist() {
  const formData = new FormData();
  formData.append("id_ternak", document.getElementById("edit_id_ternak").value);
  formData.append("nama_petugas", document.getElementById("edit_nama_petugas").value);
  formData.append("id_petugas", document.getElementById("edit_id_petugas").value);
  formData.append("id_laporan", document.getElementById("edit_id_laporan").value);
  formData.append("check_lokasi", document.getElementById("edit_check_lokasi").value);
  formData.append("check_sesuai_jumlah", document.getElementById("edit_check_sesuai_jumlah").value);
  formData.append("check_ada_foto", document.getElementById("edit_check_ada_foto").value);
  formData.append("check_lengkap", document.getElementById("edit_check_lengkap").value);
  formData.append("status", document.getElementById("edit_status").value);
  formData.append("catatan_petugas", document.getElementById("edit_catatan_petugas").value);

  const fotoFile = document.getElementById("edit_foto").files[0];
  if (fotoFile) {
    formData.append("foto", fotoFile);
  } else if (document.getElementById("edit_fotoLama").value) {
    formData.append("foto", document.getElementById("edit_fotoLama").value);
  }

  await fetch(`${API_URL}/checklist/${editingChecklistId}`, {
    method: "PUT",
    body: formData
  });

  closeEditModal();
  fetchChecklist();
}

    function editChecklist(id) {
      alert(`Edit checklist ID ${id}`);
    }

// =================== INIT ===================

// ==============section================= //

// Fungsi untuk menampilkan section tertentu
function showSection(id) {
  // Ambil semua section
  const sections = document.querySelectorAll("section");
  
  // Hapus class active dari semua section
  sections.forEach(sec => sec.classList.remove("active"));
  
  // Aktifkan section yang dipilih jika ada
  const activeSection = document.getElementById(id);
  if(activeSection) {
    activeSection.classList.add("active");
  }
}

// =========== export ke exel ======

function exportTableToExcel(tableID, filename = '') {
  let downloadLink;
  const dataType = 'application/vnd.ms-excel';
  const tableSelect = document.getElementById(tableID);
  const tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
  
  filename = filename ? filename + '.xls' : 'data.xls';

  // Buat link download
  downloadLink = document.createElement("a");
  document.body.appendChild(downloadLink);

  if (navigator.msSaveOrOpenBlob) {
    // Untuk IE
    const blob = new Blob(['\ufeff', tableHTML], { type: dataType });
    navigator.msSaveOrOpenBlob(blob, filename);
  } else {
    // Browser lain
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    downloadLink.download = filename;
    downloadLink.click();
  }
}


function exportTernak() {
  const table = document.getElementById("ternakTable").cloneNode(true); // Clone biar tabel asli aman
  
  // Hapus kolom "Aksi" (asumsi kolom terakhir)
  table.querySelectorAll("tr").forEach(row => {
    if (row.cells.length > 0) {
      row.deleteCell(row.cells.length - 1);
    }
  });

  // Buat array data dari tabel
  const rows = Array.from(table.querySelectorAll("tr")).map(row =>
    Array.from(row.querySelectorAll("th, td")).map(cell => cell.innerText)
  );

  // Opsional: ubah urutan kolom kalau mau
  // Misalnya urutan sesuai Excel kamu: Nama Peternak, ID Peternak, Tanggal, Jenis, Jumlah, Lokasi, Keterangan
  const reorderedRows = rows.map(row => [
    row[0], // Nama Peternak
    row[1], // ID Peternak
    row[2], // Tanggal Kejadian
    row[3], // Jenis Laporan
    row[4], // Jumlah Ternak
    row[5], // Lokasi Kejadian
    row[6]  // Keterangan
  ]);

  // Convert ke worksheet
  const ws = XLSX.utils.aoa_to_sheet(reorderedRows);

  // Buat workbook dan simpan
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "DataTernak");
  XLSX.writeFile(wb, "DataTernak.xlsx");
}


// ======angka=======
// ===== dashboard.js =====
async function loadDashboard() {
  const [usersRes, ternakRes, checklistRes] = await Promise.all([
    fetch(`${API_URL}/user`),
    fetch(`${API_URL}/ternak`),
    fetch(`${API_URL}/checklist`)
  ]);

  const [users, ternak, checklist] = await Promise.all([
    usersRes.json(),
    ternakRes.json(),
    checklistRes.json()
  ]);

  // Tampilkan ringkasan
  document.getElementById("totalUsers").textContent = ` ${users.length}`;
  document.getElementById("totalTernak").textContent = ` ${ternak.length}`;
  document.getElementById("totalChecklist").textContent = ` ${checklist.length}`;

}

loadDashboard();




// Set section awal yang aktif, misal User
showSection('ternakSection');

fetchUsers();
fetchTernak();
fetchChecklist();
