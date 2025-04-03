import { View, Text, FlatList, Image, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useMemo } from 'react'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { TableProvider, useTable } from './context'
import { Pagination } from './pagination'
import { SearchBar } from './searchBar'

export * from './tableUtils'
// Table header component that accesses context
function TableHeader() {
    const { requestSort, sortConfig, actions } = useTable();
    // Get visibleColumns from context with an empty array fallback
    const { visibleColumns = [] } = useTable();

    return (
        <View className="flex-row bg-gray-100 p-3 border-b border-gray-200">
            {/* Add a check to ensure visibleColumns is an array before mapping */}
            {Array.isArray(visibleColumns) && visibleColumns.map((column, index) => (
                <TouchableOpacity
                    key={column.id}
                    style={{
                        width: column.width || 'auto',
                        flex: column.flex || 0,
                        paddingHorizontal: 8,
                    }}
                    className={`${column.textAlign === 'right' ? 'items-end' : column.textAlign === 'center' ? 'items-center' : 'items-start'}`}
                    onPress={() => column.sortable ? requestSort(column.field) : null}
                    disabled={!column.sortable}
                >
                    <View className="flex-row items-center">
                        <Text className="font-semibold text-gray-600">
                            {column.title}
                        </Text>
                        {column.sortable && (
                            <View className="ml-1">
                                {sortConfig && sortConfig.field === column.field ? (
                                    <MaterialIcons
                                        name={sortConfig.direction === 'asc' ? 'arrow-upward' : 'arrow-downward'}
                                        size={14}
                                        color="#4B5563"
                                    />
                                ) : (
                                    <MaterialIcons name="sort" size={14} color="#9CA3AF" />
                                )}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
            {/* Check if actions exists and has length before rendering */}
            {Array.isArray(actions) && actions.length > 0 && (
                <Text className="w-20 font-semibold text-gray-600 text-center ml-2">Actions</Text>
            )}
        </View>
    );
}

// Main table component with the data rows
function TableContent() {
    const {
        displayData = [],
        imageField,
        subtitleField,
        emptyText,
        onRefresh,
        refreshing
    } = useTable();

    // Get visibleColumns and actions with empty array fallbacks
    const { visibleColumns = [], actions = [] } = useTable();

    const renderItem = ({ item }) => (
        <View className="flex-row items-center py-4 px-2 border-b border-gray-100">
            {Array.isArray(visibleColumns) && visibleColumns.map((column) => {
                if (column.id === 'main') {
                    // Special case for main column that may contain image and subtitle
                    return (
                        <View
                            key={column.id}
                            style={{
                                flex: column.flex || 1,
                            }}
                            className="flex-row items-center"
                        >
                            {imageField && item[imageField] && (
                                <Image source={{ uri: item[imageField] }} className="w-10 h-10 rounded-md bg-gray-200" />
                            )}
                            <View className="ml-3">
                                <Text className="font-medium text-gray-800">
                                    {column.render ? column.render(item) : item[column.field]}
                                </Text>
                                {subtitleField && item[subtitleField] && (
                                    <Text className="text-xs text-gray-500">{item[subtitleField]}</Text>
                                )}
                            </View>
                        </View>
                    );
                }

                return (
                    <Text
                        key={column.id}
                        style={{
                            width: column.width || 'auto',
                            flex: column.flex || 0,
                            paddingHorizontal: 8,
                        }}
                        className={`text-gray-700 ${column.textAlign === 'right' ? 'text-right' : column.textAlign === 'center' ? 'text-center' : 'text-left'}`}
                    >
                        {column.render ? column.render(item) : item[column.field]}
                    </Text>
                );
            })}

            {Array.isArray(actions) && actions.length > 0 && (
                <View className="w-20 flex-row justify-center ml-2">
                    {actions.map((action) => (
                        <TouchableOpacity
                            key={action.id}
                            className="mx-1"
                            onPress={() => action.onPress(item)}
                        >
                            <Ionicons name={action.icon} size={18} color={action.color} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );

    return (
        <FlatList
            data={displayData}
            keyExtractor={(item) => (item.id || '').toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListEmptyComponent={
                <View className="p-4 items-center justify-center">
                    <Text className="text-gray-500">{emptyText || "No data found"}</Text>
                </View>
            }
        />
    );
}

// Internal implementation of the table that uses context
function TableImplementation({
    imageField,
    subtitleField,
    actions = [],
    loading,
    emptyText,
    onRefresh,
    refreshing,
    searchEnabled,
    pagination,
    columns = [],
}) {
    const { width } = useWindowDimensions();

    // Calculate visible columns and store in context
    const visibleColumns = useMemo(() => {
        if (!Array.isArray(columns)) return [];

        if (width < 350) {
            return columns.filter(col => col.priority === 1);
        } else if (width < 600) {
            return columns.filter(col => col.priority <= 2);
        }
        return columns;
    }, [columns, width]);

    // Update the context with calculated visibleColumns
    const tableContext = useTable();
    React.useEffect(() => {
        if (tableContext.setVisibleColumns) {
            tableContext.setVisibleColumns(visibleColumns);
        }
    }, [visibleColumns]);

    return (
        <View className="flex-1 bg-white rounded-lg overflow-hidden">
            {/* Search bar */}
            {searchEnabled && <SearchBar />}

            {/* Table header */}
            <TableHeader />

            {/* Table content with loading state */}
            <View className="flex-1">
                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#4B5563" />
                        <Text className="mt-2 text-gray-500">Loading data...</Text>
                    </View>
                ) : (
                    <TableContent
                        imageField={imageField}
                        subtitleField={subtitleField}
                        actions={actions}
                        loading={loading}
                        emptyText={emptyText}
                        onRefresh={onRefresh}
                        refreshing={refreshing}
                    />
                )}
            </View>

            {/* Pagination */}
            {pagination && <Pagination />}
        </View>
    );
}

// Main exported component that wraps everything in the context provider
export function ResourceTable({
    data = [],
    columns = [],
    actions = [],
    title = "Resources",
    loading = false,
    onRefresh = null,
    refreshing = false,
    emptyText = "No data found",
    imageField = null,
    subtitleField = null,
    pagination = false,
    onPageChange = null,
    initialItemsPerPage = 10,
    sortable = false,
    initialSort = { field: null, direction: 'asc' },
    onSortChange = null,
    searchEnabled = false,
    onSearch = null,

    serverSide = false,
    totalServerItems = null,
}) {
    const { width } = useWindowDimensions();

    // Safety check to ensure columns is an array
    const safeColumns = Array.isArray(columns) ? columns : [];
    const safeActions = Array.isArray(actions) ? actions : [];

    // Calculate visible columns for initial context setup
    const visibleColumns = useMemo(() => {
        if (width < 350) {
            return safeColumns.filter(col => col.priority === 1);
        } else if (width < 600) {
            return safeColumns.filter(col => col.priority <= 2);
        }
        return safeColumns;
    }, [safeColumns, width]);

    return (
        <TableProvider
            data={data}
            initialSort={initialSort}
            initialItemsPerPage={initialItemsPerPage}
            pagination={pagination}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            onSearch={onSearch}
            searchEnabled={searchEnabled}
            visibleColumns={visibleColumns}
            actions={safeActions}

            serverSide={serverSide}
            loading={loading}
            totalServerItems={totalServerItems}
        >
            <TableImplementation
                columns={safeColumns}
                imageField={imageField}
                subtitleField={subtitleField}
                actions={safeActions}
                loading={loading}
                emptyText={emptyText}
                onRefresh={onRefresh}
                refreshing={refreshing}
                searchEnabled={searchEnabled}
                pagination={pagination}
            />
        </TableProvider>
    );
}