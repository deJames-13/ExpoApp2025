import { SafeAreaView, ScrollView, Text, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

// Import components
import StatsCards from './components/StatsCards'
import RecentOrders from './components/RecentOrders'
import RecentUsers from './components/RecentUsers'
import RecentFeedback from './components/RecentFeedback'

// Import data
import { fetchStatsData, fetchRecentOrders, fetchRecentUsers } from './data'
import { adminStyles, adminColors } from '~/styles/adminTheme'

export function Dashboard() {
    // Separate loading states for each component
    const [statsLoading, setStatsLoading] = useState(true)
    const [ordersLoading, setOrdersLoading] = useState(true)
    const [usersLoading, setUsersLoading] = useState(true)

    // Separate data states for each component
    const [statsData, setStatsData] = useState({
        totalUsers: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        newFeedbacks: 0
    })
    const [recentOrders, setRecentOrders] = useState([])
    const [recentUsers, setRecentUsers] = useState([])

    const navigation = useNavigation()

    // Fetch each component's data independently
    useEffect(() => {
        // Fetch stats data
        fetchStatsData()
            .then(data => {
                setStatsData(data)
                setStatsLoading(false)
            })
            .catch(() => setStatsLoading(false))

        // Fetch recent orders
        fetchRecentOrders()
            .then(data => {
                setRecentOrders(data)
                setOrdersLoading(false)
            })
            .catch(() => setOrdersLoading(false))

        // Fetch recent users
        fetchRecentUsers()
            .then(data => {
                setRecentUsers(data)
                setUsersLoading(false)
            })
            .catch(() => setUsersLoading(false))
    }, [])

    // Navigation handlers
    const navigateToOrders = () => navigation.navigate('Orders')
    const navigateToUsers = () => navigation.navigate('Users')
    const navigateToFeedbacks = () => navigation.navigate('Feedbacks')

    return (
        <SafeAreaView style={adminStyles.safeArea}>
            <ScrollView style={adminStyles.scrollView} contentContainerStyle={{ padding: 16 }}>
                <Text style={adminStyles.pageTitle}>Admin Dashboard</Text>

                {/* Stats Cards with loading state */}
                <StatsCards
                    stats={statsData}
                    loading={statsLoading}
                />

                {/* Recent Orders with loading state */}
                <RecentOrders
                    orders={recentOrders}
                    loading={ordersLoading}
                    onViewAllPress={navigateToOrders}
                />

                {/* Recent Users with loading state */}
                <RecentUsers
                    users={recentUsers}
                    loading={usersLoading}
                    onViewAllPress={navigateToUsers}
                />

                {/* Recent Feedback with loading state */}
                <RecentFeedback
                    newFeedbackCount={statsData.newFeedbacks}
                    loading={statsLoading}
                    onReviewPress={navigateToFeedbacks}
                />
            </ScrollView>
        </SafeAreaView>
    )
}
