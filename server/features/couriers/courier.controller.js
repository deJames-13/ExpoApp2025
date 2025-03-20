import { Controller } from '#lib';
import CourierResource from './courier.resource.js';
import CourierService from './courier.service.js';
import { courierCreateRules, courierUpdateRules } from './courier.validation.js';

class CourierController extends Controller {
  service = CourierService;
  resource = CourierResource;
  rules = {
    create: courierCreateRules,
    update: courierUpdateRules,
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };
}

export default new CourierController();

