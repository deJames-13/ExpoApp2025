import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import NotificationHeader from './NotiicationHeader'
import NotificationList from './NotificationList'

export function NotificationScreen() {
    // State to store notifications
    const [notifications, setNotifications] = useState([]);
    // State to track selected notifications for bulk actions
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    // Selection mode state
    const [selectionMode, setSelectionMode] = useState(false);

    // Mock data loading
    useEffect(() => {
        // In a real app, you'd fetch this from an API
        const mockNotifications = [
            {
                id: '1',
                title: 'New Offer',
                shortDescription: '20% off on all eyewear products',
                timestamp: '10 min ago',
                read: false,
                fullContent: 'Enjoy 20% discount on all eyewear products until the end of the month. Visit our store or shop online to avail this limited time offer.',
                image: 'https://via.placeholder.com/50'
            },
            {
                id: '2',
                title: 'Order Shipped',
                shortDescription: 'Your order #12345 has been shipped',
                timestamp: '1 hour ago',
                read: true,
                fullContent: 'Your order #12345 has been shipped and is expected to arrive within 3-5 business days. You can track your order using the tracking number provided in your email.',
                image: 'https://via.placeholder.com/50'
            },
            {
                id: '3',
                title: 'Appointment Reminder',
                shortDescription: 'Your eye checkup is scheduled tomorrow',
                timestamp: '2 hours ago',
                read: false,
                fullContent: 'This is a reminder that your eye checkup appointment is scheduled for tomorrow at 10:00 AM. Please arrive 15 minutes early to complete the paperwork.',
                image: 'https://via.placeholder.com/50'
            },
        ];

        setNotifications(mockNotifications);
    }, []);

    // Function to clear all notifications
    const clearAllNotifications = () => {
        setNotifications([]);
        setSelectionMode(false);
        setSelectedNotifications([]);
    };

    // Function to mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    // Function to toggle selection mode
    const toggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedNotifications([]);
    };

    // Function to toggle selected notification
    const toggleSelectNotification = (id) => {
        if (selectedNotifications.includes(id)) {
            setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
        } else {
            setSelectedNotifications([...selectedNotifications, id]);
        }
    };

    // Function to handle deleting selected notifications
    const deleteSelected = () => {
        setNotifications(notifications.filter(notif => !selectedNotifications.includes(notif.id)));
        setSelectedNotifications([]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <NotificationHeader
                clearAll={clearAllNotifications}
                markAllAsRead={markAllAsRead}
                toggleSelectionMode={toggleSelectionMode}
                selectionMode={selectionMode}
                deleteSelected={deleteSelected}
                hasSelectedItems={selectedNotifications.length > 0}
            />
            <NotificationList
                notifications={notifications}
                selectionMode={selectionMode}
                selectedNotifications={selectedNotifications}
                toggleSelectNotification={toggleSelectNotification}
                setNotifications={setNotifications}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    }
});