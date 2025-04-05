import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const NotificationHeader = ({
    clearAll,
    markAllAsRead,
    toggleSelectionMode,
    selectionMode,
    deleteSelected,
    hasSelectedItems,
    onRefresh,
    isRefreshing
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Notifications</Text>
                {!selectionMode && (
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={onRefresh}
                        disabled={isRefreshing}
                    >
                        <MaterialIcons
                            name="refresh"
                            size={24}
                            color="#2196F3"
                            style={isRefreshing ? styles.rotating : null}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.actionsContainer}>
                {!selectionMode ? (
                    <>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={markAllAsRead}
                        >
                            <MaterialIcons name="done-all" size={22} color="#555" />
                            <Text style={styles.actionText}>Read All</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={toggleSelectionMode}
                        >
                            <MaterialIcons name="playlist-add-check" size={22} color="#555" />
                            <Text style={styles.actionText}>Select</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={clearAll}
                        >
                            <MaterialIcons name="clear-all" size={22} color="#555" />
                            <Text style={styles.actionText}>Clear All</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={toggleSelectionMode}
                        >
                            <MaterialIcons name="close" size={22} color="#555" />
                            <Text style={styles.actionText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, !hasSelectedItems && styles.disabledButton]}
                            onPress={hasSelectedItems ? deleteSelected : null}
                        >
                            <MaterialIcons name="delete" size={22} color={hasSelectedItems ? "#ff3b30" : "#aaa"} />
                            <Text style={[styles.actionText, hasSelectedItems && styles.deleteText]}>Delete</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    titleContainer: {
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    refreshButton: {
        padding: 4,
    },
    rotating: {
        opacity: 0.7,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginLeft: 10,
    },
    actionText: {
        marginLeft: 4,
        fontSize: 14,
        color: '#555',
    },
    deleteText: {
        color: '#ff3b30',
    },
    disabledButton: {
        opacity: 0.5,
    }
});

export default NotificationHeader;
