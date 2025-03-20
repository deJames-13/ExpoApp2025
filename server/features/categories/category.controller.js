import { Controller } from '#lib';
import CategoryResource from './category.resource.js';
import CategoryService from './category.service.js';
import { categoryCreateRules, categoryUpdateRules } from './category.validation.js';

class CategoryController extends Controller {
  service = CategoryService;
  resource = CategoryResource;
  rules = {
    create: categoryCreateRules,
    update: categoryUpdateRules,
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };
}
export default new CategoryController();
