import { Product } from '../models/index.js';
import Service from './service.js';

class ProductService extends Service {
  model = Product;

  // Add custom methods for Product service below
  // For example:
  
  async findByProductName(name) {
    return this.getOne({ name });
  }
  
  // You can override base methods or add new ones as needed
}

export default new ProductService();
