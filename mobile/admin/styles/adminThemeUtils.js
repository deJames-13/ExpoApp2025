import { colors } from '../../theme/colors';

// Status color palette with proper opacity variants
export const statusColors = {
    // Success states
    success: '#00C853',
    successLight: 'rgba(0, 200, 83, 0.1)',

    // Warning states
    warning: '#FF9100',
    warningLight: 'rgba(255, 145, 0, 0.1)',

    // Error states
    error: '#D50000',
    errorLight: 'rgba(213, 0, 0, 0.1)',

    // Info states
    info: '#2979FF',
    infoLight: 'rgba(41, 121, 255, 0.1)',

    // Neutral states
    neutral: '#757575',
    neutralLight: 'rgba(117, 117, 117, 0.1)',
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

// Helper for status chip styling
export const getStatusChipStyle = (status) => {
    const { text, background } = getStatusColor(status);

    return {
        text: { color: text },
        chip: { backgroundColor: background }
    };
};
