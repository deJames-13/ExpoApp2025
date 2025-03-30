import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';
import OrderDetail from '~/components/OrderDetail';
import LoadingScreen from '../LoadingScreen';
import useResource from '~/hooks/useResource';

const OrderDetailView = ({ route, navigation }) => {
    const { orderId } = route.params;
    const user = useSelector(selectCurrentUser);

    // Initialize resource hook for orders
    const api = useResource({ resourceName: 'orders', silent: false });
    const { fetchData, doUpdate } = api.actions;
    const { loading, current: order } = api.states;
    const { showSuccess, showError } = api.toast;

    const [error, setError] = useState(null);
    const [redirectTimer, setRedirectTimer] = useState(null);

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (redirectTimer) {
                clearTimeout(redirectTimer);
            }
        };
    }, [redirectTimer]);

    useEffect(() => {
        if (orderId) {
            loadOrderDetails();
        } else {
            handleRedirectToOrdersList('Missing order ID');
        }
    }, [orderId]);

    const handleRedirectToOrdersList = (errorMessage) => {
        showError('Error', errorMessage || 'Could not load order details');

        // Set a timer to navigate back after showing the error message
        const timer = setTimeout(() => {
            navigation.goBack();
        }, 1500); // 1.5 seconds delay

        setRedirectTimer(timer);
    };

    const loadOrderDetails = async () => {
        if (!orderId) {
            handleRedirectToOrdersList('Order ID is missing');
            return;
        }

        try {
            setError(null);
            const response = await fetchData({ id: orderId, verbose: false });
            console.log('response', response)
            // Check if the response indicates an error
            if (!response || response.error || !response?.resource.id) {
                handleRedirectToOrdersList('Order not found or access denied');
                return;
            }
        } catch (err) {
            console.error('Error fetching order details:', err);
            const errorMessage = err.status === 404
                ? 'Order not found'
                : (err.message || 'An error occurred while fetching order details');

            setError(errorMessage);
            handleRedirectToOrdersList(errorMessage);
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleTrackPackage = () => {
        Alert.alert('Track Package', 'Redirecting to carrier website...');
    };

    const handleContactSupport = () => {
        Alert.alert('Contact Support', 'Opening support chat...');
    };

    const handleCancelOrder = () => {
        if (!user || !order) {
            showError('Error', 'User information or order details missing');
            return;
        }

        if (order.status === 'delivered' || order.status === 'cancelled') {
            return
        }

        Alert.alert(
            'Cancel Order',
            'Are you sure you want to cancel this order?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel Order',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await doUpdate(orderId, {
                                user: user.id,
                                status: 'cancelled',
                                order: order
                            });

                            if (response) {
                                showSuccess('Order Cancelled', 'Your order has been cancelled successfully');
                                // Reload details to see updated status
                                loadOrderDetails();
                            }
                        } catch (err) {
                            console.error('Error cancelling order:', err);
                            showError('Error', err.message || 'An error occurred while cancelling the order');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return <LoadingScreen message="Loading order details..." />;
    }

    return (
        <View style={styles.container}>
            <OrderDetail
                order={order}
                isAdmin={false}
                onBack={handleBack}
                onContactSupport={handleContactSupport}
                onCancelOrder={handleCancelOrder}
                error={error}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
});

export default OrderDetailView;
