import { getActionIcon } from '~/utils/iconHelper';

// Configuration for product table columns
export const productColumns = [
    {
        id: 'main',
        title: 'Product',
        field: 'name',
        textAlign: 'left',
        flex: 1,
        priority: 1,
        sortable: true
    },
    {
        id: 'price',
        title: 'Price',
        field: 'price',
        textAlign: 'right',
        priority: 1,
        sortable: true,
        render: (item) => {
            // Check if price exists and is a number before using toFixed
            const price = item.price !== undefined && !isNaN(item.price) 
                ? `$${Number(item.price).toFixed(2)}` 
                : '$0.00';
            return price;
        }
    },
    {
        id: 'stock',
        title: 'Stock',
        field: 'stock',
        width: 80,
        textAlign: 'center',
        priority: 1,
        sortable: true
    }
];

// Configuration for table actions - using the icon helper
export const productActions = [
    { id: 'edit', icon: getActionIcon('edit', 'Ionicons'), color: '#4B5563' },
    { id: 'delete', icon: getActionIcon('delete', 'Ionicons'), color: '#EF4444' },
];
