/**
 * Utility functions for ResourceTable operations
 */

/**
 * Sort an array of objects based on a field and direction
 * @param {Array} data - The array to sort
 * @param {Object} sortConfig - The sort configuration { field, direction }
 * @returns {Array} Sorted array
 */
export const sortData = (data, sortConfig) => {
    if (!sortConfig.field || !data?.length) return data;

    return [...data].sort((a, b) => {
        let aValue = a[sortConfig.field];
        let bValue = b[sortConfig.field];

        // Handle nested objects like category or brand
        if (sortConfig.field.includes('.')) {
            const parts = sortConfig.field.split('.');
            aValue = parts.reduce((obj, part) => obj && obj[part], a);
            bValue = parts.reduce((obj, part) => obj && obj[part], b);
        }

        // Default to empty string for undefined values
        aValue = aValue ?? '';
        bValue = bValue ?? '';

        // Handle string vs number comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortConfig.direction === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
    });
};

/**
 * Filter an array of objects based on a search text
 * @param {Array} data - The array to filter
 * @param {String} searchText - The search text
 * @param {Array} searchFields - Optional fields to search in (if not provided, searches all fields)
 * @returns {Array} Filtered array
 */
export const filterData = (data, searchText, searchFields = null) => {
    if (!searchText || !data?.length) return data;

    return data.filter(item => {
        // If specific fields are provided, only search those
        if (searchFields) {
            return searchFields.some(field => {
                const value = field.includes('.')
                    ? field.split('.').reduce((obj, part) => obj && obj[part], item)
                    : item[field];
                return value && String(value).toLowerCase().includes(searchText.toLowerCase());
            });
        }

        // Otherwise search all direct properties
        return Object.values(item).some(val =>
            val &&
            (typeof val === 'object'
                ? false // Skip nested objects in general search
                : String(val).toLowerCase().includes(searchText.toLowerCase()))
        );
    });
};

/**
 * Handles common table data operations: filtering and sorting
 * @param {Array} data - The source data array
 * @param {String} searchText - Search query text
 * @param {Object} sortConfig - { field, direction } sorting configuration
 * @param {Array} searchFields - Optional fields to search in
 * @returns {Array} Processed data array
 */
export const processTableData = (data, searchText, sortConfig, searchFields = null) => {
    let result = [...data];

    // Apply search filter
    if (searchText) {
        result = filterData(result, searchText, searchFields);
    }

    // Apply sorting
    if (sortConfig?.field) {
        result = sortData(result, sortConfig);
    }

    return result;
};
