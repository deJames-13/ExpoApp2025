import { Controller } from '#lib';
import ChartService from './chart.service.js';

class ChartController extends Controller {
  service = ChartService;

  monthlyRevenue = async (req, res) => {
    const data = await this.service.monthlyRevenue();
    this.success({ res, message: 'Data fetched!', resource: data });
  };
  
  dailyRevenue = async (req, res) => {
    const { startDate, endDate } = req.body;
    const data = await this.service.dailyRevenue({
      startDate,
      endDate,
    });
    this.success({ res, message: 'Data fetched!', resource: data });
  };

  // Dashboard Home Page
  recentOrders = async (req, res) => {
    try {
      const limit = req.query.limit || 5;
      const orders = await this.service.getRecentOrders(limit);
      this.success({ res, message: 'Recent orders fetched!', resource: orders });
    } catch (error) {
      this.error({ res, message: 'Failed to fetch recent orders', error });
    }
  }

  recentUsers = async (req, res) => {
    try {
      const limit = req.query.limit || 5;
      const users = await this.service.getRecentUsers(limit);
      this.success({ res, message: 'Recent users fetched!', resource: users });
    } catch (error) {
      this.error({ res, message: 'Failed to fetch recent users', error });
    }
  }
  
  statsData = async (req, res) => {
    try {
      const stats = await this.service.getDashboardStats();
      this.success({ res, message: 'Dashboard stats fetched!', resource: stats });
    } catch (error) {
      this.error({ res, message: 'Failed to fetch dashboard stats', error });
    }
  }

  dashboardData = async (req, res) => {
    try {
      // Get all dashboard data in a single API call but without revenue calculation
      const stats = await this.service.getDashboardStats();
      const recentOrders = await this.service.getRecentOrders(5);
      const recentUsers = await this.service.getRecentUsers(5);

      const dashboardData = {
        stats,
        recentOrders,
        recentUsers
      };

      this.success({ res, message: 'Dashboard data fetched!', resource: dashboardData });
    } catch (error) {
      this.error({ res, message: 'Failed to fetch dashboard data', error });
    }
  }
}
export default new ChartController();
