import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { itemsStyles as styles } from './styles';

const OrderItems = ({ items, formatCurrency }) => {
    // Prepare items array with needed properties
    const prepareItems = () => {
        if (!items || !Array.isArray(items)) return [];

        return items.map((item, index) => {
            return {
                id: item._id || item.id || `item-${index}`,
                name: item.name || 'Unknown Product',
                price: item.price || 0,
                quantity: item.quantity || 1,
                imageUrl: item.images && item.images.length > 0
                    ? item.images[0].url
                    : process.env.EXPO_PUBLIC_APP_LOGO || 'https://via.placeholder.com/60'
            };
        });
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Image
                source={{ uri: item.imageUrl }}
                style={styles.itemImage}
                resizeMode="cover"
            />
            <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>
                    {formatCurrency(item.price)} x {item.quantity}
                </Text>
                <Text style={styles.itemTotal}>
                    {formatCurrency(item.price * item.quantity)}
                </Text>
            </View>
        </View>
    );

    const orderItems = prepareItems();

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <FlatList
                    data={orderItems}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </Card.Content>
        </Card>
    );
};

export default OrderItems;
