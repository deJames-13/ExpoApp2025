import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons, Ionicons, AntDesign } from '@expo/vector-icons';

const CartHeader = ({ onSearch, onSelectAll, onDeselectAll, onClearCart, onRefresh, selectedCount, totalCount, navigation }) => {
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
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={onRefresh}
                    >
                        <Ionicons name="refresh" size={20} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => navigation?.navigate('TabsRoute', { screen: 'Home' })}
                    >
                        <Text style={styles.addButtonText}>+ Shop More</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchInputWrapper}>
                    <Ionicons name="search-outline" size={20} color="#757575" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search items in cart..."
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={() => handleSearchChange('')}
                            style={styles.clearSearchButton}
                        >
                            <Ionicons name="close-circle" size={18} color="#9e9e9e" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleFilterOptions}
                >
                    <Ionicons name="filter" size={22} color="#757575" />
                </TouchableOpacity>
            </View>

            <View style={styles.selectionControls}>
                <Text style={styles.selectionText}>
                    {selectedCount} of {totalCount} items selected
                </Text>
                <View style={styles.selectionButtons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onSelectAll}
                    >
                        <MaterialIcons name="select-all" size={22} color="#2196F3" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onDeselectAll}
                    >
                        <MaterialIcons name="deselect" size={22} color="#F44336" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onClearCart}
                    >
                        <AntDesign name="delete" size={22} color="#F44336" />
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
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    refreshButton: {
        padding: 8,
        marginRight: 8,
        borderRadius: 20,
        backgroundColor: '#E3F2FD',
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
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
        alignItems: 'center',
    },
    searchInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 40,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 6,
        paddingHorizontal: 8,
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        padding: 0,
    },
    clearSearchButton: {
        padding: 2,
    },
    filterButton: {
        backgroundColor: '#f5f5f5',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e0e0e0',
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
    iconButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        marginLeft: 8,
        backgroundColor: '#f5f5f5',
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
