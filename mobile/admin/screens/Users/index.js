import { View, StyleSheet, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Text, Button } from 'react-native-paper'
import DashboardTable from '../../components/table'
import AdminModal, { useAdminModal } from '../../components/modal'
import FormComponent from '../../components/form'
import * as Yup from 'yup'

export function Users() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [formVisible, setFormVisible] = useState(false)
    const [currentUser, setCurrentUser] = useState(null)
    const { openModal } = useAdminModal()

    // Form validation schema
    const userSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        role: Yup.string().required('Role is required'),
        status: Yup.string().required('Status is required')
    })

    // Table columns configuration
    const columns = [
        { key: 'name', title: 'Name', numeric: false },
        { key: 'email', title: 'Email', numeric: false },
        { key: 'role', title: 'Role', numeric: false },
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
                    case 'Suspended':
                        color = 'red';
                        break;
                    default:
                        color = 'black';
                }
                return <Text style={{ color }}>{value}</Text>;
            }
        },
        { key: 'lastLogin', title: 'Last Login', numeric: false }
    ]

    // Simulate fetching users
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockUsers = [
                {
                    key: 1,
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'Admin',
                    status: 'Active',
                    lastLogin: '2023-06-15'
                },
                {
                    key: 2,
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: 'Manager',
                    status: 'Active',
                    lastLogin: '2023-06-14'
                },
                {
                    key: 3,
                    name: 'Mike Johnson',
                    email: 'mike@example.com',
                    role: 'Staff',
                    status: 'Inactive',
                    lastLogin: '2023-05-20'
                },
                {
                    key: 4,
                    name: 'Sarah Williams',
                    email: 'sarah@example.com',
                    role: 'Staff',
                    status: 'Suspended',
                    lastLogin: '2023-04-10'
                }
            ]
            setUsers(mockUsers)
            setLoading(false)
        }, 1000)
    }, [])

    // CRUD Operations
    const handleSave = (newUser) => {
        setUsers([...users, { ...newUser, key: Date.now() }])
        setFormVisible(false)
    }

    const handleUpdate = (updatedUser) => {
        setUsers(users.map(user => user.key === updatedUser.key ? updatedUser : user))
        setFormVisible(false)
    }

    const handleDelete = (user) => {
        openModal({
            title: 'Confirm Deletion',
            children: <Text>Are you sure you want to delete user {user.name}?</Text>,
            primaryAction: {
                label: 'Delete',
                onPress: () => {
                    setUsers(users.filter(u => u.key !== user.key))
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
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'text', keyboardType: 'email-address' },
        {
            name: 'role',
            label: 'Role',
            type: 'select',
            options: [
                { label: 'Admin', value: 'Admin' },
                { label: 'Manager', value: 'Manager' },
                { label: 'Staff', value: 'Staff' }
            ]
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' }
            ]
        }
    ]

    return (
        <SafeAreaView style={styles.container}>
            <Text variant="headlineMedium" style={styles.header}>User Management</Text>

            <DashboardTable
                title="Users"
                initialData={users}
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
                title={currentUser ? "Edit User" : "Add New User"}
                size="medium"
            >
                <FormComponent
                    initialValues={currentUser || {
                        name: '',
                        email: '',
                        role: 'Staff',
                        status: 'Active',
                        lastLogin: new Date().toISOString().split('T')[0]
                    }}
                    validationSchema={userSchema}
                    fields={formFields}
                    onSubmit={currentUser ? handleUpdate : handleSave}
                    submitButtonText={currentUser ? "Update User" : "Add User"}
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