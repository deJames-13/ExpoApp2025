import { Service } from '#lib';
import WishlistModel from './wishlist.model.js';

class WishlistService extends Service {
  model = WishlistModel;
  
  async createWishlistItem(user, product) {
    this._checkModel();

    const existingWishlist = await this.model.findOne({ user, product });
    if (existingWishlist) return existingWishlist;

    const wishlist = new this.model({ user, product });
    return wishlist.save();
  }

  // async getWishlistByUser(userId) {
  //   return this.model.find({ user: userId })
  //     .populate({
  //       path: 'product',
  //       match: { _id: { $ne: null } } // Avoid populating if product is null
  //     })
  //     .populate({
  //       path: 'user',
  //       match: { _id: { $ne: null } } // Avoid populating if user is null
  //     })
  //     .exec();
  // }
}

export default new WishlistService();
