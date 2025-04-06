import { SafeAreaView, ScrollView, Text, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useDispatch, useSelector } from 'react-redux'

// Import components
import StatsCards from './components/StatsCards'
import RecentOrders from './components/RecentOrders'
import RecentUsers from './components/RecentUsers'
import RecentFeedback from './components/RecentFeedback'

// Import Redux selectors and actions
import {
    selectDashboardStats,
    selectRecentOrders,
    selectRecentUsers,
    fetchStatsWithCache,
    fetchOrdersWithCache,
    fetchUsersWithCache
} from '~/states/slices/dashboard'

import { adminStyles, adminColors } from '~/styles/adminTheme'

export function Dashboard() {
    const dispatch = useDispatch()
    const navigation = useNavigation()

    // Get cached data from Redux store
    const { data: statsData, isLoading: statsLoading } = useSelector(selectDashboardStats)
    const { data: recentOrders, isLoading: ordersLoading } = useSelector(selectRecentOrders)
    const { data: recentUsers, isLoading: usersLoading } = useSelector(selectRecentUsers)

    // Fetch each component's data with caching
    useEffect(() => {
        dispatch(fetchStatsWithCache())
        dispatch(fetchOrdersWithCache())
        dispatch(fetchUsersWithCache())
    }, [dispatch])

    // Navigation handlers
    const navigateToOrders = () => navigation.navigate('Orders')
    const navigateToUsers = () => navigation.navigate('Users')
    const navigateToFeedbacks = () => navigation.navigate('Feedbacks')

    return (
        <SafeAreaView style={adminStyles.safeArea}>
            <ScrollView style={adminStyles.scrollView} contentContainerStyle={{ padding: 16 }}>
                <Text style={adminStyles.pageTitle}>Admin Dashboard</Text>

                {/* Stats Cards with cached data */}
                <StatsCards
                    stats={statsData}
                    loading={statsLoading && !statsData.totalUsers}
                />

                {/* Recent Orders with cached data */}
                <RecentOrders
                    orders={recentOrders}
                    loading={ordersLoading && recentOrders.length === 0}
                    onViewAllPress={navigateToOrders}
                />

                {/* Recent Users with cached data */}
                <RecentUsers
                    users={recentUsers}
                    loading={usersLoading && recentUsers.length === 0}
                    onViewAllPress={navigateToUsers}
                />

                {/* Recent Feedback with cached data */}
                <RecentFeedback
                    newFeedbackCount={statsData.newFeedbacks}
                    loading={statsLoading && !statsData.totalUsers}
                    onReviewPress={navigateToFeedbacks}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
