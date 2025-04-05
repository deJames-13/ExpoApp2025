import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Card, List } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';

export function AdminSupport() {
    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Title title="Help & Support" />
                <Card.Content>
                    <Text style={styles.text}>
                        Welcome to the Admin Support Center. If you need assistance with your admin dashboard, please refer to the following resources:
                    </Text>

                    <List.Section>
                        <List.Item 
                            title="Documentation" 
                            description="Read our comprehensive admin guide"
                            left={props => <List.Icon {...props} icon="book-open-variant" />}
                        />
                        <List.Item 
                            title="Contact Support" 
                            description="Reach out to our technical team"
                            left={props => <List.Icon {...props} icon="email" />}
                        />
                        <List.Item 
                            title="Frequently Asked Questions" 
                            description="Find answers to common questions"
                            left={props => <List.Icon {...props} icon="frequently-asked-questions" />}
                        />
                    </List.Section>
                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: adminColors.background,
        padding: 16,
    },
    card: {
        marginBottom: 16,
        backgroundColor: adminColors.cardBackground,
    },
    text: {
        fontSize: 16,
        color: adminColors.text.secondary,
        marginBottom: 16,
        lineHeight: 22,
    },
});

export default AdminSupport;
