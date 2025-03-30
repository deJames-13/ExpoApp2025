import { colors } from '../theme/colors';

// Status color palette with proper opacity variants
export const statusColors = {
    // Success states - slightly darkened for better contrast
    success: '#00A046', // Darker green for better visibility
    successLight: 'rgba(0, 160, 70, 0.1)',

    // Warning states
    warning: '#FF9100',
    warningLight: 'rgba(255, 145, 0, 0.1)',

    // Error states
    error: '#D50000',
    errorLight: 'rgba(213, 0, 0, 0.1)',

    // Info states
    info: '#2979FF',
    infoLight: 'rgba(41, 121, 255, 0.1)',

    // Neutral states - slightly darker for better contrast
    neutral: '#616161', // Slightly darker for better contrast
    neutralLight: 'rgba(97, 97, 97, 0.1)',
};

// Map status texts to appropriate colors
export const getStatusColor = (status) => {
    status = status?.toLowerCase?.() || '';

    if (['active', 'delivered', 'resolved', 'completed', 'success', 'paid'].includes(status)) {
        return { text: statusColors.success, background: statusColors.successLight };
    }

    if (['inactive', 'pending', 'processing', 'shipped', 'in progress'].includes(status)) {
        return { text: statusColors.warning, background: statusColors.warningLight };
    }

    if (['cancelled', 'failed', 'out of stock', 'suspended', 'error'].includes(status)) {
        return { text: statusColors.error, background: statusColors.errorLight };
    }

    if (['new', 'info'].includes(status)) {
        return { text: statusColors.info, background: statusColors.infoLight };
    }

    if (['closed', 'neutral'].includes(status)) {
        return { text: statusColors.neutral, background: statusColors.neutralLight };
    }

    // Default fallback
    return { text: colors.text.primary, background: 'rgba(0, 0, 0, 0.05)' };
};

// Helper for status chip styling with improved contrast
export const getStatusChipStyle = (status) => {
    const { text, background } = getStatusColor(status);

    return {
        text: { color: text, fontWeight: '500' }, // Add font weight for better readability
        chip: { backgroundColor: background }
    };
};
