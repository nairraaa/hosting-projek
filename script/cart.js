document.addEventListener("DOMContentLoaded", () => {
  const cartItemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  const totalEl = document.getElementById("total");
  let products = [];

  const formatPrice = (num) => `$${num.toFixed(2)}`;

  const loadCartFromStorage = () => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  };

  const saveCartToStorage = () => {
    localStorage.setItem("cart", JSON.stringify(products));
  };

  const showEmptyCartMessage = () => {
    cartItemsEl.innerHTML = `
      <tr>
        <td colspan="5" class="text-center text-gray-500 py-4">
          Keranjang Anda kosong
        </td>
      </tr>
    `;
    subtotalEl.textContent = "$0.00";
    totalEl.textContent = "$0.00";
  };

  const renderCartItems = () => {
    cartItemsEl.innerHTML = "";
    products.forEach((product, index) => {
      const tr = document.createElement("tr");
      tr.className = "border-b border-gray-100";
      const itemTotal = product.price * product.quantity;
      tr.innerHTML = `
        <td class="p-3 text-center">
          <input type="checkbox" ${
            product.checked ? "checked" : ""
          } data-index="${index}" class="w-5 h-5 cursor-pointer" />
        </td>
        <td class="p-3 flex items-center gap-3">
          <img src="${product.image}" alt="${
        product.title
      }" class="w-12 h-12 object-contain" />
          <span class="font-semibold text-sm">${product.title}</span>
        </td>
        <td class="p-3 font-semibold">${formatPrice(product.price)}</td>
        <td class="p-3 text-center">
          <select data-index="${index}" class="border border-gray-300 rounded px-2 py-1 quantity-select">
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
        <td class="p-3 text-center cursor-pointer text-gray-600 hover:text-red-600" data-remove="${index}" title="Hapus">
          🗑️
        </td>
      `;
      cartItemsEl.appendChild(tr);
    });
    attachEventListeners();
    updateTotals();
  };

  const attachEventListeners = () => {
    // Checkbox toggle
    cartItemsEl.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        products[idx].checked = e.target.checked;
        saveCartToStorage();
        updateTotals();
      });
    });
    // Quantity change
    cartItemsEl.querySelectorAll(".quantity-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const idx = parseInt(e.target.dataset.index, 10);
        products[idx].quantity = parseInt(e.target.value, 10);
        saveCartToStorage();
        updateTotals();
      });
    });
    // Remove item
    cartItemsEl.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.remove, 10);
        products.splice(idx, 1);
        saveCartToStorage();
        products.length ? renderCartItems() : showEmptyCartMessage();
      });
    });
  };

  const updateTotals = () => {
    let subtotal = 0;
    products.forEach((item) => {
      if (item.checked && !isNaN(item.price) && !isNaN(item.quantity)) {
        subtotal += item.price * item.quantity;
      }
    });
    subtotalEl.textContent = formatPrice(subtotal);
    totalEl.textContent = formatPrice(subtotal);
  };

  const initializeCart = () => {
    const stored = loadCartFromStorage();
    console.log("Cart data:", stored);
    if (stored.length) {
      products = stored.map((item) => ({
        ...item,
        checked: item.checked !== false,
        quantity: item.quantity || 1,
      }));
      renderCartItems();
    } else {
      showEmptyCartMessage();
    }
  };

  // Expose addToCart for product detail pages
  window.addToCart = (productData) => {
    const cart = loadCartFromStorage();
    const existing = cart.find((item) => item.id === productData.id);
    if (existing) {
      existing.quantity += productData.quantity || 1;
    } else {
      cart.push({
        id: productData.id,
        title: productData.title,
        image: productData.image,
        price: parseFloat(productData.price),
        quantity: productData.quantity || 1,
        checked: true,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    products = cart;
    renderCartItems();
    alert(`${productData.title} telah ditambahkan ke keranjang!`);
  };

  initializeCart();
});
