import React from 'react';
import { Card, DataTable, Button, ActivityIndicator } from 'react-native-paper';
import { adminStyles, adminColors } from '~/styles/adminTheme';
import { Text, View } from 'react-native';
import { getStatusColor } from '~/styles/adminThemeUtils';

const RecentOrders = ({ orders, loading, onViewAllPress }) => {
    // Custom header style to improve visibility
    const headerTextStyle = {
        color: adminColors.text.primary,
        fontWeight: '700',
        fontSize: 14
    };

    return (
        <Card style={adminStyles.card}>
            <Card.Title titleStyle={{ color: adminColors.text.primary, fontWeight: 'bold' }} title="Recent Orders" />
            <Card.Content>
                {loading ? (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                        <ActivityIndicator size="small" color={adminColors.primary} />
                        <Text style={{ marginTop: 10, color: adminColors.text.secondary }}>Loading orders...</Text>
                    </View>
                ) : orders.length === 0 ? (
                    <Text style={{ textAlign: 'center', padding: 20, color: adminColors.text.secondary }}>
                        No recent orders available
                    </Text>
                ) : (
                            <DataTable>
                                <DataTable.Header style={{
                                    backgroundColor: '#FFFFFF',
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#E0E0E0'
                                }}>
                                    <DataTable.Title style={{ flex: 2 }}><Text style={headerTextStyle}>Order</Text></DataTable.Title>
                                    <DataTable.Title numeric style={{ flex: 1.5 }}><Text style={headerTextStyle}>Amount</Text></DataTable.Title>
                                    <DataTable.Title style={{ flex: 2, paddingLeft: 16 }}><Text style={headerTextStyle}>Status</Text></DataTable.Title>
                                </DataTable.Header>

                                {orders.map(order => (
                                    <DataTable.Row key={order.id} style={adminStyles.tableRow}>
                                        <DataTable.Cell style={{ flex: 2 }}>
                                            <Text style={{ color: adminColors.text.primary, fontWeight: '500' }}>{order.user.username}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell numeric style={{ flex: 1.5 }}>
                                            <Text style={{ color: adminColors.text.primary }}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {order.total?.toFixed(2)}</Text>
                                        </DataTable.Cell>
                                        <DataTable.Cell style={{ flex: 2, paddingLeft: 16 }}>
                                            <Text style={{ color: getStatusColor(order.status).text, fontSize: 13, fontWeight: '600' }}>
                                                {order.status}
                                            </Text>
                                        </DataTable.Cell>
                                    </DataTable.Row>
                                ))}
                            </DataTable>
                )}

                <Button
                    mode="text"
                    color={adminColors.primary}
                    onPress={onViewAllPress}
                    style={adminStyles.viewAllButton}
                >
                    View All Orders
                </Button>
            </Card.Content>
        </Card>
    );
};

export default RecentOrders;
