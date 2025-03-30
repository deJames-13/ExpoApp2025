import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Menu, TextInput } from 'react-native-paper';
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

    // Open/close the dropdown menu
    const openMenu = () => !disabled && setVisible(true);
    const closeMenu = () => setVisible(false);

    // Handle option selection
    const handleSelect = (selectedValue) => {
        setFieldValue(field, selectedValue);
        closeMenu();
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
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                    <TextInput
                        label={label}
                        value={getDisplayValue()}
                        style={styles.input}
                        mode="outlined"
                        editable={false}
                        disabled={disabled}
                        right={
                            <TextInput.Icon
                                icon="menu-down"
                                onPress={openMenu}
                                disabled={disabled}
                            />
                        }
                        placeholder={placeholder}
                        outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                        activeOutlineColor={adminColors.primary}
                        onPressIn={openMenu}
                        error={hasError}
                        {...props}
                    />
                }
                contentStyle={{ maxHeight: 300 }}
            >
                {options.map((option, index) => {
                    const optionValue = typeof option === 'object' ? option.value : option;
                    const optionLabel = typeof option === 'object' ? option.label : option;
                    const isSelected = value === optionValue;

                    return (
                        <Menu.Item
                            key={index}
                            onPress={() => handleSelect(optionValue)}
                            title={optionLabel}
                            leadingIcon={isSelected ? 'check' : undefined}
                            titleStyle={isSelected ? { color: adminColors.primary } : undefined}
                        />
                    );
                })}
                {options.length === 0 && (
                    <Menu.Item
                        disabled
                        title="No options available"
                    />
                )}
            </Menu>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
