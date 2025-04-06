import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    stats: {
        data: {
            totalUsers: 0,
            totalOrders: 0,
            totalProducts: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            newFeedbacks: 0
        },
        lastFetched: null,
        isLoading: false
    },
    recentOrders: {
        data: [],
        lastFetched: null,
        isLoading: false
    },
    recentUsers: {
        data: [],
        lastFetched: null,
        isLoading: false
    }
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // Stats actions
        fetchStatsStart: (state) => {
            state.stats.isLoading = true;
        },
        fetchStatsSuccess: (state, action) => {
            state.stats.data = action.payload;
            state.stats.lastFetched = Date.now();
            state.stats.isLoading = false;
        },
        fetchStatsFailure: (state) => {
            state.stats.isLoading = false;
        },

        // Recent orders actions
        fetchOrdersStart: (state) => {
            state.recentOrders.isLoading = true;
        },
        fetchOrdersSuccess: (state, action) => {
            state.recentOrders.data = action.payload;
            state.recentOrders.lastFetched = Date.now();
            state.recentOrders.isLoading = false;
        },
        fetchOrdersFailure: (state) => {
            state.recentOrders.isLoading = false;
        },

        // Recent users actions
        fetchUsersStart: (state) => {
            state.recentUsers.isLoading = true;
        },
        fetchUsersSuccess: (state, action) => {
            state.recentUsers.data = action.payload;
            state.recentUsers.lastFetched = Date.now();
            state.recentUsers.isLoading = false;
        },
        fetchUsersFailure: (state) => {
            state.recentUsers.isLoading = false;
        },

        // Reset all dashboard data
        resetDashboard: () => initialState
    }
});

export const {
    fetchStatsStart,
    fetchStatsSuccess,
    fetchStatsFailure,
    fetchOrdersStart,
    fetchOrdersSuccess,
    fetchOrdersFailure,
    fetchUsersStart,
    fetchUsersSuccess,
    fetchUsersFailure,
    resetDashboard
} = dashboardSlice.actions;

// Selectors
export const selectDashboardStats = state => state.dashboard.stats;
export const selectRecentOrders = state => state.dashboard.recentOrders;
export const selectRecentUsers = state => state.dashboard.recentUsers;

// Thunk for fetching stats with caching (15 minutes)
export const fetchStatsWithCache = () => async (dispatch, getState) => {
    const { lastFetched, isLoading } = getState().dashboard.stats;
    const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

    // If data is being loaded or was recently fetched, don't fetch again
    if (isLoading || (lastFetched && Date.now() - lastFetched < CACHE_DURATION)) {
        return;
    }

    dispatch(fetchStatsStart());

    try {
        const { fetchStatsData } = await import('~/admin/screens/Dashboard/data');
        const statsData = await fetchStatsData();
        dispatch(fetchStatsSuccess(statsData));
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        dispatch(fetchStatsFailure());
    }
};

// Thunk for fetching orders with caching (15 minutes)
export const fetchOrdersWithCache = () => async (dispatch, getState) => {
    const { lastFetched, isLoading } = getState().dashboard.recentOrders;
    const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (isLoading || (lastFetched && Date.now() - lastFetched < CACHE_DURATION)) {
        return;
    }

    dispatch(fetchOrdersStart());

    try {
        const { fetchRecentOrders } = await import('~/admin/screens/Dashboard/data');
        const ordersData = await fetchRecentOrders();
        dispatch(fetchOrdersSuccess(ordersData));
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        dispatch(fetchOrdersFailure());
    }
};

// Thunk for fetching users with caching (15 minutes)
export const fetchUsersWithCache = () => async (dispatch, getState) => {
    const { lastFetched, isLoading } = getState().dashboard.recentUsers;
    const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

    if (isLoading || (lastFetched && Date.now() - lastFetched < CACHE_DURATION)) {
        return;
    }

    dispatch(fetchUsersStart());

    try {
        const { fetchRecentUsers } = await import('~/admin/screens/Dashboard/data');
        const usersData = await fetchRecentUsers();
        dispatch(fetchUsersSuccess(usersData));
    } catch (error) {
        console.error('Failed to fetch users:', error);
        dispatch(fetchUsersFailure());
    }
};

export default dashboardSlice.reducer;
