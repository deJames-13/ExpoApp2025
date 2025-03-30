import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    activeNotification: null
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications: (state, action) => {
            // Ensure we always have an array, even if payload is undefined
            const notifications = Array.isArray(action.payload) ? action.payload : [];
            state.notifications = notifications;
            state.unreadCount = notifications.filter(notif => !notif.isRead).length;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            state.unreadCount += 1;
        },
        markAsRead: (state, action) => {
            const notifId = action.payload;
            const notification = state.notifications.find(n => n.id === notifId);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(notif => {
                notif.isRead = true;
            });
            state.unreadCount = 0;
        },
        setActiveNotification: (state, action) => {
            state.activeNotification = action.payload;
        },
        clearActiveNotification: (state) => {
            state.activeNotification = null;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        }
    }
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    setActiveNotification,
    clearActiveNotification,
    setLoading,
    setError
} = notificationSlice.actions;

// Selectors
export const selectNotifications = state => state.notification.notifications;
export const selectUnreadCount = state => state.notification.unreadCount;
export const selectActiveNotification = state => state.notification.activeNotification;
export const selectNotificationLoading = state => state.notification.isLoading;
export const selectNotificationError = state => state.notification.error;

export default notificationSlice.reducer;