import React from 'react';
import { View, Text, Alert } from 'react-native';
import { Button, Icon } from 'react-native-paper';
import { workflowStyles as styles } from './styles';
import { adminColors } from '~/styles/adminTheme';
import { statusLabels, getStatusIcon, getStatusVisualProps } from './themeUtils';

const OrderStatusWorkflow = ({ currentStatus, onStatusChange, isLoading }) => {
    const confirmStatusChange = (newStatus) => {
        Alert.alert(
            `Confirm Status Change`,
            `Are you sure you want to change the order status to ${statusLabels[newStatus]}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Confirm', onPress: () => onStatusChange(newStatus) }
            ]
        );
    };

    const confirmCancellation = () => {
        Alert.alert(
            'Confirm Cancellation',
            'Are you sure you want to cancel this order? This action cannot be undone.',
            [
                { text: 'No', style: 'cancel' },
                { text: 'Yes, Cancel Order', style: 'destructive', onPress: () => onStatusChange('cancelled') }
            ]
        );
    };

    // Determine which buttons to show based on current status
    const renderStatusButtons = () => {
        // Add disabled state based on isLoading prop
        const buttonProps = { disabled: isLoading };

        switch (currentStatus) {
            case 'pending':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="contained"
                            icon="check-circle-outline"
                            onPress={() => confirmStatusChange('processing')}
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            {...buttonProps}
                        >
                            Process
                        </Button>
                        <View style={styles.cancelButtonContainer}>
                            <Button
                                mode="outlined"
                                icon="close-circle-outline"
                                onPress={confirmCancellation}
                                style={[styles.cancelButton]}
                                textColor={adminColors.status.error}
                                {...buttonProps}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                );

            case 'processing':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="outlined"
                            icon="arrow-left"
                            onPress={() => confirmStatusChange('pending')}
                            style={styles.revertButton}
                            textColor={adminColors.text.secondary}
                            {...buttonProps}
                        >
                            Revert
                        </Button>
                        <Button
                            mode="contained"
                            icon="truck-delivery-outline"
                            onPress={() => confirmStatusChange('shipped')}
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            {...buttonProps}
                        >
                            Ship
                        </Button>
                        <View style={styles.cancelButtonContainer}>
                            <Button
                                mode="outlined"
                                icon="close-circle-outline"
                                onPress={confirmCancellation}
                                style={[styles.cancelButton]}
                                textColor={adminColors.status.error}
                                {...buttonProps}
                            >
                                Cancel
                            </Button>
                        </View>
                    </View>
                );

            case 'shipped':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="outlined"
                            icon="arrow-left"
                            onPress={() => confirmStatusChange('processing')}
                            style={styles.revertButton}
                            textColor={adminColors.text.secondary}
                            {...buttonProps}
                        >
                            Revert
                        </Button>
                        <Button
                            mode="contained"
                            icon="check-circle"
                            onPress={() => confirmStatusChange('delivered')}
                            style={styles.actionButton}
                            labelStyle={styles.actionButtonLabel}
                            {...buttonProps}
                        >
                            Deliver
                        </Button>
                    </View>
                );

            case 'delivered':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Button
                            mode="outlined"
                            icon="arrow-left"
                            onPress={() => confirmStatusChange('shipped')}
                            style={styles.revertButton}
                            textColor={adminColors.text.secondary}
                            {...buttonProps}
                        >
                            Revert
                        </Button>
                    </View>
                );

            case 'cancelled':
                return (
                    <View style={styles.statusButtonsContainer}>
                        <Text style={styles.cancelledText}>
                            This order has been cancelled and cannot be processed further.
                        </Text>
                    </View>
                );

            default:
                return null;
        }
    };

    // Render a status step with appropriate styling based on current status
    const renderStatusStep = (stepStatus, label) => {
        const { dotColor, textStyle } = getStatusVisualProps(stepStatus, currentStatus);
        const icon = getStatusIcon(stepStatus, currentStatus);

        return (
            <View style={styles.statusStep}>
                <View style={[
                    styles.statusDot,
                    { backgroundColor: dotColor }
                ]}>
                    {icon && (
                        <Icon
                            source={icon}
                            size={10}
                            color="#fff"
                        />
                    )}
                </View>
                <Text style={[styles.statusStepText, styles[textStyle]]}>
                    {label}
                </Text>
            </View>
        );
    };

    // Visualization of the workflow
    return (
        <View style={styles.statusWorkflowContainer}>
            <View style={styles.statusStepsContainer}>
                {renderStatusStep('pending', 'Pending')}
                <View style={styles.statusConnector} />
                {renderStatusStep('processing', 'Processing')}
                <View style={styles.statusConnector} />
                {renderStatusStep('shipped', 'Shipped')}
                <View style={styles.statusConnector} />
                {renderStatusStep('delivered', 'Delivered')}
            </View>

            {currentStatus === 'cancelled' && (
                <View style={styles.cancelledBadge}>
                    <Icon source="close-circle" size={16} color="#fff" style={styles.cancelledIcon} />
                    <Text style={styles.cancelledBadgeText}>Cancelled</Text>
                </View>
            )}

            {renderStatusButtons()}
        </View>
    );
};

export default OrderStatusWorkflow;
