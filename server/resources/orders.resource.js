import Resource from './resource.js';

export default class OrdersResource extends Resource {
  transform(orders) {
    return {
      id: orders._id,
      name: orders.name,
      createdAt: this.formatDate(orders.createdAt),
      // Add more fields to transform as needed
    };
  }
}
