import { NotificationsResource } from '#resources';
import { NotificationsService } from '#services';
import Controller from './controller.js';
import { notificationsCreateRules, notificationsUpdateRules } from '../validations/notifications.validation.js';


class NotificationsController extends Controller {
  service = NotificationsService;
  resource = NotificationsResource;
  rules = {
    create: notificationsCreateRules,
    update: notificationsUpdateRules,
  }

  /**
   * You can add custom methods or override existing methods from the base Controller class here.
   * 
   * The base Controller already provides:
   * - getAll(): Fetches all records
   * - getById(): Fetches a record by ID
   * 
   * Example of overriding or adding a method:
   * 
   * create = async (req, res) => {
   *   const validData = await this.validator(req, res, notificationsCreateRules);
   *   const notifications = await this.service.create(validData);
   *   if (!notifications?._id) return this.error({ res, message: 'Failed to create notifications!' });
   *
   *   const resource = this.resource.make(notifications);
   *   this.success({ res, message: 'Notifications created!', resource });
   * };
   */
}

export default new NotificationsController();
