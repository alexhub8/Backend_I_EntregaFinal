# Backend I: Desarrollo Avanzado de Backend

## Entrega Final

Este proyecto es la entrega final del curso de Backend I, que implementa un sistema de gestión de productos y carritos de compras utilizando Node.js, Express, MongoDB y Socket.IO.

### Características principales:
- **Persistencia en MongoDB**: Los productos y carritos se almacenan en una base de datos MongoDB.
- **API RESTful**: Endpoints para gestionar productos y carritos.
- **Paginación y filtros**: La API de productos soporta paginación, filtros por categoría/estado y ordenamiento por precio.
- **Tiempo real**: Actualizaciones en tiempo real usando Socket.IO.
- **Vistas**: Interfaz web con Handlebars para visualizar productos y carritos.

### Tecnologías utilizadas:
- Node.js
- Express.js
- MongoDB con Mongoose
- Socket.IO
- Handlebars
- HTML/CSS/JavaScript

### Instalación y ejecución:
1. Instalar dependencias: `npm install`
2. Asegurarse de que MongoDB esté corriendo en localhost:27017
3. Ejecutar el servidor: `npm start`
4. Acceder a http://localhost:8080 en el navegador