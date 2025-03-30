import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { selectUnreadCount } from '../states/slices/notification';
import { useGetUserNotificationsQuery } from '../states/api/notification';

const NotificationBell = ({ color = '#333', size = 24 }) => {
    const navigation = useNavigation();
    const unreadCount = useSelector(selectUnreadCount);
    const { refetch } = useGetUserNotificationsQuery();

    // Refetch notifications when component mounts
    useEffect(() => {
        refetch();
    }, []);

    const handlePress = () => {
        navigation.navigate('Notifications');
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            <Ionicons name="notifications" size={size} color={color} />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 8,
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        right: 0,
        top: 0,
        backgroundColor: 'red',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default NotificationBell;
