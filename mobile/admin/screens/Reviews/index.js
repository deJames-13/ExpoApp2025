import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { reviewsData, fetchReviews, deleteReview, createReview, updateReview } from './data';
import { reviewColumns, reviewActions } from './table-data';
import { ReviewModal } from './modal';
import { ResourceTable } from '~/components/ResourceTable';

export function Reviews() {
    const [reviews, setReviews] = useState(reviewsData);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentSort, setCurrentSort] = useState({ field: 'createdAt', direction: 'desc' });
    const [searchText, setSearchText] = useState('');
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        pages: 0
    });
    const prevQueryRef = useRef('');
    const isInitialLoadRef = useRef(true);
    const tableKeyRef = useRef(`reviews-table-${Date.now()}`);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedReview, setSelectedReview] = useState(null);

    // Build query parameters for API requests
    const buildQueryParams = () => {
        const params = new URLSearchParams();
        params.append('page', pagination.page);
        params.append('limit', pagination.limit);

        if (searchText) params.append('search', searchText);
        if (currentSort.field) {
            const order = currentSort.direction === 'desc' ? -1 : 1;
            params.append('sort', JSON.stringify({ [currentSort.field]: order }));
        }

        return params.toString();
    };

    // Fetch reviews with backend pagination
    const loadReviews = useCallback(async (page = pagination.page, limit = pagination.limit, search = searchText, sort = currentSort) => {
        setLoading(true);
        try {
            const queryString = buildQueryParams();
            prevQueryRef.current = queryString;

            const result = await fetchReviews(page, limit, search, sort);

            if (result.reviews) {
                setReviews(result.reviews);
                setPagination(prev => ({
                    ...prev,
                    ...result.pagination,
                    pages: result.pagination.last_page ||
                        Math.ceil(result.pagination.total / result.pagination.limit)
                }));
            } else {
                console.error('Failed to fetch reviews data');
                setReviews([]);
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [pagination.page, pagination.limit, searchText, currentSort]);

    // Effect to handle changes in pagination, search, or sort parameters
    useEffect(() => {
        if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
            loadReviews();
            return;
        }

        const queryString = buildQueryParams();

        if (queryString !== prevQueryRef.current) {
            prevQueryRef.current = queryString;
            loadReviews();
        }
    }, [pagination.page, pagination.limit, searchText, currentSort]);

    // Effect to handle edge cases when pagination info changes from API
    useEffect(() => {
        if (pagination.pages > 0 && pagination.page > pagination.pages) {
            setPagination(prev => ({
                ...prev,
                page: pagination.pages
            }));
        }
    }, [pagination.pages, pagination.page]);

    // Open modal for creating a new review
    const handleAddReview = useCallback(() => {
        setModalMode('create');
        setSelectedReview(null);
        setModalVisible(true);
    }, []);

    // Action handlers
    const handleView = useCallback((review) => {
        setModalMode('view');
        setSelectedReview(review);
        setModalVisible(true);
    }, []);

    const handleEdit = useCallback((review) => {
        setModalMode('edit');
        setSelectedReview(review);
        setModalVisible(true);
    }, []);

    const handleDelete = useCallback((review) => {
        Alert.alert(
            "Delete Review",
            "Are you sure you want to delete this review?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteReview(review.id || review._id);
                            loadReviews();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete review");
                        }
                    }
                }
            ]
        );
    }, [loadReviews]);

    // Handle saving review from modal
    const handleSaveReview = useCallback(async (reviewData) => {
        try {
            if (modalMode === 'create') {
                await createReview(reviewData);
                setPagination(prev => ({ ...prev, page: 1 }));
                loadReviews(1, pagination.limit, searchText, currentSort);
            } else if (modalMode === 'edit') {
                await updateReview(selectedReview.id || selectedReview._id, reviewData);
                loadReviews();
            }
            setModalVisible(false);
        } catch (error) {
            console.error("Error saving review:", error);
            Alert.alert("Error", `Failed to ${modalMode === 'create' ? 'create' : 'update'} review`);
        }
    }, [modalMode, selectedReview, pagination, searchText, currentSort, loadReviews]);

    // Configure action handlers for the table
    const actions = reviewActions.map(action => {
        if (action.id === 'view') {
            return { ...action, onPress: handleView };
        } else if (action.id === 'edit') {
            return { ...action, onPress: handleEdit };
        } else if (action.id === 'delete') {
            return { ...action, onPress: handleDelete };
        }
        return action;
    });

    // Refresh handler
    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        setPagination(prev => ({ ...prev, page: 1 }));
        loadReviews(1, pagination.limit, searchText, currentSort);
        tableKeyRef.current = `reviews-table-${Date.now()}`; // Force table remount
    }, [pagination.limit, searchText, currentSort, loadReviews]);

    // Search handler (backend search)
    const handleSearch = useCallback((query) => {
        if (query !== searchText) {
            setSearchText(query);
            setPagination(prev => ({ ...prev, page: 1 }));
            loadReviews(1, pagination.limit, query, currentSort);
        }
    }, [pagination.limit, currentSort, loadReviews, searchText]);

    // Pagination handler (backend pagination)
    const handlePageChange = useCallback((page, itemsPerPage) => {
        const updatedPagination = { ...pagination };

        if (page !== pagination.page) {
            updatedPagination.page = page;
        }

        if (itemsPerPage !== pagination.limit) {
            updatedPagination.limit = itemsPerPage;
            updatedPagination.page = 1;
        }

        setPagination(updatedPagination);
    }, [pagination]);

    // Sorting handler (backend sorting)
    const handleSortChange = useCallback((sortConfig) => {
        if (sortConfig.field !== currentSort.field ||
            sortConfig.direction !== currentSort.direction) {
            setCurrentSort(sortConfig);
            setPagination(prev => ({ ...prev, page: 1 }));
        }
    }, [currentSort]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View className="flex-1 px-4 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">Reviews</Text>
                    <TouchableOpacity
                        className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
                        onPress={handleAddReview}
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text className="text-white font-medium ml-1">Add Review</Text>
                    </TouchableOpacity>
                </View>

                {/* Table with server-side operations */}
                <View className="flex-1 bg-white rounded-lg shadow-sm">
                    <ResourceTable
                        key={tableKeyRef.current}
                        data={reviews}
                        columns={reviewColumns}
                        actions={actions}
                        emptyText="No reviews found"
                        onRefresh={handleRefresh}
                        refreshing={refreshing}
                        loading={loading}

                        // Server-side configuration
                        serverSide={true}
                        totalServerItems={pagination.total}

                        // Pagination configuration - use the server's pages count
                        pagination={true}
                        initialItemsPerPage={pagination.limit}
                        onPageChange={handlePageChange}
                        currentPage={pagination.page}
                        totalPages={pagination.pages}

                        // Search configuration
                        searchEnabled={true}
                        onSearch={handleSearch}

                        // Sorting configuration
                        initialSort={currentSort}
                        onSortChange={handleSortChange}
                    />
                </View>

                {/* Review Modal for create/edit/view */}
                <ReviewModal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    review={selectedReview}
                    onSave={handleSaveReview}
                    mode={modalMode}
                />
            </View>
        </SafeAreaView>
    );
}

export default Reviews;