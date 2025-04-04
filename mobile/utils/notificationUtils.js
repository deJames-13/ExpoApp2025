// Process notification from firebase.
// Allow link redirects etc.

/**
 * Checks if a notification message is a JSON string (prefixed with "JSON:")
 * @param {string} message - The notification message
 * @returns {boolean} - Whether the message is a JSON string
 */
export const isJsonMessage = (message) => {
    if (!message || typeof message !== 'string') return false;
    return message.startsWith('JSON:');
};

/**
 * Parse a JSON notification message
 * @param {string} message - The notification message (expected to start with "JSON:")
 * @returns {object|null} - The parsed JSON object or null if parsing failed
 */
export const parseJsonMessage = (message) => {
    if (!isJsonMessage(message)) return null;

    try {
        // Remove the "JSON:" prefix and parse the JSON
        const jsonString = message.substring(5);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Error parsing notification JSON:', error);
        return null;
    }
};

/**
 * Navigate to the appropriate screen based on notification data
 * @param {object} data - Notification data object
 * @param {function} navigation - React Navigation navigate function
 * @param {boolean} isAdmin - Whether the user is an admin
 * @returns {boolean} - Whether navigation was attempted
 */
export const navigateFromNotification = (navigation, data, isAdmin = false) => {
    if (!navigation || !data) return;

    try {
        // Handle order notifications
        if (data.type === 'order' && data.id) {
            if (isAdmin) {
                navigation.navigate('AdminRoutesStack', {
                    screen: 'AdminOrderDetail',
                    params: { orderId: data.id }
                });
            } else {
                navigation.navigate('DefaultRoutes', {
                    screen: 'Orders',
                    param: {
                        screen: 'OrderDetailView',
                        params: { orderId: data.id }
                    }
                });
            }
            return true;
        }

        // Handle other notification types as needed
        return false;
    } catch (error) {
        console.error('Navigation error:', error);
        return false;
    }
};