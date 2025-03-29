import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text, TextInput, IconButton } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
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

    const parseInitialValue = (val) => {
        if (val === undefined || val === null || val === '') return '';
        const parsedNum = parseFloat(val);
        return isNaN(parsedNum) ? '' : String(parsedNum);
    };

    const [localValue, setLocalValue] = useState(parseInitialValue(value));

    useEffect(() => {
        setLocalValue(parseInitialValue(value));
    }, [value]);

    const incrementValue = () => {
        if (disabled) return;

        const currentValue = parseFloat(localValue) || 0;
        const newValue = currentValue + step;

        if (max !== undefined && newValue > max) return;

        setLocalValue(String(newValue));
        setFieldValue(field, newValue);
    };

    const decrementValue = () => {
        if (disabled) return;

        const currentValue = parseFloat(localValue) || 0;
        const newValue = currentValue - step;

        if (min !== undefined && newValue < min) return;

        setLocalValue(String(newValue));
        setFieldValue(field, newValue);
    };

    // Handle direct input changes
    const handleInputChange = (text) => {
        const numericRegex = /^-?\d*\.?\d*$/;

        if (text === '' || numericRegex.test(text)) {
            setLocalValue(text);

            if (text === '') {
                setFieldValue(field, '');
            } else if (text === '-' || text === '.') {
                setFieldValue(field, text);
            } else if (!isNaN(parseFloat(text))) {
                if (text.endsWith('.')) {
                    setFieldValue(field, text);
                } else {
                    const numValue = parseFloat(text);
                    setFieldValue(field, numValue);
                }
            }
        }
    };

    return (
        <View style={styles.fieldContainer}>

            <View style={styles.numberInputContainer}>
                <IconButton
                    icon="minus"
                    size={20}
                    onPress={decrementValue}
                    disabled={disabled || (min !== undefined && (parseFloat(localValue) || 0) <= min)}
                    style={styles.numberButton}
                />

                <TextInput
                    label={label}
                    value={String(localValue || '')}
                    onChangeText={handleInputChange}
                    onBlur={handleBlur(field)}
                    keyboardType="numeric"
                    mode="outlined"
                    style={styles.numberInput}
                    textColor={adminColors.text.primary}
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
                    disabled={disabled || (max !== undefined && (parseFloat(localValue) || 0) >= max)}
                    style={styles.numberButton}
                />
            </View>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
