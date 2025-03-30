export const cartItemsData = [
    {
        id: '1',
        name: 'Ray-Ban Aviator',
        price: 149.99,
        quantity: 1,
        status: 'In Stock',
        product: {
            id: '101',
            name: 'Ray-Ban Aviator',
            images: ['https://example.com/rayban.jpg'],
            description: 'Classic Aviator sunglasses',
            stock: 10
        },
        total: 149.99
    },
    {
        id: '2',
        name: 'Oakley Holbrook',
        price: 129.99,
        quantity: 2,
        status: 'In Stock',
        product: {
            id: '102',
            name: 'Oakley Holbrook',
            images: ['https://example.com/oakley.jpg'],
            description: 'Sport sunglasses with UV protection',
            stock: 5
        },
        total: 259.98
    },
    {
        id: '3',
        name: 'Gucci GG0036S',
        price: 299.99,
        quantity: 1,
        status: 'Processing',
        product: {
            id: '103',
            name: 'Gucci GG0036S',
            images: ['https://example.com/gucci.jpg'],
            description: 'Luxury designer sunglasses',
            stock: 3
        },
        total: 299.99
    },
]