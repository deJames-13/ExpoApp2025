import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { Card } from 'react-native-paper';
import { itemsStyles as styles } from './styles';

const OrderItems = ({ items, formatCurrency }) => {
    const renderOrderItem = ({ item }) => (
        <View style={styles.orderItem}>
            <Image
                source={{ uri: item.imageUrl || process.env.EXPO_PUBLIC_APP_LOGO }}
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

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Order Items</Text>
                <FlatList
                    data={items}
                    renderItem={renderOrderItem}
                    keyExtractor={item => item.id}
                    scrollEnabled={false}
                />
            </Card.Content>
        </Card>
    );
};

export default OrderItems;
