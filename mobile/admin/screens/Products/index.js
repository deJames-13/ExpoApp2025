import { View, Text, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { ResourceTable } from '../../components/ResourceTable'
import { Ionicons } from '@expo/vector-icons'

export function Products() {
    // Sample data - in a real app, this would likely come from an API
    const [products, setProducts] = useState([
        { id: '1', name: 'Ray-Ban Aviator', price: '150.00', category: 'Sunglasses', stock: 24, image: 'https://via.placeholder.com/50' },
        { id: '2', name: 'Oakley Holbrook', price: '129.99', category: 'Sunglasses', stock: 15, image: 'https://via.placeholder.com/50' },
        { id: '3', name: 'Gucci Optical', price: '310.00', category: 'Eyeglasses', stock: 8, image: 'https://via.placeholder.com/50' },
        { id: '4', name: 'Contact Lens Solution', price: '12.99', category: 'Accessories', stock: 42, image: 'https://via.placeholder.com/50' },
        { id: '5', name: 'Anti-fog Cloth', price: '7.99', category: 'Accessories', stock: 56, image: 'https://via.placeholder.com/50' },
        { id: '6', name: 'Prada PR 17WS', price: '280.00', category: 'Sunglasses', stock: 12, image: 'https://via.placeholder.com/50' },
        { id: '7', name: 'Burberry BE2325', price: '220.00', category: 'Eyeglasses', stock: 18, image: 'https://via.placeholder.com/50' },
        { id: '8', name: 'Lens Cleaning Kit', price: '15.99', category: 'Accessories', stock: 35, image: 'https://via.placeholder.com/50' },
        { id: '9', name: 'Eyeglass Case', price: '24.99', category: 'Accessories', stock: 47, image: 'https://via.placeholder.com/50' },
        { id: '10', name: 'Tom Ford FT5634-B', price: '395.00', category: 'Eyeglasses', stock: 9, image: 'https://via.placeholder.com/50' },
        { id: '11', name: 'Maui Jim Honi', price: '329.99', category: 'Sunglasses', stock: 11, image: 'https://via.placeholder.com/50' },
        { id: '12', name: 'Vision Test Chart', price: '49.99', category: 'Equipment', stock: 7, image: 'https://via.placeholder.com/50' },
    ]);

    // State for table operations (client-side)
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentSort, setCurrentSort] = useState({ field: 'name', direction: 'asc' });
    const [searchText, setSearchText] = useState('');

    // Column definitions for the table with improved configuration
    const columns = [
        {
            id: 'main',
            title: 'Product',
            field: 'name',
            textAlign: 'left',
            flex: 1,
            priority: 1,
            sortable: true
        },
        {
            id: 'price',
            title: 'Price',
            field: 'price',
            textAlign: 'right',
            priority: 1,
            sortable: true,
            render: (item) => `$${item.price}`
        },
        {
            id: 'stock',
            title: 'Stock',
            field: 'stock',
            width: 80, // Wider for better readability
            textAlign: 'center', // Center-aligned for better appearance
            priority: 2,
            sortable: true
        },
        {
            id: 'category',
            title: 'Category',
            field: 'category',
            textAlign: 'left',
            priority: 3,
            sortable: true
        },
    ];

    // Update filtered products when sorting or searching changes (client-side implementation)
    useEffect(() => {
        let result = [...products];

        // Apply search filter if search text exists
        if (searchText) {
            result = result.filter(item =>
                Object.values(item).some(val =>
                    val && String(val).toLowerCase().includes(searchText.toLowerCase())
                )
            );
        }

        // Apply sorting if sort field exists
        if (currentSort.field) {
            result.sort((a, b) => {
                const aValue = a[currentSort.field] ?? '';
                const bValue = b[currentSort.field] ?? '';

                // Handle string vs number comparison
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return currentSort.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                return currentSort.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }

        setFilteredProducts(result);
    }, [products, currentSort, searchText]);

    // Action handlers
    const handleEdit = (product) => {
        console.log('Edit product:', product.id);
        // Navigation or modal logic would go here
    };

    const handleDelete = (product) => {
        Alert.alert(
            "Delete Product",
            `Are you sure you want to delete ${product.name}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        // Filter out the deleted product
                        setProducts(products.filter(p => p.id !== product.id));
                    }
                }
            ]
        );
    };

    // Actions configuration
    const actions = [
        { id: 'edit', icon: 'create-outline', color: '#4B5563', onPress: handleEdit },
        { id: 'delete', icon: 'trash-outline', color: '#EF4444', onPress: handleDelete },
    ];

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

        /* 
        // Server-side search example (commented out)
        setLoading(true);
        
        // This would be your API call with the search parameter
        // const response = await fetch(`/api/products?search=${query}`);
        // const data = await response.json();
        // setProducts(data);
        
        setLoading(false);
        */
    }, []);

    // Pagination handler (client-side)
    const handlePageChange = useCallback((page, itemsPerPage) => {
        console.log(`Page changed to ${page}, items per page: ${itemsPerPage}`);

        /* 
        // Server-side pagination example (commented out)
        setLoading(true);
        
        // This would be your API call with pagination parameters
        // const response = await fetch(`/api/products?page=${page}&limit=${itemsPerPage}`);
        // const data = await response.json();
        // setProducts(data.items);
        // setTotalItems(data.total);
        
        setLoading(false);
        */
    }, []);

    // Sorting handler (client-side)
    const handleSortChange = useCallback((sortConfig) => {
        console.log(`Sorting by ${sortConfig.field} (${sortConfig.direction})`);
        setCurrentSort(sortConfig);

        /* 
        // Server-side sorting example (commented out)
        setLoading(true);
        
        // This would be your API call with sorting parameters
        // const response = await fetch(`/api/products?sortBy=${sortConfig.field}&order=${sortConfig.direction}`);
        // const data = await response.json();
        // setProducts(data);
        
        setLoading(false);
        */
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
                        onPress={() => console.log('Add product')}
                    >
                        <Ionicons name="add" size={20} color="white" />
                        <Text className="text-white font-medium ml-1">Add Product</Text>
                    </TouchableOpacity>
                </View>

                {/* Table with client-side operations */}
                <View className="flex-1 bg-white rounded-lg shadow-sm">
                    <ResourceTable
                        data={filteredProducts}
                        columns={columns}
                        actions={actions}
                        title="Products"
                        emptyText="No products found"
                        imageField="image"
                        subtitleField="category"
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

                    // Server-side mode is disabled for now
                    // serverSide={false}
                    // totalServerItems={products.length}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}