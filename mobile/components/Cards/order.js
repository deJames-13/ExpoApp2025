import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const OrderCard = ({ order, onViewDetails }) => {
    if (!order) return null;

    const { id, orderNumber, date, totalAmount, items = [], status } = order;

    const getStatusColor = () => {
        if (!status) return '#9E9E9E'; // default gray

        switch (status.toLowerCase()) {
            case 'delivered':
                return '#4CAF50'; // green
            case 'shipped':
                return '#2196F3'; // blue
            case 'processing':
                return '#FF9800'; // orange
            case 'pending':
                return '#9E9E9E'; // gray
            case 'cancelled':
                return '#F44336'; // red
            default:
                return '#9E9E9E'; // grey
        }
    };

    // Get the first item image to display as the order thumbnail
    const mainItemImageUrl = items && items[0] && items[0].images && items[0].images[0]
        ? items[0].images[0].url
        : process.env.EXPO_PUBLIC_APP_LOGO;

    return (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => onViewDetails(id)}
        >
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{orderNumber || 'Unknown'}</Text>
                <Text style={[styles.status, { color: getStatusColor() }]}>
                    {status || 'Unknown'}
                </Text>
            </View>

            <View style={styles.orderContent}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: mainItemImageUrl }}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {items.length > 1 && (
                        <View style={styles.badgeContainer}>
                            <Text style={styles.badgeText}>+{items.length - 1}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.date}>{date || 'Unknown date'}</Text>
                    <Text style={styles.itemCount}>{items.length} item{items.length !== 1 ? 's' : ''}</Text>
                    <Text style={styles.totalAmount}>
                        {process.env.EXPO_PUBLIC_APP_CURRENCY || '$'} {(totalAmount || 0).toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onViewDetails(id)}
                >
                    <Text style={styles.actionText}>View</Text>
                </TouchableOpacity>

                {status && status.toLowerCase() === 'delivered' && (
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionText}>Review</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    status: {
        fontSize: 14,
        fontWeight: '600',
    },
    orderContent: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 12,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    badgeContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderTopLeftRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    date: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 4,
    },
    itemCount: {
        fontSize: 14,
        marginBottom: 4,
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 8,
        backgroundColor: '#f5f5f5',
        borderRadius: 4,
    },
    actionText: {
        color: '#2196F3',
        fontSize: 14,
    },
});

export default OrderCard;
