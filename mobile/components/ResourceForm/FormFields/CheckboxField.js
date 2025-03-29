import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, Checkbox } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const CheckboxField = ({
    field,
    label,
    value,
    options = [],
    setFieldValue,
    errors,
    touched,
    disabled = false,
    direction = 'vertical',
    ...props
}) => {
    const hasError = touched[field] && errors[field];

    const handleToggle = (option) => {
        if (disabled) return;

        // For single checkbox (boolean value)
        if (!options || options.length === 0) {
            setFieldValue(field, !value);
            return;
        }

        // For multiple checkboxes (array of values)
        const optionValue = typeof option === 'object' ? option.value : option;

        if (!Array.isArray(value)) {
            setFieldValue(field, [optionValue]);
            return;
        }

        const isSelected = value.includes(optionValue);

        if (isSelected) {
            setFieldValue(field, value.filter(item => item !== optionValue));
        } else {
            setFieldValue(field, [...value, optionValue]);
        }
    };

    // Render a single checkbox if no options provided
    if (!options || options.length === 0) {
        return (
            <View style={styles.fieldContainer}>
                <TouchableOpacity
                    onPress={() => handleToggle()}
                    disabled={disabled}
                    style={styles.checkboxContainer}
                >
                    <Checkbox
                        status={value ? 'checked' : 'unchecked'}
                        onPress={() => handleToggle()}
                        disabled={disabled}
                        color={adminColors.primary}
                    />
                    <Text style={[
                        styles.checkboxLabel,
                        disabled && styles.disabledText
                    ]}>
                        {label}
                    </Text>
                </TouchableOpacity>

                {hasError && (
                    <Text style={styles.errorText}>{errors[field]}</Text>
                )}
            </View>
        );
    }

    // Render multiple checkboxes
    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <View style={[
                styles.checkboxGroupContainer,
                direction === 'horizontal' && styles.checkboxGroupHorizontal
            ]}>
                {options.map((option, index) => {
                    const optionValue = typeof option === 'object' ? option.value : option;
                    const optionLabel = typeof option === 'object' ? option.label : option;
                    const isSelected = Array.isArray(value) && value.includes(optionValue);

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleToggle(option)}
                            disabled={disabled}
                            style={[
                                styles.checkboxContainer,
                                direction === 'horizontal' && styles.checkboxContainerHorizontal
                            ]}
                        >
                            <Checkbox
                                status={isSelected ? 'checked' : 'unchecked'}
                                onPress={() => handleToggle(option)}
                                disabled={disabled}
                                color={adminColors.primary}
                            />
                            <Text style={[
                                styles.checkboxLabel,
                                disabled && styles.disabledText
                            ]}>
                                {optionLabel}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
