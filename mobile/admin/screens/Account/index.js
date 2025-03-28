import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { Text, Button, Avatar, Card, Divider } from 'react-native-paper'
import FormComponent from '../../components/form'
import AdminModal, { useAdminModal } from '../../components/modal'
import * as Yup from 'yup'

export function AdminAccount() {
    const [adminData, setAdminData] = useState({
        name: 'Admin User',
        email: 'admin@eyezone.com',
        role: 'Administrator',
        lastLogin: '2023-06-15 14:30',
        phone: '+1 123-456-7890',
        position: 'System Administrator',
        department: 'IT',
        joinDate: '2022-01-15'
    })

    const [passwordFormVisible, setPasswordFormVisible] = useState(false)
    const [profileFormVisible, setProfileFormVisible] = useState(false)

    const { openModal } = useAdminModal()

    // Profile form validation
    const profileSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        phone: Yup.string().required('Phone number is required'),
        position: Yup.string().required('Position is required'),
        department: Yup.string().required('Department is required')
    })

    // Password form validation
    const passwordSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('New password is required'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required('Confirm password is required')
    })

    // Profile form fields
    const profileFields = [
        { name: 'name', label: 'Full Name', type: 'text' },
        { name: 'email', label: 'Email Address', type: 'text', keyboardType: 'email-address' },
        { name: 'phone', label: 'Phone Number', type: 'text' },
        { name: 'position', label: 'Position', type: 'text' },
        {
            name: 'department',
            label: 'Department',
            type: 'select',
            options: [
                { label: 'IT', value: 'IT' },
                { label: 'HR', value: 'HR' },
                { label: 'Sales', value: 'Sales' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'Operations', value: 'Operations' }
            ]
        }
    ]

    // Password form fields
    const passwordFields = [
        { name: 'currentPassword', label: 'Current Password', type: 'text', secureTextEntry: true },
        { name: 'newPassword', label: 'New Password', type: 'text', secureTextEntry: true },
        { name: 'confirmPassword', label: 'Confirm New Password', type: 'text', secureTextEntry: true }
    ]

    // Handle profile update
    const handleUpdateProfile = (values) => {
        setAdminData({ ...adminData, ...values })
        setProfileFormVisible(false)
        openModal({
            title: 'Success',
            children: <Text>Your profile has been updated successfully!</Text>,
            primaryAction: {
                label: 'OK',
                onPress: () => { },
            },
            size: 'small',
        })
    }

    // Handle password update
    const handleUpdatePassword = (values) => {
        setPasswordFormVisible(false)
        openModal({
            title: 'Success',
            children: <Text>Your password has been changed successfully!</Text>,
            primaryAction: {
                label: 'OK',
                onPress: () => { },
            },
            size: 'small',
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Text variant="headlineMedium" style={styles.header}>Admin Account</Text>

                <Card style={styles.profileCard}>
                    <Card.Content style={styles.profileHeader}>
                        <Avatar.Text
                            size={80}
                            label={adminData.name.split(' ').map(n => n[0]).join('')}
                            style={styles.avatar}
                        />
                        <View style={styles.profileInfo}>
                            <Text variant="titleLarge">{adminData.name}</Text>
                            <Text variant="bodyLarge">{adminData.role}</Text>
                            <Text variant="bodyMedium">{adminData.email}</Text>
                        </View>
                    </Card.Content>

                    <Divider style={styles.divider} />

                    <Card.Content>
                        <View style={styles.infoRow}>
                            <Text variant="bodyLarge" style={styles.infoLabel}>Phone:</Text>
                            <Text variant="bodyLarge">{adminData.phone}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text variant="bodyLarge" style={styles.infoLabel}>Position:</Text>
                            <Text variant="bodyLarge">{adminData.position}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text variant="bodyLarge" style={styles.infoLabel}>Department:</Text>
                            <Text variant="bodyLarge">{adminData.department}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text variant="bodyLarge" style={styles.infoLabel}>Join Date:</Text>
                            <Text variant="bodyLarge">{adminData.joinDate}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text variant="bodyLarge" style={styles.infoLabel}>Last Login:</Text>
                            <Text variant="bodyLarge">{adminData.lastLogin}</Text>
                        </View>
                    </Card.Content>

                    <Card.Actions style={styles.actionButtons}>
                        <Button
                            mode="contained"
                            onPress={() => setProfileFormVisible(true)}
                            style={styles.button}
                        >
                            Edit Profile
                        </Button>

                        <Button
                            mode="outlined"
                            onPress={() => setPasswordFormVisible(true)}
                            style={styles.button}
                        >
                            Change Password
                        </Button>
                    </Card.Actions>
                </Card>

                <Card style={styles.card}>
                    <Card.Title title="Security Settings" />
                    <Card.Content>
                        <View style={styles.settingRow}>
                            <Text variant="bodyLarge">Two-Factor Authentication</Text>
                            <Button mode="text">Enable</Button>
                        </View>

                        <View style={styles.settingRow}>
                            <Text variant="bodyLarge">Session Management</Text>
                            <Button mode="text">Manage</Button>
                        </View>

                        <View style={styles.settingRow}>
                            <Text variant="bodyLarge">API Access</Text>
                            <Button mode="text">Configure</Button>
                        </View>
                    </Card.Content>
                </Card>
            </ScrollView>

            {/* Profile Edit Modal */}
            <AdminModal
                visible={profileFormVisible}
                onDismiss={() => setProfileFormVisible(false)}
                title="Edit Profile"
                size="medium"
            >
                <FormComponent
                    initialValues={adminData}
                    validationSchema={profileSchema}
                    fields={profileFields}
                    onSubmit={handleUpdateProfile}
                    submitButtonText="Update Profile"
                    onCancel={() => setProfileFormVisible(false)}
                />
            </AdminModal>

            {/* Password Change Modal */}
            <AdminModal
                visible={passwordFormVisible}
                onDismiss={() => setPasswordFormVisible(false)}
                title="Change Password"
                size="medium"
            >
                <FormComponent
                    initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                    }}
                    validationSchema={passwordSchema}
                    fields={passwordFields}
                    onSubmit={handleUpdatePassword}
                    submitButtonText="Update Password"
                    onCancel={() => setPasswordFormVisible(false)}
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
    profileCard: {
        marginBottom: 16,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        marginRight: 16,
    },
    profileInfo: {
        flex: 1,
    },
    divider: {
        marginVertical: 12,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    infoLabel: {
        fontWeight: 'bold',
        width: 120,
    },
    actionButtons: {
        justifyContent: 'flex-start',
        marginTop: 8,
    },
    button: {
        marginRight: 8,
    },
    card: {
        marginBottom: 16,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    }
})