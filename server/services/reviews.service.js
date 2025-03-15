import { Reviews } from '../models/index.js';
import Service from './service.js';

class ReviewsService extends Service {
  model = Reviews;

  // Add custom methods for Reviews service below
  // For example:
  
  async findByReviewsName(name) {
    return this.getOne({ name });
  }
  
  // You can override base methods or add new ones as needed
}

export default new ReviewsService();
