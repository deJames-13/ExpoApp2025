import { OrdersResource } from '#resources';
import { OrdersService } from '#services';
import Controller from './controller.js';
import { ordersCreateRules, ordersUpdateRules } from '../validations/orders.validation.js';


class OrdersController extends Controller {
  service = OrdersService;
  resource = OrdersResource;
  rules = {
    create: ordersCreateRules,
    update: ordersUpdateRules,
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
   *   const validData = await this.validator(req, res, ordersCreateRules);
   *   const orders = await this.service.create(validData);
   *   if (!orders?._id) return this.error({ res, message: 'Failed to create orders!' });
   *
   *   const resource = this.resource.make(orders);
   *   this.success({ res, message: 'Orders created!', resource });
   * };
   */
}

export default new OrdersController();
