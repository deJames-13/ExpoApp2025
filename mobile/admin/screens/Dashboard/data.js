import api from "~/axios.config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthConfig = async () => {
    try {
        let token = await AsyncStorage.getItem('auth_token');

        return {
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
                'Content-Type': 'application/json'
            }
        };
    } catch (error) {
        console.error('Error getting auth config:', error);
        return { headers: { 'Content-Type': 'application/json' } };
    }
};
// Default fallback data in case of API errors
const fallbackStatsData = {
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    newFeedbacks: 0
};

const fallbackRecentOrdersData = [];
const fallbackRecentUsersData = [];

// Function to fetch all dashboard data from the API
export const fetchDashboardData = async () => {
    try {
        // Try to fetch data from the combined dashboard endpoint
        const config = await getAuthConfig();
        const response = await api.get('/api/v1/charts/dashboard-data', config);

        if (response.data && response.data.resource) {
            return {
                stats: response.data.resource.stats || fallbackStatsData,
                recentOrders: response.data.resource.recentOrders || fallbackRecentOrdersData,
                recentUsers: response.data.resource.recentUsers || fallbackRecentUsersData
            };
        } else {
            console.warn('Unexpected API response format:', response.data);
            return await fetchDashboardDataFallback();
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return await fetchDashboardDataFallback();
    }
};

// Fallback function to fetch each data type separately if combined endpoint fails
const fetchDashboardDataFallback = async () => {
    try {
        const config = await getAuthConfig();
        // Create an object to store all fetched data
        const dashboardData = {
            stats: fallbackStatsData,
            recentOrders: fallbackRecentOrdersData,
            recentUsers: fallbackRecentUsersData
        };

        // Fetch stats data
        try {
            const statsResponse = await api.get('/api/v1/charts/stats-data', config);
            if (statsResponse.data && statsResponse.data.resource) {
                dashboardData.stats = statsResponse.data.resource;
            }
        } catch (error) {
            console.error('Error fetching stats data:', error);
        }

        // Fetch recent orders
        try {
            const ordersResponse = await api.get('/api/v1/charts/recent-orders', config); // Added config parameter
            if (ordersResponse.data && ordersResponse.data.resource) {
                dashboardData.recentOrders = ordersResponse.data.resource;
            }
        } catch (error) {
            console.error('Error fetching recent orders:', error);
        }

        // Fetch recent users
        try {
            const usersResponse = await api.get('/api/v1/charts/recent-users', config); // Added config parameter
            if (usersResponse.data && usersResponse.data.resource) {
                dashboardData.recentUsers = usersResponse.data.resource;
            }
        } catch (error) {
            console.error('Error fetching recent users:', error);
        }

        return dashboardData;
    } catch (error) {
        console.error('Error in fallback dashboard data fetch:', error);

        // Return mock data as final fallback
        return {
            stats: {
                totalUsers: 1250,
                totalOrders: 843,
                pendingOrders: 47,
                newFeedbacks: 12
            },
            recentOrders: [
                { id: 1, number: 'ORD-005', customer: 'Robert Brown', amount: 175.25, status: 'Processing', date: '2023-06-11' },
                { id: 2, number: 'ORD-004', customer: 'Sarah Williams', amount: 99.99, status: 'Cancelled', date: '2023-06-12' },
                { id: 3, number: 'ORD-003', customer: 'Mike Johnson', amount: 395.00, status: 'Delivered', date: '2023-06-13' },
                { id: 4, number: 'ORD-002', customer: 'Jane Smith', amount: 127.50, status: 'Shipped', date: '2023-06-14' },
            ],
            recentUsers: [
                { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', date: '2023-06-15' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', date: '2023-06-14' },
                { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Staff', date: '2023-06-12' },
            ]
        };
    }
};

// Individual data fetching functions
export const fetchStatsData = async () => {
    try {
        const config = await getAuthConfig();
        const response = await api.get('/api/v1/charts/stats-data', config);
        return response.data && response.data.resource ? response.data.resource : fallbackStatsData;
    } catch (error) {
        console.error('Error fetching stats data:', error);
        return fallbackStatsData;
    }
};

export const fetchRecentOrders = async (limit = 5) => {
    try {
        const config = await getAuthConfig();
        const response = await api.get(`/api/v1/charts/recent-orders?limit=${limit}`, config);
        return response.data && response.data.resource ? response.data.resource : fallbackRecentOrdersData;
    } catch (error) {
        console.error('Error fetching recent orders:', error);
        return fallbackRecentOrdersData;
    }
};

export const fetchRecentUsers = async (limit = 5) => {
    try {
        const config = await getAuthConfig();
        const response = await api.get(`/api/v1/charts/recent-users?limit=${limit}`, config);
        return response.data && response.data.resource ? response.data.resource : fallbackRecentUsersData;
    } catch (error) {
        console.error('Error fetching recent users:', error);
        return fallbackRecentUsersData;
    }
};
