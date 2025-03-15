import { View, FlatList, Text, StyleSheet } from 'react-native';
import React from 'react';
import NotificationCard from './NotificationCard';

const NotificationList = ({
    notifications,
    selectionMode,
    selectedNotifications,
    toggleSelectNotification,
    setNotifications
}) => {
    // Function to handle marking a notification as read
    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
        ));
    };

    // Function to handle deleting a specific notification
    const handleDeleteNotification = (id) => {
        setNotifications(notifications.filter(notification => notification.id !== id));
    };

    // Empty list placeholder
    const renderEmptyList = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications available</Text>
        </View>
    );

    return (
        <FlatList
            data={notifications}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
                <NotificationCard
                    notification={item}
                    selectionMode={selectionMode}
                    isSelected={selectedNotifications.includes(item.id)}
                    onSelect={() => toggleSelectNotification(item.id)}
                    onMarkAsRead={() => handleMarkAsRead(item.id)}
                    onDelete={() => handleDeleteNotification(item.id)}
                />
            )}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    separator: {
        height: 8,
    }
});

export default NotificationList;
