import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

const CartHeader = ({ onSearch, onSelectAll, onDeselectAll, selectedCount, totalCount }) => {
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
                <Text style={styles.title}>My Cart</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Shop More</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search items in cart..."
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

            <View style={styles.selectionControls}>
                <Text style={styles.selectionText}>
                    {selectedCount} of {totalCount} items selected
                </Text>
                <View style={styles.selectionButtons}>
                    <TouchableOpacity
                        style={styles.selectionButton}
                        onPress={onSelectAll}
                    >
                        <Text style={styles.selectionButtonText}>Select All</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.selectionButton, styles.deselectButton]}
                        onPress={onDeselectAll}
                    >
                        <Text style={styles.deselectButtonText}>Deselect All</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {showFilterOptions && (
                <View style={styles.filterOptionsContainer}>
                    <Text style={styles.filterTitle}>Filter by:</Text>
                    <View style={styles.filterOptions}>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>All</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>In Stock</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.filterOption}>
                            <Text>Processing</Text>
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
    addButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 6,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    searchContainer: {
        flexDirection: 'row',
        marginBottom: 12,
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
    selectionControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    selectionText: {
        color: '#757575',
        fontSize: 14,
    },
    selectionButtons: {
        flexDirection: 'row',
    },
    selectionButton: {
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: '#E3F2FD',
        borderRadius: 4,
        marginLeft: 8,
    },
    selectionButtonText: {
        color: '#2196F3',
        fontWeight: '500',
        fontSize: 13,
    },
    deselectButton: {
        backgroundColor: '#FFEBEE',
    },
    deselectButtonText: {
        color: '#F44336',
        fontWeight: '500',
        fontSize: 13,
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
    },
    filterOption: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
});

export default CartHeader;
