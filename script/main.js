/* ==========================================================
   main.js – menangani halaman katalog & checkout sekaligus
   ========================================================== */

/* ---------- 1. UTILITAS ---------- */
function $(selector) {
    return document.querySelector(selector);
  }
  function $all(selector) {
    return document.querySelectorAll(selector);
  }
  
  /* ---------- 2. HALAMAN KATALOG ---------- */
  async function showProductListing() {
    const productList = $("#product-list");
    if (!productList) return; // jaga-jaga kalau selector tak ada
  
    try {
      const res = await fetch("https://fakestoreapi.com/products?limit=8");
      const products = await res.json();
  
      let subtotal = 0;
      productList.innerHTML = "";
  
      products.forEach((p) => {
        subtotal += p.price;
  
        const card = document.createElement("div");
        card.className = "flex items-start gap-4";
  
        card.innerHTML = `
          <img src="${p.image}" alt="${p.title}" class="w-16 h-16 object-contain border" />
          <div class="flex-1">
            <h3 class="font-semibold">${p.title}</h3>
            <p class="text-sm">${p.description.substring(0, 120)}...</p>
            <div class="mt-2 font-bold">$${p.price.toFixed(2)}</div>
            <button
              class="buy-now mt-2 px-4 py-1 bg-blue-600 text-white rounded"
              data-id="${p.id}">
              Buy Now
            </button>
          </div>
        `;
        productList.appendChild(card);
      });
  
      $("#subtotal") && ($("#subtotal").textContent = `$${subtotal.toFixed(2)}`);
      $("#total") && ($("#total").textContent =`$${subtotal.toFixed(2)}`);
  
      // tombol Buy Now
      $all(".buy-now").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
          const id = e.currentTarget.dataset.id;
          const prod = await fetch(`https://fakestoreapi.com/products/${id}).then((r) => r.json()`);
  
          localStorage.setItem("cart", JSON.stringify([prod]));
          window.location.href = "checkout.html";
        });
      });
    } catch (err) {
      console.error("Gagal memuat produk:", err);
    }
  }
  
  /* ---------- 3. HALAMAN CHECKOUT ---------- */
  function showCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const productList = $("#product-list");
    const subtotalEl = $("#subtotal");
    const totalEl = $("#total");
  
    if (!productList) return;
  
    let subtotal = 0;
    productList.innerHTML = "";
  
    cart.forEach((p) => {
      subtotal += p.price;
      productList.innerHTML += `
        <div class="flex items-center gap-4">
          <img src="${p.image}" alt="${p.title}" class="w-16 h-16 object-cover rounded" />
          <div class="flex-1">
            <h3 class="text-md font-semibold">${p.title}</h3>
            <p class="text-sm text-gray-600">${p.description.substring(0, 100)}...</p>
          </div>
          <div class="text-lg font-bold">$${p.price.toFixed(2)}</div>
        </div>
      `;
    });
  
    subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    totalEl.textContent = `$${subtotal.toFixed(2)}`;
  
    const checkoutBtn = $("#checkoutBtn");
    const popup = $("#popup-success");
    if (checkoutBtn && popup) {
      checkoutBtn.addEventListener("click", () => {
        popup.classList.remove("hidden");
        localStorage.removeItem("cart");
      });
    }
  }
  
  /* ---------- 4. DETEKSI HALAMAN & INISIALISASI ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    const isCheckout = $("#checkoutBtn") !== null;
    if (isCheckout) {
      showCheckoutCart(); // halaman checkout
    } else {
      showProductListing(); // halaman katalog
    }
  });

  // Menampilkan popup
function showSuccessPopup() {
  const popup = document.getElementById("successPopup");
  popup.classList.remove("hidden");
}

// Mengarahkan ke halaman home saat klik tombol dalam popup
function goHome() {
  window.location.href = "./home.html"; // ganti sesuai dengan file home kamu
}

// Tambahkan event listener ke tombol checkout
document.addEventListener("DOMContentLoaded", function () {
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function (e) {
      e.preventDefault(); // Mencegah reload form jika ada
      showSuccessPopup();
    });
  }
});