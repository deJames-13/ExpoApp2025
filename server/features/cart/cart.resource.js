import { ProductModel, ProductResource, UserModel, UserResource } from '#features';
import { Resource } from '#lib';
export default class CartResource extends Resource {
  async transform(cart) {
    const { _id, ...rest } = cart;
    const product = await ProductModel.findById(rest.product);
    const user = await UserModel.findById(rest.user);
    const productResource = await ProductResource.make(product);
    const userResource = await UserResource.make(user);

    return {
      id: _id,
      ...rest,
      product: productResource,
      user: userResource,
      total: rest.price * rest.quantity,
    };
  }
}
