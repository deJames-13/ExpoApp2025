import { View, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Button, Avatar, Chip } from 'react-native-paper'
import DashboardTable from '../../components/table'
import AdminModal, { useAdminModal } from '../../components/modal'
import FormComponent from '../../components/form'
import * as Yup from 'yup'

export function Feedbacks() {
    const [feedbacks, setFeedbacks] = useState([])
    const [loading, setLoading] = useState(true)
    const [formVisible, setFormVisible] = useState(false)
    const [currentFeedback, setCurrentFeedback] = useState(null)
    const { openModal } = useAdminModal()

    // Form validation schema
    const feedbackSchema = Yup.object().shape({
        customerName: Yup.string().required('Customer name is required'),
        subject: Yup.string().required('Subject is required'),
        message: Yup.string().required('Message is required'),
        rating: Yup.number().required('Rating is required').min(1).max(5),
        status: Yup.string().required('Status is required')
    })

    // Table columns configuration
    const columns = [
        {
            key: 'customerName',
            title: 'Customer',
            numeric: false,
            render: (value) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar.Text size={24} label={value.charAt(0)} style={{ marginRight: 8 }} />
                    <Text>{value}</Text>
                </View>
            )
        },
        { key: 'date', title: 'Date', numeric: false },
        { key: 'subject', title: 'Subject', numeric: false },
        {
            key: 'rating',
            title: 'Rating',
            numeric: true,
            render: (value) => {
                const color = value >= 4 ? 'green' : value >= 3 ? 'orange' : 'red';
                return <Text style={{ color }}>{value} / 5</Text>;
            }
        },
        {
            key: 'status',
            title: 'Status',
            numeric: false,
            render: (value) => {
                let color;
                switch (value) {
                    case 'New':
                        color = 'blue';
                        break;
                    case 'In Progress':
                        color = 'orange';
                        break;
                    case 'Resolved':
                        color = 'green';
                        break;
                    case 'Closed':
                        color = 'gray';
                        break;
                    default:
                        color = 'black';
                }
                return <Chip textStyle={{ color }} style={{ backgroundColor: `${color}10` }}>{value}</Chip>;
            }
        }
    ]

    // Simulate fetching feedbacks
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockFeedbacks = [
                {
                    key: 1,
                    customerName: 'John Doe',
                    date: '2023-06-15',
                    subject: 'Great Service',
                    message: 'I had a wonderful experience with your customer service team.',
                    rating: 5,
                    status: 'New'
                },
                {
                    key: 2,
                    customerName: 'Jane Smith',
                    date: '2023-06-14',
                    subject: 'Product Quality Issue',
                    message: 'The product I received had some defects.',
                    rating: 2,
                    status: 'In Progress'
                },
                {
                    key: 3,
                    customerName: 'Mike Johnson',
                    date: '2023-06-12',
                    subject: 'Delivery Delay',
                    message: 'My order was delivered 3 days late.',
                    rating: 3,
                    status: 'Resolved'
                },
                {
                    key: 4,
                    customerName: 'Sarah Williams',
                    date: '2023-06-10',
                    subject: 'Website Suggestion',
                    message: 'I have some suggestions for improving your website.',
                    rating: 4,
                    status: 'New'
                },
                {
                    key: 5,
                    customerName: 'Robert Brown',
                    date: '2023-06-08',
                    subject: 'Return Process',
                    message: 'The return process was complicated and took too much time.',
                    rating: 2,
                    status: 'Closed'
                }
            ]
            setFeedbacks(mockFeedbacks)
            setLoading(false)
        }, 1000)
    }, [])

    // CRUD Operations
    const handleSave = (newFeedback) => {
        setFeedbacks([...feedbacks, { ...newFeedback, key: Date.now() }])
        setFormVisible(false)
    }

    const handleUpdate = (updatedFeedback) => {
        setFeedbacks(feedbacks.map(feedback => feedback.key === updatedFeedback.key ? updatedFeedback : feedback))
        setFormVisible(false)
    }

    const handleDelete = (feedback) => {
        openModal({
            title: 'Confirm Deletion',
            children: <Text>Are you sure you want to delete this feedback from {feedback.customerName}?</Text>,
            primaryAction: {
                label: 'Delete',
                onPress: () => {
                    setFeedbacks(feedbacks.filter(f => f.key !== feedback.key))
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

    // View feedback details
    const handleViewFeedback = (feedback) => {
        openModal({
            title: 'Feedback Details',
            size: 'medium',
            children: (
                <View>
                    <Text variant="titleMedium" style={styles.detailLabel}>From:</Text>
                    <Text style={styles.detailText}>{feedback.customerName}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailText}>{feedback.date}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Subject:</Text>
                    <Text style={styles.detailText}>{feedback.subject}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Rating:</Text>
                    <Text style={styles.detailText}>{feedback.rating} / 5</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Message:</Text>
                    <Text style={styles.detailText}>{feedback.message}</Text>

                    <Text variant="titleMedium" style={styles.detailLabel}>Status:</Text>
                    <Text style={styles.detailText}>{feedback.status}</Text>
                </View>
            ),
            primaryAction: {
                label: 'Close',
                onPress: () => { },
            },
        });
    };

    // Form fields configuration
    const feedbackFields = [
        { name: 'customerName', label: 'Customer Name', type: 'text' },
        { name: 'date', label: 'Date', type: 'text' },
        { name: 'subject', label: 'Subject', type: 'text' },
        { name: 'message', label: 'Message', type: 'textarea' },
        {
            name: 'rating',
            label: 'Rating',
            type: 'select',
            options: [
                { label: '1 Star', value: 1 },
                { label: '2 Stars', value: 2 },
                { label: '3 Stars', value: 3 },
                { label: '4 Stars', value: 4 },
                { label: '5 Stars', value: 5 }
            ]
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'New', value: 'New' },
                { label: 'In Progress', value: 'In Progress' },
                { label: 'Resolved', value: 'Resolved' },
                { label: 'Closed', value: 'Closed' }
            ]
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>Feedback Management</Text>

            <DashboardTable
                title="Customer Feedbacks"
                initialData={feedbacks}
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
                title={currentFeedback ? "Edit Feedback" : "Add New Feedback"}
                size="medium"
            >
                <FormComponent
                    initialValues={currentFeedback || {
                        customerName: '',
                        date: new Date().toISOString().split('T')[0],
                        subject: '',
                        message: '',
                        rating: 3,
                        status: 'New'
                    }}
                    validationSchema={feedbackSchema}
                    fields={feedbackFields}
                    onSubmit={currentFeedback ? handleUpdate : handleSave}
                    submitButtonText={currentFeedback ? "Update Feedback" : "Add Feedback"}
                    onCancel={() => setFormVisible(false)}
                />
            </AdminModal>
        </SafeAreaView>
    );
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
    detailLabel: {
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 8,
    }
});
