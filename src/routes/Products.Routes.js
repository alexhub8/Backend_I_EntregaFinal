import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager("../data/Products.json");

router.get("/", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
});

router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product
    ? res.json(product)
    : res.status(404).json({ error: "Producto no encontrado" });
});

router.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    const io = req.app.get('io');
    if (io) {
      const products = await manager.getProducts();
      io.emit('productsUpdated', products);
    }
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "Producto no encontrado" });
});

router.delete("/:pid", async (req, res) => {
  const deleted = await manager.deleteProduct(req.params.pid);
  deleted
    ? (async () => {
        const io = req.app.get('io');
        if (io) {
          const products = await manager.getProducts();
          io.emit('productsUpdated', products);
        }
        return res.json({ message: "Producto eliminado", product: deleted });
      })()
    : res.status(404).json({ error: "Producto no encontrado" });
});

export default router;
