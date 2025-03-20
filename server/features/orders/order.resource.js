import { ProductModel, ReviewModel, ReviewResource, UserResource, UserService } from '#features';
import { Resource } from '#lib';


let shippingMethods = {
  std: { key: 'std', fee: 100, method: 'Standard', day: 7},
  exp: { key: 'exp', fee: 200, method: 'Express', day: 3},
  smd: { key: 'smd', fee: 300, method: 'Same Day', day: 1},
}

let notesPhrases = {
  pending: 'Your order is pending',
  processing: 'Your order is processing',
  shipped: 'Your order has been shipped',
  delivered: 'Your order has been delivered',
  cancelled: 'Your order has been cancelled',
}
export default class OrderResource extends Resource {

  async transform(order) {
    const { _id, user, products, review=null, ...rest } = order;
    const userData = await UserService.getById(user);
    const productList = products.map((product) => product.product);
    const productData = await ProductModel.find({ _id: { $in: productList } }).exec();
    const reviewData = review ? await ReviewModel.findById(review).exec() : null;
    const subTotal = productData.reduce((acc, product, index) => acc + product.price * products[index].quantity, 0);
    const shippingFee = shippingMethods[rest.shipping.method].fee;
    const total = subTotal + shippingFee;
    const notes = notesPhrases[rest.status];

    return {
      id: _id,
      ...rest,
      user: await UserResource.make(userData),
      review: review ? await ReviewResource.make(reviewData) : null,
      products: productData,
      quantities: products.map((product) => ({[product.product]: product.quantity})),
      subTotal,
      total,
      notes,
    };
  }
}
