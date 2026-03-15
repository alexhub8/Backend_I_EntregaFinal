// Importar Mongoose para definir el esquema de la base de datos
import mongoose from 'mongoose';

// Definir el esquema del carrito de compras
const cartSchema = new mongoose.Schema({
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Referencia al ID del producto, obligatorio
    quantity: { type: Number, required: true, default: 1 } // Cantidad del producto en el carrito, obligatorio, por defecto 1
  }]
}, { timestamps: true }); // Agregar timestamps (createdAt, updatedAt)

// Exportar el modelo Cart basado en el esquema
export default mongoose.model('Cart', cartSchema);