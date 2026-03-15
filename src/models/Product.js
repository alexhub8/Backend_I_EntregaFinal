// Importar Mongoose para definir el esquema de la base de datos
import mongoose from 'mongoose';

// Definir el esquema del producto con validaciones
const productSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Título del producto, obligatorio
  description: { type: String, required: true }, // Descripción del producto, obligatorio
  code: { type: String, required: true, unique: true }, // Código único del producto, obligatorio y único
  price: { type: Number, required: true }, // Precio del producto, obligatorio
  status: { type: Boolean, default: true }, // Estado del producto (activo/inactivo), por defecto true
  stock: { type: Number, required: true }, // Cantidad en stock, obligatorio
  category: { type: String, required: true }, // Categoría del producto, obligatorio
  thumbnails: { type: [String], default: [] } // Array de URLs de imágenes, por defecto vacío
}, { timestamps: true }); // Agregar timestamps (createdAt, updatedAt)

// Exportar el modelo Product basado en el esquema
export default mongoose.model('Product', productSchema);