// Importar el modelo Cart para interactuar con la base de datos
import Cart from '../models/Cart.js';

// Clase CartManager para manejar operaciones relacionadas con carritos de compras
export default class CartManager {
  // Método para obtener todos los carritos con productos poblados
  async getCarts() {
    return await Cart.find().populate('products.product');
  }

  // Método para crear un nuevo carrito vacío
  async createCart() {
    const newCart = new Cart();
    return await newCart.save();
  }

  // Método para obtener un carrito por su ID con productos poblados
  async getCartById(cid) {
    return await Cart.findById(cid).populate('products.product');
  }

  // Método para agregar un producto a un carrito
  async addProductToCart(cid, pid, quantity = 1) {
    const cart = await Cart.findById(cid);
    if (!cart) return null; // Si no existe el carrito, retornar null

    // Buscar si el producto ya está en el carrito
    const productIndex = cart.products.findIndex(p => p.product.toString() === pid);
    if (productIndex > -1) {
      cart.products[productIndex].quantity += quantity; // Incrementar cantidad si ya existe
    } else {
      cart.products.push({ product: pid, quantity }); // Agregar nuevo producto
    }

    return await cart.save(); // Guardar cambios
  }

  // Método para eliminar un producto específico del carrito
  async removeProductFromCart(cid, pid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    // Filtrar el producto a eliminar
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    return await cart.save();
  }

  // Método para actualizar todos los productos del carrito
  async updateCart(cid, products) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    // Reemplazar productos con el nuevo array
    cart.products = products.map(p => ({ product: p.product, quantity: p.quantity }));
    return await cart.save();
  }

  // Método para actualizar la cantidad de un producto específico en el carrito
  async updateProductQuantity(cid, pid, quantity) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    const product = cart.products.find(p => p.product.toString() === pid);
    if (!product) return null; // Si no existe el producto en el carrito, retornar null

    product.quantity = quantity; // Actualizar cantidad
    return await cart.save();
  }

  // Método para vaciar completamente el carrito
  async clearCart(cid) {
    const cart = await Cart.findById(cid);
    if (!cart) return null;

    cart.products = []; // Vaciar array de productos
    return await cart.save();
  }
}
