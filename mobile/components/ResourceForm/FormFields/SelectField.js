import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Menu, TextInput, ActivityIndicator, Button, Divider } from 'react-native-paper';
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
    withSearch = false,
    onSearch = null,
    allowCreate = false,
    onLoadMore = null,
    hasMore = false,
    ...props
}) => {
    const [visible, setVisible] = useState(false);
    const [menuWidth, setMenuWidth] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [customOption, setCustomOption] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const hasError = touched[field] && errors[field];
    const inputRef = useRef(null);
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);
    const isMeasuringRef = useRef(false);
    const searchTimeoutRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    const memoizedOptions = useRef(options);
    useEffect(() => {
        if (JSON.stringify(options) !== JSON.stringify(memoizedOptions.current)) {
            memoizedOptions.current = options;
            setFilteredOptions(options);
        }
    }, [options]);

    useEffect(() => {
        if (!withSearch || onSearch) {
            return;
        }
        if (searchQuery.trim() === '') {
            setFilteredOptions(memoizedOptions.current);
            setCustomOption(null);
        } else {
            const filtered = memoizedOptions.current.filter(option => {
                const optionLabel = typeof option === 'object' ? option.label : option;
                return optionLabel.toLowerCase().includes(searchQuery.toLowerCase());
            });

            setFilteredOptions(filtered);
            if (filtered.length === 0 && allowCreate) {
                setCustomOption(searchQuery);
            } else {
                setCustomOption(null);
            }
        }
    }, [searchQuery, withSearch, onSearch, allowCreate]);

    const performSearch = useCallback((query) => {
        if (!onSearch) return;
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        setSearching(true);

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                await onSearch(query);
            } catch (error) {
                console.error(`[SelectField] Search error for ${field}:`, error);
            } finally {
                setSearching(false);
            }
            searchTimeoutRef.current = null;
        }, 300);
    }, [onSearch, field]);
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    const openMenu = useCallback(() => {
        if (disabled || loading || isMeasuringRef.current) return;

        isMeasuringRef.current = true;
        setSearchQuery('');
        if (containerRef.current) {
            containerRef.current.measure((x, y, width) => {
                setMenuWidth(width > 0 ? width : screenWidth * 0.9);
                setVisible(true);
                isMeasuringRef.current = false;
                if (withSearch && onSearch && !searching) {
                    performSearch('');
                }
            });
        } else {
            setMenuWidth(screenWidth * 0.9);
            setVisible(true);
            isMeasuringRef.current = false;
        }
    }, [disabled, loading, screenWidth, withSearch, onSearch, searching, performSearch]);

    const closeMenu = useCallback(() => {
        setVisible(false);
        setSearchQuery('');
        setCustomOption(null);
    }, []);

    const handleSearchChange = useCallback((text) => {
        setSearchQuery(text);
        if (onSearch) {
            performSearch(text);
        }
    }, [onSearch, performSearch]);

    const handleSelect = useCallback((selectedValue, selectedLabel) => {
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
    }, [field, value, returnObjectValue, setFieldValue, closeMenu]);

    const handleCreateOption = useCallback(() => {
        if (!customOption || !allowCreate) return;

        console.log(`[SelectField] Creating new option for ${field}:`, customOption);

        if (returnObjectValue) {
            setFieldValue(field, {
                id: null,
                name: customOption
            });
        } else {
            setFieldValue(field, customOption);
        }
        closeMenu();
    }, [customOption, allowCreate, field, returnObjectValue, setFieldValue, closeMenu]);

    const handleLoadMore = useCallback(async () => {
        if (!onLoadMore || loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            await onLoadMore();
        } catch (error) {
            console.error(`[SelectField] Load more error for ${field}:`, error);
        } finally {
            setLoadingMore(false);
        }
    }, [onLoadMore, loadingMore, hasMore, field]);

    const getDisplayValue = useCallback(() => {
        if (!value) return '';

        if (typeof value === 'string') {
            const selectedOption = memoizedOptions.current.find(option => {
                const optionLabel = typeof option === 'object' ? option.label : option;
                return optionLabel === value;
            });

            if (selectedOption) {
                return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
            }

            return value;
        }

        const valueToCheck = typeof value === 'object' ? value.id || value.name : value;

        const selectedOption = memoizedOptions.current.find(option => {
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionLabel = typeof option === 'object' ? option.label : option;
            return optionValue === valueToCheck || optionLabel === valueToCheck;
        });

        if (!selectedOption) {
            if (typeof value === 'object' && value.name) {
                return value.name;
            }
            return '';
        }
        return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
    }, [value]);

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
                        textColor={adminColors.text.primary}
                        right={
                            loading ? (
                                <TextInput.Icon
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
                {withSearch && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            ref={searchInputRef}
                            placeholder="Search..."
                            value={searchQuery}
                            onChangeText={handleSearchChange}
                            mode="outlined"
                            dense
                            right={
                                searching ? (
                                    <TextInput.Icon icon={() => <ActivityIndicator size={16} color={adminColors.primary} />} />
                                ) : searchQuery ? (
                                    <TextInput.Icon icon="close" onPress={() => handleSearchChange('')} />
                                ) : null
                            }
                            style={styles.searchInput}
                        />
                    </View>
                )}

                <ScrollView
                    style={[styles.menuScrollView, { width: Math.min(menuWidth || screenWidth * 0.9, screenWidth * 0.9) }]}
                    nestedScrollEnabled={true}
                >
                    {(loading || searching) && filteredOptions.length === 0 ? (
                        <Menu.Item
                            disabled
                            title={searching ? "Searching..." : "Loading options..."}
                            leadingIcon={() => <ActivityIndicator size={20} color={adminColors.primary} />}
                        />
                    ) : filteredOptions.length === 0 ? (
                        <Menu.Item
                            disabled
                            title="No options available"
                        />
                    ) : (
                        <>
                            {filteredOptions.map((option, index) => {
                                const optionValue = typeof option === 'object' ? option.value : option;
                                const optionLabel = typeof option === 'object' ? option.label : option;
                                const isSelected = typeof value === 'object'
                                    ? value.id === optionValue || value.name === optionLabel
                                    : value === optionValue || value === optionLabel;

                                return (
                                    <Menu.Item
                                        key={index}
                                        onPress={() => handleSelect(optionValue, optionLabel)}
                                        title={optionLabel}
                                        leadingIcon={isSelected ? 'check' : undefined}
                                        titleStyle={isSelected ? { color: adminColors.primary } : undefined}
                                    />
                                );
                            })}
                        </>
                    )}

                    {/* Custom option for creating new item */}
                    {customOption && allowCreate && (
                        <>
                            <Divider style={styles.divider} />
                            <TouchableOpacity
                                style={styles.createOptionButton}
                                onPress={handleCreateOption}
                            >
                                <Text style={styles.createOptionText}>
                                    Create "{customOption}"
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Load more button */}
                    {hasMore && onLoadMore && (
                        <View style={styles.loadMoreContainer}>
                            <Divider style={styles.divider} />
                            <Button
                                mode="text"
                                onPress={handleLoadMore}
                                loading={loadingMore}
                                disabled={loadingMore}
                                style={styles.loadMoreButton}
                            >
                                Load More
                            </Button>
                        </View>
                    )}
                </ScrollView>
            </Menu>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
