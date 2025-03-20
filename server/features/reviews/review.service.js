import { OrderModel, ProductModel } from '#features';
import { Service } from '#lib';
import { Filter } from 'bad-words';
import mongoose from 'mongoose';
import customBadWords from './customBadWords.js';
import ReviewModel from './review.model.js';

const filter = new Filter();
filter.addWords(...customBadWords);

class ReviewService extends Service {
  model = ReviewModel;
  setUserId(userId) {
    this.forceFilter = { user: userId };
  }

  async addReviewToProducts(orderId, reviewId) {
    const order = await OrderModel.findById(orderId);
    if (!order) return;
    order.review = reviewId;
    order.save();
    
    const products = await ProductModel.find({ _id: { $in: order.products.map(p=>p.product) } });
    products.forEach((product) => {
      if (!product.reviews.includes(new mongoose.Types.ObjectId(reviewId))) {
        product.reviews.push(reviewId);
        product.save();
      }
    });

  }


  async reviewExistInOrder(orderId, userId) {
    this._checkModel();
    const review = await this.model.findOne({ order: orderId, user: userId });
    return review;
  }

  async insertMany(data) {
    this._checkModel();
    await Promise.all(data.map(async (item) => {
      return this.update(item);
    }));
  }

  async create(body) {
    return this.update(body);
  }

  async update(body, id = null ) {
    this._checkModel();
    const data = Array.isArray(body)
      ? body.map((item) => this.model.filterFillables(item))
      : this.model.filterFillables(body);

    const exists = await this.reviewExistInOrder(data.order, data.user);
    if (exists) {
      id = exists._id;
    }
    
    data.title = filter.clean(data.title);
    data.description = filter.clean(data.description);
    
    let review;
    if (id) {
      review = await this.model.findByIdAndUpdate(id, data, { new: true });
    } else{
      review = await this.model.create(data);
    }
    if (data.order) {
      await this.addReviewToProducts(data.order, review._id);
    }
    return review;
    

  }


}

export default new ReviewService();
