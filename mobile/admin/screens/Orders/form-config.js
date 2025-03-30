// Order status options from order model
export const orderStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
];

// Payment method options
export const paymentMethodOptions = [
    { value: 'cod', label: 'Cash on Delivery' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'stripe', label: 'Credit Card (Stripe)' }
];

// Payment status options
export const paymentStatusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' }
];

// Shipping method options
export const shippingMethodOptions = [
    { value: 'std', label: 'Standard Shipping' },
    { value: 'exp', label: 'Express Shipping' },
    { value: 'smd', label: 'Same-day Delivery' }
];

// Import formatDate from formatters instead of defining it again
export { formatDate } from '~/utils/formatters';
