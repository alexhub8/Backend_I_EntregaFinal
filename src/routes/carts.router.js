// Importar Router de Express y CartManager
import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const manager = new CartManager();

// Ruta POST para crear un nuevo carrito vacío
router.post("/", async (req, res) => {
  const cart = await manager.createCart();
  res.status(201).json(cart);
});

// Ruta GET para obtener un carrito específico por ID
router.get("/:cid", async (req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  cart
    ? res.json(cart)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Ruta POST para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { quantity = 1 } = req.body;
  const cart = await manager.addProductToCart(req.params.cid, req.params.pid, quantity);
  cart
    ? res.status(201).json(cart)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Ruta DELETE para eliminar un producto específico del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const cart = await manager.removeProductFromCart(req.params.cid, req.params.pid);
  cart
    ? res.json(cart)
    : res.status(404).json({ error: "Carrito o producto no encontrado" });
});

// Ruta PUT para actualizar todos los productos del carrito
router.put("/:cid", async (req, res) => {
  const cart = await manager.updateCart(req.params.cid, req.body.products);
  cart
    ? res.json(cart)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Ruta PUT para actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const cart = await manager.updateProductQuantity(req.params.cid, req.params.pid, req.body.quantity);
  cart
    ? res.json(cart)
    : res.status(404).json({ error: "Carrito o producto no encontrado" });
});

// Ruta DELETE para vaciar completamente el carrito
router.delete("/:cid", async (req, res) => {
  const cart = await manager.clearCart(req.params.cid);
  cart
    ? res.json(cart)
    : res.status(404).json({ error: "Carrito no encontrado" });
});

// Exportar el router
export default router;
