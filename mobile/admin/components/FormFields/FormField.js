import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { adminColors } from '../../styles/adminTheme';
import { styles } from './styles';

export const FormField = ({
    field,
    label,
    value,
    handleChange,
    handleBlur,
    errors,
    touched,
    disabled = false,
    multiline = false,
    keyboardType = 'default',
    numberOfLines,
    style,
    leftIcon,
    ...props
}) => {
    const hasError = touched[field] && errors[field];

    return (
        <View style={styles.fieldContainer}>
            <TextInput
                label={label}
                value={String(value || '')}
                onChangeText={handleChange(field)}
                onBlur={handleBlur(field)}
                style={[styles.input, multiline && styles.multilineInput, style]}
                disabled={disabled}
                mode="outlined"
                multiline={multiline}
                numberOfLines={numberOfLines}
                keyboardType={keyboardType}
                textColor={adminColors.text.primary}
                outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                activeOutlineColor={adminColors.primary}
                error={hasError}
                left={leftIcon}
                {...props}
            />
            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
