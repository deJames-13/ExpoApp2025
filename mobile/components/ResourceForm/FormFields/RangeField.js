import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider'; // Fixed import
import { Text } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const RangeField = ({
    field,
    label,
    value,
    setFieldValue,
    errors,
    touched,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    showValues = true,
    displayName = '',
    ...props
}) => {
    const hasError = touched[field] && errors[field];

    const handleValueChange = (newValue) => {
        setFieldValue(field, newValue);
    };

    return (
        <View style={styles.fieldContainer}>
            <View style={styles.rangeHeaderContainer}>
                <Text style={styles.fieldLabel}>{label}</Text>
                {showValues && (
                    <Text style={styles.rangeValue}>{value}</Text>
                )}
            </View>

            <Slider
                value={value || min}
                onValueChange={handleValueChange}
                minimumValue={min}
                maximumValue={max}
                step={step}
                disabled={disabled}
                minimumTrackTintColor={disabled ? adminColors.text.light : adminColors.primary}
                thumbTintColor={disabled ? adminColors.text.light : adminColors.primary}
                {...props}
            />

            {showValues && (
                <View style={styles.rangeLabelsContainer}>
                    <Text style={styles.rangeMinMaxLabel}>{min}</Text>
                    <Text style={styles.rangeMinMaxLabel}>{max}</Text>
                </View>
            )}

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
