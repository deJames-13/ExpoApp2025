import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

export default function ItemListsView({ items }) {
    const renderItem = ({ item }) => {
        return (
            <View style={styles.itemContainer}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: process.env.EXPO_PUBLIC_APP_LOGO }}
                        style={styles.image}
                    />
                </View>
                <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.itemInfo}>
                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                        <Text style={styles.itemPrice}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {item.price.toFixed(2)}</Text>
                    </View>
                    <Text style={[styles.itemStatus, { color: getStatusColor(item.status) }]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        );
    };

    const getStatusColor = (status) => {
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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Items in Your Order</Text>
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#212121',
    },
    listContainer: {
        paddingBottom: 8,
    },
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 6,
        overflow: 'hidden',
        marginRight: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#212121',
        marginBottom: 4,
    },
    itemInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    itemQuantity: {
        fontSize: 14,
        color: '#757575',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2196F3',
    },
    itemStatus: {
        fontSize: 13,
        fontWeight: '500',
    }
});
