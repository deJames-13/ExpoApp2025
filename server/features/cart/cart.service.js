import { ProductModel } from '#features';
import { Service } from '#lib';
import CartModel from './cart.model.js';

class CartService extends Service {
  model = CartModel;
  userId = null;

  setUserId(userId) {
    this.userId = userId;
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

  async findExistingCartItem(productId, userId) {
    try {
      return await this.model.findOne({
        product: productId,
        user: userId
      });
    } catch (error) {
      console.error('Error finding existing cart item:', error);
      return null;
    }
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

  async update(id, data) {
    try {
      // Ensure quantity is a number
      if (data.quantity) {
        data.quantity = Number(data.quantity);
      }

      // If price exists but total isn't provided, calculate it
      if (data.quantity && data.price && !data.total) {
        data.total = Number(data.price) * Number(data.quantity);
      }

      // Update the cart item with the new data
      const updatedItem = await this.model.findByIdAndUpdate(
        id,
        data,
        { new: true }
      );

      // Log successful update
      console.log(`Cart item ${id} updated:`, updatedItem);

      return updatedItem;
    } catch (error) {
      console.error('Error updating cart item:', error);
      return null;
    }
  }

  async clear() {
    const data = await this.model.find(this.forceFilter).deleteMany();
    return data;
  }

  async findById(id) {
    try {
      if (!this.userId) {
        throw new Error('User ID not set. Call setUserId before finding cart items.');
      }

      const cartItem = await this.model.findOne({
        _id: id,
        user: this.userId
      }).populate('product');

      return cartItem;
    } catch (error) {
      console.error(`Error finding cart item with ID ${id}:`, error);
      return null;
    }
  }
}

export default new CartService();
