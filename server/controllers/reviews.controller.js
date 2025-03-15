import { ReviewsResource } from '#resources';
import { ReviewsService } from '#services';
import Controller from './controller.js';
import { reviewsCreateRules, reviewsUpdateRules } from '../validations/reviews.validation.js';


class ReviewsController extends Controller {
  service = ReviewsService;
  resource = ReviewsResource;
  rules = {
    create: reviewsCreateRules,
    update: reviewsUpdateRules,
  }

  /**
   * You can add custom methods or override existing methods from the base Controller class here.
   * 
   * The base Controller already provides:
   * - getAll(): Fetches all records
   * - getById(): Fetches a record by ID
   * 
   * Example of overriding or adding a method:
   * 
   * create = async (req, res) => {
   *   const validData = await this.validator(req, res, reviewsCreateRules);
   *   const reviews = await this.service.create(validData);
   *   if (!reviews?._id) return this.error({ res, message: 'Failed to create reviews!' });
   *
   *   const resource = this.resource.make(reviews);
   *   this.success({ res, message: 'Reviews created!', resource });
   * };
   */
}

export default new ReviewsController();
