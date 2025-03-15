import Resource from './resource.js';

export default class CartResource extends Resource {
  transform(cart) {
    return {
      id: cart._id,
      name: cart.name,
      createdAt: this.formatDate(cart.createdAt),
      // Add more fields to transform as needed
    };
  }
}
