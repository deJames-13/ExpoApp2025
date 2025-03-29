import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text, RadioButton } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const RadioField = ({
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

    const handleSelect = (optionValue) => {
        if (!disabled) {
            setFieldValue(field, optionValue);
        }
    };

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <View style={[
                styles.radioGroupContainer,
                direction === 'horizontal' && styles.radioGroupHorizontal
            ]}>
                {options.map((option, index) => {
                    const optionValue = typeof option === 'object' ? option.value : option;
                    const optionLabel = typeof option === 'object' ? option.label : option;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleSelect(optionValue)}
                            disabled={disabled}
                            style={[
                                styles.radioContainer,
                                direction === 'horizontal' && styles.radioContainerHorizontal
                            ]}
                        >
                            <RadioButton
                                value={optionValue}
                                status={value === optionValue ? 'checked' : 'unchecked'}
                                onPress={() => handleSelect(optionValue)}
                                disabled={disabled}
                                color={adminColors.primary}
                            />
                            <Text style={[
                                styles.radioLabel,
                                disabled && styles.disabledText,
                                value === optionValue && styles.radioLabelActive
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
