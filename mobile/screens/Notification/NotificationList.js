import { View, FlatList, Text, StyleSheet, RefreshControl } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import NotificationCard from './NotificationCard';
import { markAsRead } from '~/states/slices/notification';
import { useMarkNotificationAsReadMutation } from '~/states/api/notification';

const NotificationList = ({
    notifications,
    selectionMode,
    selectedNotifications,
    toggleSelectNotification,
    onViewDetails,
    refreshing,
    onRefresh
}) => {
    const dispatch = useDispatch();
    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();

    // Function to handle marking a notification as read
    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
        markNotificationAsRead(id);
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
                    onViewDetails={() => onViewDetails(item)}
                />
            )}
            ListEmptyComponent={renderEmptyList}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={['#2196F3']}
                    tintColor={'#2196F3'}
                />
            }
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
