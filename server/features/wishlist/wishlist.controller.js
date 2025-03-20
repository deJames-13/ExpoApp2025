// import { Controller } from '#lib';
// import WishlistResource from './wishlist.resource.js';
// import WishlistService from './wishlist.service.js';

// class WishlistController extends Controller {
//   service = WishlistService;
//   resource = WishlistResource;

//   store = async (req, res) => {
//     const wishlist = await this.service.create(req.body);
//     if (!wishlist?.id) return this.error({ res, message: 'Wishlist not created' });

//     const resource = await this.resource.make(wishlist);
//     this.success({ res, message: 'Product added to wishlist!', resource });
//   };

// }
// export default new WishlistController();

import { Controller } from '#lib';
import WishlistResource from './wishlist.resource.js';
import WishlistService from './wishlist.service.js';

class WishlistController extends Controller {
  service = WishlistService;
  resource = WishlistResource;

  store = async (req, res) => {
    const { user, product } = req.body;

    if (!user || !product) {
      return this.error({ res, message: 'User and product are required' });
    }

    const wishlist = await this.service.createWishlistItem(user, product);
    if (!wishlist?.id) return this.error({ res, message: 'Wishlist item not created' });

    const resource = await this.resource.make(wishlist);
    this.success({ res, message: 'Product added to wishlist!', resource });
  };
}

export default new WishlistController();
