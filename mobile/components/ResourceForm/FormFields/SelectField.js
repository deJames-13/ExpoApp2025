import React, { useState, useRef } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { Text, Menu, TextInput, ActivityIndicator } from 'react-native-paper';
import { styles, adminColors } from './styles';

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
    loading = false,
    returnObjectValue = false,
    ...props
}) => {
    const [visible, setVisible] = useState(false);
    const [menuWidth, setMenuWidth] = useState(0);
    const hasError = touched[field] && errors[field];
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    // Open/close the dropdown menu
    const openMenu = () => {
        if (disabled || loading) return;

        // Measure the container width for proper menu positioning
        if (containerRef.current) {
            containerRef.current.measure((x, y, width) => {
                setMenuWidth(width);
                setVisible(true);
            });
        } else {
            setVisible(true);
        }
    };

    const closeMenu = () => setVisible(false);

    // Handle option selection
    const handleSelect = (selectedValue, selectedLabel) => {
        // Log selection change
        console.log(`[SelectField] Field ${field} changed:`, {
            from: value,
            to: returnObjectValue ? { id: selectedValue, name: selectedLabel } : selectedLabel,
            fieldName: field
        });

        if (returnObjectValue) {
            setFieldValue(field, {
                id: selectedValue,
                name: selectedLabel
            });
        } else {
            setFieldValue(field, selectedLabel);
        }
        closeMenu();
    };

    // Find the label for the current value
    const getDisplayValue = () => {
        if (!value) return '';

        if (typeof value === 'string') {
            const selectedOption = options.find(option => {
                const optionLabel = typeof option === 'object' ? option.label : option;
                return optionLabel === value;
            });

            if (selectedOption) {
                return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
            }

            return value;
        }

        // Handle object value (legacy support)
        const valueToCheck = typeof value === 'object' ? value.id || value.name : value;

        const selectedOption = options.find(option => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return optionValue === valueToCheck || optionLabel === valueToCheck;
        });

        if (!selectedOption) return '';
        return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
    };

    return (
        <View style={styles.fieldContainer} ref={containerRef}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                contentStyle={[styles.menuContent, { width: Math.min(menuWidth || screenWidth * 0.9, screenWidth * 0.9) }]}
                style={styles.menu}
                anchor={
                    <TextInput
                        ref={inputRef}
                        label={label}
                        value={getDisplayValue()}
                        style={styles.input}
                        mode="outlined"
                        editable={false}
                        // disabled={disabled || loading}
                        textColor={adminColors.text.primary}
                        right={
                            loading ? (
                                <TextInput.Icon
                                    textColor={adminColors.text.primary}

                                    icon={() => <ActivityIndicator size={20} color={adminColors.primary} />}
                                />
                            ) : (
                                <TextInput.Icon
                                    icon="menu-down"
                                    textColor={adminColors.text.primary}
                                    onPress={openMenu}
                                    disabled={disabled || loading}
                                />
                            )
                        }
                        placeholder={loading ? "Loading options..." : placeholder}
                        outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                        activeOutlineColor={adminColors.primary}
                        onPressIn={openMenu}
                        error={hasError}
                        {...props}
                    />
                }
            >
                <ScrollView
                    style={[styles.menuScrollView, { width: Math.min(menuWidth || screenWidth * 0.9, screenWidth * 0.9) }]}
                    nestedScrollEnabled={true}
                >
                    {options.length === 0 ? (
                        <Menu.Item
                            disabled
                            title={loading ? "Loading options..." : "No options available"}
                            leadingIcon={loading ? () => <ActivityIndicator size={20} color={adminColors.primary} /> : undefined}
                        />
                    ) : (
                        options.map((option, index) => {
                            const optionValue = typeof option === 'object' ? option.value : option;
                            const optionLabel = typeof option === 'object' ? option.label : option;
                            const isSelected = typeof value === 'object'
                                ? value.id === optionValue
                                : value === optionValue;

                            return (
                                <Menu.Item
                                    key={index}
                                    onPress={() => handleSelect(optionValue, optionLabel)}
                                    title={optionLabel}
                                    leadingIcon={isSelected ? 'check' : undefined}
                                    titleStyle={isSelected ? { color: adminColors.primary } : undefined}
                                />
                            );
                        })
                    )}
                </ScrollView>
            </Menu>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
