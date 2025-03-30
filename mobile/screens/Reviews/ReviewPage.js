import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';
import useResource from '~/hooks/useResource';
import ReviewList from './ReviewList';
import LoadingScreen from '../LoadingScreen';

export function ReviewPage({ navigation }) {
    const [currentTab, setCurrentTab] = useState('my'); // 'my' or 'all'
    const user = useSelector(selectCurrentUser);

    // Initialize resource hook for reviews
    const reviewApi = useResource({ resourceName: 'reviews', silent: false });
    const { fetchDatas } = reviewApi.actions;
    const { data: reviews, loading, refresh } = reviewApi.states;
    const { showError } = reviewApi.toast;

    // Filter reviews based on current tab
    const myReviews = reviews.filter(review =>
        review.user !== 'Anon' &&
        (review.user?.id === user?.id || review.user?.username === user?.username)
    );

    const displayedReviews = currentTab === 'my' ? myReviews : reviews;

    useEffect(() => {
        loadReviews();
    }, [refresh, currentTab]);

    const loadReviews = async () => {
        if (!user) return;

        try {
            let queryParams = '';
            if (currentTab === 'my') {
                queryParams = `user=${user.id}`;
            }

            await fetchDatas({ qStr: queryParams, verbose: false });
        } catch (err) {
            console.error('Error fetching reviews:', err);
            showError('Error', 'Failed to load reviews');
        }
    };

    const handleRefresh = () => {
        loadReviews();
    };

    const handleWriteReview = () => {
        navigation.navigate('Orders', {
            screen: 'OrderPage'
        });
    };

    if (loading && !reviews.length) {
        return <LoadingScreen message="Loading reviews..." />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Reviews</Text>
                <TouchableOpacity style={styles.writeButton} onPress={handleWriteReview}>
                    <Ionicons name="create-outline" size={20} color="#fff" />
                    <Text style={styles.writeButtonText}>Write a Review</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, currentTab === 'my' && styles.activeTab]}
                    onPress={() => setCurrentTab('my')}
                >
                    <Text style={[styles.tabText, currentTab === 'my' && styles.activeTabText]}>
                        My Reviews
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, currentTab === 'all' && styles.activeTab]}
                    onPress={() => setCurrentTab('all')}
                >
                    <Text style={[styles.tabText, currentTab === 'all' && styles.activeTabText]}>
                        All Reviews
                    </Text>
                </TouchableOpacity>
            </View>

            <ReviewList
                reviews={displayedReviews}
                loading={loading}
                onRefresh={handleRefresh}
                emptyText={currentTab === 'my'
                    ? "You haven't written any reviews yet"
                    : "No reviews available"
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    writeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    writeButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#2196F3',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#757575',
    },
    activeTabText: {
        color: '#2196F3',
        fontWeight: '600',
    },
});
