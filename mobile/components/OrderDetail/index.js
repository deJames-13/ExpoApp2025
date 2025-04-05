import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { Text as PaperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Import component files
import OrderHeader from './OrderHeader';
import OrderStatusWorkflow from './OrderStatusWorkflow';
import UserOrderStatusWorkflow from './UserOrderStatusWorkflow';
import UserInfoCard from './UserInfoCard';
import OrderItems from './OrderItems';
import OrderSummary from './OrderSummary';
import ShippingInfo from './ShippingInfo';
import PaymentInfo from './PaymentInfo';
import OrderActions from './OrderActions';

// Import styles and theme utilities
import { containerStyles as styles } from './styles';
import { getOrderStatusColor } from './themeUtils';

const OrderDetail = ({
    order,
    isAdmin = false,
    onStatusChange = null,
    isLoading = false,
    error = null,
    onBack = () => { },
    onTrackPackage = () => { },
    onContactSupport = () => { },
    onCancelOrder = () => { },
}) => {
    const navigation = useNavigation();

    if (!order) {
        return (
            <View style={styles.loading}>
                <PaperText>{error || 'No order data available'}</PaperText>
            </View>
        );
    }

    // Format currency
    const formatCurrency = (amount) => {
        return `${process.env.EXPO_PUBLIC_APP_CURRENCY || '$'}${parseFloat(amount || 0).toFixed(2)}`;
    };

    return (
        <ScrollView style={[
            styles.scrollContainer,
            isAdmin && styles.adminContainer
        ]}>
            <OrderHeader
                order={order}
                isAdmin={isAdmin}
                onBack={onBack}
                getStatusColor={getOrderStatusColor}
            />

            {/* Review button for delivered orders */}
            {!isAdmin && order.status === 'delivered' && (
                <View style={styles.reviewButtonContainer}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() => navigation.navigate('Reviews', {
                            screen: 'ReviewForm',
                            params: { order }
                        })}
                    >
                        <Ionicons name="star-outline" size={18} color="#fff" />
                        <Text style={styles.reviewButtonText}>Write a Review</Text>
                    </TouchableOpacity>
                </View>
            )}

            {isAdmin ? (
                <View style={styles.adminSection}>
                    <OrderStatusWorkflow
                        currentStatus={order.status?.toLowerCase()}
                        onStatusChange={(newStatus) => onStatusChange(order, newStatus)}
                        isLoading={isLoading}
                    />
                </View>
            ) : (
                <UserOrderStatusWorkflow
                    currentStatus={order.status?.toLowerCase()}
                />
            )}

            {isAdmin && order.user && (
                <UserInfoCard user={order.user} isAdmin={isAdmin} />
            )}

            <OrderItems
                items={order.products || []}
                formatCurrency={formatCurrency}
            />

            <OrderSummary
                order={order}
                isAdmin={isAdmin}
                formatCurrency={formatCurrency}
            />

            <ShippingInfo
                order={order}
                isAdmin={isAdmin}
                trackPackage={order.status === 'shipped'}
                onTrackPackage={onTrackPackage}
            />

            <PaymentInfo
                order={order}
                isAdmin={isAdmin}
                getStatusColor={getOrderStatusColor}
            />

            {!isAdmin && !(order.status === 'delivered' || order.status === 'cancelled') && (
                <OrderActions
                    order={order}
                    onContactSupport={onContactSupport}
                    onCancelOrder={!(order.status === 'delivered' || order.status === 'cancelled') ? onCancelOrder : () => { }}
                />
            )}

            <View style={styles.spacer} />
        </ScrollView>
    );
};

export default OrderDetail;
