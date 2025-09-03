async function fetchProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");
    const products = await res.json();
    const grid = document.getElementById("product-grid");

    if (!grid) {
      console.error("Elemen #product-grid tidak ditemukan!");
      return;
    }

    products.forEach((product) => {
      const rating = product.rating?.rate || 0;
      const rounded = Math.round(rating);

      const card = document.createElement("div");
      card.className =
        "relative group bg-white border shadow-sm hover:shadow-lg transition p-4 rounded-lg product-card";

      card.innerHTML = `
        <a href="detail.html?id=${
          product.id
        }" class="block h-full w-full pointer-events-auto">
          <img src="${product.image}" alt="${
        product.title
      }" class="w-full h-60 object-contain mb-4" />
          <h3 class="text-sm font-medium mb-2 truncate product-title">${
            product.title
          }</h3>
          <p class="text-gray-600 text-sm mb-2 product-price">$${product.price.toFixed(
            2
          )}</p>
          <div class="text-yellow-400 text-sm flex items-center">
            ${"★".repeat(rounded)}${"☆".repeat(5 - rounded)}
            <span class="ml-2 text-gray-500 text-xs">(${rating.toFixed(
              1
            )})</span>
          </div>
        </a>

        <button class="absolute bottom-4 right-4 bg-white border border-zinc-300 rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 
        hover:bg-zinc-200 transition z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300" 
        title="Add to cart" aria-label="Add to cart">
          <i class="fas fa-shopping-cart text-gray-600"></i>
        </button>
      `;

      const cartButton = card.querySelector("button");
      cartButton.addEventListener("click", (e) => {
        e.preventDefault(); // cegah link
        e.stopPropagation(); // cegah bubbling ke <a>

        addToCart(product);

        // Alert langsung
        alert("✅ Berhasil dimasukkan ke keranjang!");
      });

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Gagal mengambil produk:", error);
  }
}

// ======= Tambah ke Keranjang =======
function addToCart(productData) {
  const product = {
    id: productData.id,
    title: productData.title,
    image: productData.image,
    price: parseFloat(productData.price),
    quantity: 1,
  };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(product);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// ======= Update Badge Keranjang =======
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = totalCount;
}

// ======= Toast Notifikasi =======
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className =
      "fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50 transition-opacity duration-300 opacity-0";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.remove("opacity-0");
  toast.classList.add("opacity-100");

  setTimeout(() => {
    toast.classList.remove("opacity-100");
    toast.classList.add("opacity-0");
  }, 2000);
}

// ======= Saat DOM Siap =======
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
  updateCartCount();
});
