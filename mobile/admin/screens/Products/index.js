import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { productsData, fetchProducts } from './data'
import { productColumns, productActions } from './table-data'
import { ProductModal } from './modal'
import { ResourceTable, processTableData } from '~/components/ResourceTable'
import api from '~/axios.config'
import { useSelector } from 'react-redux'

export function Products() {
    const [products, setProducts] = useState(productsData);
    const [loading, setLoading] = useState(true); // Changed to be used for actual loading state
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

    // Fetch products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            setLoading(true);
            try {
                // Request up to 100 products instead of using the default limit
                const data = await fetchProducts(100);
                console.log('Fetched products count:', data?.length); // Log the count for debugging
                
                // Ensure we have valid data before setting state
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Received invalid products data:', data);
                    setProducts([]);
                }
            } catch (error) {
                console.error('Error loading products:', error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadProducts();
    }, []);

    // Use useMemo with null check for filteredProducts
    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) {
            console.warn('Products is not an array:', products);
            return [];
        }
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

    // Get auth token for API requests
    const authToken = useSelector(state => state.auth?.token);

    // Add delete product function that calls the API
    const deleteProduct = async (productId) => {
        try {
            // Set up auth headers for the request
            const config = {
                headers: {
                    'Authorization': authToken ? `Bearer ${authToken}` : ''
                }
            };
            
            console.log(`Attempting to delete product: ${productId}`);
            
            // Make API call to delete the product
            const response = await api.delete(`/api/v1/products/delete/${productId}`, config);
            
            console.log('Delete response:', response.data);
            
            // Fix: Check for success correctly based on your API response format
            // Your API returns { message: "Data deleted!", status: 200, success: true }
            if (response.data && (response.data.success === true || response.data.status === 200 || response.data.status === 'success')) {
                // If successful, remove from state
                setProducts(prevProducts => prevProducts.filter(p => {
                    // Check both id and _id to ensure we remove the correct product
                    const pId = p.id || p._id;
                    return pId !== productId;
                }));
                return true;
            } else {
                console.error('Unexpected response format:', response.data);
                return false;
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            
            // Provide more detailed error message
            let errorMessage = 'Failed to delete product. Please try again.';
            
            if (error.response) {
                // The server responded with an error status
                console.error('Server error:', error.response.data);
                
                if (error.response.status === 404) {
                    errorMessage = 'Product not found. It may have been already deleted.';
                } else if (error.response.status === 401) {
                    errorMessage = 'You are not authorized to delete this product.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.request) {
                // The request was made but no response was received
                errorMessage = 'No response from server. Please check your connection.';
            }
            
            Alert.alert('Error', errorMessage);
            return false;
        }
    };

    // Update the handleDelete function to use the API
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
                        const productId = product.id || product._id;
                        if (!productId) {
                            Alert.alert('Error', 'Invalid product ID');
                            return;
                        }
                        
                        // Show loading indicator
                        setLoading(true);
                        
                        // Call the delete API
                        const success = await deleteProduct(productId);
                        
                        // Hide loading indicator
                        setLoading(false);
                        
                        // Show success message if operation was successful
                        if (success) {
                            Alert.alert('Success', `${product.name} has been deleted successfully`);
                        }
                    }
                }
            ]
        );
    }, [authToken]); // Add authToken to dependencies

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

    // Refresh handler updated to use the API with better error handling
    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        try {
            const data = await fetchProducts(100);
            
            // Ensure we have valid data before setting state
            if (Array.isArray(data)) {
                setProducts(data);
            } else {
                console.error('Received invalid products data:', data);
                // Keep existing products if we get invalid data
            }
        } catch (error) {
            console.error('Error refreshing products:', error);
        } finally {
            setRefreshing(false);
        }
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
                        imageField="images[0]?.url || 'https://via.placeholder.com/50'"
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