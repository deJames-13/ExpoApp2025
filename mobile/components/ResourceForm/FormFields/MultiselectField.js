import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Chip, TextInput, Menu, Divider } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const MultiselectField = ({
    field,
    label,
    options = [],
    value = [],
    setFieldValue,
    errors,
    touched,
    disabled = false,
    displayProperty = 'label',
    valueProperty = 'value',
    ...props
}) => {
    const [visible, setVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const hasError = touched[field] && errors[field];

    const openMenu = () => !disabled && setVisible(true);
    const closeMenu = () => setVisible(false);

    const handleSelect = (option) => {
        const selectedValue = typeof option === 'object' ? option[valueProperty] : option;

        // Check if already selected
        const isSelected = Array.isArray(value) &&
            value.some(item =>
                typeof item === 'object'
                    ? item[valueProperty] === selectedValue
                    : item === selectedValue
            );

        // Toggle selection
        let newValue;
        if (isSelected) {
            newValue = value.filter(item =>
                typeof item === 'object'
                    ? item[valueProperty] !== selectedValue
                    : item !== selectedValue
            );
        } else {
            newValue = [...(value || []), option];
        }

        setFieldValue(field, newValue);
    };

    const handleRemove = (itemToRemove) => {
        const valueToRemove = typeof itemToRemove === 'object' ? itemToRemove[valueProperty] : itemToRemove;

        const newValue = value.filter(item =>
            typeof item === 'object'
                ? item[valueProperty] !== valueToRemove
                : item !== valueToRemove
        );

        setFieldValue(field, newValue);
    };

    const getDisplayValue = (item) => {
        if (typeof item === 'object') {
            return item[displayProperty] || item[valueProperty] || String(item);
        }
        return String(item);
    };

    const filteredOptions = options.filter(option => {
        const optionLabel = getDisplayValue(option).toLowerCase();
        return optionLabel.includes(searchQuery.toLowerCase());
    });

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <View style={styles.multiselectContainer}>
                <View style={styles.selectedChipsContainer}>
                    {Array.isArray(value) && value.length > 0 ? (
                        value.map((item, index) => (
                            <Chip
                                key={index}
                                onClose={!disabled ? () => handleRemove(item) : undefined}
                                style={styles.selectedChip}
                                mode="outlined"
                                disabled={disabled}
                            >
                                {getDisplayValue(item)}
                            </Chip>
                        ))
                    ) : (
                        <Text style={styles.placeholderText}>None selected</Text>
                    )}
                </View>

                {!disabled && (
                    <Menu
                        visible={visible}
                        onDismiss={closeMenu}
                        anchor={
                            <TextInput
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                placeholder="Search and select..."
                                style={[styles.input, styles.multiselectInput]}
                                mode="outlined"
                                right={
                                    <TextInput.Icon
                                        icon="menu-down"
                                        onPress={openMenu}
                                    />
                                }
                                outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                                activeOutlineColor={adminColors.primary}
                                onFocus={openMenu}
                                disabled={disabled}
                                error={hasError}
                            />
                        }
                        contentStyle={styles.menuContent}
                    >
                        {searchQuery.length > 0 && (
                            <View style={styles.searchResultHeader}>
                                <Text style={styles.searchResultText}>
                                    Search results for "{searchQuery}"
                                </Text>
                            </View>
                        )}

                        {filteredOptions.length === 0 ? (
                            <Menu.Item title="No options found" disabled />
                        ) : (
                            filteredOptions.map((option, index) => {
                                const optionValue = typeof option === 'object' ? option[valueProperty] : option;
                                const optionLabel = getDisplayValue(option);

                                const isSelected = Array.isArray(value) &&
                                    value.some(item =>
                                        typeof item === 'object'
                                            ? item[valueProperty] === optionValue
                                            : item === optionValue
                                    );

                                return (
                                    <React.Fragment key={index}>
                                        <Menu.Item
                                            title={optionLabel}
                                            onPress={() => {
                                                handleSelect(option);
                                                setSearchQuery('');
                                            }}
                                            leadingIcon={isSelected ? 'check' : undefined}
                                            titleStyle={isSelected ? { color: adminColors.primary } : undefined}
                                        />
                                        {index < filteredOptions.length - 1 && <Divider />}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </Menu>
                )}
            </View>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
