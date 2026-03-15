// Conectar al servidor Socket.IO
const socket = io();

// Función para renderizar la lista de productos en el DOM
function renderProducts(products) {
  const list = document.getElementById('productsList');
  if (!list) return; // Si no existe el elemento, salir
  list.innerHTML = ''; // Limpiar la lista
  products.forEach(p => {
    const li = document.createElement('li');
    li.dataset.id = p.id; // Almacenar ID en dataset
    li.innerHTML = `<strong>${p.title}</strong> — Precio: ${p.price} — ID: ${p.id} <button class="deleteBtn" data-id="${p.id}">Eliminar</button>`;
    list.appendChild(li); // Agregar elemento a la lista
  });
}

// Escuchar evento de actualización de productos desde el servidor
socket.on('productsUpdated', (products) => {
  renderProducts(products); // Renderizar productos actualizados
});

// Manejar clics en botones de eliminar
document.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('deleteBtn')) {
    const id = e.target.dataset.id; // Obtener ID del producto
    socket.emit('deleteProduct', id); // Emitir evento para eliminar producto
  }
});

// Manejar envío del formulario para crear productos
const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevenir envío por defecto
    const data = Object.fromEntries(new FormData(form).entries()); // Obtener datos del formulario
    // Parsear campos numéricos y booleanos
    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock || '0');
    data.status = data.status === 'true' || data.status === true;
    data.thumbnails = data.thumbnails ? data.thumbnails.split(',').map(s => s.trim()) : []; // Parsear thumbnails
    socket.emit('createProduct', data); // Emitir evento para crear producto
    form.reset(); // Limpiar formulario
  });
}
