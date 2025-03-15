import Resource from './resource.js';

export default class NotificationsResource extends Resource {
  transform(notifications) {
    return {
      id: notifications._id,
      name: notifications.name,
      createdAt: this.formatDate(notifications.createdAt),
      // Add more fields to transform as needed
    };
  }
}
