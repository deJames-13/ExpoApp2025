import { ROLES } from '#common';
import { Controller } from '#lib';
import OrderResource from './order.resource.js';
import OrderService from './order.service.js';

class OrderController extends Controller {
  service = OrderService;
  resource = OrderResource;

  getAll = async (req, res) => {
    const { user } = req;
    if (!user?._id) return this.error({ res, message: 'User not found!' });
    if (user.role !== ROLES.ADMIN)
      this.service.setUserId(user._id);

    if (!req.query.limit) req.query.limit = 10;
    if (!req.query.page) req.query.page = 1;
    const meta = await this.service._getMeta(req.query);

    this.service.query = this.service.model.find(this.service.forceFilter)
      .sort({ createdAt: -1 });

    const data = await this.service.paginate(meta).exec();
    const message = data.length ? 'Data collection fetched!' : 'No data found!';

    const resource = (await this.resource?.collection(data)) || data;
    this.success({ res, message, resource, meta: { ...meta, count: data.length } });
  };

  getById = async (req, res) => {
    try {
      const data = await this.service.getById(req.params.id);
      if (!data?._id) return this.error({ res, message: 'Order not found!' });

      // Use the resource transformation from OrderResource
      const resource = await this.resource.make(data);
      this.success({ res, message: 'Data fetched!', resource });
    } catch (error) {
      return this.error({ res, message: 'Failed to fetch order details', error });
    }
  };

  store = async (req, res) => {
    const order = await this.service.create(req.body);
    if (!order?.id) return this.error({ res, message: 'Order not created' });

    const resource = await this.resource.make(order);
    this.success({ res, message: 'Order created successfully!', resource });
  };
  update = async (req, res) => {
    const order = await this.service.update(req.body);
    if (!order?.id) return this.error({ res, message: 'Order not updated' });

    const resource = await this.resource.make(order);
    this.success({ res, message: 'Order updated successfully!', resource });
  };
}
export default new OrderController();
