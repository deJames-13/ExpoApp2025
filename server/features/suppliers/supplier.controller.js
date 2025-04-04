import { Controller } from '#lib';
import SupplierResource from './supplier.resource.js';
import SupplierService from './supplier.service.js';
import { supplierCreateRules, supplierUpdateRules } from './supplier.validation.js';

class SupplierController extends Controller {
  service = SupplierService;
  resource = SupplierResource;
  rules = {
    create: supplierCreateRules,
    update: supplierUpdateRules,
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };

  search = async (req, res) => {
    const { q, limit, page, sort } = req.query;

    try {
      const { data, meta } = await this.service.search(q, {
        limit: parseInt(limit) || 10,
        page: parseInt(page) || 1,
        sort
      });

      const resource = (await this.resource?.collection(data)) || data;
      this.success({
        res,
        message: 'Search results fetched!',
        resource,
        meta
      });
    } catch (error) {
      this.error({ res, message: error.message });
    }
  };
}
export default new SupplierController();

