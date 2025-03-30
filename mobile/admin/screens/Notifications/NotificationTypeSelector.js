import React from 'react';
import { View, Text, Switch } from 'react-native';
import { TextInput, Chip } from 'react-native-paper';
import { styles, adminColors } from './styles.js';

export const NotificationTypes = [
    { label: 'Info', value: 'info' },
    { label: 'Warning', value: 'warning' },
    { label: 'Error', value: 'error' },
    { label: 'Promo', value: 'promo' },
    { label: 'Discount', value: 'discount' },
    { label: 'Sale', value: 'sale' },
    { label: 'Notification', value: 'notification' }
];

const NotificationTypeSelector = ({
    useCustomType,
    setUseCustomType,
    values,
    setFieldValue,
    errors,
    touched,
    handleChange,
    handleBlur
}) => {
    return (
        <>
            <View style={styles.switchRow}>
                <Text style={styles.label}>Use Custom Notification Type</Text>
                <Switch
                    value={useCustomType}
                    onValueChange={setUseCustomType}
                />
            </View>

            {!useCustomType && (
                <>
                    <Text style={styles.label}>Notification Type:</Text>
                    <View style={styles.chipContainer}>
                        {NotificationTypes.map((type) => (
                            <Chip
                                key={type.value}
                                selected={values.type === type.value}
                                onPress={() => setFieldValue('type', type.value)}
                                style={[
                                    styles.chip,
                                    values.type === type.value && styles.selectedChip
                                ]}
                                textStyle={values.type === type.value ? styles.selectedChipText : {}}
                            >
                                {type.label}
                            </Chip>
                        ))}
                    </View>
                </>
            )}

            {useCustomType && (
                <TextInput
                    label="Custom Notification Type *"
                    mode="outlined"
                    outlineColor="#ddd"
                    activeOutlineColor={adminColors.primary}
                    textColor={adminColors.text.primary}
                    backgroundColor="white"
                    placeholderTextColor={adminColors.text.light}
                    value={values.customType}
                    onChangeText={handleChange('customType')}
                    onBlur={handleBlur('customType')}
                    error={touched.customType && errors.customType}
                    style={styles.input}
                    placeholder="Enter custom type (e.g., update, maintenance, feature)"
                />
            )}
            {useCustomType && touched.customType && errors.customType && (
                <Text style={styles.errorText}>{errors.customType}</Text>
            )}
        </>
    );
};

export default NotificationTypeSelector;
