import { Cart } from '../models/index.js';
import Service from './service.js';

class CartService extends Service {
  model = Cart;

  // Add custom methods for Cart service below
  // For example:
  
  async findByCartName(name) {
    return this.getOne({ name });
  }
  
  // You can override base methods or add new ones as needed
}

export default new CartService();
