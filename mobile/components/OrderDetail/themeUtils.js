import { adminColors } from '~/styles/adminTheme';

// Status color mapping for order details
export const getOrderStatusColor = (status) => {
    const statusMap = {
        'pending': '#FF9800',
        'processing': '#FF9800',
        'shipped': '#2196F3',
        'delivered': '#4CAF50',
        'cancelled': '#F44336',
        'Delivered': '#4CAF50',
        'Shipped': '#2196F3',
        'Processing': '#FF9800',
        'Pending': '#FF9800',
        'Cancelled': '#F44336',
    };
    return statusMap[status] || '#9E9E9E';
};

// Order status labels
export const statusLabels = {
    'pending': 'Pending',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
};

// Helper to get appropriate icon for status
export const getStatusIcon = (status, currentStatus) => {
    // Icons for current active status
    if (status === currentStatus) {
        const activeIcons = {
            'pending': 'clock-outline',
            'processing': 'cog',
            'shipped': 'truck-delivery-outline',
            'delivered': 'check-bold',
            'cancelled': 'close-circle',
        };
        return activeIcons[status] || 'help-circle-outline';
    }

    // Icons for completed status (steps before current)
    else if (shouldMarkAsCompleted(status, currentStatus)) {
        return 'check';
    }

    // Default for future steps
    return null;
};

// Helper to determine if a step should be marked as completed
const shouldMarkAsCompleted = (stepStatus, currentStatus) => {
    const order = ['pending', 'processing', 'shipped', 'delivered'];
    const stepIndex = order.indexOf(stepStatus);
    const currentIndex = order.indexOf(currentStatus);

    // If cancelled, nothing is completed
    if (currentStatus === 'cancelled') return false;

    // If current step is after the checked step, mark as completed
    return stepIndex < currentIndex;
};

// Get colors for order workflow visualization
export const getStatusVisualProps = (stepStatus, currentStatus) => {
    // If cancelled, use special styling
    if (currentStatus === 'cancelled') {
        return {
            dotColor: adminColors.text.light,
            textStyle: 'inactiveStatusStep',
        };
    }

    // Active status
    if (stepStatus === currentStatus) {
        return {
            dotColor: adminColors.status.warning,
            textStyle: 'activeStatusStep',
        };
    }

    // Completed status
    if (shouldMarkAsCompleted(stepStatus, currentStatus)) {
        return {
            dotColor: adminColors.status.success,
            textStyle: 'completedStatusStep',
        };
    }

    // Inactive/future status
    return {
        dotColor: adminColors.text.light,
        textStyle: 'inactiveStatusStep',
    };
};

export default {
    getOrderStatusColor,
    statusLabels,
    getStatusIcon,
    getStatusVisualProps
};
