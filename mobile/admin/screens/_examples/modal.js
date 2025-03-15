import * as React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, TextInput, Checkbox, Divider, List, Avatar } from 'react-native-paper';
import AdminModal, { AdminModalProvider, useAdminModal } from '../components/AdminModal';

const AdminModalExampleScreen = () => {
    // State for direct modal usage
    const [userModalVisible, setUserModalVisible] = React.useState(false);
    const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
    const [formModalVisible, setFormModalVisible] = React.useState(false);
    const [fullScreenModalVisible, setFullScreenModalVisible] = React.useState(false);

    // Form state for the example
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    // Context-based modal usage
    const { openModal } = useAdminModal();

    // Mock user data
    const users = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
        { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer' },
    ];

    // Mock submit function
    const handleSubmit = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setFormModalVisible(false);
            // Show success confirmation modal
            openModal({
                title: 'Success',
                children: <Text>User has been successfully created!</Text>,
                primaryAction: {
                    label: 'OK',
                    onPress: () => { },
                },
                size: 'small',
            });
        }, 1500);
    };

    // Example of a modal with custom styling
    const openStyleModal = () => {
        openModal({
            title: 'Custom Styled Modal',
            headerStyle: { backgroundColor: '#f0f9ff', borderBottomColor: '#bae6fd' },
            contentStyle: { backgroundColor: '#f8fafc' },
            footerStyle: { backgroundColor: '#f0f9ff', borderTopColor: '#bae6fd' },
            children: (
                <Text>
                    This modal has custom styling applied to the header, content, and footer sections.
                </Text>
            ),
            primaryAction: {
                label: 'Close',
                color: '#0284c7',
                onPress: () => { },
            },
            size: 'small',
        });
    };

    // Example of a detailed user profile modal
    const openUserProfileModal = (user) => {
        openModal({
            title: 'User Profile',
            children: (
                <View style={styles.userProfileContainer}>
                    <View style={styles.userHeader}>
                        <Avatar.Text size={64} label={user.name[0]} />
                        <View style={styles.userInfo}>
                            <Text variant="titleMedium">{user.name}</Text>
                            <Text variant="bodyMedium">{user.email}</Text>
                            <Text variant="bodySmall" style={styles.roleTag}>{user.role}</Text>
                        </View>
                    </View>
                    <Divider style={styles.divider} />
                    <List.Section>
                        <List.Item title="View Activity Log" left={() => <List.Icon icon="history" />} />
                        <List.Item title="Edit User" left={() => <List.Icon icon="account-edit" />} />
                        <List.Item title="Change Password" left={() => <List.Icon icon="lock-reset" />} />
                        <List.Item title="Delete User" left={() => <List.Icon icon="delete" color="#f43f5e" />} />
                    </List.Section>
                </View>
            ),
            size: 'medium',
            primaryAction: {
                label: 'Close',
                onPress: () => { },
            },
        });
    };

    return (
        <View style={styles.container}>
            <Text variant="headlineMedium" style={styles.heading}>
                Admin Modal Examples
            </Text>
            <Divider style={styles.divider} />

            <ScrollView style={styles.scrollView}>
                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Direct Modal Usage
                    </Text>

                    <Button
                        mode="contained"
                        onPress={() => setUserModalVisible(true)}
                        style={styles.button}
                    >
                        User List Modal
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => setDeleteModalVisible(true)}
                        style={styles.button}
                    >
                        Delete Confirmation Modal
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => setFormModalVisible(true)}
                        style={styles.button}
                    >
                        User Form Modal
                    </Button>

                    <Button
                        mode="contained"
                        onPress={() => setFullScreenModalVisible(true)}
                        style={styles.button}
                    >
                        Full Screen Modal
                    </Button>
                </View>

                <View style={styles.section}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>
                        Context-based Modal Usage
                    </Text>

                    <Button
                        mode="outlined"
                        onPress={() => openStyleModal()}
                        style={styles.button}
                    >
                        Custom Styled Modal
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => openUserProfileModal(users[0])}
                        style={styles.button}
                    >
                        User Profile Modal
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={() => {
                            openModal({
                                title: 'Help & Documentation',
                                children: (
                                    <Text>
                                        This is a contextual help modal that can be opened from anywhere in your app
                                        using the context provider.
                                    </Text>
                                ),
                                primaryAction: {
                                    label: 'Got it',
                                    onPress: () => { },
                                },
                                size: 'small',
                            });
                        }}
                        style={styles.button}
                    >
                        Help Modal
                    </Button>
                </View>
            </ScrollView>

            {/* User List Modal */}
            <AdminModal
                visible={userModalVisible}
                onDismiss={() => setUserModalVisible(false)}
                title="User Management"
                size="medium"
                primaryAction={{
                    label: 'Add New User',
                    onPress: () => {
                        setUserModalVisible(false);
                        setFormModalVisible(true);
                    },
                }}
                secondaryAction={{
                    label: 'Close',
                    onPress: () => setUserModalVisible(false),
                }}
            >
                <List.Section>
                    {users.map(user => (
                        <List.Item
                            key={user.id}
                            title={user.name}
                            description={user.email}
                            left={props => <List.Icon {...props} icon="account" />}
                            right={props => (
                                <Button
                                    {...props}
                                    onPress={() => openUserProfileModal(user)}
                                    mode="text"
                                >
                                    View
                                </Button>
                            )}
                        />
                    ))}
                </List.Section>
            </AdminModal>

            {/* Delete Confirmation Modal */}
            <AdminModal
                visible={deleteModalVisible}
                onDismiss={() => setDeleteModalVisible(false)}
                title="Confirm Deletion"
                size="small"
                primaryAction={{
                    label: 'Delete',
                    onPress: () => setDeleteModalVisible(false),
                    color: '#ef4444',
                }}
                secondaryAction={{
                    label: 'Cancel',
                    onPress: () => setDeleteModalVisible(false),
                }}
            >
                <Text>
                    Are you sure you want to delete this user? This action cannot be undone.
                </Text>
            </AdminModal>

            {/* Form Modal */}
            <AdminModal
                visible={formModalVisible}
                onDismiss={() => setFormModalVisible(false)}
                title="Create New User"
                size="medium"
                loading={isLoading}
                primaryAction={{
                    label: 'Create User',
                    onPress: handleSubmit,
                    disabled: !username || !email || isLoading,
                    loading: isLoading,
                }}
                secondaryAction={{
                    label: 'Cancel',
                    onPress: () => setFormModalVisible(false),
                    disabled: isLoading,
                }}
            >
                <View style={styles.form}>
                    <TextInput
                        label="Username"
                        value={username}
                        onChangeText={setUsername}
                        style={styles.input}
                        disabled={isLoading}
                    />
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        disabled={isLoading}
                    />
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            status={isAdmin ? 'checked' : 'unchecked'}
                            onPress={() => setIsAdmin(!isAdmin)}
                            disabled={isLoading}
                        />
                        <Text style={styles.checkboxLabel}>Admin privileges</Text>
                    </View>
                </View>
            </AdminModal>

            {/* Full Screen Modal */}
            <AdminModal
                visible={fullScreenModalVisible}
                onDismiss={() => setFullScreenModalVisible(false)}
                title="Dashboard Settings"
                size="fullscreen"
                primaryAction={{
                    label: 'Save Settings',
                    onPress: () => setFullScreenModalVisible(false),
                }}
                secondaryAction={{
                    label: 'Cancel',
                    onPress: () => setFullScreenModalVisible(false),
                }}
            >
                <View style={styles.fullScreenContent}>
                    <Text>
                        This is a full-screen modal that can be used for complex settings or configurations.
                        It gives you maximum space to work with.
                    </Text>
                    <Text style={styles.note}>
                        Note: You can implement tabs, accordions, or any other complex UI elements here.
                    </Text>
                </View>
            </AdminModal>
        </View>
    );
};

const ModalExample = () => (
    <AdminModalProvider>
        <AdminModalExampleScreen />
    </AdminModalProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        marginBottom: 8,
    },
    divider: {
        marginBottom: 16,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        marginBottom: 12,
    },
    button: {
        marginBottom: 8,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 12,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    fullScreenContent: {
        padding: 16,
    },
    note: {
        marginTop: 12,
        fontStyle: 'italic',
    },
    userProfileContainer: {
        width: '100%',
    },
    userHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    userInfo: {
        marginLeft: 16,
    },
    roleTag: {
        marginTop: 4,
        backgroundColor: '#e0f2fe',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        color: '#0284c7',
    },
});

export default ModalExample;