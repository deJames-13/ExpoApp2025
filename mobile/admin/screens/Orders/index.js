import { View, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Button, Chip } from 'react-native-paper'
import DashboardTable from '../../components/table'
import AdminModal, { useAdminModal } from '../../components/modal'
import FormComponent from '../../components/form'
import * as Yup from 'yup'

export function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [formVisible, setFormVisible] = useState(false)
    const [currentOrder, setCurrentOrder] = useState(null)
    const { openModal } = useAdminModal()

    // Form validation schema
    const orderSchema = Yup.object().shape({
        orderNumber: Yup.string().required('Order number is required'),
        customerName: Yup.string().required('Customer name is required'),
        amount: Yup.number().required('Amount is required').positive('Amount must be positive'),
        status: Yup.string().required('Status is required'),
        paymentStatus: Yup.string().required('Payment status is required')
    })

    // Table columns configuration
    const columns = [
        { key: 'orderNumber', title: 'Order #', numeric: false },
        { key: 'date', title: 'Date', numeric: false },
        { key: 'customerName', title: 'Customer', numeric: false },
        { key: 'amount', title: 'Amount', numeric: true },
        {
            key: 'status',
            title: 'Status',
            numeric: false,
            render: (value) => {
                let color;
                switch (value) {
                    case 'Processing':
                        color = 'blue';
                        break;
                    case 'Shipped':
                        color = 'orange';
                        break;
                    case 'Delivered':
                        color = 'green';
                        break;
                    case 'Cancelled':
                        color = 'red';
                        break;
                    default:
                        color = 'black';
                }
                return <Chip textStyle={{ color }} style={{ backgroundColor: `${color}10` }}>{value}</Chip>;
            }
        },
        {
            key: 'paymentStatus',
            title: 'Payment',
            numeric: false,
            render: (value) => {
                let color;
                switch (value) {
                    case 'Paid':
                        color = 'green';
                        break;
                    case 'Pending':
                        color = 'orange';
                        break;
                    case 'Failed':
                        color = 'red';
                        break;
                    default:
                        color = 'black';
                }
                return <Chip textStyle={{ color }} style={{ backgroundColor: `${color}10` }}>{value}</Chip>;
            }
        }
    ]

    // Simulate fetching orders
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockOrders = [
                {
                    key: 1,
                    orderNumber: 'ORD-001',
                    date: '2023-06-15',
                    customerName: 'John Doe',
                    amount: 245.99,
                    status: 'Processing',
                    paymentStatus: 'Paid'
                },
                {
                    key: 2,
                    orderNumber: 'ORD-002',
                    date: '2023-06-14',
                    customerName: 'Jane Smith',
                    amount: 127.50,
                    status: 'Shipped',
                    paymentStatus: 'Paid'
                },
                {
                    key: 3,
                    orderNumber: 'ORD-003',
                    date: '2023-06-13',
                    customerName: 'Mike Johnson',
                    amount: 395.00,
                    status: 'Delivered',
                    paymentStatus: 'Paid'
                },
                {
                    key: 4,
                    orderNumber: 'ORD-004',
                    date: '2023-06-12',
                    customerName: 'Sarah Williams',
                    amount: 99.99,
                    status: 'Cancelled',
                    paymentStatus: 'Failed'
                },
                {
                    key: 5,
                    orderNumber: 'ORD-005',
                    date: '2023-06-11',
                    customerName: 'Robert Brown',
                    amount: 175.25,
                    status: 'Processing',
                    paymentStatus: 'Pending'
                }
            ]
            setOrders(mockOrders)
            setLoading(false)
        }, 1000)
    }, [])

    // CRUD Operations
    const handleSave = (newOrder) => {
        setOrders([...orders, { ...newOrder, key: Date.now() }])
        setFormVisible(false)
    }

    const handleUpdate = (updatedOrder) => {
        setOrders(orders.map(order => order.key === updatedOrder.key ? updatedOrder : order))
        setFormVisible(false)
    }

    const handleDelete = (order) => {
        openModal({
            title: 'Confirm Deletion',
            children: <Text>Are you sure you want to delete order {order.orderNumber}?</Text>,
            primaryAction: {
                label: 'Delete',
                onPress: () => {
                    setOrders(orders.filter(o => o.key !== order.key))
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

    // Form fields configuration
    const formFields = [
        { name: 'orderNumber', label: 'Order Number', type: 'text' },
        { name: 'date', label: 'Date', type: 'text' },
        { name: 'customerName', label: 'Customer Name', type: 'text' },
        { name: 'amount', label: 'Amount', type: 'text', keyboardType: 'numeric' },
        {
            name: 'status',
            label: 'Order Status',
            type: 'select',
            options: [
                { label: 'Processing', value: 'Processing' },
                { label: 'Shipped', value: 'Shipped' },
                { label: 'Delivered', value: 'Delivered' },
                { label: 'Cancelled', value: 'Cancelled' }
            ]
        },
        {
            name: 'paymentStatus',
            label: 'Payment Status',
            type: 'select',
            options: [
                { label: 'Paid', value: 'Paid' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Failed', value: 'Failed' }
            ]
        }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>Order Management</Text>

            <DashboardTable
                title="Orders"
                initialData={orders}
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
                title={currentOrder ? "Edit Order" : "Add New Order"}
                size="medium"
            >
                <FormComponent
                    initialValues={currentOrder || {
                        orderNumber: 'ORD-' + (orders.length + 1).toString().padStart(3, '0'),
                        date: new Date().toISOString().split('T')[0],
                        customerName: '',
                        amount: '',
                        status: 'Processing',
                        paymentStatus: 'Pending'
                    }}
                    validationSchema={orderSchema}
                    fields={formFields}
                    onSubmit={currentOrder ? handleUpdate : handleSave}
                    submitButtonText={currentOrder ? "Update Order" : "Add Order"}
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
    }
})