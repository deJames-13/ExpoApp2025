import { Category } from '../models/index.js';
import Service from './service.js';

class CategoryService extends Service {
  model = Category;

  // Add custom methods for Category service below
  // For example:
  
  async findByCategoryName(name) {
    return this.getOne({ name });
  }
  
  // You can override base methods or add new ones as needed
}

export default new CategoryService();
