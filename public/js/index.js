/* =====================================================================
   CratoPression — admin products frontend
   This is a STANDALONE frontend demo. It manages products in memory
   (the `products` array below) so the page works on its own.

   --- WIRE UP YOUR OWN BACKEND HERE ---
   Each of the four functions below is where your real API calls go:
     - loadProducts()      -> GET    /products
     - createProduct(data) -> POST   /products
     - updateProduct(data) -> PUT    /products/:id
     - deleteProduct(id)   -> DELETE /products/:id
   Replace the in-memory logic inside each with a fetch() call, then
   call render() (or re-fetch + render) once the request resolves.
   ===================================================================== */

let API_BASE = "https://products-dashboard-xt6c.onrender.com/api/products"

const checkAuthStatus = async () =>{
  let res = await fetch("https://products-dashboard-xt6c.onrender.com/auth/status")
      if(res.ok){
          res = await res.json()
          return res.authenticated
      }
}
let products = [];

// ---- API hook stubs -------------------------------------------------

async function loadProducts() {
  // TODO: replace with `const res = await fetch('/products'); products = await res.json();`
  let res = await fetch("https://products-dashboard-xt6c.onrender.com/api/products")
  let data = await res.json();
  console.log(data)
  data.forEach(product => products.push(product))
  render();
}

async function createProduct(data) {
  // TODO: replace with a real POST request, e.g.:
  // const res = await fetch('/products', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify([data]) });
  const res = await fetch("/api/products", {"method" : "POST",
    "headers" : {"content-type" : "application/json"},
    "body" : JSON.stringify(data)
  })
  if(res.ok){
    let newProduct = await res.json()
    products.push(data)
    render();
  }
}

async function updateProduct(id, data) {
  // TODO: replace with a real PUT/PATCH request to /products/:id
  let res = await fetch(`/api/products/${id}`,
  {
  "method" : "PUT",
  "headers" : {"content-type" : "application/json"},
  "body" : JSON.stringify(data)
  });
  if(res.ok){
      let updatedData = await res.json()
      const idx = products.findIndex(p => p._id === updatedData._id);
      if (idx !== -1) products[idx] = updatedData;
      render()
  }
}

async function deleteProduct(id) {
  // TODO: replace with a real DELETE request to /products/:id
  const res = await fetch("/api/products/" + id,
    {
      "method" : "DELETE",
    }
  )
  let data = await res.json()
  console.log(data)
  if(data.success){
    products = products.filter(p => p._id !== id)
    render()
    // return 
  }
//   render();
}

// ---- Rendering --------------------------------------------------------

const grid = document.getElementById("productGrid");
const emptyState = document.getElementById("emptyState");

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function formatRs(n) {
  return "Rs " + Number(n).toLocaleString("en-PK");
}

function renderStats() {
  document.getElementById("statTotal").textContent = products.length;
  document.getElementById("statDiscounted").textContent = products.filter(p => Number(p.discount) > 0).length;
  const total = products.reduce((sum, p) => sum + Math.max(Number(p.price) - Number(p.discount || 0), 0), 0);
  document.getElementById("statValue").textContent = formatRs(total);
}

function productCardHtml(p) {
  const finalPrice = Math.max(Number(p.price) - Number(p.discount || 0), 0);
  const hasDiscount = Number(p.discount) > 0;

  return `
    <div class="col-12 col-sm-6 col-lg-4" data-id="${p._id}">
      <div class="product-card h-100 d-flex flex-column">
        <div class="price-tag mono">${formatRs(finalPrice)}</div>
        <div class="p-3 pb-2 flex-grow-1">
          <div class="product-name mb-1">${escapeHtml(p.name)}</div>
          <div class="product-qty mb-2">${escapeHtml(p.quantity)}</div>
          ${hasDiscount
            ? `<span class="discount-flag">− ${formatRs(p.discount)} off</span>`
            : `<span class="text-muted" style="font-size:0.78rem;">No discount</span>`}
        </div>
        <div class="card-actions d-flex">
          <button class="btn btn-edit flex-fill py-2" type="button" onclick="openEditModal('${p._id}')">
            Edit
          </button>
          <button class="btn btn-delete flex-fill py-2 border-start" type="button" onclick="openDeleteModal('${p._id}')">
            Delete
          </button>
        </div>
      </div>
    </div>`;
}

const addSlotHtml = `
  <div class="col-12 col-sm-6 col-lg-4">
    <div class="add-slot h-100" tabindex="0" role="button" onclick="openAddModal()"
         onkeydown="if(event.key==='Enter')openAddModal()">
      <div class="plus-ring">+</div>
      <div class="add-label">Add product</div>
    </div>
  </div>`;

function render() {
  if (products.length === 0) {
    grid.innerHTML = addSlotHtml;
    emptyState.classList.remove("d-none");
  } else {
    emptyState.classList.add("d-none");
    grid.innerHTML = products.map(productCardHtml).join("") + addSlotHtml;
  }
  renderStats();
}

// ---- Add / Edit modal ---------------------------------------------------

const productModalEl = document.getElementById("productModal");
const productModal = new bootstrap.Modal(productModalEl);
const productForm = document.getElementById("productForm");
const productModalTitle = document.getElementById("productModalTitle");
const productFormSubmit = document.getElementById("productFormSubmit");

function openAddModal() {
  productForm.reset();
  document.getElementById("productId").value = "";
  productModalTitle.textContent = "Add product";
  productFormSubmit.textContent = "Add product";
  productModal.show();
}

function openEditModal(id) {
  const p = products.find(p => p._id === id);
  if (!p) return;
  document.getElementById("productId").value = p._id;
  document.getElementById("fieldName").value = p.name;
  document.getElementById("fieldQuantity").value = p.quantity;
  document.getElementById("fieldPrice").value = p.price;
  document.getElementById("fieldDiscount").value = p.discount || 0;
  productModalTitle.textContent = "Edit product";
  productFormSubmit.textContent = "Save changes";
  productModal.show();
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("productId").value;
  const data = {
    name: document.getElementById("fieldName").value.trim(),
    quantity: document.getElementById("fieldQuantity").value.trim(),
    price: Number(document.getElementById("fieldPrice").value),
    discount: Number(document.getElementById("fieldDiscount").value || 0),
  };

  if (id) {
    await updateProduct(id, data);
  } else {
    await createProduct(data);
  }
  productModal.hide();
});

// ---- Delete modal ---------------------------------------------------

const deleteModalEl = document.getElementById("deleteModal");
const deleteModal = new bootstrap.Modal(deleteModalEl);
let pendingDeleteId = null;
let delete_id = '';
function openDeleteModal(id) {
  delete_id = id;
  const p = products.find(p => p._id === id);
  if (!p) return;
  pendingDeleteId = id;
  document.getElementById("deleteProductName").textContent = p.name;
  deleteModal.show();
}

document.getElementById("confirmDeleteBtn").addEventListener("click", async () => {
  if (pendingDeleteId !== null) {
    pendingDeleteId = null;
  }
  await deleteProduct(delete_id);
  
  deleteModal.hide();
});

// ---- Init -------------------------------------------------------------
const init = async () => {
  let isAuthenticated = await checkAuthStatus()
  if(!isAuthenticated){
    location.replace("/login.html")
    return
  }

  loadProducts();
}

init()