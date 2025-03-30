import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Step 1: Customer Information
    customerInfo: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    },

    // Step 1: Shipping Address
    shippingAddress: {
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    },

    // Step 2: Shipping & Payment Methods
    shippingMethod: 'standard', // standard or express
    paymentMethod: 'cash', // cash, card, paypal

    // Order Items (from Cart)
    items: [], // Selected items from cart

    // Order Totals
    subtotal: 0,
    shippingCost: 9.99, // Default to standard shipping cost
    tax: 0,
    total: 0,

    // Order Status
    status: 'pending', // pending, processing, completed, failed
    orderId: null,

    // Checkout Steps Tracking
    currentStep: 1, // 1: Info, 2: Payment, 3: Review
    stepsCompleted: {
        customerInfo: false,
        shippingAddress: false,
        paymentMethod: false,
    },
};

const checkoutSlice = createSlice({
    name: 'checkout',
    initialState,
    reducers: {
        setCustomerInfo: (state, action) => {
            state.customerInfo = {
                ...state.customerInfo,
                ...action.payload,
            };
            state.stepsCompleted.customerInfo = true;
        },

        setShippingAddress: (state, action) => {
            state.shippingAddress = {
                ...state.shippingAddress,
                ...action.payload,
            };
            state.stepsCompleted.shippingAddress = true;
        },

        setShippingMethod: (state, action) => {
            state.shippingMethod = action.payload;
            // Update shipping cost based on method
            state.shippingCost = action.payload === 'express' ? 19.99 : 9.99;
            // Recalculate total
            state.total = state.subtotal + state.shippingCost + state.tax;
        },

        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
            state.stepsCompleted.paymentMethod = true;
        },

        setCheckoutItems: (state, action) => {
            state.items = action.payload;
            // Calculate subtotal
            state.subtotal = state.items.reduce(
                (sum, item) => sum + (item.price * item.quantity), 0
            );
            // Calculate tax (e.g., 7% of subtotal)
            state.tax = parseFloat((state.subtotal * 0.07).toFixed(2));
            // Update total
            state.total = state.subtotal + state.shippingCost + state.tax;
        },

        setOrderStatus: (state, action) => {
            state.status = action.payload;
        },

        setOrderId: (state, action) => {
            state.orderId = action.payload;
        },

        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },

        resetCheckout: (state) => {
            return initialState;
        },

        // Combined action for updating basic info and shipping in one go
        updateBasicInfo: (state, action) => {
            const { userInfo, shippingAddress } = action.payload;
            if (userInfo) {
                state.customerInfo = {
                    ...state.customerInfo,
                    ...userInfo,
                };
                state.stepsCompleted.customerInfo = true;
            }

            if (shippingAddress) {
                state.shippingAddress = {
                    ...state.shippingAddress,
                    ...shippingAddress,
                };
                state.stepsCompleted.shippingAddress = true;
            }
        },

        // Combined action for all payment-related info
        updatePaymentInfo: (state, action) => {
            const { shippingMethod, paymentMethod } = action.payload;

            if (shippingMethod) {
                state.shippingMethod = shippingMethod;
                state.shippingCost = shippingMethod === 'express' ? 19.99 : 9.99;
            }

            if (paymentMethod) {
                state.paymentMethod = paymentMethod;
                state.stepsCompleted.paymentMethod = true;
            }

            // Recalculate total
            state.total = state.subtotal + state.shippingCost + state.tax;
        },
    },
});

export const {
    setCustomerInfo,
    setShippingAddress,
    setShippingMethod,
    setPaymentMethod,
    setCheckoutItems,
    setOrderStatus,
    setOrderId,
    setCurrentStep,
    resetCheckout,
    updateBasicInfo,
    updatePaymentInfo,
} = checkoutSlice.actions;

// Selectors
export const selectCustomerInfo = state => state.checkout.customerInfo;
export const selectShippingAddress = state => state.checkout.shippingAddress;
export const selectShippingMethod = state => state.checkout.shippingMethod;
export const selectPaymentMethod = state => state.checkout.paymentMethod;
export const selectCheckoutItems = state => state.checkout.items;
export const selectOrderSubtotal = state => state.checkout.subtotal;
export const selectShippingCost = state => state.checkout.shippingCost;
export const selectTax = state => state.checkout.tax;
export const selectOrderTotal = state => state.checkout.total;
export const selectOrderStatus = state => state.checkout.status;
export const selectCurrentStep = state => state.checkout.currentStep;
export const selectStepsCompleted = state => state.checkout.stepsCompleted;

export default checkoutSlice.reducer;
