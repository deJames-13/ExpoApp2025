import React from 'react';
import { Card, List, Avatar, Button, ActivityIndicator } from 'react-native-paper';
import { Text, View } from 'react-native';
import { adminStyles, adminColors } from '~/styles/adminTheme';

const RecentUsers = ({ users, loading, onViewAllPress }) => {
    return (
        <Card style={adminStyles.card}>
            <Card.Title titleStyle={{ color: adminColors.text.primary, fontWeight: 'bold' }} title="Recently Added Users" />
            <Card.Content>
                {loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={adminColors.primary} />
                        <Text style={{ marginTop: 10, color: adminColors.text.secondary }}>Loading users...</Text>
                    </View>
                ) : !users?.length ? (
                    <Text style={{ textAlign: 'center', padding: 20, color: adminColors.text.secondary }}>
                        No recent users available
                    </Text>
                ) : (
                            <List.Section>
                                {users.map((user, index) => (
                                    <List.Item
                                        key={user.id ? `user-${user.id}` : `user-index-${index}`}
                                        title={user.name}
                                        titleStyle={{ color: adminColors.text.primary, fontWeight: '500' }}
                                        description={user.email}
                                        descriptionStyle={{ color: adminColors.text.secondary }}
                                        style={adminStyles.listItem}
                                        left={props => (
                                            <Avatar.Text
                                                {...props}
                                                size={40}
                                                color="#FFFFFF"
                                                backgroundColor={adminColors.primary}
                                                label={user?.name?.split(' ').map(n => n[0]).join('')}
                                            />
                                        )}
                                        right={props => (
                                            <Text style={{ color: adminColors.text.light }}>{user.date}</Text>
                                        )}
                                    />
                                ))}
                            </List.Section>
                )}

                <Button
                    mode="text"
                    color={adminColors.primary}
                    onPress={onViewAllPress}
                    style={adminStyles.viewAllButton}
                >
                    View All Users
                </Button>
            </Card.Content>
        </Card>
    );
};

export default RecentUsers;
