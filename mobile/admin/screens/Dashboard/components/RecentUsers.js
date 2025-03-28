import React from 'react';
import { Card, List, Avatar, Button } from 'react-native-paper';
import { View, Text } from 'react-native';
import { adminStyles, adminColors } from '../../../styles/adminTheme';

const RecentUsers = ({ users, onViewAllPress }) => {
    return (
        <Card style={adminStyles.card}>
            <Card.Title titleStyle={{ color: adminColors.text.primary, fontWeight: 'bold' }} title="Recently Added Users" />
            <Card.Content>
                <List.Section>
                    {users.map(user => (
                        <List.Item
                            key={user.id}
                            title={() => <Text style={{ color: adminColors.text.primary, fontWeight: '500' }}>{user.name}</Text>}
                            description={() => <Text style={{ color: adminColors.text.secondary }}>{user.email}</Text>}
                            style={adminStyles.listItem}
                            left={props => (
                                <Avatar.Text
                                    {...props}
                                    size={40}
                                    color="#FFFFFF"
                                    backgroundColor={adminColors.primary}
                                    label={user.name.split(' ').map(n => n[0]).join('')}
                                />
                            )}
                            right={props => (
                                <Text style={{ color: adminColors.text.light }}>{user.date}</Text>
                            )}
                        />
                    ))}
                </List.Section>

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
