import { Service } from '#lib';
import SupplierModel from './supplier.model.js';

class SupplierService extends Service {
  model = SupplierModel;
  fieldToSlugify = 'name';

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }

  async search(query, options = {}) {
    this._checkModel();
    const { limit = 10, page = 1, sort = 'name' } = options;
    const skip = (page - 1) * limit;

    const searchQuery = query ? { name: { $regex: query, $options: 'i' } } : {};

    const data = await this.model.find(searchQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await this.model.countDocuments(searchQuery);

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        last_page: Math.ceil(total / limit)
      }
    };
  }
}

export default new SupplierService();
