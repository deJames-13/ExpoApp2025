import { CartResource } from '#resources';
import { CartService } from '#services';
import Controller from './controller.js';
import { cartCreateRules, cartUpdateRules } from '../validations/cart.validation.js';


class CartController extends Controller {
  service = CartService;
  resource = CartResource;
  rules = {
    create: cartCreateRules,
    update: cartUpdateRules,
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
   *   const validData = await this.validator(req, res, cartCreateRules);
   *   const cart = await this.service.create(validData);
   *   if (!cart?._id) return this.error({ res, message: 'Failed to create cart!' });
   *
   *   const resource = this.resource.make(cart);
   *   this.success({ res, message: 'Cart created!', resource });
   * };
   */
}

export default new CartController();
