import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, TextInput, Modal, Portal, Button, TouchableRipple } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const SelectField = ({
    field,
    label,
    value,
    setFieldValue,
    options = [],
    errors,
    touched,
    disabled = false,
    placeholder = 'Select an option',
    ...props
}) => {
    const [visible, setVisible] = useState(false);
    const hasError = touched[field] && errors[field];

    // Open/close the modal
    const openModal = () => !disabled && setVisible(true);
    const closeModal = () => setVisible(false);

    // Handle option selection
    const handleSelect = (selectedValue) => {
        setFieldValue(field, selectedValue);
        closeModal();
    };

    // Find the label for the current value
    const getDisplayValue = () => {
        if (!value) return '';
        const selectedOption = options.find(option =>
            typeof option === 'object' ? option.value === value : option === value
        );
        if (!selectedOption) return '';
        return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
    };

    return (
        <View style={styles.fieldContainer}>
            <TextInput
                label={label}
                value={getDisplayValue()}
                style={styles.input}
                mode="outlined"
                editable={false}
                disabled={disabled}
                textColor={adminColors.text.primary}
                right={
                    <TextInput.Icon
                        icon="menu-down"
                        onPress={openModal}
                        disabled={disabled}
                    />
                }
                placeholder={placeholder}
                outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                activeOutlineColor={adminColors.primary}
                onPressIn={openModal}
                error={hasError}
                {...props}
            />

            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        marginHorizontal: 20,
                        borderRadius: 8,
                        maxHeight: '80%',
                    }}
                >
                    <View style={{ padding: 16 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
                            {label || 'Select an option'}
                        </Text>

                        <ScrollView style={{ maxHeight: 400 }}>
                            {options.map((option, index) => {
                                const optionValue = typeof option === 'object' ? option.value : option;
                                const optionLabel = typeof option === 'object' ? option.label : option;
                                const isSelected = value === optionValue;

                                return (
                                    <TouchableRipple
                                        key={index}
                                        onPress={() => handleSelect(optionValue)}
                                        style={{
                                            paddingVertical: 12,
                                            paddingHorizontal: 16,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: isSelected ? adminColors.background.light : 'transparent',
                                            borderRadius: 4,
                                        }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {isSelected && (
                                                <Text style={{ marginRight: 8, color: adminColors.primary }}>✓</Text>
                                            )}
                                            <Text style={{
                                                color: isSelected ? adminColors.primary : adminColors.text.primary
                                            }}>
                                                {optionLabel}
                                            </Text>
                                        </View>
                                    </TouchableRipple>
                                );
                            })}
                            {options.length === 0 && (
                                <Text style={{ padding: 16, color: adminColors.text.light }}>
                                    No options available
                                </Text>
                            )}
                        </ScrollView>

                        <Button
                            mode="text"
                            onPress={closeModal}
                            style={{ marginTop: 16 }}
                        >
                            Cancel
                        </Button>
                    </View>
                </Modal>
            </Portal>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
