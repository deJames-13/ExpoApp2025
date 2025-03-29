import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';

const CartDetailView = ({ route, navigation }) => {
    const { itemId } = route.params;
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Mock fetch item data - in a real app you'd get this from your data store
    useEffect(() => {
        // Simulate API call
        const fetchedItem = {
            id: itemId,
            name: 'Ray-Ban Aviator',
            price: 149.99,
            quantity: 1,
            status: 'In Stock',
            description: 'Classic aviator sunglasses with gold frame and green lenses',
            material: 'Metal',
            color: 'Gold/Green',
            warranty: '2 Years',
            imageUrl: 'placeholder-glasses.png'
        };

        setItem(fetchedItem);
        setQuantity(fetchedItem.quantity);
    }, [itemId]);

    if (!item) {
        return <View style={styles.loading}><Text>Loading...</Text></View>;
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>← Back to Cart</Text>
            </TouchableOpacity>

            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: process.env.EXPO_PUBLIC_APP_LOGO }}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>${item.price.toFixed(2)}</Text>

                <View style={styles.statusContainer}>
                    <Text style={[styles.status,
                    { color: item.status === 'In Stock' ? '#4CAF50' : '#FF9800' }]}>
                        {item.status}
                    </Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Product Details</Text>
                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.specsContainer}>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Material:</Text>
                        <Text style={styles.specValue}>{item.material}</Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Color:</Text>
                        <Text style={styles.specValue}>{item.color}</Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specLabel}>Warranty:</Text>
                        <Text style={styles.specValue}>{item.warranty}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.quantityContainer}>
                    <Text style={styles.sectionTitle}>Quantity:</Text>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
                        >
                            <Text style={styles.quantityButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantityValue}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => setQuantity(quantity + 1)}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.updateButton}>
                        <Text style={styles.updateButtonText}>Update Cart</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeButton}>
                        <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        padding: 16,
    },
    backButtonText: {
        color: '#2196F3',
        fontSize: 16,
    },
    imageContainer: {
        height: 250,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    detailsContainer: {
        padding: 16,
        backgroundColor: '#fff',
        marginTop: 8,
        borderRadius: 8,
        marginHorizontal: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    price: {
        fontSize: 20,
        color: '#2196F3',
        marginTop: 8,
    },
    statusContainer: {
        marginTop: 16,
    },
    status: {
        fontSize: 16,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 16,
        color: '#424242',
        lineHeight: 24,
    },
    specsContainer: {
        marginTop: 16,
    },
    specItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    specLabel: {
        fontSize: 16,
        fontWeight: '500',
        width: 100,
    },
    specValue: {
        fontSize: 16,
        color: '#424242',
    },
    quantityContainer: {
        marginBottom: 16,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        backgroundColor: '#f5f5f5',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    quantityButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    quantityValue: {
        fontSize: 18,
        marginHorizontal: 16,
    },
    actionsContainer: {
        marginTop: 24,
        flexDirection: 'row',
    },
    updateButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        alignItems: 'center',
    },
    updateButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    removeButton: {
        backgroundColor: '#ffebee',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    removeButtonText: {
        color: '#F44336',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CartDetailView;
