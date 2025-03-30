import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Card, Chip, Divider } from 'react-native-paper';
import { useGetUserNotificationsQuery } from '~/states/api/notification';
import { getStatusChipStyle } from '~/styles/adminThemeUtils';
import { styles } from './styles';

const NotificationHistory = () => {
    const { data: notificationsData, isLoading } = useGetUserNotificationsQuery();

    if (isLoading) {
        return <ActivityIndicator size="large" color={styles.loader.color} style={styles.loader} />;
    }

    if (!notificationsData?.data?.length) {
        return <Text style={styles.emptyText}>No notifications found</Text>;
    }

    return (
        <>
            {notificationsData.data.map((notification, index) => {
                const statusStyle = getStatusChipStyle(notification.type || 'info');

                return (
                    <View key={notification.id || index} style={styles.historyItem}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.historyTitle}>{notification.title}</Text>
                            <Chip
                                style={statusStyle.chip}
                                textStyle={statusStyle.text}
                            >
                                {notification.type}
                            </Chip>
                        </View>
                        <Text style={styles.historyBody}>{notification.body}</Text>
                        <Text style={styles.historyDate}>
                            {new Date(notification.createdAt).toLocaleString()}
                        </Text>
                        <Divider style={styles.divider} />
                    </View>
                );
            })}
        </>
    );
};

export default NotificationHistory;
