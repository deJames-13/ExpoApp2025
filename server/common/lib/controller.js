import * as utils from '#utils';
export class Controller {
  service;
  resource;
  error = utils.errorHandler;
  success = utils.successHandler;
  validator = utils.validate;
  rules = {
    create: [],
    update: [],
  };

  // controller functions
  search = async (req, res) => {
    const meta = await this.service._getMeta(req.query, res);
    const data = await this.service
      ?.search(req.query.q)
      .paginate(meta)
      .filter(req.query.filters || {})
      .exec();
    const message = data.length ? 'Data collection fetched!' : 'No data found!';

    const resource = (await this.resource?.collection(data)) || data;
    this.success({ res, message, resource, meta: { ...meta, count: data.length } });
  };

  getAll = async (req, res) => {
    let data, meta;
    if (req.query.all){
      data = await this.service?.getAll();
    }
    else {
      meta = await this.service._getMeta(req.query);
      data = await this.service.paginate(meta).exec();
    }
    const message = data.length ? 'Data collection fetched!' : 'No data found!';

    const resource = (await this.resource?.collection(data)) || data;
    this.success({ res, message, resource, meta: { ...(meta||[]), count: data.length } });
  };

  getById = async (req, res) => {
    const data = await this.service?.getById(req.params.id);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data fetched!', resource });
  };

  addImage = (req, oldImages) => {
    const files = Array.isArray(req.files) ? req.files : [req.file];
    const images = files.map((file) => ({
      folder: file.folder || '',
      public_id: file.public_id || '',
      resource_type: file.resource_type || '',
      url: file.url || '',
      secure_url: file.secure_url || '',
      tags: file.tags || [],
      allowed_formats: file.allowed_formats || [],
    }));
    return images;
  };

  store = async (req, res, next) => {
    let validData = req.body;
    if (!this.rules.create.length) validData = await this.validator(req, res, this.rules.create);

    let data = await this.service?.create(validData);
    if (!data._id) return this.error({ res, message: 'Invalid data!' });

    if (req.file || req.files || this.service.hasField('images')) {
      const images = this.addImage(req);
      data.images = [...(data.images || []), ...images];
      await data.save();
    }

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data created!', resource });
  };

  update = async (req, res, next) => {
    let validData = req.body;
    if (!this.rules.create.length) validData = await this.validator(req, res, this.rules.update);

    const data = await this.service?.update(req.params.id, validData);
    if (!data._id) return this.error({ res, message: 'Invalid data!' });

    if (req.file || req.files || this.service.hasField('images')) {
      const images = this.addImage(req);
      const oldImages = new Set((data.images || []).map((image) => image.public_id));
      const newImages = images.filter((image) => !oldImages.has(image.public_id));
      data.images = [...(data.images || []), ...newImages];
      await data.save();
    }

    const resource = (await this.resource?.make(data)) || data;
    this.success({ res, message: 'Data updated!', resource });
  };

  delete = async (req, res, next) => {
    const data = await this.service?.delete(req.params.id);
    if (!data?._id) return this.error({ res, message: 'Data not found!' });

    try {
      if (data.images) {
        const publicIds = data.images.map((image) => `${image.folder}/${image.public_id}`);
        await utils.deleteFiles(publicIds);
      }
    } catch (error) {
      return this.error({ res, message: 'Failed to delete images!' });
    }

    this.success({ res, message: 'Data deleted!' });
  };
}
