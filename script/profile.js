document.addEventListener("DOMContentLoaded", () => {
  const profileBtn = document.getElementById("profileBtn");
  const profilePopup = document.getElementById("profilePopup");
  const overlay = document.getElementById("overlay");
  const logoutBtn = document.getElementById("logoutBtn");

  // Tampilkan popup dan overlay
  profileBtn.addEventListener("click", () => {
    profilePopup.classList.remove("hidden");
    overlay.classList.remove("hidden");
    profilePopup.classList.add("flex"); // Agar bisa flex-box center
  });

  // Sembunyikan popup dan overlay
  overlay.addEventListener("click", () => {
    profilePopup.classList.add("hidden");
    overlay.classList.add("hidden");
    profilePopup.classList.remove("flex");
  });

  // Log out dan redirect
  logoutBtn.addEventListener("click", () => {
    alert("Berhasil log out");
    window.location.href = "login.html"; // Ganti sesuai halaman login kamu
  });
});
