import React, { useState } from 'react';
import { View, Platform } from 'react-native';
import { Text, Button, TextInput } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { adminColors } from '../../styles/adminTheme';
import { styles } from './styles';

export const DateField = ({
    field,
    label,
    value,
    setFieldValue,
    errors,
    touched,
    disabled = false,
    mode = 'date',
    format = 'MM/DD/YYYY',
    minimumDate,
    maximumDate,
    ...props
}) => {
    const [show, setShow] = useState(false);
    const hasError = touched[field] && errors[field];

    // Convert string to Date object if needed
    const getDateValue = () => {
        if (!value) return new Date();
        if (value instanceof Date) return value;
        return new Date(value);
    };

    // Format date for display
    const formatDate = (date) => {
        if (!date) return '';

        try {
            const d = date instanceof Date ? date : new Date(date);

            if (mode === 'date') {
                return d.toLocaleDateString();
            } else if (mode === 'time') {
                return d.toLocaleTimeString();
            } else {
                return d.toLocaleString();
            }
        } catch (error) {
            return '';
        }
    };

    const showDatepicker = () => {
        if (!disabled) {
            setShow(true);
        }
    };

    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');

        if (selectedDate) {
            setFieldValue(field, selectedDate);
        }
    };

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <View style={styles.datePickerContainer}>
                <TextInput
                    value={formatDate(value)}
                    style={[styles.input, styles.dateInput]}
                    editable={false}
                    mode="outlined"
                    right={
                        <TextInput.Icon
                            icon={mode === 'time' ? 'clock-outline' : 'calendar'}
                            onPress={showDatepicker}
                            disabled={disabled}
                        />
                    }
                    outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                    activeOutlineColor={adminColors.primary}
                    disabled={disabled}
                    error={hasError}
                    onPressIn={showDatepicker}
                />

                {show && (
                    <DateTimePicker
                        testID={`${field}-picker`}
                        value={getDateValue()}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={onChange}
                        minimumDate={minimumDate}
                        maximumDate={maximumDate}
                        {...props}
                    />
                )}
            </View>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
