import { Service } from '#lib';
import CategoryModel from './category.model.js';

class CategoryService extends Service {
  model = CategoryModel;
  fieldToSlugify = 'name';

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }
}

export default new CategoryService();
