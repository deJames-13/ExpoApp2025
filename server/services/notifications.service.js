import { Notifications } from '../models/index.js';
import Service from './service.js';

class NotificationsService extends Service {
  model = Notifications;

  // Add custom methods for Notifications service below
  // For example:
  
  async findByNotificationsName(name) {
    return this.getOne({ name });
  }
  
  // You can override base methods or add new ones as needed
}

export default new NotificationsService();
