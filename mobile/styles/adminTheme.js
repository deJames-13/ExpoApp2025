import { StyleSheet } from 'react-native';
import { globalStyles } from './global';
import { colors } from '../theme/colors';
import { theme } from '../core/theme';
import { statusColors, getStatusColor } from './adminThemeUtils';

// Admin-specific color palette extending the main theme
export const adminColors = {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    background: colors.background,
    cardBackground: '#FFFFFF', // Pure white for card backgrounds
    text: {
        primary: '#212121', // Dark text for good contrast
        secondary: '#424242', // Medium dark for secondary text
        light: '#757575',    // Light text for less emphasis
    },
    status: statusColors,
    card: {
        stats: {
            users: '#E1F5FE',    // Lighter blue with better visibility
            orders: '#FFF8E1',   // Lighter amber
            revenue: '#E8F5E9',  // Lighter green
            pending: '#FFEBEE',  // Lighter red
        }
    }
};

// Admin theme styles extending global styles
export const adminStyles = StyleSheet.create({
    // Base containers
    container: {
        ...globalStyles.container,
        padding: 16,
        backgroundColor: adminColors.background,
    },
    safeArea: {
        flex: 1,
        backgroundColor: adminColors.background,
    },
    scrollView: {
        flexGrow: 1,
    },
    loadingContainer: {
        ...globalStyles.centeredContainer,
    },

    // Typography
    pageTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: adminColors.text.primary,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: adminColors.text.primary,
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: adminColors.text.primary,
        marginBottom: 8,
    },
    cardValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: adminColors.text.primary,
    },
    cardLabel: {
        fontSize: 16,
        color: adminColors.text.secondary,
        fontWeight: '500',
    },

    // Cards
    card: {
        ...globalStyles.card,
        marginBottom: 16,
        backgroundColor: adminColors.cardBackground, // Make sure card background is white
        // Enhanced shadow for better visibility
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statsCard: {
        width: '48%',
        marginBottom: 12,
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderRadius: 12,
        // Enhanced shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },

    // List & Table elements
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        paddingVertical: 12,
    },
    tableHeader: {
        backgroundColor: '#F5F5F5', // Light gray background for headers
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    tableRow: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },

    // Action buttons
    actionButton: {
        backgroundColor: adminColors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 16,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    viewAllButton: {
        alignSelf: 'flex-end',
        marginTop: 8,
    },

    // Status indicators
    statusText: (status) => {
        const { text } = getStatusColor(status);
        return {
            color: text,
            fontWeight: '600', // Make status text bold for better visibility
        };
    },
});

export default adminStyles;
