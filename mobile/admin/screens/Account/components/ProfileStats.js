import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';

export function ProfileStats({ stats = [] }) {
    return (
        <Card style={styles.statsCard}>
            <View style={styles.statsContainer}>
                {stats.map((stat, index) => (
                    <View 
                        key={stat.label} 
                        style={[
                            styles.statItem,
                            index < stats.length - 1 && styles.statItemWithBorder
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
});
