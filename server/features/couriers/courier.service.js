import { Service } from '#lib';
import CourierModel from './courier.model.js';

class CourierService extends Service {
  model = CourierModel;
  fieldToSlugify = 'name';

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }
}

export default new CourierService();
