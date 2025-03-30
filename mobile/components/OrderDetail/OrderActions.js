import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import { actionsStyles as styles } from './styles';

const OrderActions = ({ order, onContactSupport, onCancelOrder }) => {
    return (
        <Card style={styles.container}>
            <Card.Content style={styles.actionsContainer}>
                {/* <TouchableOpacity
                    style={styles.supportButton}
                    onPress={onContactSupport}
                >
                    <Text style={styles.supportButtonText}>Contact Support</Text>
                </TouchableOpacity> */}
                {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={onCancelOrder}
                    >
                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                    </TouchableOpacity>
                )}
            </Card.Content>
        </Card>
    );
};

export default OrderActions;
