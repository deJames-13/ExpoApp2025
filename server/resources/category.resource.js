import Resource from './resource.js';

export default class CategoryResource extends Resource {
  transform(category) {
    return {
      id: category._id,
      name: category.name,
      createdAt: this.formatDate(category.createdAt),
      // Add more fields to transform as needed
    };
  }
}
