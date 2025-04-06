import { OrderModel, OrderResource, UserModel, ProductModel } from '#features';
import { Service } from '#lib';

class ChartService extends Service {
  shortMonths = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  async monthlyRevenue(data) {
    data = this.shortMonths.map((month) => ({ month: month, revenue: Math.floor(Math.random() * 5000) + 1000 }));
    const orders = await OrderModel.find({}).exec();
    const orderResource = await OrderResource.collection(orders);
    const monthlyRevenue = orderResource.reduce((acc, order) => {
      const month = new Date(order.createdAt).getMonth();
      acc[month] = acc[month] ? acc[month] + order.total : order.total;
      return acc;
    }, {});
    data = this.shortMonths.map((month, index) => ({ month, revenue: monthlyRevenue[index] || 0 }));


    return data;
  } 

  getDates(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    while (currentDate <= end) {
      dates.push(currentDate.toDateString());
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  async dailyRevenue({startDate, endDate}) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    let statuses = ['delivered', 'cancelled'];
    const orders = await OrderModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
      status: { $in: statuses },
    }).exec();
    const orderResource = await OrderResource.collection(orders);
  
    const dates = this.getDates(startDate, endDate);
    const dailyRevenue = orderResource.reduce((acc, order) => {
      const date = new Date(order.createdAt).toDateString();
      const status = order.status;
      const total = order.total;
      const index = dates.indexOf(date);
      acc[index] = acc[index] || { date, delivered: 0, cancelled: 0 };
      acc[index][status] += total;
      return acc;
    }, {});

    const data = dates.map((date, index) => {
      const revenue = dailyRevenue[index];
      return revenue ? { date: revenue.date, successful: revenue.delivered, cancelled: revenue.cancelled } : null;
    });

  
  
    return data.filter(Boolean);
  }

  async getRecentOrders(limit = 5) {
    const orders = await OrderModel.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .exec();
    return OrderResource.collection(orders);
  }

  async getRecentUsers(limit = 5) {
    const users = await UserModel.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .exec();

    return users;
  }

  async getDashboardStats() {
    const totalOrders = await OrderModel.countDocuments();

    const delivered = await OrderModel.countDocuments({ status: 'delivered' });
    const cancelled = await OrderModel.countDocuments({ status: 'cancelled' });
    const pending = await OrderModel.countDocuments({ status: 'pending' });
    const processing = await OrderModel.countDocuments({ status: 'processing' });

    const totalUsers = await UserModel.countDocuments({ role: 'customer' });

    // Add product count
    const totalProducts = await ProductModel.countDocuments();

    return {
      totalOrders,
      totalUsers,
      totalProducts,
      ordersByStatus: {
        delivered,
        cancelled,
        pending,
        processing
      }
    };
  }

  // We'll keep this separate method for future use if needed
  async getTotalRevenue() {
    const orders = await OrderModel.find({}).exec();
    const orderResource = await OrderResource.collection(orders);
    return orderResource.reduce((acc, order) => acc + order.total, 0);
  }
}

export default new ChartService();
