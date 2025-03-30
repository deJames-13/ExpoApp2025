import React from 'react';
import { View, Text } from 'react-native';
import { Chip } from 'react-native-paper';
import { styles } from './styles';

export const NotificationStatus = [
    { label: 'None', value: 'none' },
    { label: 'Active', value: 'active' },
    { label: 'Important', value: 'important' }
];

const NotificationStatusSelector = ({ values, setFieldValue }) => {
    return (
        <>
            <Text style={styles.label}>Status:</Text>
            <View style={styles.chipContainer}>
                {NotificationStatus.map((status) => (
                    <Chip
                        key={status.value}
                        selected={values.status === status.value}
                        onPress={() => setFieldValue('status', status.value)}
                        style={[
                            styles.chip,
                            values.status === status.value && styles.selectedStatusChip
                        ]}
                        textStyle={values.status === status.value ? styles.selectedChipText : {}}
                    >
                        {status.label}
                    </Chip>
                ))}
            </View>
        </>
    );
};

export default NotificationStatusSelector;
