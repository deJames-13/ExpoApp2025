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
        default:
            return 'chevron-right';
    }
};

export default getIconForRoute;
