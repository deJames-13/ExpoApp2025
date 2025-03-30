// Process notification from firebase.
// Allow link redirects etc.

/**
 * Checks if a notification message is a JSON string (prefixed with "JSON:")
 * @param {string} message - The notification message
 * @returns {boolean} - Whether the message is a JSON string
 */
export const isJsonMessage = (message) => {
    return typeof message === 'string' && message.startsWith('JSON:');
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
 * Determine navigation parameters based on notification type
 * @param {object} data - Notification data with type and id
 * @returns {object|null} - Navigation parameters or null if invalid
 */
export const getNavigationParams = (data) => {
    if (!data || !data.type) return null;

    switch (data.type) {
        case 'order':
            // Determine if user is admin or regular user
            const isAdmin = data.isAdmin === true;

            if (isAdmin) {
                return {
                    rootNav: 'AdminNav',
                    params: {
                        screen: 'AdminRoutesStack',
                        params: {
                            screen: 'AdminOrderDetail',
                            params: { order: { id: data.id } }
                        }
                    }
                };
            } else {
                return {
                    rootNav: 'DefaultNav',
                    params: {
                        screen: 'DefaultRoutes',
                        params: {
                            screen: 'OrderDetailView',
                            params: { orderId: data.id }
                        }
                    }
                };
            }

        // Add more notification types as needed
        case 'product':
            return {
                rootNav: data.isAdmin ? 'AdminNav' : 'DefaultNav',
                params: {
                    screen: 'ProductDetailView',
                    params: { productId: data.id }
                }
            };

        default:
            return null;
    }
};

/**
 * Navigate to the appropriate screen based on notification data
 * @param {object} data - Notification data object
 * @param {function} navigation - React Navigation navigate function
 * @returns {boolean} - Whether navigation was attempted
 */
export const navigateFromNotification = (data, navigation) => {
    if (!data || !navigation) return false;

    const navParams = getNavigationParams(data);
    if (!navParams) return false;

    try {
        navigation.navigate(navParams.rootNav, navParams.params);
        return true;
    } catch (error) {
        console.error('Navigation error:', error);
        return false;
    }
};