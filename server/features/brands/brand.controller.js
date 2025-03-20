import { Controller } from '#lib';
import BrandResource from './brand.resource.js';
import BrandService from './brand.service.js';
import { brandCreateRules, brandUpdateRules } from './brand.validation.js';

class BrandController extends Controller {
  service = BrandService;
  resource = BrandResource;
  rules = {
    create: brandCreateRules,
    update: brandUpdateRules,
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };
}
export default new BrandController();
