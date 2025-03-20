import { Service } from '#lib';
import SupplierModel from './supplier.model.js';

class SupplierService extends Service {
  model = SupplierModel;
  fieldToSlugify = 'name';

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }
}

export default new SupplierService();
