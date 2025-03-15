import { CategoryResource } from '#resources';
import { CategoryService } from '#services';
import Controller from './controller.js';
import { categoryCreateRules, categoryUpdateRules } from '../validations/category.validation.js';


class CategoryController extends Controller {
  service = CategoryService;
  resource = CategoryResource;
  rules = {
    create: categoryCreateRules,
    update: categoryUpdateRules,
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
   *   const validData = await this.validator(req, res, categoryCreateRules);
   *   const category = await this.service.create(validData);
   *   if (!category?._id) return this.error({ res, message: 'Failed to create category!' });
   *
   *   const resource = this.resource.make(category);
   *   this.success({ res, message: 'Category created!', resource });
   * };
   */
}

export default new CategoryController();
