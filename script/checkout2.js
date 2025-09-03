document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkoutBtn");
  const successPopup = document.getElementById("successPopup");

  // Ambil data produk dari localStorage
  const data = JSON.parse(localStorage.getItem("checkoutProduct"));

  if (!data) {
    productList.innerHTML = `<p class="text-gray-500">Produk tidak tersedia.</p>`;
    subtotalEl.textContent = "$0";
    totalEl.textContent = "$0";
    checkoutBtn.disabled = true;
    checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
    return;
  }

  // Hitung subtotal & tampilkan produk
  const subtotal = data.price * data.quantity;

  productList.innerHTML = `
      <div class="flex items-center gap-4 p-4 border rounded-md">
        <img src="${data.image}" alt="${
    data.title
  }" class="w-20 h-20 object-contain" />
        <div class="flex-1">
          <h4 class="font-semibold">${data.title}</h4>
          <p class="text-sm">Quantity: ${data.quantity}</p>
          <p class="text-sm text-gray-700">$${data.price.toFixed(2)} x ${
    data.quantity
  } = $${subtotal.toFixed(2)}</p>
        </div>
      </div>
    `;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  totalEl.textContent = `$${subtotal.toFixed(2)}`;

  // Ketika tombol checkout diklik
  checkoutBtn.addEventListener("click", (e) => {
    e.preventDefault();
    // Tampilkan popup sukses
    successPopup.classList.remove("hidden");

    // Hapus produk dari localStorage setelah checkout
    localStorage.removeItem("checkoutProduct");
  });
});
