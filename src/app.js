import express from "express";
import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import { engine } from "express-handlebars";
import productsRouter from "./routes/Products.Routes.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import ProductManager from "./managers/ProductManager.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("src/public"));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const server = createServer(app);
const io = new IOServer(server);

// expose io to routes via app
app.set("io", io);

// instantiate a manager for socket handlers
const manager = new ProductManager("./src/data/Products.json");

io.on("connection", async (socket) => {
  console.log("Nuevo cliente conectado");
  // send current products on connect
  const products = await manager.getProducts();
  socket.emit("productsUpdated", products);

  socket.on("createProduct", async (data) => {
    try {
      await manager.addProduct(data);
      const updated = await manager.getProducts();
      io.emit("productsUpdated", updated);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });

  socket.on("deleteProduct", async (id) => {
    try {
      await manager.deleteProduct(id);
      const updated = await manager.getProducts();
      io.emit("productsUpdated", updated);
    } catch (err) {
      socket.emit("error", err.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
