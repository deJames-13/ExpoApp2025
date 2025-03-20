import { Service } from '#lib';
import _ExampleModel from './_example.model.js';

class _ExampleService extends Service {
  model = _ExampleModel;
  fieldToSlugify = 'name';

  async getBySlug(slug) {
    this._checkModel();
    return this.model.findOne({ slug });
  }
}

export default new _ExampleService();
