import React, { useState, useRef, useEffect } from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Divider, Portal, Provider } from 'react-native-paper';
import { OrderForm } from './form';
import { adminColors } from '~/styles/adminTheme';

export function OrderModal({ visible, order, onClose, onStatusChange }) {
    const [hasChanges, setHasChanges] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(order?.status || 'pending');

    // Reset status tracking when modal opens with new order
    useEffect(() => {
        if (visible && order) {
            setCurrentStatus(order.status || 'pending');
            setHasChanges(false);
        }
    }, [visible, order]);

    // This handler will be called by OrderForm when user clicks save in the modal
    const handleStatusUpdate = (orderId, newStatus) => {
        onStatusChange(orderId, newStatus);
        setHasChanges(false);
    };

    // This will be called from OrderForm when status changes
    const handleFormStatusChange = (status) => {
        setCurrentStatus(status);
        setHasChanges(status !== order?.status);
    };

    // Handle save button click
    const handleSaveChanges = () => {
        if (hasChanges) {
            onStatusChange(order.id, currentStatus);
            setHasChanges(false);
        }
    };

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={onClose}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Order #{order?.orderNumber}</Text>
                                <Button
                                    icon="close"
                                    mode="text"
                                    onPress={onClose}
                                    style={styles.closeButton}
                                />
                            </View>

                            <Divider />

                            <ScrollView style={styles.modalContent}>
                                <OrderForm
                                    order={order}
                                    onStatusChange={handleStatusUpdate}
                                    isModal={true} // Pass true to hide the button
                                    onStatusChanged={handleFormStatusChange}
                                />
                            </ScrollView>

                            <Divider />

                            <View style={styles.modalFooter}>
                                <Button
                                    mode="outlined"
                                    onPress={onClose}
                                    style={styles.footerButton}
                                >
                                    Close
                                </Button>

                                {hasChanges && (
                                    <Button
                                        mode="contained"
                                        onPress={handleSaveChanges}
                                        style={[styles.footerButton, styles.saveButton]}
                                        textColor={adminColors.background}
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
        maxHeight: '70%',
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
