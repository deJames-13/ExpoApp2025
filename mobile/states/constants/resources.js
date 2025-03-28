// Central list of all resources used in the application
export const resources = [
    'users',
    'products',
    'categories',
    'orders',
    'cart',
    'notifications',
    'reviews',
];

// Export function to add a new resource type
export const addResource = (resource) => {
    if (!resources.includes(resource.toLowerCase())) {
        resources.push(resource.toLowerCase());

        try {
            const { addTagType } = require('../api');
            if (addTagType) {
                addTagType(resource.toUpperCase());
            }
        } catch (error) {
            console.warn('Could not automatically update tag types:', error);
        }
    }
};
