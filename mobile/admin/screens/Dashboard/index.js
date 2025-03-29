import { SafeAreaView, ScrollView, Text, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

// Import components
import StatsCards from './components/StatsCards'
import RecentOrders from './components/RecentOrders'
import RecentUsers from './components/RecentUsers'
import RecentFeedback from './components/RecentFeedback'

// Import data
import { fetchDashboardData } from './data'
import { adminStyles, adminColors } from '~/styles/adminTheme'

export function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalUsers: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalRevenue: 0,
            newFeedbacks: 0
        },
        recentOrders: [],
        recentUsers: []
    })
    const [loading, setLoading] = useState(true)

    const navigation = useNavigation()

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData().then(data => {
            setDashboardData(data)
            setLoading(false)
        })
    }, [])

    // Navigation handlers
    const navigateToOrders = () => navigation.navigate('Orders')
    const navigateToUsers = () => navigation.navigate('Users')
    const navigateToFeedbacks = () => navigation.navigate('Feedbacks')

    // Render loading state
    if (loading) {
        return (
            <SafeAreaView style={adminStyles.loadingContainer}>
                <ActivityIndicator size="large" color={adminColors.primary} />
                <Text style={{ marginTop: 12, color: adminColors.text.primary, fontSize: 16 }}>
                    Loading dashboard data...
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={adminStyles.safeArea}>
            <ScrollView style={adminStyles.scrollView} contentContainerStyle={{ padding: 16 }}>
                <Text style={adminStyles.pageTitle}>Admin Dashboard</Text>

                {/* Stats Cards */}
                <StatsCards stats={dashboardData.stats} />

                {/* Recent Orders */}
                <RecentOrders
                    orders={dashboardData.recentOrders}
                    onViewAllPress={navigateToOrders}
                />

                {/* Recent Users */}
                <RecentUsers
                    users={dashboardData.recentUsers}
                    onViewAllPress={navigateToUsers}
                />

                {/* Recent Feedback */}
                <RecentFeedback
                    newFeedbackCount={dashboardData.stats.newFeedbacks}
                    onReviewPress={navigateToFeedbacks}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
