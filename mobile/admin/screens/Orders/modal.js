import React from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import { OrderForm } from './form';

export function OrderModal({ visible, order, onClose, onStatusChange }) {
    const handleStatusUpdate = (orderId, newStatus) => {
        onStatusChange(orderId, newStatus);
    };

    return (
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
                            isModal={true}
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
                    </View>
                </View>
            </View>
        </Modal>
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
        backgroundColor: 'white',
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
});
