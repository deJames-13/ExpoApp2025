import React from 'react';
import { View } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { getStatusChipStyle } from '~/styles/adminThemeUtils';
import { styles } from './styles';

export const StatusField = ({
    value,
    options,
    setFieldValue,
    field = 'status',
    errors,
    touched,
    disabled = false,
    label = 'Status:',
}) => {
    const hasError = touched[field] && errors[field];

    if (disabled) {
        return (
            <View style={styles.statusViewContainer}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <Chip
                    style={[
                        styles.statusChipView,
                        { backgroundColor: getStatusChipStyle(value).chip.backgroundColor }
                    ]}
                    textStyle={[styles.statusChipText, getStatusChipStyle(value).text]}
                >
                    {value.charAt(0).toUpperCase() + value.slice(1)}
                </Chip>
            </View>
        );
    }

    return (
        <View style={styles.statusContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>
            <View style={styles.statusOptions}>
                {options.map((status) => {
                    const { text, background } = getStatusChipStyle(status);
                    const isSelected = value === status;

                    return (
                        <Chip
                            key={status}
                            selected={isSelected}
                            onPress={() => setFieldValue(field, status)}
                            style={[
                                styles.statusChip,
                                { backgroundColor: isSelected ? background : 'transparent' },
                                isSelected && { borderColor: text }
                            ]}
                            textStyle={{
                                color: isSelected ? text : adminColors.text.secondary,
                                fontWeight: isSelected ? 'bold' : 'normal'
                            }}
                            mode="outlined"
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Chip>
                    );
                })}
            </View>
            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
