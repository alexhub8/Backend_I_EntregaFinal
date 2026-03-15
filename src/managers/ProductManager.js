// Importar el modelo Product para interactuar con la base de datos
import Product from '../models/Product.js';

// Clase ProductManager para manejar operaciones relacionadas con productos
export default class ProductManager {
  // Método para obtener productos con opciones de paginación, filtros y ordenamiento
  async getProducts(options = {}) {
    // Extraer opciones de consulta
    const { limit = 10, page = 1, sort, query } = options;
    const filter = {};

    // Aplicar filtros si se proporcionan
    if (query) {
      if (query.category) {
        filter.category = query.category; // Filtrar por categoría
      }
      if (query.status !== undefined) {
        filter.status = query.status; // Filtrar por estado
      }
    }

    // Configurar opciones de ordenamiento
    const sortOption = {};
    if (sort === 'asc') {
      sortOption.price = 1; // Orden ascendente por precio
    } else if (sort === 'desc') {
      sortOption.price = -1; // Orden descendente por precio
    }

    // Calcular total de productos y páginas
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;
    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    // Obtener productos con paginación y ordenamiento
    const products = await Product.find(filter)
      .sort(sortOption)
      .limit(limit)
      .skip((page - 1) * limit);

    // Construir enlaces de navegación
    const baseUrl = '/api/products';
    const prevLink = hasPrevPage ? `${baseUrl}?page=${prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${JSON.stringify(query)}` : ''}` : null;
    const nextLink = hasNextPage ? `${baseUrl}?page=${nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${JSON.stringify(query)}` : ''}` : null;

    // Retornar objeto con resultados y metadatos de paginación
    return {
      status: 'success',
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink
    };
  }

  // Método para obtener un producto por su ID
  async getProductById(id) {
    return await Product.findById(id);
  }

  // Método para agregar un nuevo producto
  async addProduct(product) {
    const newProduct = new Product(product);
    return await newProduct.save();
  }

  // Método para actualizar un producto existente
  async updateProduct(id, updatedFields) {
    return await Product.findByIdAndUpdate(id, updatedFields, { new: true });
  }

  // Método para eliminar un producto por su ID
  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}
