import { StyleSheet } from 'react-native';
import { adminColors } from '~/styles/adminTheme';

// Shared styles that can be used across all OrderDetail components
const sharedStyles = {
    container: {
        marginVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF', // Explicit white background for all cards
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: adminColors.text.primary, // Ensure title text has good contrast
    },
};

// Main container styles
export const containerStyles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 8,
    },
    adminContainer: {
        backgroundColor: adminColors.background,
        padding: 16,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    adminSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        marginVertical: 12,
        padding: 16,
    },
    spacer: {
        height: 24,
    }
});

// OrderHeader styles
export const headerStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container
    },
    backButton: {
        marginBottom: 16,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.text.primary, // Ensure order number is visible
    },
    statusBadge: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    statusBadgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    orderDate: {
        marginTop: 8,
        color: adminColors.text.secondary, // Use secondary color for better contrast
    },
});

// OrderStatusWorkflow styles
export const workflowStyles = StyleSheet.create({
    statusWorkflowContainer: {
        marginVertical: 10,
    },
    statusStepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    statusStep: {
        alignItems: 'center',
        width: 60,
    },
    statusDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginBottom: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusStepText: {
        fontSize: 12,
        textAlign: 'center',
    },
    activeStatusStep: {
        color: adminColors.status.warning,
        fontWeight: 'bold',
    },
    completedStatusStep: {
        color: adminColors.status.success,
        fontWeight: 'bold',
    },
    inactiveStatusStep: {
        color: adminColors.text.light,
    },
    statusConnector: {
        height: 2,
        backgroundColor: adminColors.text.light,
        flex: 1,
    },
    statusButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    actionButton: {
        backgroundColor: adminColors.primary,
        margin: 4,
    },
    actionButtonLabel: {
        color: '#fff',
    },
    revertButton: {
        marginHorizontal: 5,
        borderColor: adminColors.text.secondary,
        margin: 4,
    },
    cancelButton: {
        borderColor: adminColors.status.error,
        margin: 4,
    },
    cancelledBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: adminColors.status.error,
        padding: 8,
        borderRadius: 4,
        marginBottom: 16,
    },
    cancelledIcon: {
        marginRight: 5,
    },
    cancelledBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelledText: {
        color: adminColors.status.error,
        fontStyle: 'italic',
        textAlign: 'center',
    },
});

// UserInfoCard styles
export const userStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container,
    },
    sectionTitle: {
        ...sharedStyles.sectionTitle,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userDetails: {
        marginLeft: 16,
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: adminColors.text.primary, // Ensure name is visible
    },
    userEmail: {
        fontSize: 14,
        color: adminColors.text.secondary, // Use secondary color for better contrast
        marginTop: 4,
    },
    userPhone: {
        fontSize: 14,
        color: adminColors.text.secondary, // Use secondary color for better contrast
        marginTop: 2,
    },
    addressContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 0.5,
        borderTopColor: '#e0e0e0',
    },
    addressLabel: {
        fontSize: 14,
        color: adminColors.text.secondary, // Use secondary color for better contrast
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        lineHeight: 20,
        color: adminColors.text.primary, // Ensure address text is visible
    },
    divider: {
        marginVertical: 16,
    },
    userMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    metaItem: {
        flex: 1,
    },
    metaLabel: {
        fontSize: 12,
        color: '#757575',
    },
    metaValue: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 2,
    },
});

// OrderItems styles
export const itemsStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container,
    },
    sectionTitle: {
        ...sharedStyles.sectionTitle,
    },
    orderItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        backgroundColor: '#f0f0f0',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: adminColors.text.primary, // Ensure item name is visible
    },
    itemPrice: {
        fontSize: 14,
        color: adminColors.text.secondary, // Use secondary color for better contrast
        marginTop: 4,
    },
    itemTotal: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 4,
        color: adminColors.text.primary, // Ensure total is visible
    },
});

// OrderSummary styles
export const summaryStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container,
    },
    sectionTitle: {
        ...sharedStyles.sectionTitle,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 16,
        color: adminColors.text.secondary, // Use secondary color for better contrast
    },
    summaryValue: {
        fontSize: 16,
        color: adminColors.text.primary, // Ensure value is visible
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.text.primary, // Ensure label is visible
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2196F3',
    },
});

// ShippingInfo styles
export const shippingStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container,
    },
    sectionTitle: {
        ...sharedStyles.sectionTitle,
    },
    addressName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 16,
        lineHeight: 22,
    },
    trackingContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    trackingTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    trackingNumber: {
        fontSize: 16,
        marginBottom: 4,
    },
    deliveryDate: {
        fontSize: 16,
        marginBottom: 16,
    },
    trackButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    trackButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    methodRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    methodLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#757575',
        width: 80,
    },
    methodValue: {
        fontSize: 16,
        color: '#212121',
        flex: 1,
    },
    addressContainer: {
        marginTop: 8,
        marginBottom: 16,
    },
    addressSectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#757575',
    },
});

// PaymentInfo styles
export const paymentStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container,
    },
    sectionTitle: {
        ...sharedStyles.sectionTitle,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: 16,
        color: '#757575',
    },
    summaryValue: {
        fontSize: 16,
    },
    paymentText: {
        fontSize: 16,
        color: adminColors.text.primary, // Ensure payment text is visible
    },
    statusChip: {
        height: 32,
        borderRadius: 14,
    },
});

// OrderActions styles
export const actionsStyles = StyleSheet.create({
    container: {
        ...sharedStyles.container,
    },
    actionsContainer: {
        flexDirection: 'row',
        padding: 0, // Override Card.Content padding
    },
    supportButton: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginRight: 8,
    },
    supportButtonText: {
        color: '#2196F3',
        fontWeight: 'bold',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#ffebee',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#F44336',
        fontWeight: 'bold',
    },
});
