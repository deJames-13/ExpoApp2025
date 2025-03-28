import React from 'react';
import { View } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { adminColors } from '../../styles/adminTheme';
import { styles } from './styles';

export const NumberField = ({
    field,
    label,
    value,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    touched,
    disabled = false,
    min,
    max,
    step = 1,
    prefix,
    suffix,
    ...props
}) => {
    const hasError = touched[field] && errors[field];

    const incrementValue = () => {
        if (disabled) return;

        const currentValue = parseFloat(value) || 0;
        const newValue = currentValue + step;

        if (max !== undefined && newValue > max) return;

        setFieldValue(field, newValue.toString());
    };

    const decrementValue = () => {
        if (disabled) return;

        const currentValue = parseFloat(value) || 0;
        const newValue = currentValue - step;

        if (min !== undefined && newValue < min) return;

        setFieldValue(field, newValue.toString());
    };

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <View style={styles.numberInputContainer}>
                <IconButton
                    icon="minus"
                    size={20}
                    onPress={decrementValue}
                    disabled={disabled || (min !== undefined && (parseFloat(value) || 0) <= min)}
                    style={styles.numberButton}
                />

                <TextInput
                    value={String(value || '')}
                    onChangeText={handleChange(field)}
                    onBlur={handleBlur(field)}
                    style={[styles.input, styles.numberInput]}
                    keyboardType="numeric"
                    mode="outlined"
                    disabled={disabled}
                    left={prefix ? <TextInput.Affix text={prefix} /> : null}
                    right={suffix ? <TextInput.Affix text={suffix} /> : null}
                    outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                    activeOutlineColor={adminColors.primary}
                    error={hasError}
                    {...props}
                />

                <IconButton
                    icon="plus"
                    size={20}
                    onPress={incrementValue}
                    disabled={disabled || (max !== undefined && (parseFloat(value) || 0) >= max)}
                    style={styles.numberButton}
                />
            </View>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
