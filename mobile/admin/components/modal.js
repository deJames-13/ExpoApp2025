import * as React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Modal, Portal, Text, Button, IconButton, Surface, useTheme } from 'react-native-paper';

// AdminModal component - highly customizable modal for admin interfaces
const AdminModal = ({
    // Visibility control
    visible = false,
    onDismiss,

    // Content
    title,
    children,

    // Options
    dismissable = true,
    loading = false,
    size = 'medium', // 'small', 'medium', 'large', 'fullscreen'
    position = 'center', // 'center', 'top', 'bottom'

    // Actions
    primaryAction = null, // { label, onPress, color, loading, disabled }
    secondaryAction = null, // { label, onPress, color, loading, disabled }
    customActions = null,

    // Styling
    contentStyle = {},
    headerStyle = {},
    footerStyle = {},
}) => {
    const theme = useTheme();

    // Calculate modal dimensions based on size prop
    const getModalDimensions = () => {
        const { width, height } = Dimensions.get('window');
        const isSmallScreen = width < 600;

        switch (size) {
            case 'small':
                return {
                    width: isSmallScreen ? '90%' : 400,
                    maxHeight: isSmallScreen ? '80%' : '60%',
                };
            case 'medium':
                return {
                    width: isSmallScreen ? '95%' : 600,
                    maxHeight: isSmallScreen ? '90%' : '75%',
                };
            case 'large':
                return {
                    width: isSmallScreen ? '98%' : 800,
                    maxHeight: isSmallScreen ? '95%' : '85%',
                };
            case 'fullscreen':
                return {
                    width: '100%',
                    height: '100%',
                    maxHeight: '100%',
                };
            default:
                return {
                    width: isSmallScreen ? '95%' : 600,
                    maxHeight: isSmallScreen ? '90%' : '75%',
                };
        }
    };

    // Calculate position styles
    const getPositionStyle = () => {
        switch (position) {
            case 'top':
                return { justifyContent: 'flex-start', marginTop: 60 };
            case 'bottom':
                return { justifyContent: 'flex-end', marginBottom: 60 };
            case 'center':
            default:
                return { justifyContent: 'center' };
        }
    };

    const dimensions = getModalDimensions();
    const positionStyle = getPositionStyle();

    const containerStyle = {
        backgroundColor: theme.colors.surface,
        padding: 0,
        borderRadius: size === 'fullscreen' ? 0 : 8,
        ...dimensions,
        ...contentStyle,
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={dismissable ? onDismiss : undefined}
                dismissable={dismissable}
                contentContainerStyle={[styles.modalContainer, positionStyle]}
            >
                <Surface style={containerStyle} elevation={5}>
                    {/* Modal Header */}
                    <View style={[styles.header, headerStyle]}>
                        <Text variant="titleLarge" style={styles.title}>
                            {title || 'Modal Title'}
                        </Text>
                        {dismissable && (
                            <IconButton
                                icon="close"
                                size={24}
                                onPress={onDismiss}
                                accessibilityLabel="Close modal"
                            />
                        )}
                    </View>

                    {/* Modal Content */}
                    <View style={styles.content}>
                        {loading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" />
                                <Text style={styles.loadingText}>Loading...</Text>
                            </View>
                        ) : (
                            children
                        )}
                    </View>

                    {/* Modal Footer with Actions */}
                    {(primaryAction || secondaryAction || customActions) && (
                        <View style={[styles.footer, footerStyle]}>
                            {customActions}

                            {!customActions && (
                                <View style={styles.actionButtons}>
                                    {secondaryAction && (
                                        <Button
                                            mode="outlined"
                                            onPress={secondaryAction.onPress}
                                            loading={secondaryAction.loading}
                                            disabled={secondaryAction.disabled}
                                            style={styles.secondaryButton}
                                            textColor={secondaryAction.color || theme.colors.secondary}
                                        >
                                            {secondaryAction.label || 'Cancel'}
                                        </Button>
                                    )}

                                    {primaryAction && (
                                        <Button
                                            mode="contained"
                                            onPress={primaryAction.onPress}
                                            loading={primaryAction.loading}
                                            disabled={primaryAction.disabled}
                                            buttonColor={primaryAction.color || theme.colors.primary}
                                        >
                                            {primaryAction.label || 'Confirm'}
                                        </Button>
                                    )}
                                </View>
                            )}
                        </View>
                    )}
                </Surface>
            </Modal>
        </Portal>
    );
};

// Create a context for managing multiple modals
const AdminModalContext = React.createContext({
    openModal: () => { },
    closeModal: () => { },
});

// Modal Provider Component
export const AdminModalProvider = ({ children }) => {
    const [modalStack, setModalStack] = React.useState([]);

    const openModal = (modalProps) => {
        const modalId = Date.now().toString();
        setModalStack((prevStack) => [
            ...prevStack,
            {
                id: modalId,
                ...modalProps,
                visible: true,
            },
        ]);
        return modalId;
    };

    const closeModal = (modalId) => {
        if (modalId) {
            setModalStack((prevStack) =>
                prevStack.filter((modal) => modal.id !== modalId)
            );
        } else {
            // Close the top modal if no ID is provided
            setModalStack((prevStack) => prevStack.slice(0, -1));
        }
    };

    return (
        <AdminModalContext.Provider value={{ openModal, closeModal }}>
            {children}

            {modalStack.map((modalProps) => (
                <AdminModal
                    key={modalProps.id}
                    {...modalProps}
                    onDismiss={() => closeModal(modalProps.id)}
                />
            ))}
        </AdminModalContext.Provider>
    );
};

// Custom hook for using the modal system
export const useAdminModal = () => {
    const context = React.useContext(AdminModalContext);

    if (!context) {
        throw new Error('useAdminModal must be used within an AdminModalProvider');
    }

    return context;
};

// Usage example component
export const ModalExample = () => {
    // Direct usage
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    // Context-based usage
    const { openModal, closeModal } = useAdminModal();

    const handleOpenContextModal = () => {
        openModal({
            title: 'User Management',
            children: <Text>User management controls would go here.</Text>,
            primaryAction: {
                label: 'Save Changes',
                onPress: () => closeModal(),
            },
            secondaryAction: {
                label: 'Cancel',
                onPress: () => closeModal(),
            },
        });
    };

    return (
        <View>
            {/* Direct usage example */}
            <Button onPress={showModal}>Open Direct Modal</Button>

            <AdminModal
                visible={visible}
                onDismiss={hideModal}
                title="Product Management"
                primaryAction={{
                    label: 'Save Product',
                    onPress: hideModal,
                }}
                secondaryAction={{
                    label: 'Discard',
                    onPress: hideModal,
                }}
            >
                <Text>Product management form would go here.</Text>
            </AdminModal>

            {/* Context-based usage example */}
            <Button onPress={handleOpenContextModal} style={{ marginTop: 20 }}>
                Open Context Modal
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        alignItems: 'center',
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    title: {
        flex: 1,
    },
    content: {
        padding: 16,
        maxHeight: '80%',
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    secondaryButton: {
        marginRight: 8,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
    },
});

export default AdminModal;