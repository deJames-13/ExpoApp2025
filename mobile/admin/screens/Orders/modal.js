import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Button, Text, Divider, Portal, Provider } from 'react-native-paper';
import { OrderForm } from './form';
import { adminColors } from '~/styles/adminTheme';

export function OrderModal({ visible, order, onClose, onStatusChange }) {
    const [hasChanges, setHasChanges] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending');
    const [isLoading, setIsLoading] = useState(false);
    const modalHeight = useRef(Math.min(Dimensions.get('window').height * 0.8, 600));

    // Reset status tracking when modal opens with new order
    useEffect(() => {
        if (visible && order) {
            setCurrentStatus(order.status || 'pending');
            setHasChanges(false);
            setIsLoading(false);
        }
    }, [visible, order]);

    // This handler will be called by OrderForm when user changes status
    const handleStatusUpdate = async (orderObj, newStatus) => {
        try {
            setIsLoading(true);
            // Call the parent onStatusChange function
            const success = await onStatusChange(orderObj, newStatus);

            if (success) {
                setCurrentStatus(newStatus);
                setHasChanges(false);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error updating status:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // This will be called from OrderForm when status changes
    const handleFormStatusChange = (newStatus) => {
        if (newStatus !== currentStatus) {
            setCurrentStatus(newStatus);
            setHasChanges(newStatus !== order?.status);
        }
    };

    // Handle save button click
    const handleSaveChanges = async () => {
        if (hasChanges) {
            setIsLoading(true);
            try {
                const success = await onStatusChange(order, currentStatus);
                if (success) {
                    setHasChanges(false);
                }
            } catch (error) {
                console.error('Error saving changes:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    // Clean up modal close to ensure parent component can handle it properly
    const handleModalClose = () => {
        if (!isLoading) {
            setHasChanges(false);
            onClose();
        }
    };

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={handleModalClose}
                >
                    <View style={styles.centeredView}>
                        <View style={[styles.modalView, { maxHeight: modalHeight.current }]}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Order #{order?.id?.substring(0, 8)}</Text>
                                <Button
                                    icon="close"
                                    mode="text"
                                    onPress={handleModalClose}
                                    style={styles.closeButton}
                                    disabled={isLoading}
                                />
                            </View>

                            <Divider />

                            <ScrollView
                                style={styles.modalContent}
                                contentContainerStyle={styles.modalContentContainer}
                            >
                                <OrderForm
                                    order={{ ...order, status: currentStatus }}
                                    onStatusChange={handleStatusUpdate}
                                    isModal={true}
                                    onStatusChanged={handleFormStatusChange}
                                    isLoading={isLoading}
                                />
                            </ScrollView>

                            <Divider />

                            <View style={styles.modalFooter}>
                                <Button
                                    mode="outlined"
                                    onPress={handleModalClose}
                                    style={styles.footerButton}
                                    disabled={isLoading}
                                >
                                    Close
                                </Button>

                                {hasChanges && (
                                    <Button
                                        mode="contained"
                                        onPress={handleSaveChanges}
                                        style={[styles.footerButton, styles.saveButton]}
                                        textColor={adminColors.background}
                                        loading={isLoading}
                                        disabled={isLoading}
                                    >
                                        Save Changes
                                    </Button>
                                )}
                            </View>
                        </View>
                    </View>
                </Modal>
            </Portal>
        </Provider>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: adminColors.cardBackground,
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.text.primary,
    },
    closeButton: {
        margin: 0,
        padding: 0,
    },
    modalContent: {
        padding: 15,
        flexGrow: 1,
    },
    modalContentContainer: {
        paddingBottom: 10,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 15,
    },
    footerButton: {
        marginLeft: 10,
    },
    saveButton: {
        backgroundColor: adminColors.primary,
    },
});
