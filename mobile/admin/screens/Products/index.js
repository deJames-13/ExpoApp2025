import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { productsData } from './data'
import { productColumns, productActions } from './table-data'
import { ProductModal } from './modal'
import { ResourceTable, processTableData } from '~/components/ResourceTable'

export function Products() {
    const [products, setProducts] = useState(productsData);
    const [loading, _setLoading] = useState(false); // Prefix with underscore to indicate intentionally unused
    const [refreshing, setRefreshing] = useState(false);
    const [currentSort, setCurrentSort] = useState({ field: 'name', direction: 'asc' });
    const [searchText, setSearchText] = useState('');
    const searchFields = [
        'name',
        'price',
        'stock',
        'category.name',
        'brand.name'
    ];

    // Use useMemo for filteredProducts to prevent recalculation on every render
    const filteredProducts = useMemo(() => {
        return processTableData(products, searchText, currentSort, searchFields);
    }, [products, currentSort, searchText, searchFields]);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
    const [selectedProduct, setSelectedProduct] = useState(null);

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
        setModalMode('view');
        setSelectedProduct(product);
        setModalVisible(true);
    }, []);

    const handleDelete = useCallback((product) => {
        Alert.alert(
            "Delete Product",
            `Are you sure you want to delete ${product.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        setProducts(products.filter(p => p.id !== product.id));
                    }
                }
            ]
        );
    }, [products]);

    // Handle saving product from modal
    const handleSaveProduct = useCallback((productData) => {
        if (modalMode === 'create') {
            const newProduct = {
                ...productData,
                id: Date.now().toString(),
                createdAt: new Date().toISOString()
            };
            setProducts(prevProducts => [...prevProducts, newProduct]);
        } else if (modalMode === 'edit') {
            setProducts(prevProducts =>
                prevProducts.map(p => p.id === selectedProduct.id ? { ...p, ...productData } : p)
            );
        }
        setModalVisible(false);
    }, [modalMode, selectedProduct]);

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
        setRefreshing(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Refreshed products');

        // In a real app, you'd fetch fresh data here
        // const response = await fetch('/api/products');
        // const data = await response.json();
        // setProducts(data);

        setRefreshing(false);
    }, []);

    // Search handler (client-side)
    const handleSearch = useCallback((query) => {
        console.log('Searching for:', query);
        setSearchText(query);
    }, []);

    // Pagination handler (client-side)
    const handlePageChange = useCallback((page, itemsPerPage) => {
        console.log(`Page changed to ${page}, items per page: ${itemsPerPage}`);
    }, []);

    // Sorting handler (client-side)
    const handleSortChange = useCallback((sortConfig) => {
        console.log(`Sorting by ${sortConfig.field} (${sortConfig.direction})`);
        setCurrentSort(sortConfig);
    }, []);

    // Clean up setTimeout to avoid memory leaks
    const handleSomeAction = useCallback(() => {
        const timer = setTimeout(() => {
            // Function content
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <View className="flex-1 px-4 pt-4">
                {/* Header */}
                <View className="flex-row justify-between items-center mb-6">
                    <Text className="text-2xl font-bold text-gray-800">Products</Text>
                    <TouchableOpacity
                        className="bg-blue-600 px-4 py-2 rounded-lg flex-row items-center"
                        onPress={handleAddProduct}
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text className="text-white font-medium ml-1">Add Product</Text>
                    </TouchableOpacity>
                </View>

                {/* Table with client-side operations */}
                <View className="flex-1 bg-white rounded-lg shadow-sm">
                    <ResourceTable
                        data={filteredProducts}
                        columns={productColumns}
                        actions={actions}
                        title="Products"
                        emptyText="No products found"
                        imageField="images[0].url"
                        subtitleField="brand.name"
                        onRefresh={handleRefresh}
                        refreshing={refreshing}
                        loading={loading}

                        // Client-side pagination
                        pagination={true}
                        initialItemsPerPage={5}
                        onPageChange={handlePageChange}

                        // Client-side search
                        searchEnabled={true}
                        onSearch={handleSearch}

                        // Client-side sorting
                        initialSort={currentSort}
                        onSortChange={handleSortChange}
                    />
                </View>

                {/* Product Modal for create/edit/view */}
                <ProductModal
                    visible={modalVisible}
                    onDismiss={() => setModalVisible(false)}
                    product={selectedProduct}
                    onSave={handleSaveProduct}
                    mode={modalMode}
                />
            </View>
        </SafeAreaView>
    )
}