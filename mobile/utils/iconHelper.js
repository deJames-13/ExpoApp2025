/**
 * Helper function to map route names to appropriate icons
 */
export const getIconForRoute = (routeName) => {
    switch (routeName.toLowerCase()) {
        case 'home':
            return 'home';
        case 'search':
            return 'magnify';
        case 'profile':
            return 'account';
        case 'settings':
            return 'cog';
        case 'cart':
            return 'cart';
        case 'shop':
        case 'products':
            return 'shopping';
        case 'favorites':
        case 'wishlist':
            return 'heart';
        case 'orders':
            return 'package-variant-closed';
        case 'notifications':
            return 'bell';
        case 'about':
            return 'information';
        case 'support':
        case 'help':
            return 'help-circle';
        case 'contact':
            return 'email';
        case 'categories':
            return 'shape';
        case 'brands':
            return 'tag';
        case 'edit':
        case 'modify':
            return 'pencil';
        case 'delete':
        case 'remove':
            return 'trash-can';
        case 'add':
        case 'create':
            return 'plus';
        case 'view':
        case 'details':
            return 'eye';
        case 'stock':
        case 'inventory':
            return 'package';
        default:
            return 'chevron-right';
    }
};

/**
 * Helper function to get icon for table action
 * @param {String} actionType - The type of action
 * @param {String} iconLibrary - The icon library to use (default: 'MaterialCommunityIcons')
 * @returns {String} The icon name
 */
export const getActionIcon = (actionType, iconLibrary = 'MaterialCommunityIcons') => {
    if (iconLibrary === 'Ionicons') {
        switch (actionType.toLowerCase()) {
            case 'edit':
                return 'create-outline';
            case 'delete':
                return 'trash-outline';
            case 'view':
                return 'eye-outline';
            case 'add':
                return 'add';
            default:
                return 'chevron-forward-outline';
        }
    }

    // Default is MaterialCommunityIcons
    return getIconForRoute(actionType);
};

export default getIconForRoute;
