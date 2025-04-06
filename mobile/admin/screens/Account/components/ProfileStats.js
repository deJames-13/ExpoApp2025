import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { adminColors } from '~/styles/adminTheme';
import {
    selectDashboardStats,
    fetchStatsWithCache
} from '~/states/slices/dashboard';

export function ProfileStats({ customStats }) {
    const dispatch = useDispatch();
    const { data: stats, isLoading } = useSelector(selectDashboardStats);

    useEffect(() => {
        dispatch(fetchStatsWithCache());
    }, [dispatch]);

    // Use custom stats if provided, otherwise use the dashboard stats
    const adminStats = customStats || [
        { label: 'Users', value: stats.totalUsers || 0 },
        { label: 'Orders', value: stats.totalOrders || 0 },
        { label: 'Products', value: stats.totalProducts || 0 }
    ];

    if (isLoading && !customStats) {
        return (
            <Card style={styles.statsCard}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color={adminColors.primary} />
                </View>
            </Card>
        );
    }

    return (
        <Card style={styles.statsCard}>
            <View style={styles.statsContainer}>
                {adminStats.map((stat, index) => (
                    <View 
                        key={stat.label} 
                        style={[
                            styles.statItem,
                            index < adminStats.length - 1 && styles.statItemWithBorder
                        ]}
                    >
                        <Text style={styles.statValue}>{stat.value}</Text>
                        <Text style={styles.statLabel}>{stat.label}</Text>
                    </View>
                ))}
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    statsCard: {
        marginBottom: 16,
        backgroundColor: adminColors.cardBackground,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 12,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
        paddingVertical: 10,
    },
    statItemWithBorder: {
        borderRightWidth: 1,
        borderRightColor: 'rgba(0,0,0,0.1)',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: adminColors.primary,
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 14,
        color: adminColors.text.secondary,
    },
    loadingContainer: {
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
