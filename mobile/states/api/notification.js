import apiSlice from './index';
import { setNotifications, addNotification, setLoading, setError, markAsRead } from '../slices/notification';

const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get notifications for the current user
        getUserNotifications: builder.query({
            query: () => 'notifications',
            providesTags: ['NOTIFICATIONS'],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(setLoading(true));
                    const { data } = await queryFulfilled;
                    console.log('Notification API response:', data);

                    // Ensure we have a valid array of notifications
                    if (data?.data && Array.isArray(data.data)) {
                        dispatch(setNotifications(data.data));
                    } else {
                        console.warn('Invalid notification data structure:', data);
                        dispatch(setNotifications([])); // Pass empty array as fallback
                        dispatch(setError('Invalid notification data received'));
                    }
                } catch (error) {
                    console.error('Error fetching notifications:', error);
                    dispatch(setNotifications([])); // Ensure we set empty array on error
                    dispatch(setError(error?.error?.message || 'Failed to fetch notifications'));
                } finally {
                    dispatch(setLoading(false));
                }
            }
        }),

        // Register device token for push notifications
        registerDevice: builder.mutation({
            query: (fcmToken) => ({
                url: 'notifications/device',
                method: 'POST',
                body: { fcmToken }
            })
        }),

        // Admin: Send notification to specific users
        sendBatchNotifications: builder.mutation({
            query: (notificationData) => ({
                url: 'notifications/admin/batch',
                method: 'POST',
                body: notificationData
            }),
            invalidatesTags: ['NOTIFICATIONS'],
        }),

        // Admin: Broadcast notification to all users or filtered users
        broadcastNotification: builder.mutation({
            query: (notificationData) => ({
                url: 'notifications/admin/broadcast',
                method: 'POST',
                body: notificationData
            }),
            invalidatesTags: ['NOTIFICATIONS'],
        }),

        // Mark a notification as read
        markNotificationAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `notifications/${notificationId}/read`,
                method: 'PATCH'
            }),
            async onQueryStarted(notificationId, { dispatch, queryFulfilled }) {
                // Optimistic update
                dispatch(markAsRead(notificationId));
                try {
                    await queryFulfilled;
                } catch (error) {
                    // Revert on error by refetching
                    dispatch(apiSlice.endpoints.getUserNotifications.initiate());
                }
            }
        })
    }),
    overrideExisting: process.env.NODE_ENV !== 'production', // Allow endpoint overrides in development
});

export const {
    useGetUserNotificationsQuery,
    useRegisterDeviceMutation,
    useSendBatchNotificationsMutation,
    useBroadcastNotificationMutation,
    useMarkNotificationAsReadMutation
} = notificationApi;

export { notificationApi };
