import React from 'react';
import { View, Text } from 'react-native';
import { getActionIcon } from '~/utils/iconHelper';

// Get rating color based on score
const getRatingColor = (rating) => {
    if (rating >= 8) return '#4CAF50'; // Green for high ratings
    if (rating >= 6) return '#8BC34A'; // Light green for good ratings
    if (rating >= 4) return '#FFA000'; // Amber for average ratings
    if (rating >= 2) return '#F57C00'; // Orange for poor ratings
    return '#F44336'; // Red for bad ratings
};

// Format date for display
const formatDate = (date) => {
    if (!date) return '--';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Configuration for review table columns
export const reviewColumns = [
    {
        id: 'main',
        title: 'Review',
        field: 'title',
        textAlign: 'left',
        flex: 2,
        priority: 1,
        sortable: true,
        render: (item) => (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    {item.title || 'Untitled Review'}
                </Text>
                {item.description && (
                    <Text numberOfLines={2} style={{ fontSize: 12, color: '#666', marginTop: 3 }}>
                        {item.description.length > 80 ?
                            `${item.description.substring(0, 80)}...` :
                            item.description}
                    </Text>
                )}
            </View>
        )
    },
    {
        id: 'rating',
        title: 'Rating',
        field: 'rating',
        textAlign: 'center',
        width: 80,
        priority: 1,
        sortable: true,
        render: (item) => (
            <View style={{
                backgroundColor: getRatingColor(item.rating) + '20',
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 4,
                alignSelf: 'flex-start'
            }}>
                <Text style={{
                    color: getRatingColor(item.rating),
                    fontWeight: 'bold',
                    fontSize: 16
                }}>
                    {item.rating}/10
                </Text>
            </View>
        )
    },
    {
        id: 'user',
        title: 'User',
        field: 'user',
        textAlign: 'left',
        flex: 1.5,
        priority: 2,
        sortable: true,
        render: (item) => {
            if (item.isAnonymous) {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontStyle: 'italic', color: '#666' }}>Anonymous</Text>
                    </View>
                );
            }

            const username = typeof item.user === 'object' ?
                item.user.username :
                (typeof item.user === 'string' ? item.user : 'Unknown');

            const fullName = typeof item.user === 'object' && item.user.full_name ?
                item.user.full_name : '';

            return (
                <View>
                    {fullName && <Text style={{ fontWeight: '500' }}>{fullName}</Text>}
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        {username !== 'Unknown' ? `@${username}` : 'Unknown user'}
                    </Text>
                </View>
            );
        }
    },
    {
        id: 'product',
        title: 'Product',
        field: 'product.name',
        textAlign: 'left',
        flex: 1.5,
        priority: 3,
        sortable: true,
        render: (item) => {
            const productName = item.product?.name || 'Unknown product';
            return (
                <View>
                    <Text numberOfLines={1} style={{ fontWeight: '500' }}>
                        {productName}
                    </Text>
                    {item.order && (
                        <Text style={{ fontSize: 12, color: '#666' }}>
                            Order #{typeof item.order === 'object' ? item.order.id?.substring(0, 8) : item.order.substring(0, 8)}
                        </Text>
                    )}
                </View>
            );
        }
    },
    {
        id: 'date',
        title: 'Date',
        field: 'createdAt',
        textAlign: 'right',
        width: 100,
        priority: 3,
        sortable: true,
        render: (item) => (
            <Text style={{ fontSize: 12, color: '#666' }}>
                {formatDate(item.createdAt)}
            </Text>
        )
    }
];

// Configuration for table actions - using the icon helper
export const reviewActions = [
    { id: 'view', icon: getActionIcon('eye', 'Ionicons'), color: '#4B5563' },
    { id: 'edit', icon: getActionIcon('edit', 'Ionicons'), color: '#4B5563' },
    { id: 'delete', icon: getActionIcon('delete', 'Ionicons'), color: '#EF4444' },
];
