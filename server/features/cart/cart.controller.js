import { Controller } from '#lib';
import CartResource from './cart.resource.js';
import CartService from './cart.service.js';

class CartController extends Controller {
  service = CartService;
  resource = CartResource;

  getAll = async (req, res) => {
    const { user } = req;
    this.service.setUserId(user._id);

    const meta = await this.service._getMeta(req.query);
    const data = await this.service.paginate(meta).exec();
    const message = data.length ? 'Data collection fetched!' : 'No data found!';

    const resource = (await this.resource?.collection(data)) || data;
    this.success({ res, message, resource, meta: { ...meta, count: data.length } });
  };

  store = async (req, res) => {
    const validData = await this.service.validate(req.body);
    if (validData.error) return this.error({ res, message: validData.error });

    // Check if this product already exists in the user's cart
    const existingItem = await this.service.findExistingCartItem(
      validData.product,
      req.user._id
    );

    let data;
    let message = 'Request successful!';

    if (existingItem) {
      // If exists, increment the quantity and update total
      const newQuantity = existingItem.quantity + validData.quantity;
      const newTotal = (existingItem.price || 0) * newQuantity;

      data = await this.service.update(existingItem._id, {
        quantity: newQuantity,
        total: newTotal
      });

      message = 'Cart updated! Quantity increased for existing item.';
    } else {
      // If not exists, create a new cart item
      data = await this.service.updateOrCreate(validData, req.user);
    }

    if (!data?._id) return this.error({ res, message: 'Invalid data!' });

    const resource = await this.resource?.make(data);
    this.success({ res, message, resource });
  };

  delete = async (req, res) => {
    const data = await this.service?.delete(req.params.id);
    if (!data?._id) return this.error({ res, message: `Data with ID: ${req.params.id} not found.` });

    this.success({ res, message: 'Data deleted!' });
  };

  clear = async (req, res) => {
    const data = await this.service?.clear();
    if (!data) return this.error({ res, message: 'No data found!' });

    this.success({ res, message: 'Data deleted!' });
  };

  getById = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    // Set the user ID to ensure proper filtering
    this.service.setUserId(user._id);

    // Find the cart item by ID
    const data = await this.service.findById(id);

    // Return error if not found
    if (!data?._id) {
      return this.error({
        res,
        message: `Cart item with ID: ${id} not found.`,
        statusCode: 404
      });
    }

    // Transform and return the cart item
    const resource = await this.resource?.make(data);
    this.success({ res, message: 'Cart item fetched successfully!', resource });
  };

  // Add this new method to handle direct updates
  update = async (req, res) => {
    const { id } = req.params;
    const { user } = req;

    // Set the user ID for filtering
    this.service.setUserId(user._id);

    // Get the original cart item
    const originalItem = await this.service.findById(id);
    if (!originalItem?._id) {
      return this.error({
        res,
        message: `Cart item with ID: ${id} not found.`,
        statusCode: 404
      });
    }

    // Validate the update data
    const updateData = req.body;

    // Ensure quantity is valid
    if (updateData.quantity) {
      const quantity = Number(updateData.quantity);
      if (isNaN(quantity) || quantity < 1) {
        return this.error({
          res,
          message: 'Invalid quantity value',
          statusCode: 400
        });
      }

      // Check product stock if needed
      if (updateData.product) {
        const validData = await this.service.validate({
          product: updateData.product,
          quantity
        });

        if (validData.error) {
          return this.error({ res, message: validData.error });
        }
      }
    }

    // Update the cart item
    const data = await this.service.update(id, updateData);
    if (!data?._id) {
      return this.error({ res, message: 'Failed to update cart item' });
    }

    const resource = await this.resource?.make(data);
    this.success({ res, message: 'Cart item updated successfully', resource });
  };

}

export default new CartController();
