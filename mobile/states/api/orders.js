import apiSlice from './index';
import { setOrderId, setOrderStatus } from '../slices/checkout';

const ordersApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (orderData) => ({
                url: 'orders',
                method: 'POST',
                body: orderData,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    // Set order ID and status in checkout slice
                    dispatch(setOrderId(data.id));
                    dispatch(setOrderStatus('completed'));
                } catch (error) {
                    console.error('Order creation failed:', error);
                }
            },
        }),
        getOrderById: builder.query({
            query: (orderId) => `orders/${orderId}`,
        }),
        getUserOrders: builder.query({
            query: () => 'orders',
            providesTags: ['ORDERS'],
        }),
        updateOrder: builder.mutation({
            query: (orderData) => ({
                url: `orders/${orderData.id}`,
                method: 'PATCH',
                body: orderData,
            }),
            invalidatesTags: ['ORDERS'],
        }),
    }),
});

export const {
    useCreateOrderMutation,
    useGetOrderByIdQuery,
    useGetUserOrdersQuery,
    useUpdateOrderMutation,
} = ordersApi;

export { ordersApi };
