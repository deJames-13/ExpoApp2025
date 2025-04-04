import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { productColumns, productActions } from './table-data'
import { ProductModal } from './modal'
import { ResourceTable, processTableData } from '~/components/ResourceTable'
import useResource from '~/hooks/useResource'
import { createHybridFormData } from '~/utils/imageUpload'

export function Products({ navigation }) {
    const {
        states: { data: products, loading, refresh, meta },
        actions: { fetchDatas, doStore, doUpdate, doDestroy },
        events: { onStore, onUpdate, onDestroy },
        toast: { showSuccess, showError }
    } = useResource({ resourceName: 'products' });

    const [refreshing, setRefreshing] = useState(false);
    const [tableKey, setTableKey] = useState('products-table-0');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Server-side state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ field: 'name', direction: 'asc' });

    // Use refs to track previous values for comparison
    const prevQueryRef = React.useRef('');
    const isInitialLoadRef = React.useRef(true);
    const lastRequestRef = React.useRef({ page: 1, limit: 10 });

    // Build the query string for API requests
    const buildQueryString = useCallback(() => {
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
    }, [currentPage, itemsPerPage, searchQuery, sortConfig]);

    // Initial data load and when params change
    useEffect(() => {
        if (isInitialLoadRef.current) {
            isInitialLoadRef.current = false;
            loadProducts();
            return;
        }

        const queryString = buildQueryString();

        if (queryString !== prevQueryRef.current) {
            prevQueryRef.current = queryString;
            loadProducts();
        }
    }, [currentPage, itemsPerPage, searchQuery, sortConfig, refresh]);

    // Handle pagination edge cases
    useEffect(() => {
        if (meta && meta.page !== undefined && meta.last_page !== undefined) {
            if (currentPage > meta.last_page && meta.last_page > 0 && currentPage !== meta.page) {
                setCurrentPage(meta.page);
            }
        }
    }, [meta]);

    // Load products with query string
    const loadProducts = useCallback(async () => {
        try {
            const queryString = buildQueryString();
            prevQueryRef.current = queryString;

            lastRequestRef.current = {
                page: currentPage,
                limit: itemsPerPage
            };

            setRefreshing(true);
            await fetchDatas({ qStr: queryString });
            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setRefreshing(false);
        }
    }, [currentPage, itemsPerPage, searchQuery, sortConfig, fetchDatas]);

    // Open modal for creating a new product
    const handleAddProduct = useCallback(() => {
        setModalMode('create');
        setSelectedProduct(null);
        setModalVisible(true);
    }, []);

    // Action handlers
    const handleEdit = useCallback((product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setModalVisible(true);
    }, []);

    const handleView = useCallback((product) => {
        // Navigate to detail view instead of modal
        navigation.navigate('ProductDetail', { productId: product._id || product.id });
    }, [navigation]);

    const handleDelete = useCallback((product) => {
        Alert.alert(
            "Delete Product",
            `Are you sure you want to delete ${product.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await doDestroy(product._id || product.id);
                            showSuccess('Success', 'Product deleted successfully');
                            // Force refresh the table
                            setTableKey(`products-table-${Date.now()}`);
                            loadProducts();
                        } catch (error) {
                            showError('Error', 'Failed to delete product');
                            console.error(error);
                        }
                    }
                }
            ]
        );
    }, [doDestroy, showSuccess, showError, loadProducts]);

    const handleSaveProduct = useCallback(async (rawData) => {
        try {
            const { productData, images } = rawData;
            const uploadImages = images || [];

            if (modalMode === 'create') {
                let formData;
                if (uploadImages && uploadImages.length > 0) {
                    formData = await createHybridFormData(
                        productData,
                        { image: uploadImages[0] },
                        true
                    );

                    // Add additional images if available
                    if (uploadImages.length > 1) {
                        const additionalImages = uploadImages.slice(1).filter(Boolean);
                        if (additionalImages.length > 0) {
                            formData.append('additionalImages', JSON.stringify(additionalImages));
                        }
                    }
                } else {
                    formData = await createHybridFormData(productData, {}, true);
                }

                // Pass FormData directly without wrapping it further
                await doStore(formData);
                showSuccess('Success', 'Product created successfully');
            } else if (modalMode === 'edit') {
                const productId = selectedProduct._id || selectedProduct.id;

                let formData;
                if (uploadImages && uploadImages.length > 0) {
                    formData = await createHybridFormData(
                        productData,
                        { image: uploadImages[0] },
                        true
                    );

                    if (selectedProduct.images && selectedProduct.images.length > 0) {
                        const publicIds = selectedProduct.images
                            .filter(img => img.public_id)
                            .map(img => img.public_id);

                        if (publicIds.length > 0) {
                            formData.append('public_ids', JSON.stringify(publicIds));
                        }
                    }

                    // Add additional images if available
                    if (uploadImages.length > 1) {
                        const additionalImages = uploadImages.slice(1).filter(Boolean);
                        if (additionalImages.length > 0) {
                            formData.append('additionalImages', JSON.stringify(additionalImages));
                        }
                    }
                } else {
                    formData = await createHybridFormData(productData, {}, true);
                }

                // Pass FormData directly to doUpdate
                await doUpdate(productId, formData);
                showSuccess('Success', 'Product updated successfully');
            }

            setModalVisible(false);

            // Force refresh with a new table key and reload data
            const newTableKey = `products-table-${Date.now()}`;
            setTableKey(newTableKey);

            // Slight delay to ensure API has time to process the update
            setTimeout(() => {
                loadProducts();
            }, 100);
        } catch (error) {
            showError('Error', modalMode === 'create'
                ? 'Failed to create product'
                : 'Failed to update product');
            console.error(error);
        }
    }, [modalMode, selectedProduct, doStore, doUpdate, showSuccess, showError, loadProducts]);

    // Configure action handlers for the imported action definitions
    const actions = useMemo(() => {
        return productActions.map(action => {
            if (action.id === 'view') {
                return { ...action, onPress: handleView };
            } else if (action.id === 'edit') {
                return { ...action, onPress: handleEdit };
            } else if (action.id === 'delete') {
                return { ...action, onPress: handleDelete };
            }
            return action;
        });
    }, [handleView, handleEdit, handleDelete]);

    // Refresh handler
    const handleRefresh = useCallback(async () => {
        setTableKey(`products-table-${Date.now()}`);
        loadProducts();
    }, [loadProducts]);

    // Search handler
    const handleSearch = useCallback((query) => {
        if (query !== searchQuery) {
            setSearchQuery(query);
            setCurrentPage(1);
        }
    }, [searchQuery]);

    // Pagination handler
    const handlePageChange = useCallback((page, perPage) => {
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
    }, [currentPage, itemsPerPage, meta]);

    // Sorting handler
    const handleSortChange = useCallback((newSortConfig) => {
        if (newSortConfig.field !== sortConfig.field ||
            newSortConfig.direction !== sortConfig.direction) {
            setSortConfig(newSortConfig);
            setCurrentPage(1);
        }
    }, [sortConfig]);

    // Handle modal close
    const handleModalClose = useCallback(() => {
        setModalVisible(false);
        // Delay clearing the selected product to avoid UI flicker
        setTimeout(() => {
            setSelectedProduct(null);
        }, 100);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View className="flex-1 px-4 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">Products</Text>
                    <View className="flex-row">
                        <TouchableOpacity
                            className="bg-gray-200 p-2 rounded-lg mr-2"
                            onPress={handleRefresh}
                        >
                            <Ionicons name="refresh" size={20} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
                            onPress={handleAddProduct}
                        >
                            <Ionicons name="add" size={20} color="white" />
                            <Text className="text-white font-medium ml-1">Add Product</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Table with server-side operations */}
                <View className="flex-1 bg-white rounded-lg shadow-sm">
                    {/* Add key prop to force remount when needed */}
                    <ResourceTable
                        key={tableKey}
                        data={products}
                        columns={productColumns}
                        actions={actions}
                        title="Products"
                        emptyText="No products found"
                        imageField="images[0].url"
                        subtitleField="brand.name"
                        onRefresh={handleRefresh}
                        refreshing={refreshing}
                        loading={loading}

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
                    />
                </View>

                {/* Product Modal for create/edit */}
                <ProductModal
                    visible={modalVisible}
                    onDismiss={handleModalClose}
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    mode={modalMode}
                />
            </View>
        </SafeAreaView>
    )
}