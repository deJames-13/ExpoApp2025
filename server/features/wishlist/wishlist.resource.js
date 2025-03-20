import { ProductModel, UserModel } from '#features';
import { Resource } from '#lib';

export default class WishlistResource extends Resource {
  async transform(wishlist) {
    const { _id } = wishlist;


    const product = await ProductModel.findById(product).select('_id');
    const user =  await UserModel.findById(user).select('_id');

    return {
      id: _id,
      user: user,
      product: product,
    };
  }
}
