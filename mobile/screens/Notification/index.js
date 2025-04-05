import { View, StyleSheet, SafeAreaView, StatusBar, Modal, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import NotificationHeader from './NotiicationHeader'
import NotificationList from './NotificationList'
import NotificationViewModal from './NotificationViewModal'
import LoadingScreen from '../LoadingScreen'
import {
    useGetUserNotificationsQuery,
    useMarkNotificationAsReadMutation,
    useMarkAllNotificationsAsReadMutation,
    useClearAllNotificationsMutation,
    useDeleteSelectedNotificationsMutation
} from '~/states/api/notification'
import {
    markAsRead,
    markAllAsRead,
    selectNotifications,
    selectNotificationLoading,
    setActiveNotification,
    clearActiveNotification
} from '~/states/slices/notification'

export function NotificationScreen() {
    const dispatch = useDispatch();
    const notifications = useSelector(selectNotifications);
    const isLoading = useSelector(selectNotificationLoading);
    const [selectedNotifications, setSelectedNotifications] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // API queries and mutations
    const { refetch, isFetching, data } = useGetUserNotificationsQuery();
    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
    const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation();
    const [clearAllNotificationsMutation] = useClearAllNotificationsMutation();
    const [deleteSelectedNotificationsMutation] = useDeleteSelectedNotificationsMutation();

    // Handle refresh state
    useEffect(() => {
        if (!isFetching && isRefreshing) {
            setIsRefreshing(false);
        }
    }, [isFetching, isRefreshing]);

    // Function to handle pull-to-refresh
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch();
    };

    // Function to clear all notifications
    const clearAllNotifications = () => {
        Alert.alert(
            "Clear All Notifications",
            "Are you sure you want to clear all notifications? This cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Clear All",
                    style: "destructive",
                    onPress: () => {
                        clearAllNotificationsMutation()
                            .unwrap()
                            .then(() => {
                                // Refetch to update the UI
                                refetch();
                                setSelectionMode(false);
                                setSelectedNotifications([]);
                            })
                            .catch(error => {
                                console.error('Failed to clear notifications:', error);
                                Alert.alert("Error", "Failed to clear notifications. Please try again.");
                            });
                    }
                }
            ]
        );
    };

    // Function to mark all notifications as read
    const handleMarkAllAsRead = () => {
        markAllNotificationsAsRead()
            .unwrap()
            .then(() => {
        // Local state is updated via the optimistic update in the mutation
                dispatch(markAllAsRead());
            })
            .catch(error => {
                console.error('Failed to mark all as read:', error);
                Alert.alert("Error", "Failed to mark all notifications as read. Please try again.");
            });
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
        if (selectedNotifications.length === 0) return;

        Alert.alert(
            "Delete Selected Notifications",
            `Are you sure you want to delete ${selectedNotifications.length} selected notification(s)?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        deleteSelectedNotificationsMutation(selectedNotifications)
                            .unwrap()
                            .then(() => {
                                // Refetch to update the UI
                                refetch();
                                setSelectedNotifications([]);
                                // If all selected items are deleted, exit selection mode
                                if (selectedNotifications.length === notifications.length) {
                                    setSelectionMode(false);
                                }
                            })
                            .catch(error => {
                                console.error('Failed to delete notifications:', error);
                                Alert.alert("Error", "Failed to delete selected notifications. Please try again.");
                            });
                    }
                }
            ]
        );
    };

    // Function to view notification details
    const viewNotificationDetails = (notification) => {
        dispatch(markAsRead(notification.id));
        dispatch(setActiveNotification(notification));
        setModalVisible(true);

        // Call the API to mark as read if it's not already read
        if (!notification.isRead) {
            markNotificationAsRead(notification.id);
        }
    };

    // Close the modal
    const closeModal = () => {
        setModalVisible(false);
        dispatch(clearActiveNotification());
    };

    // Show loading screen only for initial load, not refreshes
    if (isLoading && !isRefreshing) {
        return <LoadingScreen message="Loading notifications..." />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
            <NotificationHeader
                clearAll={clearAllNotifications}
                markAllAsRead={handleMarkAllAsRead}
                toggleSelectionMode={toggleSelectionMode}
                selectionMode={selectionMode}
                deleteSelected={deleteSelected}
                hasSelectedItems={selectedNotifications.length > 0}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
            />
            <NotificationList
                notifications={notifications}
                selectionMode={selectionMode}
                selectedNotifications={selectedNotifications}
                toggleSelectNotification={toggleSelectNotification}
                onViewDetails={viewNotificationDetails}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <NotificationViewModal onClose={closeModal} />
            </Modal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    }
});