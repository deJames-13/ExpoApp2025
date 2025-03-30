/**
 * Format a date string to a readable format
 * @param {string|Date} dateString - Date string or Date object
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';

    const defaultOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options
    };

    return date.toLocaleDateString(undefined, defaultOptions);
};

/**
 * Format a currency value
 * @param {number} value - Value to format
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = '$') => {
    if (value === null || value === undefined) return 'N/A';
    return `${currency} ${parseFloat(value).toFixed(2)}`;
};
