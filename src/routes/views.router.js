// Importar Router de Express y gestores de productos y carritos
import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Ruta GET para la página principal con productos paginados
router.get("/", async (req, res) => {
  // Extraer parámetros de consulta para paginación
  const { limit, page, sort, query } = req.query;
  const options = {
    limit: limit ? parseInt(limit) : 10,
    page: page ? parseInt(page) : 1,
    sort,
    query: query ? JSON.parse(query) : undefined
  };
  const result = await productManager.getProducts(options);
  // Renderizar vista home con productos y datos de paginación
  res.render("home", {
    products: result.payload,
    pagination: {
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink
    }
  });
});

// Ruta GET para la página de productos (similar a home)
router.get("/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;
  const options = {
    limit: limit ? parseInt(limit) : 10,
    page: page ? parseInt(page) : 1,
    sort,
    query: query ? JSON.parse(query) : undefined
  };
  const result = await productManager.getProducts(options);
  res.render("home", {
    products: result.payload,
    pagination: {
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.prevLink,
      nextLink: result.nextLink
    }
  });
});

// Ruta GET para mostrar detalles de un producto específico
router.get("/products/:pid", async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) {
    res.render("productDetail", { product }); // Renderizar vista de detalle
  } else {
    res.status(404).render("error", { message: "Producto no encontrado" }); // Error 404
  }
});

// Ruta GET para mostrar un carrito específico
router.get("/carts/:cid", async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) {
    res.render("cart", { cart }); // Renderizar vista del carrito
  } else {
    res.status(404).render("error", { message: "Carrito no encontrado" }); // Error 404
  }
});

// Ruta GET para la página de productos en tiempo real
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getProducts();
  res.render("realTimeProducts", { products: products.payload }); // Renderizar vista con productos
});

// Exportar el router
export default router;
