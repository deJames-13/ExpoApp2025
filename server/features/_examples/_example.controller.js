import { Controller } from '#lib';
import _ExampleResource from './_example.resource.js';
import _ExampleService from './_example.service.js';
import { _exampleCreateRules, _exampleUpdateRules } from './_example.validation.js';

class _ExampleController extends Controller {
  service = _ExampleService;
  resource = _ExampleResource;
  rules = {
    create: _exampleCreateRules,
    update: _exampleUpdateRules,
  };

  getBySlug = async (req, res) => {
    const { slug } = req.params;
    const data = await this.service.getBySlug(slug);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = this.resource?.make(data) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };
}
export default new _ExampleController();
