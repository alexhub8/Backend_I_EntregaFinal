// Importaciones necesarias para el servidor
import express from "express";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import mongoose from "mongoose";
import productsRouter from "./routes/Products.Routes.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;

// Conectar a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/backend_entrega_final')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Middleware para parsear JSON y datos de formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar el motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Servir archivos estáticos desde la carpeta public
app.use(express.static("src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

// Crear servidor HTTP y configurar Socket.IO para comunicación en tiempo real
const server = createServer(app);
const io = new IOServer(server);

// Hacer disponible el objeto io en las rutas
app.set("io", io);

// Instanciar el gestor de productos para los manejadores de sockets
const manager = new ProductManager();

// Configurar eventos de Socket.IO
io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  // Enviar productos actuales al conectarse
  const products = await manager.getProducts();
  socket.emit("productsUpdated", products.payload);

  // Evento para crear un nuevo producto
  socket.on("createProduct", async (data) => {
    try {
      await manager.addProduct(data);
      const updated = await manager.getProducts();
      io.emit("productsUpdated", updated.payload);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  // Evento para eliminar un producto
  socket.on("deleteProduct", async (id) => {
    try {
      await manager.deleteProduct(id);
      const updated = await manager.getProducts();
      io.emit("productsUpdated", updated.payload);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
