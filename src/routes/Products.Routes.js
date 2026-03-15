// Importar Router de Express y ProductManager
import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const manager = new ProductManager();

// Ruta GET para obtener productos con paginación, filtros y ordenamiento
router.get("/", async (req, res) => {
  // Extraer parámetros de consulta
  const { limit, page, sort, query } = req.query;
  const options = {
    limit: limit ? parseInt(limit) : 10, // Límite de productos por página, por defecto 10
    page: page ? parseInt(page) : 1, // Página actual, por defecto 1
    sort, // Ordenamiento: 'asc' o 'desc'
    query: query ? JSON.parse(query) : undefined // Filtros de consulta
  };
  const result = await manager.getProducts(options);
  res.json(result); // Retornar resultado con paginación
});

// Ruta GET para obtener un producto específico por ID
router.get("/:pid", async (req, res) => {
  const product = await manager.getProductById(req.params.pid);
  product
    ? res.json(product) // Retornar producto si existe
    : res.status(404).json({ error: "Producto no encontrado" }); // Error 404 si no existe
});

// Ruta POST para crear un nuevo producto
router.post("/", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    // Emitir actualización en tiempo real a través de Socket.IO
    const io = req.app.get('io');
    if (io) {
      const products = await manager.getProducts();
      io.emit('productsUpdated', products.payload);
    }
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Ruta PUT para actualizar un producto existente
router.put("/:pid", async (req, res) => {
  const updated = await manager.updateProduct(req.params.pid, req.body);
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "Producto no encontrado" });
});

// Ruta DELETE para eliminar un producto
router.delete("/:pid", async (req, res) => {
  const deleted = await manager.deleteProduct(req.params.pid);
  if (deleted) {
    // Emitir actualización en tiempo real
    const io = req.app.get('io');
    if (io) {
      const products = await manager.getProducts();
      io.emit('productsUpdated', products.payload);
    }
    res.json({ message: "Producto eliminado", product: deleted });
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

// Exportar el router
export default router;
