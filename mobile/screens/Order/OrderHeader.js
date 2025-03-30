import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const OrderHeader = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterOptions, setShowFilterOptions] = useState(false);

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        onSearch(text);
    };

    const toggleFilterOptions = () => {
        setShowFilterOptions(!showFilterOptions);
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>My Orders</Text>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                />
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleFilterOptions}
                >
                    <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
            </View>

            {showFilterOptions && (
                <View style={styles.filterOptionsContainer}>
                    <Text style={styles.filterTitle}>Filter by:</Text>
                    <View style={styles.filterOptions}>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>Processing</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>Shipped</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>Delivered</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    newButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    newButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 6,
        paddingHorizontal: 12,
        marginRight: 8,
        backgroundColor: '#f5f5f5',
    },
    filterButton: {
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    filterButtonText: {
        color: '#757575',
        fontWeight: '500',
    },
    filterOptionsContainer: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    filterTitle: {
        fontSize: 14,
        color: '#757575',
        marginBottom: 8,
    },
    filterOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterOption: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

export default OrderHeader;
