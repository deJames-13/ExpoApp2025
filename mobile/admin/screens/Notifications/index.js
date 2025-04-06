import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Divider } from 'react-native-paper';
import NotificationForm from './NotificationForm';
import NotificationHistory from './NotificationHistory';
import { styles } from './styles';

export { NotificationTypes } from './NotificationTypeSelector';

export const AdminNotifications = () => {
    return (
        <ScrollView style={[styles.container]}>
            <Card style={styles.card}>
                <Card.Title
                    title="Send Admin Notifications"
                    subtitle="Broadcast messages to your users"
                    titleStyle={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}
                    subtitleStyle={{ fontSize: 14, color: '#666', marginTop: 2 }}
                />
                <Card.Content>
                    <NotificationForm />
                </Card.Content>
            </Card>



            <Divider style={{
                padding: 10
            }} />
        </ScrollView>
    );
};

export default AdminNotifications;

// <Card style={[styles.card, { marginBottom: 20 }]}>
//             <Card.Title
//                 title="Notification History"
//                 subtitle="Recently sent notifications"
//                 titleStyle={{ fontSize: 18, fontWeight: 'bold', color: '#333' }}
//                 subtitleStyle={{ fontSize: 14, color: '#666', marginTop: 2 }}
//             />
//             <Card.Content>
//                 {/* <NotificationHistory /> */}
//             </Card.Content>
//         </Card>