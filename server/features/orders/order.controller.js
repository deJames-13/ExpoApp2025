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

    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    try {
      const searchQuery = req.query.q?.trim();
      const searchRegex = searchQuery ? new RegExp(searchQuery, 'i') : null;

      const pipeline = [];

      // Apply filter (example: only own user's orders)
      if (user.role !== ROLES.ADMIN) {
        pipeline.push({ $match: { user: user._id } });
      }

      // Join user data
      pipeline.push({
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      });

      pipeline.push({ $unwind: '$user' });

      // Search conditions
      if (searchRegex) {
        pipeline.push({
          $match: {
            $or: [
              { status: searchRegex },
              { 'user.username': searchRegex },
              { 'user.email': searchRegex },
            ]
          }
        });
      }

      // Sort by creation date
      pipeline.push({ $sort: { createdAt: -1 } });

      // Pagination
      pipeline.push({ $skip: skip }, { $limit: limit });

      // Execute aggregation
      const data = await this.service.model.aggregate(pipeline);
      const total = await this.service.model.aggregate([...pipeline.slice(0, -2), { $count: 'count' }]);
      const count = total[0]?.count || 0;

      const message = data.length ? 'Data collection fetched!' : 'No data found!';
      const resource = (await this.resource?.collection(data)) || data;

      this.success({
        res,
        message,
        resource,
        meta: {
          limit,
          page,
          total: count,
          count: data.length
        }
      });
    } catch (error) {
      console.error('Error in getAll:', error);
      return this.error({
        res,
        message: 'Error retrieving orders',
        statusCode: 500,
        error
      });
    }
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
