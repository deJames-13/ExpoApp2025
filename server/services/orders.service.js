import { Orders } from '../models/index.js';
import Service from './service.js';

class OrdersService extends Service {
  model = Orders;

  // Add custom methods for Orders service below
  // For example:
  
  async findByOrdersName(name) {
    return this.getOne({ name });
  }
  
  // You can override base methods or add new ones as needed
}

export default new OrdersService();
