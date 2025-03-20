import { Service } from '#lib';
import BrandModel from './brand.model.js';

class BrandService extends Service {
  model = BrandModel;
  fieldToSlugify = 'name';

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }
}

export default new BrandService();
