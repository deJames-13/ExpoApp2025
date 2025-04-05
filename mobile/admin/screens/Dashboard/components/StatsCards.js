import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adminStyles, adminColors } from '~/styles/adminTheme';

const StatsCards = ({ stats, loading }) => {
    // Loading skeleton component for stats card
    const renderLoadingCard = (style) => (
        <Card style={[adminStyles.statsCard, style]}>
            <Card.Content style={[styles.cardContent, { justifyContent: 'center' }]}>
                <ActivityIndicator size="small" color={adminColors.primary} />
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.statsContainer}>
                {/* Top row loading state */}
                <View style={styles.topRow}>
                    {renderLoadingCard(styles.topRowCard)}
                    {renderLoadingCard(styles.topRowCard)}
                </View>

                {/* Bottom row loading state */}
                {renderLoadingCard(styles.revenueCard)}
            </View>
        );
    }

    return (
        <View style={styles.statsContainer}>
            {/* Top row: Users - Orders - Pending */}
            <View style={styles.topRow}>
                <Card style={[adminStyles.statsCard, styles.topRowCard, { backgroundColor: adminColors.card.stats.users }]}>
                    <Card.Content style={styles.cardContent}>
                        <MaterialCommunityIcons name="account-group" size={28} color="#000" style={styles.icon} />
                        <View>
                            <Text style={styles.cardLabel}>Total Users</Text>
                            <Text style={styles.cardValue}>{stats.totalUsers}</Text>
                        </View>
                    </Card.Content>
                </Card>

                <Card style={[adminStyles.statsCard, styles.topRowCard, { backgroundColor: adminColors.card.stats.orders }]}>
                    <Card.Content style={styles.cardContent}>
                        <MaterialCommunityIcons name="shopping" size={28} color="#000" style={styles.icon} />
                        <View>
                            <Text style={styles.cardLabel}>Total Orders</Text>
                            <Text style={styles.cardValue}>{stats.totalOrders}</Text>
                        </View>
                    </Card.Content>
                </Card>
            </View>

            {/* Bottom row: Revenue (full width) */}
            <Card style={[adminStyles.statsCard, styles.revenueCard, { backgroundColor: adminColors.card.stats.revenue }]}>
                <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons name="currency-usd" size={32} color="#000" style={styles.icon} />
                    <View>
                        <Text style={styles.cardLabel}>Revenue</Text>
                        <Text style={styles.cardValue}>{process.env.EXPO_PUBLIC_APP_CURRENCY} {stats.totalRevenue.toLocaleString()}</Text>
                    </View>
                </Card.Content>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    statsContainer: {
        width: '100%',
        marginVertical: 10,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    topRowCard: {
        flex: 1,
        marginHorizontal: 5,
        minHeight: 90,
    },
    revenueCard: {
        width: '100%',
        minHeight: 100,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 12,
    },
    cardLabel: {
        fontSize: 12,
        color: '#000',
        opacity: 0.9,
        fontWeight: '500',
    },
    cardValue: {
        fontSize: 18,
        color: '#000',
        fontWeight: 'bold',
        marginTop: 4,
    }
});

export default StatsCards;
