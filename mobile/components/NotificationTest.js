import React, { useState } from 'react';
import { View, Text, Alert, Platform } from 'react-native';
import { Button, Card, Menu } from 'react-native-paper';
import notifee, { AndroidImportance } from '@notifee/react-native';
import useFirebaseMessaging from '~/firebase/useFirebaseMessaging';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { NOTIFICATION_CHANNELS } from '~/firebase/notificationChannels';
import { adminStyles, adminColors } from '~/styles/adminTheme';

const NotificationTest = () => {
    const { fcmToken } = useFirebaseMessaging();
    const { currentUser } = useSelector(state => state.auth);
    const [isLoading, setIsLoading] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedType, setSelectedType] = useState('info');

    const notificationTypes = [
        { label: 'Info', value: 'info' },
        { label: 'Alert', value: 'alert' },
        { label: 'Warning', value: 'warning' },
        { label: 'Order', value: 'order' },
        { label: 'Promotion', value: 'promotion' }
    ];

    const sendLocalNotification = async () => {
        try {
            setIsLoading(true);

            // Get the appropriate channel ID for the selected type
            let channelId;
            switch (selectedType) {
                case 'info':
                    channelId = NOTIFICATION_CHANNELS.INFO;
                    break;
                case 'alert':
                    channelId = NOTIFICATION_CHANNELS.ALERT;
                    break;
                case 'warning':
                    channelId = NOTIFICATION_CHANNELS.WARNING;
                    break;
                case 'order':
                    channelId = NOTIFICATION_CHANNELS.ORDERS;
                    break;
                case 'promotion':
                    channelId = NOTIFICATION_CHANNELS.PROMOTIONS;
                    break;
                default:
                    channelId = NOTIFICATION_CHANNELS.HIGH_IMPORTANCE;
            }

            // Ensure the channel exists (Android only)
            if (Platform.OS === 'android') {
                await notifee.createChannel({
                    id: channelId,
                    name: selectedType.charAt(0).toUpperCase() + selectedType.slice(1),
                    importance: AndroidImportance.HIGH,
                });
            }

            // Display a notification
            await notifee.displayNotification({
                title: `Test ${selectedType.toUpperCase()} Notification`,
                body: `This is a test ${selectedType} notification from the test component`,
                data: {
                    type: selectedType,
                    screen: 'Notifications',
                    tab: 'Notifications',
                    test: true
                },
                android: {
                    channelId,
                    importance: AndroidImportance.HIGH,
                    pressAction: {
                        id: 'default',
                    },
                },
            });

            // Also show a toast for testing
            Toast.show({
                type: selectedType === 'alert' || selectedType === 'warning' ? 'error' :
                    selectedType === 'order' ? 'success' : 'info',
                text1: `Test ${selectedType.toUpperCase()} Toast`,
                text2: 'This tests the Toast component separately from notifications',
                visibilityTime: 4000,
            });

            Alert.alert('Success', `Local ${selectedType} notification sent`);
        } catch (error) {
            console.error('Error sending local notification:', error);
            Alert.alert('Error', `Failed to send local notification: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const displayDebugInfo = () => {
        Alert.alert(
            'Debug Info',
            `FCM Token: ${fcmToken ? fcmToken.substring(0, 15) + '...' : 'Not available'}\n` +
            `User ID: ${currentUser?.id || 'Not signed in'}\n` +
            `Platform: ${Platform.OS}\n` +
            `Notification Type: ${selectedType}\n`
        );
    };

    return (
        <Card style={adminStyles.card}>
            <Card.Title
                title="Notification Testing"
                titleStyle={adminStyles.cardTitle}
            />
            <Card.Content>
                <Text style={styles.tokenText}>
                    FCM Token: {fcmToken ? `${fcmToken.substring(0, 20)}...` : 'Not available'}
                </Text>

                <View style={styles.row}>
                    <Text style={adminStyles.cardLabel}>Test Type:</Text>
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <Button
                                mode="outlined"
                                onPress={() => setMenuVisible(true)}
                                style={styles.typeButton}
                                color={adminColors.primary}
                            >
                                {selectedType.toUpperCase()}
                            </Button>
                        }
                    >
                        {notificationTypes.map(type => (
                            <Menu.Item
                                key={type.value}
                                onPress={() => {
                                    setSelectedType(type.value);
                                    setMenuVisible(false);
                                }}
                                title={type.label}
                            />
                        ))}
                    </Menu>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={sendLocalNotification}
                        loading={isLoading}
                        style={styles.actionButton}
                        color={adminColors.primary}
                    >
                        Test Local Notification
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={displayDebugInfo}
                        style={styles.button}
                        color={adminColors.secondary}
                    >
                        Show Debug Info
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );
};

// Only keep the custom styles that aren't available in adminStyles
const styles = {
    tokenText: {
        marginBottom: 16,
        fontSize: 12,
        color: adminColors.text.light,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        marginLeft: 8,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 10,
        marginTop: 8,
    },
    button: {
        marginVertical: 5,
    },
    actionButton: {
        marginVertical: 5,
        backgroundColor: adminColors.primary,
    },
};

export default NotificationTest;
