import { ProductResource } from '#resources';
import { ProductService } from '#services';
import Controller from './controller.js';

class ProductController extends Controller {
  service = ProductService;
  resource = ProductResource;

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
   *   const validData = await this.validator(req, res, productCreateRules);
   *   const product = await this.service.create(validData);
   *   if (!product?._id) return this.error({ res, message: 'Failed to create product!' });
   *
   *   const resource = this.resource.make(product);
   *   this.success({ res, message: 'Product created!', resource });
   * };
   */
}

export default new ProductController();
