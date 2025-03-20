import { Controller } from '#lib';
import NotificationResource from './notification.resource.js';
import NotificationService from './notification.service.js';

class NotificationController extends Controller {
  service = NotificationService;
  resource = NotificationResource;
  
  sendNotification = async (req, res) => {
    const {type, ...message} = req.body
    const result = await this.service.sendNotification(message);

    this.success({
      res,
      message: "Notification sent.",
      success: true,
      type
    })

  }


}
export default new NotificationController();
