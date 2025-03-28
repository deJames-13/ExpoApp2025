import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTable } from './context';

export function Pagination() {
    const {
        currentPage = 1,
        totalPages = 1,
        handlePageChange,
        itemsPerPage = 10,
        handleItemsPerPageChange,
        totalItems = 0
    } = useTable();

    // State for dropdown visibility
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Available items per page options
    const itemsPerPageOptions = [5, 10, 15, 25];

    // Calculate the range of items being displayed with safety checks
    const startItem = Math.max(1, (currentPage - 1) * itemsPerPage + 1);
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <View className="p-3 border-t border-gray-200 bg-gray-50">
            <View className="flex flex-col space-y-3 items-center">
                <View className="flex-row items-center justify-center">
                    <Text className="text-sm text-gray-500 mr-2">Rows:</Text>

                    <View>
                        {/* Custom dropdown implementation */}
                        <TouchableOpacity
                            style={styles.dropdownButton}
                            onPress={() => setDropdownVisible(true)}
                        >
                            <Text style={styles.dropdownButtonText}>{itemsPerPage}</Text>
                            <MaterialIcons name="arrow-drop-down" size={20} color="#4B5563" />
                        </TouchableOpacity>

                        {/* Dropdown modal */}
                        <Modal
                            visible={dropdownVisible}
                            transparent={true}
                            animationType="fade"
                            onRequestClose={() => setDropdownVisible(false)}
                        >
                            <TouchableOpacity
                                style={styles.modalOverlay}
                                activeOpacity={1}
                                onPress={() => setDropdownVisible(false)}
                            >
                                <View style={styles.dropdown}>
                                    {itemsPerPageOptions.map(option => (
                                        <TouchableOpacity
                                            key={option}
                                            style={[
                                                styles.dropdownItem,
                                                itemsPerPage === option && styles.selectedItem
                                            ]}
                                            onPress={() => {
                                                handleItemsPerPageChange(option);
                                                setDropdownVisible(false);
                                            }}
                                        >
                                            <Text style={[
                                                styles.dropdownItemText,
                                                itemsPerPage === option && styles.selectedItemText
                                            ]}>
                                                {option}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </TouchableOpacity>
                        </Modal>
                    </View>
                </View>

                {/* Middle row: Item count display */}
                <View className="flex-row justify-center">
                    <Text className="text-sm text-gray-500">
                        {totalItems === 0 ? 'No items' : `${startItem}-${endItem} of ${totalItems}`}
                    </Text>
                </View>

                {/* Bottom row: Navigation arrows */}
                <View className="flex-row justify-center items-center space-x-4">
                    {/* First page button */}
                    <TouchableOpacity
                        onPress={() => handlePageChange(1)}
                        disabled={currentPage <= 1}
                        className={`p-1 rounded-full ${currentPage <= 1 ? 'opacity-50' : 'bg-gray-100'}`}
                    >
                        <MaterialIcons name="first-page" size={24} color="#4B5563" />
                    </TouchableOpacity>

                    {/* Previous page button */}
                    <TouchableOpacity
                        onPress={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage <= 1}
                        className={`p-1 rounded-full ${currentPage <= 1 ? 'opacity-50' : 'bg-gray-100'}`}
                    >
                        <MaterialIcons name="chevron-left" size={24} color="#4B5563" />
                    </TouchableOpacity>

                    {/* Page indicator */}
                    <Text className="px-3 text-sm font-medium text-gray-700">
                        {currentPage} / {totalPages || 1}
                    </Text>

                    {/* Next page button */}
                    <TouchableOpacity
                        onPress={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= totalPages}
                        className={`p-1 rounded-full ${currentPage >= totalPages ? 'opacity-50' : 'bg-gray-100'}`}
                    >
                        <MaterialIcons name="chevron-right" size={24} color="#4B5563" />
                    </TouchableOpacity>

                    {/* Last page button */}
                    <TouchableOpacity
                        onPress={() => handlePageChange(totalPages)}
                        disabled={currentPage >= totalPages}
                        className={`p-1 rounded-full ${currentPage >= totalPages ? 'opacity-50' : 'bg-gray-100'}`}
                    >
                        <MaterialIcons name="last-page" size={24} color="#4B5563" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

// Styles for the custom dropdown
const styles = StyleSheet.create({
    dropdownButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 4,
        backgroundColor: 'white',
        width: 60,
        height: 30,
    },
    dropdownButtonText: {
        fontSize: 14,
        color: '#4B5563',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    dropdown: {
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        width: 100,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    selectedItem: {
        backgroundColor: '#EBF5FF',
    },
    dropdownItemText: {
        fontSize: 14,
        color: '#4B5563',
        textAlign: 'center',
    },
    selectedItemText: {
        color: '#2563EB',
        fontWeight: '500',
    },
});
