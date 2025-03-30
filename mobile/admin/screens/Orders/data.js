export const mockOrders = [
    {
        id: '1001',
        orderNumber: 'ORD-1001',
        createdAt: new Date('2023-10-01T10:30:00'),
        status: 'delivered',
        note: 'Leave package at front door',
        customer: {
            id: 'C001',
            username: 'johndoe',
            email: 'john.doe@example.com',
            info: {
                first_name: 'John',
                last_name: 'Doe',
                contact: '1234567890',
                address: '123 Main St',
                city: 'Anytown',
                region: 'AN',
                zip_code: '12345',
                avatar: {
                    url: 'https://randomuser.me/api/portraits/men/1.jpg'
                }
            }
        },
        totalAmount: 129.99,
        subtotal: 119.99,
        payment: {
            method: 'paypal',
            status: 'paid',
        },
        shipping: {
            method: 'std',
            address: '123 Main St, Anytown, AN 12345',
            start_ship_date: new Date('2023-10-02'),
            expected_ship_date: new Date('2023-10-03'),
            shipped_date: new Date('2023-10-03'),
            fee: 10.00,
        },
        products: [
            {
                product: {
                    id: 'P001',
                    name: 'Designer Eyeglasses - Model X',
                    price: 79.99,
                    stock: 45,
                    images: [{ url: 'https://example.com/images/glasses1.jpg' }],
                    category: {
                        name: 'Eyeglasses'
                    },
                    brand: {
                        name: 'LuxuryVision'
                    }
                },
                quantity: 1
            },
            {
                product: {
                    id: 'P002',
                    name: 'Cleaning Kit - Premium',
                    price: 19.99,
                    stock: 120,
                    images: [{ url: 'https://example.com/images/kit1.jpg' }],
                    category: {
                        name: 'Accessories'
                    },
                    brand: {
                        name: 'ClearView'
                    }
                },
                quantity: 2
            }
        ]
    },
    {
        id: '1002',
        orderNumber: 'ORD-1002',
        createdAt: new Date('2023-10-05T14:20:00'),
        status: 'shipped',
        note: '',
        customer: {
            id: 'C002',
            username: 'janesmith',
            email: 'jane.smith@example.com',
            info: {
                first_name: 'Jane',
                last_name: 'Smith',
                contact: '9876543210',
                address: '456 Oak Ave',
                city: 'Somewhere',
                region: 'SW',
                zip_code: '67890',
                avatar: {
                    url: 'https://randomuser.me/api/portraits/women/1.jpg'
                }
            }
        },
        totalAmount: 229.95,
        subtotal: 219.95,
        payment: {
            method: 'stripe',
            status: 'paid',
        },
        shipping: {
            method: 'exp',
            address: '456 Oak Ave, Somewhere, SW 67890',
            start_ship_date: new Date('2023-10-05'),
            expected_ship_date: new Date('2023-10-06'),
            shipped_date: new Date('2023-10-06'),
            fee: 10.00,
        },
        products: [
            {
                product: {
                    id: 'P003',
                    name: 'Sunglasses - Elite Series',
                    price: 149.95,
                    stock: 32,
                    images: [{ url: 'https://example.com/images/sunglasses1.jpg' }],
                    category: {
                        name: 'Sunglasses'
                    },
                    brand: {
                        name: 'SunMaster'
                    }
                },
                quantity: 1
            },
            {
                product: {
                    id: 'P004',
                    name: 'Hard Case - Protection Pro',
                    price: 29.99,
                    stock: 75,
                    images: [{ url: 'https://example.com/images/case1.jpg' }],
                    category: {
                        name: 'Accessories'
                    },
                    brand: {
                        name: 'SafeKeep'
                    }
                },
                quantity: 1
            },
            {
                product: {
                    id: 'P005',
                    name: 'Microfiber Cloth Set',
                    price: 9.99,
                    stock: 200,
                    images: [{ url: 'https://example.com/images/cloth1.jpg' }],
                    category: {
                        name: 'Accessories'
                    },
                    brand: {
                        name: 'ClearView'
                    }
                },
                quantity: 4
            }
        ]
    },
    {
        id: '1003',
        orderNumber: 'ORD-1003',
        createdAt: new Date('2023-10-08T09:15:00'),
        status: 'processing',
        note: 'Call before delivery',
        customer: {
            id: 'C003',
            username: 'robertjohnson',
            email: 'robert.johnson@example.com',
            info: {
                first_name: 'Robert',
                last_name: 'Johnson',
                contact: '5551234567',
                address: '789 Pine Blvd',
                city: 'Elsewhere',
                region: 'EL',
                zip_code: '54321',
                avatar: {
                    url: 'https://randomuser.me/api/portraits/men/2.jpg'
                }
            }
        },
        totalAmount: 339.98,
        subtotal: 329.98,
        payment: {
            method: 'cod',
            status: 'pending',
        },
        shipping: {
            method: 'std',
            address: '789 Pine Blvd, Elsewhere, EL 54321',
            start_ship_date: new Date('2023-10-10'),
            expected_ship_date: new Date('2023-10-12'),
            shipped_date: null,
            fee: 10.00,
        },
        products: [
            {
                product: {
                    id: 'P006',
                    name: 'Prescription Glasses - Premium',
                    price: 199.99,
                    stock: 18,
                    images: [{ url: 'https://example.com/images/prescription1.jpg' }],
                    category: {
                        name: 'Prescription'
                    },
                    brand: {
                        name: 'OptimumSight'
                    }
                },
                quantity: 1
            },
            {
                product: {
                    id: 'P007',
                    name: 'Reading Glasses - Comfort',
                    price: 59.99,
                    stock: 50,
                    images: [{ url: 'https://example.com/images/reading1.jpg' }],
                    category: {
                        name: 'Reading'
                    },
                    brand: {
                        name: 'ReadWell'
                    }
                },
                quantity: 2
            }
        ]
    },
    {
        id: '1004',
        orderNumber: 'ORD-1004',
        createdAt: new Date('2023-10-10T16:45:00'),
        status: 'pending',
        note: '',
        customer: {
            id: 'C004',
            username: 'mariagarcia',
            email: 'maria.garcia@example.com',
            info: {
                first_name: 'Maria',
                last_name: 'Garcia',
                contact: '4445556666',
                address: '101 Maple St',
                city: 'Nowhere',
                region: 'NW',
                zip_code: '12345',
                avatar: {
                    url: 'https://randomuser.me/api/portraits/women/2.jpg'
                }
            }
        },
        totalAmount: 94.98,
        subtotal: 84.98,
        payment: {
            method: 'paypal',
            status: 'paid',
        },
        shipping: {
            method: 'std',
            address: '101 Maple St, Nowhere, NW 12345',
            start_ship_date: null,
            expected_ship_date: new Date('2023-10-13'),
            shipped_date: null,
            fee: 10.00,
        },
        products: [
            {
                product: {
                    id: 'P008',
                    name: 'Contact Lens Solution',
                    price: 14.99,
                    stock: 85,
                    images: [{ url: 'https://example.com/images/solution1.jpg' }],
                    category: {
                        name: 'Contact Lenses'
                    },
                    brand: {
                        name: 'ClearContact'
                    }
                },
                quantity: 2
            },
            {
                product: {
                    id: 'P009',
                    name: 'Contact Lens Case - Designer',
                    price: 9.99,
                    stock: 110,
                    images: [{ url: 'https://example.com/images/lenscase1.jpg' }],
                    category: {
                        name: 'Accessories'
                    },
                    brand: {
                        name: 'ContactSafe'
                    }
                },
                quantity: 1
            },
            {
                product: {
                    id: 'P010',
                    name: 'Eyeglass Repair Kit',
                    price: 12.99,
                    stock: 65,
                    images: [{ url: 'https://example.com/images/repair1.jpg' }],
                    category: {
                        name: 'Accessories'
                    },
                    brand: {
                        name: 'FixIt'
                    }
                },
                quantity: 1
            },
            {
                product: {
                    id: 'P011',
                    name: 'Eyeglass Neck Strap',
                    price: 7.99,
                    stock: 95,
                    images: [{ url: 'https://example.com/images/strap1.jpg' }],
                    category: {
                        name: 'Accessories'
                    },
                    brand: {
                        name: 'HoldTight'
                    }
                },
                quantity: 1
            }
        ]
    },
    {
        id: '1005',
        orderNumber: 'ORD-1005',
        createdAt: new Date('2023-10-12T11:30:00'),
        status: 'cancelled',
        note: 'Customer requested cancellation',
        customer: {
            id: 'C005',
            username: 'davidwilson',
            email: 'david.wilson@example.com',
            info: {
                first_name: 'David',
                last_name: 'Wilson',
                contact: '7778889999',
                address: '222 Cedar Lane',
                city: 'Bigtown',
                region: 'BT',
                zip_code: '34567',
                avatar: {
                    url: 'https://randomuser.me/api/portraits/men/3.jpg'
                }
            }
        },
        totalAmount: 259.97,
        subtotal: 249.97,
        payment: {
            method: 'stripe',
            status: 'failed',
        },
        shipping: {
            method: 'smd',
            address: '222 Cedar Lane, Bigtown, BT 34567',
            start_ship_date: null,
            expected_ship_date: null,
            shipped_date: null,
            fee: 10.00,
        },
        products: [
            {
                product: {
                    id: 'P012',
                    name: 'Designer Frames - Limited Edition',
                    price: 249.97,
                    stock: 5,
                    images: [{ url: 'https://example.com/images/designer1.jpg' }],
                    category: {
                        name: 'Designer Frames'
                    },
                    brand: {
                        name: 'ExclusiveEye'
                    }
                },
                quantity: 1
            }
        ]
    }
];
