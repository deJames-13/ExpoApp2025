import { Resource } from '#lib';
export default class NotificationResource extends Resource {
  transform(notification) {
    const { _id, ...rest } = notification;
    return {
      id: _id,
      ...rest,
    };
  }
}
