document.addEventListener("DOMContentLoaded", async () => {
  const cartItemsEl = document.getElementById("product-list"); // Sesuai HTML Anda
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");

  let products = [];

  // Load cart dari localStorage kalau ada, kembalikan null jika belum ada
  function loadCartFromStorage() {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : null;
  }

  // Simpan cart ke localStorage
  function saveCartToStorage() {
    localStorage.setItem("cart", JSON.stringify(products));
  }

  // Inisialisasi cart: kalau ada data di localStorage, render; kalau tidak, tampilkan pesan "kosong"
  function initializeCart() {
    const stored = loadCartFromStorage();

    if (stored !== null && Array.isArray(stored) && stored.length > 0) {
      products = stored.map((item) => ({
        ...item,
        checked: item.checked !== false, // default ke true
        quantity: item.quantity || 1, // default ke 1
      }));

      renderCartItems();
    } else {
      cartItemsEl.innerHTML = `
        <tr>
          <td colspan="5" class="text-center text-gray-500 py-4">
            Keranjang Anda kosong
          </td>
        </tr>
      `;
      subtotalEl.textContent = "$0.00";
      totalEl.textContent = "$0.00";
    }
  }

  // Render semua item di keranjang
  function renderCartItems() {
    cartItemsEl.innerHTML = ""; // Kosongkan dulu

    products.forEach((product, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100";

      tr.innerHTML = `
        <td class="p-3 text-center">
          <input
            type="checkbox"
            ${product.checked ? "checked" : ""}
            class="w-5 h-5 cursor-pointer"
            data-index="${index}"
          />
        </td>
        <td class="p-3 flex items-center gap-3">
          <img
            src="${product.image}"
            alt="${product.title}"
            class="w-12 h-12 object-contain"
          />
          <span class="font-semibold text-sm">${product.title}</span>
        </td>
        <td class="p-3 font-semibold">${formatPrice(product.price)}</td>
        <td class="p-3 text-center">
          <select
            class="border border-gray-300 rounded px-2 py-1 text-center quantity-select"
            data-index="${index}"
          >
            ${[...Array(10)]
              .map((_, i) => {
                const val = i + 1;
                return `<option value="${val}" ${
                  val === product.quantity ? "selected" : ""
                }>${val}</option>`;
              })
              .join("")}
          </select>
        </td>
        <td
          class="p-3 text-center cursor-pointer text-gray-600 hover:text-red-600"
          data-remove="${index}"
          title="Remove"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </td>
      `;

      cartItemsEl.appendChild(tr);
    });

    attachEventListeners();
    updateTotals();
  }

  // Pasang event listener: checkbox, dropdown quantity, dan tombol remove
  function attachEventListeners() {
    // Checkbox item
    cartItemsEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        products[idx].checked = e.target.checked;
        saveCartToStorage();
        updateTotals();
      });
    });

    // Dropdown quantity
    cartItemsEl.querySelectorAll(".quantity-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        products[idx].quantity = parseInt(e.target.value, 10);
        saveCartToStorage();
        updateTotals();
      });
    });

    // Tombol remove item
    cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.remove, 10);
        products.splice(idx, 1);
        saveCartToStorage();
        renderCartItems();
      });
    });
  }

  // Hitung dan tampilkan subtotal & total
  function updateTotals() {
    let subtotal = 0;

    products.forEach((p) => {
      if (p.checked && !isNaN(p.price) && !isNaN(p.quantity)) {
        subtotal += p.price * p.quantity;
      }
    });

    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal); // Asumsi ongkir = 0
  }

  // Format angka jadi "$xx.xx"
  function formatPrice(num) {
    return `$${num.toFixed(2)}`;
  }

  // Event listener untuk tombol checkout
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    const checkedProducts = products.filter((p) => p.checked);
    let total = 0;

    checkedProducts.forEach((p) => {
      if (!isNaN(p.price) && !isNaN(p.quantity)) {
        total += p.price * p.quantity;
      }
    });

    if (checkedProducts.length === 0) {
      alert("Keranjang kosong! Silakan pilih produk terlebih dahulu.");
      return;
    }

    // Tampilkan popup sukses
    document.getElementById("successPopup").classList.remove("hidden");
  });

  // Jalankan inisialisasi
  initializeCart();
});
