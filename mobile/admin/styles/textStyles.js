import { StyleSheet } from 'react-native';
import { adminColors } from './adminTheme';

// Consistent text styles for admin UI
export const textStyles = StyleSheet.create({
    // Headers
    pageHeader: {
        fontSize: 24,
        fontWeight: 'bold',
        color: adminColors.text.primary,
        marginBottom: 16,
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: '600',
        color: adminColors.text.primary,
        marginBottom: 12,
    },
    cardHeader: {
        fontSize: 18,
        fontWeight: '600',
        color: adminColors.text.primary,
        marginBottom: 8,
    },

    // Table styles
    tableHeader: {
        color: adminColors.text.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    tableCell: {
        color: adminColors.text.secondary,
        fontSize: 14,
    },
    tableCellEmphasis: {
        color: adminColors.text.primary,
        fontWeight: '500',
        fontSize: 14,
    },

    // Form labels
    formLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: adminColors.text.primary,
        marginBottom: 8,
    },

    // Detail views
    detailLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: adminColors.text.primary,
        marginTop: 8,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        color: adminColors.text.secondary,
        marginBottom: 8,
    },

    // Status and emphasis
    emphasizedText: {
        color: adminColors.text.primary,
        fontWeight: '600',
    },
    secondaryText: {
        color: adminColors.text.secondary,
    },
    lightText: {
        color: adminColors.text.light,
    },
});

export default textStyles;
