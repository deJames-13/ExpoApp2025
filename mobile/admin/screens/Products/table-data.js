import React from 'react';
import { View, Text } from 'react-native';
import { getActionIcon } from '~/utils/iconHelper';

// Get status color based on stock level with better undefined handling
const getStockStatusColor = (stockValue) => {
    // Ensure stock is a number and handle undefined/null
    const stock = parseInt(stockValue) || 0;

    if (stock <= 0) return '#F44336'; // Red - Out of stock
    if (stock <= 5) return '#FFA000'; // Amber - Low stock
    if (stock <= 10) return '#2196F3'; // Blue - Medium stock
    return '#4CAF50'; // Green - Good stock
};

// Configuration for product table columns
export const productColumns = [
    {
        id: 'main',
        title: 'Product',
        field: 'name',
        textAlign: 'left',
        flex: 2,
        priority: 1,
        sortable: true,
        render: (item = {}) => (
            <View>
                <Text style={{ fontWeight: 'bold' }}>{item?.name || 'Unnamed Product'}</Text>
                {/* <Text style={{ fontSize: 12, color: '#666' }}>
                    {item?.category?.name || 'Uncategorized'}
                </Text> */}
            </View>
        )
    },
    // {
    //     id: 'brand',
    //     title: 'Brand',
    //     field: 'brand.name',
    //     textAlign: 'left',
    //     flex: 1,
    //     priority: 2,
    //     sortable: true,
    //     render: (item = {}) => (
    //         <Text>{item?.brand?.name || 'No Brand'}</Text>
    //     )
    // },
    {
        id: 'price',
        title: 'Price',
        field: 'price',
        textAlign: 'right',
        flex: 1,
        priority: 1,
        sortable: true,
        render: (item = {}) => (
            <Text style={{ fontWeight: 'bold' }}>
                ${parseFloat(item?.price || 0).toFixed(2)}
            </Text>
        )
    },
    {
        id: 'stock',
        title: 'Stock',
        field: 'stock',
        width: 80,
        textAlign: 'center',
        priority: 1,
        sortable: true,
        render: (item = {}) => {
            const stock = parseInt(item?.stock) || 0;
            return (
                <View style={{
                    backgroundColor: getStockStatusColor(stock) + '20', // 20% opacity
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 4,
                    alignSelf: 'flex-start'
                }}>
                    <Text style={{
                        color: getStockStatusColor(stock),
                        fontWeight: '500'
                    }}>
                        {stock}
                    </Text>
                </View>
            );
        }
    },
    {
        id: 'rating',
        title: 'Rating',
        field: 'averageRating',
        width: 80,
        textAlign: 'center',
        priority: 3,
        sortable: true,
        render: (item = {}) => {
            const rating = parseFloat(item?.averageRating);
            return (
                <Text>
                    {!isNaN(rating) ? rating.toFixed(1) : '—'}
                </Text>
            );
        }
    }
];

// Configuration for table actions - using the icon helper
export const productActions = [
    { id: 'view', icon: getActionIcon('view', 'Ionicons'), color: '#2196F3' },
    { id: 'edit', icon: getActionIcon('edit', 'Ionicons'), color: '#4B5563' },
    { id: 'delete', icon: getActionIcon('delete', 'Ionicons'), color: '#EF4444' },
];
