import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Checkbox } from 'react-native-paper';

const CartCard = ({ item, onViewDetails, onDeleteItem, isSelected, onToggleSelection }) => {
    const productName = item.product?.name || 'Product';
    const productPrice = item.price || 0;
    const quantity = item.quantity || 0;
    const total = item.total || 0;
    const imageUrl = item.product?.images?.length && item.product?.images[0]?.url || process.env.EXPO_PUBLIC_APP_LOGO;
    const status = item.product?.stock > 0 ? 'In Stock' : 'Out of Stock';

    return (
        <View style={[styles.card, isSelected && styles.selectedCard]}>
            <TouchableOpacity style={styles.checkbox} onPress={onToggleSelection}>
                <Checkbox
                    status={isSelected ? 'checked' : 'unchecked'}
                    onPress={onToggleSelection}
                    color="#2196F3"
                />
            </TouchableOpacity>

            <Image
                source={{ uri: imageUrl }}
                style={styles.image}
                resizeMode="contain"
            />

            <View style={styles.details}>
                <Text style={styles.name} numberOfLines={2}>{productName}</Text>
                <Text style={styles.price}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {productPrice.toFixed(2)}</Text>
                <View style={styles.quantityRow}>
                    <Text style={styles.quantity}>Qty: {quantity}</Text>
                    <Text style={[styles.status, {
                        color: status === 'In Stock' ? '#4CAF50' : '#F44336'
                    }]}>
                        {status}
                    </Text>
                </View>
                <Text style={styles.total}>Total: {process.env.EXPO_PUBLIC_APP_CURRENCY} {total.toFixed(2)}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={onViewDetails}>
                    <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDeleteItem}>
                    <Text style={styles.deleteButtonText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    selectedCard: {
        borderColor: '#2196F3',
        borderWidth: 1,
        backgroundColor: '#E3F2FD',
    },
    checkbox: {
        justifyContent: 'center',
        marginRight: 8,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 4,
        backgroundColor: '#f5f5f5',
    },
    details: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: '#2196F3',
        marginBottom: 2,
    },
    quantityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    quantity: {
        fontSize: 14,
        color: '#757575',
    },
    status: {
        fontSize: 12,
        fontWeight: '500',
    },
    total: {
        fontSize: 14,
        fontWeight: '500',
    },
    actions: {
        justifyContent: 'space-between',
        paddingLeft: 8,
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        marginBottom: 6,
    },
    actionButtonText: {
        color: '#2196F3',
        fontWeight: '500',
        fontSize: 12,
    },
    deleteButton: {
        backgroundColor: '#FFEBEE',
    },
    deleteButtonText: {
        color: '#F44336',
        fontWeight: '500',
        fontSize: 12,
    },
});

export default CartCard;
