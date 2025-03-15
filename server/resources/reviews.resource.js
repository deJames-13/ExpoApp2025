import Resource from './resource.js';

export default class ReviewsResource extends Resource {
  transform(reviews) {
    return {
      id: reviews._id,
      name: reviews.name,
      createdAt: this.formatDate(reviews.createdAt),
      // Add more fields to transform as needed
    };
  }
}
