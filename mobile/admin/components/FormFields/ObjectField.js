import React from 'react';
import { View } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { adminColors } from '../../styles/adminTheme';
import { styles } from './styles';

export const ObjectField = ({
    field,
    property = 'name',
    label,
    value,
    setFieldValue,
    handleBlur,
    errors,
    touched,
    disabled = false,
    ...props
}) => {
    const fullField = `${field}.${property}`;
    const hasError = touched[field]?.[property] && errors[field]?.[property];

    return (
        <View style={styles.fieldContainer}>
            <TextInput
                label={label}
                value={String(value[property] || '')}
                onChangeText={(text) => setFieldValue(field, { ...value, [property]: text })}
                onBlur={handleBlur(fullField)}
                style={styles.input}
                disabled={disabled}
                mode="outlined"
                textColor={adminColors.text.primary}
                outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                activeOutlineColor={adminColors.primary}
                error={hasError}
                {...props}
            />
            {hasError && (
                <Text style={styles.errorText}>{errors[field][property]}</Text>
            )}
        </View>
    );
};
