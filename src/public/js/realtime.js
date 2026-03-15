const socket = io();

function renderProducts(products) {
  const list = document.getElementById('productsList');
  if (!list) return;
  list.innerHTML = '';
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id;
    li.innerHTML = `<strong>${p.title}</strong> — Precio: ${p.price} — ID: ${p.id} <button class="deleteBtn" data-id="${p.id}">Eliminar</button>`;
    list.appendChild(li);
  });
}

socket.on('productsUpdated', (products) => {
  renderProducts(products);
});

document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('deleteBtn')) {
    const id = e.target.dataset.id;
    socket.emit('deleteProduct', id);
  }
});

const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // parse some fields
    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock || '0');
    data.status = data.status === 'true' || data.status === true;
    data.thumbnails = data.thumbnails ? data.thumbnails.split(',').map(s => s.trim()) : [];
    socket.emit('createProduct', data);
    form.reset();
  });
}
