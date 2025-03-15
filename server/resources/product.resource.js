import Resource from './resource.js';

export default class ProductResource extends Resource {
  transform(product) {
    return {
      id: product._id,
      name: product.name,
      createdAt: this.formatDate(product.createdAt),
      // Add more fields to transform as needed
    };
  }
}
