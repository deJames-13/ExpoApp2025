import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { workflowStyles as baseStyles } from './styles';
import { getOrderStatusColor } from './themeUtils';

const UserOrderStatusWorkflow = ({ currentStatus }) => {
    // Normalize status to lowercase for consistency
    const status = currentStatus?.toLowerCase() || 'pending';

    // Define status steps and their icons
    const statusSteps = [
        { key: 'pending', label: 'Pending', icon: 'timer-sand', iconComponent: MaterialCommunityIcons },
        { key: 'processing', label: 'Processing', icon: 'cog', iconComponent: MaterialCommunityIcons },
        { key: 'shipped', label: 'Shipped', icon: 'truck-delivery', iconComponent: MaterialCommunityIcons },
        { key: 'delivered', label: 'Delivered', icon: 'package-variant-closed', iconComponent: MaterialCommunityIcons }
    ];

    // Get status index for determining active/completed steps
    const currentIndex = statusSteps.findIndex(step => step.key === status);
    const isCancelled = status === 'cancelled';

    // Helper function to determine dot color based on status
    const getDotColor = (stepIndex) => {
        if (isCancelled) return '#9E9E9E'; // Grey for all steps if cancelled

        if (stepIndex < currentIndex) return '#4CAF50'; // Green for completed steps
        if (stepIndex === currentIndex) return '#FF9800'; // Orange for current step
        return '#9E9E9E'; // Grey for future steps
    };

    // Helper function to determine icon color based on status
    const getIconColor = (stepIndex) => {
        if (isCancelled) return '#FFFFFF'; // White icons on grey for cancelled

        if (stepIndex < currentIndex) return '#FFFFFF'; // White icons on green for completed
        if (stepIndex === currentIndex) return '#FFFFFF'; // White icons on orange for current
        return '#757575'; // Grey icons for future steps
    };

    // Helper function to determine text style
    const getTextStyle = (stepIndex) => {
        if (isCancelled) return styles.inactiveStatusStep;

        if (stepIndex < currentIndex) return styles.completedStatusStep;
        if (stepIndex === currentIndex) return styles.activeStatusStep;
        return styles.inactiveStatusStep;
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Order Status</Text>

                {isCancelled ? (
                    <View style={styles.cancelledBadge}>
                        <MaterialCommunityIcons name="cancel" size={20} color="#fff" style={styles.cancelledIcon} />
                        <Text style={styles.cancelledBadgeText}>Order Cancelled</Text>
                    </View>
                ) : (
                    <View style={styles.statusStepsContainer}>
                        {statusSteps.map((step, index) => (
                            <React.Fragment key={step.key}>
                                {index > 0 && (
                                    <View
                                        style={[
                                            styles.statusConnector,
                                            { backgroundColor: index <= currentIndex ? '#4CAF50' : '#9E9E9E' }
                                        ]}
                                    />
                                )}
                                <View style={styles.statusStep}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            { backgroundColor: getDotColor(index) }
                                        ]}
                                    >
                                        <step.iconComponent
                                            name={step.icon}
                                            size={14}
                                            color={getIconColor(index)}
                                        />
                                    </View>
                                    <Text style={[styles.statusStepText, getTextStyle(index)]}>
                                        {step.label}
                                    </Text>
                                </View>
                            </React.Fragment>
                        ))}
                    </View>
                )}

                {/* Notes or additional info about the status */}
                <View style={styles.notesContainer}>
                    <Text style={styles.statusNote}>
                        {isCancelled
                            ? "This order has been cancelled and will not be processed further."
                            : getStatusNote(status)}
                    </Text>
                </View>
            </Card.Content>
        </Card>
    );
};

// Helper function to get note text based on status
const getStatusNote = (status) => {
    switch (status) {
        case 'pending':
            return "Your order has been received and is awaiting processing.";
        case 'processing':
            return "We're preparing your items and will ship them soon.";
        case 'shipped':
            return "Your order is on its way to you!";
        case 'delivered':
            return "Your order has been delivered. Enjoy!";
        default:
            return "Your order is being processed.";
    }
};

const styles = StyleSheet.create({
    ...baseStyles,
    container: {
        marginVertical: 12,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#212121',
    },
    notesContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    statusNote: {
        color: '#616161',
        fontSize: 14,
        lineHeight: 20,
    }
});

export default UserOrderStatusWorkflow;
