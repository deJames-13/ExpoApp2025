import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';

const CartCard = ({ item, onViewDetails, isSelected, onToggleSelection }) => {
    const { id, name, price, quantity, status } = item;

    const getStatusColor = () => {
        switch (status.toLowerCase()) {
            case 'in stock':
                return '#4CAF50'; // green
            case 'processing':
                return '#FF9800'; // orange
            case 'out of stock':
                return '#F44336'; // red
            default:
                return '#9E9E9E'; // grey
        }
    };

    const handlePress = () => {
        onToggleSelection(id);
    };

    const handleViewDetailsPress = () => {
        onViewDetails(id);
    };

    return (
        <TouchableOpacity
            style={[
                styles.cardContainer,
                isSelected && styles.selectedCard
            ]}
            onPress={handlePress}
        >
            <View style={styles.selectionIndicator}>
                <View style={[
                    styles.checkCircle,
                    isSelected && styles.checkedCircle
                ]}>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                </View>
            </View>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: process.env.EXPO_PUBLIC_APP_LOGO }}
                    style={styles.image}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.price}>${price.toFixed(2)}</Text>
                <View style={styles.detailsRow}>
                    <Text style={styles.quantity}>Qty: {quantity}</Text>
                    <Text style={[styles.status, { color: getStatusColor() }]}>
                        {status}
                    </Text>
                </View>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleViewDetailsPress}
                >
                    <Text style={styles.actionText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.removeButton]}>
                    <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    selectedCard: {
        borderColor: '#2196F3',
        backgroundColor: '#E3F2FD',
    },
    selectionIndicator: {
        justifyContent: 'center',
        marginRight: 8,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedCircle: {
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
    },
    checkmark: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        color: '#2196F3',
        marginBottom: 4,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    quantity: {
        fontSize: 14,
        color: '#757575',
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 8,
    },
    actionsContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginBottom: 4,
    },
    actionText: {
        color: '#2196F3',
        fontSize: 14,
    },
    removeButton: {
        backgroundColor: '#ffebee',
        borderRadius: 4,
    },
    removeText: {
        color: '#F44336',
        fontSize: 14,
    }
});

export default CartCard;
