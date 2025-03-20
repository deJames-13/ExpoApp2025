import { ProductModel } from '#features';
import { Service } from '#lib';
import CartModel from './cart.model.js';

class CartService extends Service {
  model = CartModel;
  setUserId(userId) {
    this.forceFilter = { user: userId };
  }

  async validate(data) {
    let { product = null, quantity = 0, incrementBy = 0 } = data;
    incrementBy = parseInt(incrementBy) || 0;
    quantity = (parseInt(quantity) || 0) + incrementBy;
    const productData = await ProductModel.findById(product);

    if (!product || !quantity) return { error: 'Invalid data: ' + JSON.stringify(data) };
    if (!productData?._id) return { error: 'Product not found!' };
    if (productData.stock < 1) return { error: 'Product out of stock!' };
    if (productData.stock < quantity) return { error: 'Product stock not enough!' };

    const validData = {
      product: productData._id,
      quantity,
      price: productData.price,
      total: productData.price * quantity,
      _increment: incrementBy,
      _productData: productData,
    };
    return validData;
  }
  async updateOrCreate(data, user) {
    let { _increment, _productData, ...validData } = data;
    this.setUserId(user._id);

    const cartData = await this.model.findOne({
      user: user._id,
      product: _productData._id,
    });

    if (cartData?._id) {
      cartData.quantity = _increment > 0 ? cartData.quantity + _increment : data.quantity;
      await cartData.save();
      return cartData;
    }
    const newData = await this.model.create({ ...validData, user: user._id });
    return newData;
  }

  async clear(){
    const data = await this.model.find(this.forceFilter).deleteMany();
    return data;
  }

}

export default new CartService();
