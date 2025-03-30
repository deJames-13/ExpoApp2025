import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ResourceTable } from '~/components/ResourceTable';
import { IconButton } from 'react-native-paper';
import { orderTableColumns, orderActions } from './table-data';
import { OrderModal } from './modal';
import useResource from '~/hooks/useResource'

export { OrderDetailView } from './DetailView'

export function Orders({ navigation }) {
    const api = useResource({ resourceName: 'orders' });
    const { fetchDatas, doUpdate } = api.actions;
    const { loading, data: orders, meta } = api.states;

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [tableKey, setTableKey] = useState('orders-table-0'); // Add a key to force remount

    // Server-side state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ field: 'createdAt', direction: 'desc' });

    // Use refs to track previous values for comparison
    const prevQueryRef = useRef('');
    const isInitialLoadRef = useRef(true);
    const lastRequestRef = useRef({ page: 1, limit: 10 });

    // Build the query string for API requests
    const buildQueryString = () => {
        const queries = [
            `page=${currentPage}`,
            `limit=${itemsPerPage}`
        ];

        if (searchQuery) {
            queries.push(`q=${encodeURIComponent(searchQuery)}`);
        }

        if (sortConfig.field) {
            const sortDirection = sortConfig.direction === 'asc' ? '' : '-';
            queries.push(`sort=${sortDirection}${sortConfig.field}`);
        }

        return queries.join('&');
    };

    useEffect(() => {
        if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
            loadOrders();
            return;
        }

        const queryString = buildQueryString();

        if (queryString !== prevQueryRef.current) {
            prevQueryRef.current = queryString;
            loadOrders();
        }
    }, [currentPage, itemsPerPage, searchQuery, sortConfig]);

    useEffect(() => {
        if (meta && meta.page !== undefined && meta.last_page !== undefined) {
            if (currentPage > meta.last_page && meta.last_page > 0 && currentPage !== meta.page) {
                setCurrentPage(meta.page);
            }
        }
    }, [meta]);

    const loadOrders = useCallback(async () => {
        try {
            const queryString = buildQueryString();

            // Update the previous query ref
            prevQueryRef.current = queryString;

            // Store last request parameters
            lastRequestRef.current = {
                page: currentPage,
                limit: itemsPerPage
            };

            await fetchDatas({ qStr: queryString });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    }, [currentPage, itemsPerPage, searchQuery, sortConfig, fetchDatas]);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setModalVisible(true);
    };

    const handleViewDetails = (order) => {
        navigation.navigate('AdminRoutesStack', {
            screen: 'AdminOrderDetail',
            params: { order }
        });
    };

    // Status change handler
    const handleStatusChange = async (order, newStatus) => {
        try {
            const result = await doUpdate(order.id, {
                user: order?.user?.id,
                status: newStatus,
                order: order
            });

            // If we have a selected order, update its status
            if (selectedOrder && selectedOrder.id === order.id) {
                setSelectedOrder({
                    ...selectedOrder,
                    status: newStatus
                });
            }

            // Force table refresh
            setTableKey(`orders-table-${Date.now()}`);
            await loadOrders();
            return true;
        } catch (error) {
            console.error('Error updating order status:', error);
            return false;
        }
    };

    const handlePageChange = (page, perPage) => {
        // Validate page number
        if (meta && meta.last_page && page > meta.last_page) {
            page = meta.last_page;
        }

        // Only update if values actually changed
        if (page !== currentPage) {
            setCurrentPage(page);
        }

        if (perPage !== itemsPerPage) {
            setItemsPerPage(perPage);
            // Reset to page 1 when changing items per page
            setCurrentPage(1);
        }
    };

    const handleSearch = (query) => {
        if (query !== searchQuery) {
            setSearchQuery(query);
            setCurrentPage(1);
        }
    };

    // Sort handler
    const handleSortChange = (newSortConfig) => {
        if (newSortConfig.field !== sortConfig.field ||
            newSortConfig.direction !== sortConfig.direction) {
            setSortConfig(newSortConfig);
            setCurrentPage(1);
        }
    };

    const handleManualRefresh = () => {
        setTableKey(`orders-table-${Date.now()}`);
        loadOrders();
    };

    // Handle modal close - Added to fix UI issue
    const handleModalClose = () => {
        setModalVisible(false);
        // Delay clearing the selected order to avoid UI flicker
        setTimeout(() => {
            setSelectedOrder(null);
            setTableKey(`orders-table-${Date.now()}`);
            loadOrders(); // Reload orders to ensure we have the latest data
        }, 100);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="refresh"
                    size={24}
                    onPress={handleManualRefresh}
                />
            </View>

            {/* Add key prop to force remount when needed */}
            <ResourceTable
                key={tableKey}
                data={orders}
                columns={orderTableColumns}
                actions={orderActions(handleViewOrder, handleViewDetails)}
                loading={loading}
                // Keep the table height stable
                style={styles.tableContainer}

                // Server-side configuration
                serverSide={true}
                pagination={true}
                onPageChange={handlePageChange}
                initialItemsPerPage={itemsPerPage}
                totalServerItems={meta?.total || 0}

                // Search configuration
                searchEnabled={true}
                onSearch={handleSearch}

                // Sorting configuration
                sortable={true}
                initialSort={sortConfig}
                onSortChange={handleSortChange}

                emptyText="No orders found"
                onRefresh={handleManualRefresh}
                refreshing={loading}
            />

            {selectedOrder && (
                <OrderModal
                    visible={modalVisible}
                    order={selectedOrder}
                    onClose={handleModalClose}
                    onStatusChange={handleStatusChange}
                />
            )}
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
        justifyContent: 'flex-end',
        padding: 8,
    },
    tableContainer: {
        flex: 1, // Ensure the table takes full available height
        minHeight: 300, // Set a minimum height to prevent collapsing
    },
});