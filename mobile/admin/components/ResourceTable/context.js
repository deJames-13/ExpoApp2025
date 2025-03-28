import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const TableContext = createContext();

export function TableProvider({
    children,
    data = [],
    initialSort = { field: null, direction: 'asc' },
    initialItemsPerPage = 10,
    pagination = false,
    onPageChange = null,
    onSortChange = null,
    onSearch = null,
    searchEnabled = false,
    visibleColumns = [],
    actions = [],

    serverSide = false,
    loading = false,
    totalServerItems = null,
}) {
    // Sorting state
    const [sortConfig, setSortConfig] = useState(initialSort);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

    // Search state
    const [searchQuery, setSearchQuery] = useState('');

    // Store visibleColumns in state for dynamic updates
    const [columnsVisible, setVisibleColumns] = useState(visibleColumns);

    // Reset page when itemsPerPage changes
    useEffect(() => {
        setCurrentPage(1);
    }, [itemsPerPage]);

    // Reset page when data changes significantly (e.g., new data loaded)
    useEffect(() => {
        if (Array.isArray(data)) {
            // Only reset if we're doing client-side pagination
            if (!serverSide) {
                setCurrentPage(1);
            }
        }
    }, [data?.length, serverSide]);

    // Process data (sort, filter, paginate)
    const processedData = useMemo(() => {
        // Handle if data is not an array
        if (!Array.isArray(data)) return [];

        // If using server-side operations, return the data as-is
        // because sorting/filtering happens on the server
        if (serverSide) return data;

        // Start with original data for client-side operations
        let result = [...data];

        // Apply search if searchQuery exists (client-side searching)
        if (searchQuery && searchEnabled && !onSearch) {
            result = result.filter(item =>
                Object.values(item).some(val =>
                    val && String(val).toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Apply sorting if sortConfig.field exists (client-side sorting)
        if (sortConfig?.field && !onSortChange) {
            result.sort((a, b) => {
                // Get values, defaulting to empty string/0 if undefined
                let aValue = a[sortConfig.field] ?? '';
                let bValue = b[sortConfig.field] ?? '';

                // Handle string comparison
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }

                // Handle number comparison
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }

        return result;
    }, [data, sortConfig, searchQuery, searchEnabled, onSearch, onSortChange, serverSide]);

    // Paginate data (client-side pagination)
    const paginatedData = useMemo(() => {
        // If server-side pagination, the data is already paginated
        if (serverSide || !pagination || !Array.isArray(processedData))
            return processedData;

        // Apply client-side pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        return processedData.slice(startIndex, startIndex + itemsPerPage);
    }, [processedData, currentPage, itemsPerPage, pagination, serverSide]);

    // Calculate total pages
    const totalPages = useMemo(() => {
        // For server-side pagination, calculate from totalServerItems
        if (serverSide && totalServerItems !== null) {
            return Math.max(1, Math.ceil(totalServerItems / itemsPerPage));
        }

        // For client-side pagination, calculate from processed data
        if (!Array.isArray(processedData)) return 1;
        return Math.max(1, Math.ceil(processedData.length / itemsPerPage));
    }, [processedData?.length, itemsPerPage, serverSide, totalServerItems]);

    // Get total items (either from server or client-side data)
    const totalItems = useMemo(() => {
        if (serverSide && totalServerItems !== null) {
            return totalServerItems;
        }
        return Array.isArray(processedData) ? processedData.length : 0;
    }, [processedData, serverSide, totalServerItems]);

    // Request sort - enhanced for server-side operations
    const requestSort = (field) => {
        if (!field) return;

        const direction =
            sortConfig?.field === field && sortConfig?.direction === 'asc' ? 'desc' : 'asc';

        const newSortConfig = { field, direction };
        setSortConfig(newSortConfig);

        // Call external handler for server-side sorting
        if (onSortChange) {
            onSortChange(newSortConfig);
        }
    };

    // Handle page change with enhanced server-side support
    const handlePageChange = (newPage) => {
        if (newPage < 1 || newPage > totalPages) return;

        setCurrentPage(newPage);

        // Call external handler for server-side pagination
        if (onPageChange) {
            onPageChange(newPage, itemsPerPage);
        }
    };

    // Handle items per page change with enhanced server-side support
    const handleItemsPerPageChange = (newItemsPerPage) => {
        if (!newItemsPerPage || newItemsPerPage < 1) return;

        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reset to first page

        // Call external handler for server-side pagination
        if (onPageChange) {
            onPageChange(1, newItemsPerPage);
        }
    };

    // Handle search query change with enhanced server-side support
    const handleSearch = (query) => {
        const cleanQuery = query || '';
        setSearchQuery(cleanQuery);

        // Call external handler for server-side search
        if (onSearch) {
            // For server search, go back to first page
            if (serverSide) {
                setCurrentPage(1);
            }
            onSearch(cleanQuery);
        }
    };

    // Prepare a debounced search for user typing
    useEffect(() => {
        // Only apply debounce for server-side search to reduce API calls
        if (!onSearch || !serverSide) return;

        const handler = setTimeout(() => {
            onSearch(searchQuery);
        }, 300); // 300ms debounce

        return () => clearTimeout(handler);
    }, [searchQuery, onSearch, serverSide]);

    const value = {
        // Data
        originalData: data,
        processedData,
        displayData: paginatedData,
        totalItems,
        loading,
        serverSide,

        // Sorting
        sortConfig,
        requestSort,

        // Pagination
        pagination,
        currentPage,
        totalPages,
        itemsPerPage,
        handlePageChange,
        handleItemsPerPageChange,

        // Search
        searchEnabled,
        searchQuery,
        handleSearch,

        // Columns
        visibleColumns: columnsVisible,
        setVisibleColumns,

        // Actions
        actions,
    };

    return <TableContext.Provider value={value}>{children}</TableContext.Provider>;
}

export const useTable = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error('useTable must be used within a TableProvider');
    }
    return context;
};
