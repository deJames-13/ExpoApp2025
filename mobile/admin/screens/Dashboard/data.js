
export const statsData = {
    totalUsers: 1250,
    totalOrders: 843,
    pendingOrders: 47,
    totalRevenue: 152689.50,
    newFeedbacks: 12
};

export const recentOrdersData = [
    { id: 1, number: 'ORD-005', customer: 'Robert Brown', amount: 175.25, status: 'Processing', date: '2023-06-11' },
    { id: 2, number: 'ORD-004', customer: 'Sarah Williams', amount: 99.99, status: 'Cancelled', date: '2023-06-12' },
    { id: 3, number: 'ORD-003', customer: 'Mike Johnson', amount: 395.00, status: 'Delivered', date: '2023-06-13' },
    { id: 4, number: 'ORD-002', customer: 'Jane Smith', amount: 127.50, status: 'Shipped', date: '2023-06-14' },
];

export const recentUsersData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', date: '2023-06-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', date: '2023-06-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Staff', date: '2023-06-12' },
];

// Function to fetch mock data with a delay to simulate API call
const timeoutDelay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDashboardData = () => {
    return new Promise((resolve) => {
        timeoutDelay(1500).then(() => {
            resolve({
                stats: statsData,
                recentOrders: recentOrdersData,
                recentUsers: recentUsersData
            });
        });
    });
};

export const someFunction = () => {
    global.setTimeout(() => {
        // Function content
    }, 1000);
};
