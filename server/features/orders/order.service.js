import EmailTemplate from '#common/lib/email-template';
import { CartModel, NotificationService, ProductModel, ProductService, UserService } from '#features';
import { sendEmail } from '#utils';

import { Service } from '#lib';
import OrderModel from './order.model.js';

class OrderService extends Service {
  model = OrderModel;
  shippingMethods = {
    std: { key: 'std', fee: 100, method: 'Standard', day: 7 },
    exp: { key: 'exp', fee: 200, method: 'Express', day: 3 },
    smd: { key: 'smd', fee: 300, method: 'Same Day', day: 1 },
  }

  setUserId(userId) {
    this.forceFilter = { user: userId };
  }

  async manageStock(products) {
    const productList = products.map((product) => product.product);
    const productData = await ProductModel.find({ _id: { $in: productList } });
    productData.forEach((product) => {
      const orderProduct = products.find((orderProduct) => orderProduct.product == product.id);
      product.stock -= orderProduct.quantity;
      product.save();
    });
  }

  async create(data) {
    let { userId, products, shipping, ...orderData } = data;
    const user = await UserService.getById(userId);

    await CartModel.deleteMany({
      user: userId,
      product: { $in: products.map(product => product.product) },
    });

    const order = this.model.create({
      ...orderData,
      user,
      products,
      shipping: {
        ...shipping,
        expected_ship_date: new Date(Date.now() + this.shippingMethods[shipping.method].day * 24 * 60 * 60 * 1000),
        fee: this.shippingMethods[shipping.method].fee,
      },
    });

    if (!order) throw new Error('Order not created');

    const message = `Your order ${order.id} has been placed!`;
    const title = 'Order Confirmation';
    const altMessage = this.makeAltMessage(order);

    sendEmail({
      email: user.email,
      subject: title,
      message: new EmailTemplate({ userName: user.username, message, altMessage }).generate(),
    })

    return order;
  }

  makeAltMessage(order) {

    return `
    <div class="order-summary">
      <h3>Order Summary</h3>
      <ul>
        ${order?.products?.length && order.products.map((product, idx) => {
      const qty = Object.values(order.quantities[idx])[0]
      const itemTotal = product.price * parseInt(qty);
      return `
          <li>
            ${qty} x ${product.name} - $${itemTotal.toFixed(2)}
          </li>
        `}).join('')}
      </ul>
      <p>
        Subtotal: $${order?.subTotal}
      </p>
      <p>
        Shipping: $${this.shippingMethods[order?.shipping?.method]?.fee}  
      </p>
      <p>
        Total: $${order?.subTotal + this.shippingMethods[order?.shipping?.method]?.fee}  
      </p>
    </div>
    `;
  }

  async update(data) {
    let {
      user: userId,
      status,
      order: { id, products, shipping, ...orderData },
    } = data;
    const user = await UserService.getById(userId);
    const updatedOrder = this.model.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          ...orderData,
          status,
          shipping: {
            ...shipping,
            expected_ship_date: new Date(Date.now() + this.shippingMethods[shipping.method].day * 24 * 60 * 60 * 1000),
          },
        },
      },
      { new: true }
    )

    if (!updatedOrder) throw new Error('Order not found');
    if (status === 'shipped') this.manageStock(products);

    if (user) {
      const title = 'Order Status';

      // Create notification data
      const notificationData = {
        type: 'order',
        id: id,
        status: status,
        timestamp: new Date().toISOString()
      };

      // Plain text message as fallback for email
      const plainTextMessage = `[${status.toUpperCase()}] Your order has been updated! Ref: ${id}`;

      // Save notification to database
      await NotificationService.saveNotification({
        user: userId,
        title,
        body: plainTextMessage,
        data: notificationData,
        status: 'active',
        type: 'info'
      });

      // Send push notification if FCM token exists
      if (user.fcmToken) {
        // Format message with JSON prefix for special handling
        const message = `JSON:${JSON.stringify(notificationData)}`;

        NotificationService.sendNotification({
          deviceToken: user.fcmToken,
          title,
          body: message,
          data: notificationData, // Also include as data for platforms that support it
        });
      }

      const altMessage = this.makeAltMessage(data.order);
      sendEmail({
        email: user.email,
        subject: title,
        message: new EmailTemplate({ userName: user.username, message: plainTextMessage, altMessage }).generate(),
      });
    }

    return updatedOrder;
  }

  async getProductsData(productIds) {
    try {
      if (!productIds || !productIds.length) return [];

      const products = await ProductModel.find({
        _id: { $in: productIds.filter(id => id) }
      }).exec();

      return products;
    } catch (error) {
      console.error('Error fetching product data:', error);
      return [];
    }
  }

  async getById(id) {
    this._checkModel();
    this.query = this.model.findById(id);
    this.applyForceFilter();
    return this.exec();
  }


}

export default new OrderService();
