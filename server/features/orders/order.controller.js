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

    // Reset the query before building it
    this.service.query = null;

    // Apply the base filter
    this.service.applyForceFilter();

    // Add search functionality
    if (req.query.q && req.query.q.trim() !== '') {
      const searchQuery = req.query.q.trim();
      const searchRegex = new RegExp(searchQuery, 'i'); // Case insensitive search

      // First, we need to populate the user field to search within it
      this.service.query = this.service.query.populate({
        path: 'user',
        select: 'username email info.first_name info.last_name info.contact'
      });

      // Now add the search conditions using $or operator
      this.service.query = this.service.query.find({
        $or: [
          { status: searchRegex },
          // We'll use aggregation style matching for the populated fields
          { 'user.username': searchRegex },
          { 'user.email': searchRegex },
          { 'user.info.first_name': searchRegex },
          { 'user.info.last_name': searchRegex },
          { 'user.info.contact': searchRegex }
        ]
      });
    }

    const meta = await this.service._getMeta(req.query);

    // Apply sort after all other conditions
    this.service.query = this.service.query.sort({ createdAt: -1 });

    const data = await this.service.paginate(meta).exec();
    const message = data.length ? 'Data collection fetched!' : 'No data found!';

    console.log('Search results count:', data?.length);
    console.log('Query params:', req.query);

    const resource = (await this.resource?.collection(data)) || data;
    this.success({ res, message, resource, meta: { ...meta, count: data.length } });
  };

  getById = async (req, res) => {
    try {
      // Check if ID is provided
      if (!req.params.id) {
        return this.error({ res, message: 'Order ID is required', statusCode: 400 });
      }

      // Check if user is authenticated
      const { user } = req;
      if (!user?._id) {
        return this.error({ res, message: 'User not authenticated', statusCode: 401 });
      }

      // If user is not admin, set the filter to only show their orders
      if (user.role !== ROLES.ADMIN) {
        this.service.setUserId(user._id);
      }

      // Try to get the order with proper error handling
      let data;
      try {
        data = await this.service.getById(req.params.id);
      } catch (serviceError) {
        console.error('Order service error:', serviceError);
        return this.error({
          res,
          message: 'Error retrieving order',
          statusCode: 500,
          error: serviceError
        });
      }
      if (Array.isArray(data)) {
        data = data[0];
      }


      // Check if order exists
      if (!data || !data._id) {
        return this.error({ res, message: 'Order not found', statusCode: 404 });
      }

      // Try to transform the order resource
      let resource;
      try {
        resource = await this.resource.make(data);
      } catch (resourceError) {
        console.error('Resource transformation error:', resourceError);
        return this.error({
          res,
          message: 'Error processing order data',
          statusCode: 500,
          error: resourceError
        });
      }

      return this.success({ res, message: 'Order fetched successfully', resource });
    } catch (error) {
      console.error('Unhandled error in getById:', error);
      return this.error({
        res,
        message: 'Unexpected error while fetching order details',
        statusCode: 500,
        error
      });
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
