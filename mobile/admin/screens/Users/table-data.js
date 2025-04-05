import React from 'react';
import { View, Text } from 'react-native';
import { getActionIcon } from '~/utils/iconHelper';

// Get role color based on role type
const getRoleColor = (role) => {
    const colors = {
        admin: '#8E24AA', // Purple for admin
        manager: '#1E88E5', // Blue for manager
        customer: '#43A047', // Green for customer
        employee: '#FB8C00', // Orange for other employee types
    };
    return colors[role] || '#757575'; // Grey default
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

// Configuration for user table columns
export const userColumns = [
    {
        id: 'main',
        title: 'User',
        field: 'username',
        textAlign: 'left',
        flex: 2,
        priority: 1,
        sortable: true,
        render: (item) => (
            <View>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                    {item.info?.first_name && item.info?.last_name ?
                        `${item.info.first_name} ${item.info.last_name}` :
                        item.username}
                </Text>
                <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                    @{item.username}
                </Text>
            </View>
        )
    },
    {
        id: 'contact',
        title: 'Contact',
        field: 'email',
        textAlign: 'left',
        flex: 1.5,
        priority: 2,
        sortable: true,
        render: (item) => (
            <View>
                <Text style={{ fontSize: 13, marginBottom: 2 }}>
                    {item.email}
                </Text>
                {item.info?.contact && (
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        {item.info.contact}
                    </Text>
                )}
            </View>
        )
    },
    {
        id: 'role',
        title: 'Role',
        field: 'role',
        width: 100,
        textAlign: 'center',
        priority: 1,
        sortable: true,
        render: (item) => (
            <View style={{
                backgroundColor: getRoleColor(item.role) + '20',
                paddingVertical: 4,
                paddingHorizontal: 8,
                borderRadius: 4,
                alignSelf: 'flex-start'
            }}>
                <Text style={{
                    color: getRoleColor(item.role),
                    fontWeight: '500',
                    textTransform: 'capitalize'
                }}>
                    {item.role}
                </Text>
            </View>
        )
    },
    {
        id: 'status',
        title: 'Status',
        field: 'emailVerifiedAt',
        width: 100,
        textAlign: 'center',
        priority: 3,
        sortable: true,
        render: (item) => (
            <View>
                <View style={{
                    backgroundColor: item.emailVerifiedAt ? '#4CAF5020' : '#FFA00020',
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    borderRadius: 4,
                    alignSelf: 'flex-start'
                }}>
                    <Text style={{
                        color: item.emailVerifiedAt ? '#4CAF50' : '#FFA000',
                        fontWeight: '500',
                    }}>
                        {item.emailVerifiedAt ? 'Verified' : 'Unverified'}
                    </Text>
                </View>
                {item.emailVerifiedAt && (
                    <Text style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
                        {formatDate(item.emailVerifiedAt)}
                    </Text>
                )}
            </View>
        )
    },
    {
        id: 'joined',
        title: 'Joined',
        field: 'createdAt',
        width: 90,
        textAlign: 'right',
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
export const userActions = [
    { id: 'view', icon: getActionIcon('eye', 'Ionicons'), color: '#4B5563' },
    { id: 'edit', icon: getActionIcon('edit', 'Ionicons'), color: '#4B5563' },
    { id: 'delete', icon: getActionIcon('delete', 'Ionicons'), color: '#EF4444' },
];
