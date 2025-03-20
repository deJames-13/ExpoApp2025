import { Controller } from '#lib';
import ReviewResource from './review.resource.js';
import ReviewService from './review.service.js';
import { reviewCreateRules, reviewUpdateRules } from './review.validation.js';

class ReviewController extends Controller {
  service = ReviewService;
  resource = ReviewResource;
    rules = {
    create: reviewCreateRules,
    update: reviewUpdateRules,
  };
  update = async (req, res, next) => {
    let validData = req.body;
    let id = req.params.id;
    let userId = req.user._id;
    validData.user = userId;
    if (id)
      validData = await this.validator(req, res, this.rules.update);
    else
      validData = await this.validator(req, res, this.rules.create);

    const data = await this.service?.update(validData, id);
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
}

export default new ReviewController();
