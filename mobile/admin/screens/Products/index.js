import { View, StyleSheet, SafeAreaView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Button, Chip } from 'react-native-paper'
import DashboardTable from '../../components/table'
import AdminModal, { useAdminModal } from '../../components/modal'
import FormComponent from '../../components/form'
import * as Yup from 'yup'

export function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [formVisible, setFormVisible] = useState(false)
    const [currentProduct, setCurrentProduct] = useState(null)
    const { openModal } = useAdminModal()

    // Form validation schema
    const productSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        category: Yup.string().required('Category is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        stock: Yup.number().required('Stock is required').min(0, 'Stock cannot be negative'),
        status: Yup.string().required('Status is required')
    })

    // Table columns configuration
    const columns = [
        {
            key: 'name',
            title: 'Product',
            numeric: false,
            render: (value, item) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {item.image && (
                        <Image
                            source={{ uri: item.image }}
                            style={{ width: 40, height: 40, marginRight: 10, borderRadius: 4 }}
                        />
                    )}
                    <Text>{value}</Text>
                </View>
            )
        },
        { key: 'category', title: 'Category', numeric: false },
        {
            key: 'price',
            title: 'Price',
            numeric: true,
            render: (value) => `$${parseFloat(value).toFixed(2)}`
        },
        { key: 'stock', title: 'Stock', numeric: true },
        {
            key: 'status',
            title: 'Status',
            numeric: false,
            render: (value) => {
                let color;
                switch (value) {
                    case 'Active':
                        color = 'green';
                        break;
                    case 'Inactive':
                        color = 'orange';
                        break;
                    case 'Out of Stock':
                        color = 'red';
                        break;
                    default:
                        color = 'black';
                }
                return <Chip textStyle={{ color }} style={{ backgroundColor: `${color}10` }}>{value}</Chip>;
            }
        }
    ]

    // Simulate fetching products
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockProducts = [
                {
                    key: 1,
                    name: 'Designer Sunglasses XYZ',
                    category: 'Sunglasses',
                    price: 149.99,
                    stock: 23,
                    status: 'Active',
                    image: 'https://picsum.photos/seed/sunglasses1/200/200',
                    description: 'High-quality designer sunglasses with UV protection.'
                },
                {
                    key: 2,
                    name: 'Reading Glasses ABC',
                    category: 'Reading',
                    price: 79.99,
                    stock: 45,
                    status: 'Active',
                    image: 'https://picsum.photos/seed/glasses2/200/200',
                    description: 'Comfortable reading glasses with blue light protection.'
                },
                {
                    key: 3,
                    name: 'Sports Eyewear PRO',
                    category: 'Sports',
                    price: 129.99,
                    stock: 0,
                    status: 'Out of Stock',
                    image: 'https://picsum.photos/seed/sports3/200/200',
                    description: 'Durable sports eyewear for active lifestyles.'
                },
                {
                    key: 4,
                    name: 'Vintage Frames Collection',
                    category: 'Frames',
                    price: 199.99,
                    stock: 12,
                    status: 'Active',
                    image: 'https://picsum.photos/seed/vintage4/200/200',
                    description: 'Classic vintage frames for a timeless look.'
                },
                {
                    key: 5,
                    name: 'Kids Eyewear Happy',
                    category: 'Kids',
                    price: 59.99,
                    stock: 30,
                    status: 'Active',
                    image: 'https://picsum.photos/seed/kids5/200/200',
                    description: 'Fun and durable eyewear for children.'
                },
                {
                    key: 6,
                    name: 'Prescription Lenses Premium',
                    category: 'Lenses',
                    price: 89.99,
                    stock: 8,
                    status: 'Inactive',
                    image: 'https://picsum.photos/seed/lenses6/200/200',
                    description: 'High-quality prescription lenses with anti-glare coating.'
                }
            ]
            setProducts(mockProducts)
            setLoading(false)
        }, 1000)
    }, [])

    // CRUD Operations
    const handleSave = (newProduct) => {
        setProducts([...products, { ...newProduct, key: Date.now() }])
        setFormVisible(false)
    }

    const handleUpdate = (updatedProduct) => {
        setProducts(products.map(product => product.key === updatedProduct.key ? updatedProduct : product))
        setFormVisible(false)
    }

    const handleDelete = (product) => {
        openModal({
            title: 'Confirm Deletion',
            children: <Text>Are you sure you want to delete product "{product.name}"?</Text>,
            primaryAction: {
                label: 'Delete',
                onPress: () => {
                    setProducts(products.filter(p => p.key !== product.key))
                },
                color: '#ef4444',
            },
            secondaryAction: {
                label: 'Cancel',
                onPress: () => { },
            },
            size: 'small',
        })
    }

    // View product details
    const handleViewProduct = (product) => {
        openModal({
            title: 'Product Details',
            size: 'medium',
            children: (
                <View>
                    {product.image && (
                        <Image
                            source={{ uri: product.image }}
                            style={styles.productImage}
                            resizeMode="contain"
                        />
                    )}

                    <Text variant="titleMedium" style={styles.detailLabel}>Name:</Text>
                    <Text style={styles.detailText}>{product.name}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Category:</Text>
                    <Text style={styles.detailText}>{product.category}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Price:</Text>
                    <Text style={styles.detailText}>${parseFloat(product.price).toFixed(2)}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Stock:</Text>
                    <Text style={styles.detailText}>{product.stock}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailText}>{product.status}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Description:</Text>
                    <Text style={styles.detailText}>{product.description}</Text>
                </View>
            ),
            primaryAction: {
                label: 'Edit',
                onPress: () => {
                    setCurrentProduct(product)
                    setFormVisible(true)
                },
            },
            secondaryAction: {
                label: 'Close',
                onPress: () => { },
            },
        })
    }

    // Form fields configuration
    const formFields = [
        { name: 'name', label: 'Product Name', type: 'text' },
        {
            name: 'category',
            label: 'Category',
            type: 'select',
            options: [
                { label: 'Sunglasses', value: 'Sunglasses' },
                { label: 'Reading', value: 'Reading' },
                { label: 'Sports', value: 'Sports' },
                { label: 'Frames', value: 'Frames' },
                { label: 'Kids', value: 'Kids' },
                { label: 'Lenses', value: 'Lenses' }
            ]
        },
        { name: 'price', label: 'Price', type: 'text', keyboardType: 'numeric' },
        { name: 'stock', label: 'Stock', type: 'text', keyboardType: 'numeric' },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Out of Stock', value: 'Out of Stock' }
            ]
        },
        { name: 'image', label: 'Image URL', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>Product Management</Text>

            <DashboardTable
                title="Products"
                initialData={products}
                columns={columns}
                onSave={handleSave}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                searchable={true}
                editable={true}
                deletable={true}
                addable={true}
            />

            <AdminModal
                visible={formVisible}
                onDismiss={() => setFormVisible(false)}
                title={currentProduct ? "Edit Product" : "Add New Product"}
                size="medium"
            >
                <FormComponent
                    initialValues={currentProduct || {
                        name: '',
                        category: 'Sunglasses',
                        price: '',
                        stock: '',
                        status: 'Active',
                        image: '',
                        description: ''
                    }}
                    validationSchema={productSchema}
                    fields={formFields}
                    onSubmit={currentProduct ? handleUpdate : handleSave}
                    submitButtonText={currentProduct ? "Update Product" : "Add Product"}
                    onCancel={() => setFormVisible(false)}
                />
            </AdminModal>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 16,
    },
    productImage: {
        width: '100%',
        height: 200,
        marginBottom: 16,
        borderRadius: 8,
    },
    detailLabel: {
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
    }
})