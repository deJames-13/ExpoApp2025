import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { View, Modal, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Text, TextInput, Button, Searchbar, Chip, ActivityIndicator, Divider } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const ModalSelectField = ({
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
    const [modalVisible, setModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState(options);
    const [customOption, setCustomOption] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);

    const hasError = touched[field] && errors[field];
    const searchTimeoutRef = useRef(null);
    const flatListRef = useRef(null);
    const optionsRef = useRef(options);

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
                console.error(`[ModalSelectField] Search error for ${field}:`, error);
            } finally {
                setSearching(false);
            }
            searchTimeoutRef.current = null;
        }, 300);
    }, [onSearch, field]);


    const openModal = useCallback(() => {
        if (disabled || loading) return;

        setModalVisible(true);
        setSearchQuery('');

        if (withSearch && onSearch && !searching) {
            performSearch('');
        }
    }, [disabled, loading, withSearch, onSearch, searching, performSearch]);

    const closeModal = useCallback(() => {
        setModalVisible(false);
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
        console.log(`[ModalSelectField] Field ${field} changed:`, {
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
        closeModal();
    }, [field, value, returnObjectValue, setFieldValue, closeModal]);

    const handleCreateOption = useCallback(() => {
        if (!customOption || !allowCreate) return;

        console.log(`[ModalSelectField] Creating new option for ${field}:`, customOption);

        if (returnObjectValue) {
            setFieldValue(field, {
                id: null,
                name: customOption
            });
        } else {
            setFieldValue(field, customOption);
        }
        closeModal();
    }, [customOption, allowCreate, field, returnObjectValue, setFieldValue, closeModal]);

    const handleLoadMore = useCallback(async () => {
        if (!onLoadMore || loadingMore || !hasMore) return;

        setLoadingMore(true);
        try {
            await onLoadMore();
        } catch (error) {
            console.error(`[ModalSelectField] Load more error for ${field}:`, error);
        } finally {
            setLoadingMore(false);
        }
    }, [onLoadMore, loadingMore, hasMore, field]);

    const displayValue = useMemo(() => {
        if (!value) return '';

        if (typeof value === 'string') {
            const selectedOption = optionsRef.current.find(option => {
                const optionLabel = typeof option === 'object' ? option.label : option;
                return optionLabel === value;
            });

            if (selectedOption) {
                return typeof selectedOption === 'object' ? selectedOption.label : selectedOption;
            }

            return value;
        }

        const valueToCheck = typeof value === 'object' ? value.id || value.name : value;

        const selectedOption = optionsRef.current.find(option => {
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

    const renderItem = useCallback(({ item, index }) => {
        const optionValue = typeof item === 'object' ? item.value : item;
        const optionLabel = typeof item === 'object' ? item.label : item;
        const isSelected = typeof value === 'object'
            ? value.id === optionValue || value.name === optionLabel
            : value === optionValue || value === optionLabel;

        return (
            <TouchableOpacity
                style={[
                    styles.modalSelectItem,
                    isSelected && styles.modalSelectItemSelected
                ]}
                onPress={() => handleSelect(optionValue, optionLabel)}
            >
                <Text style={[
                    styles.modalSelectItemText,
                    isSelected && styles.modalSelectItemTextSelected
                ]}>
                    {optionLabel}
                </Text>
                {isSelected && (
                    <Text style={styles.modalSelectItemIcon}>✓</Text>
                )}
            </TouchableOpacity>
        );
    }, [value, handleSelect]);

    const ListEmptyComponent = useCallback(() => {
        if (loading || searching) {
            return (
                <View style={styles.modalSelectEmptyContainer}>
                    <ActivityIndicator size="small" color={adminColors.primary} />
                    <Text style={styles.modalSelectEmptyText}>
                        {searching ? "Searching..." : "Loading options..."}
                    </Text>
                </View>
            );
        }

        return (
            <View style={styles.modalSelectEmptyContainer}>
                <Text style={styles.modalSelectEmptyText}>
                    No options available
                </Text>
            </View>
        );
    }, [loading, searching]);

    const ListFooterComponent = useCallback(() => {
        return (
            <View>
                {customOption && allowCreate && (
                    <TouchableOpacity
                        style={styles.modalSelectCreateOption}
                        onPress={handleCreateOption}
                    >
                        <Text style={styles.modalSelectCreateOptionText}>
                            Create "{customOption}"
                        </Text>
                    </TouchableOpacity>
                )}

                {hasMore && onLoadMore && (
                    <Button
                        mode="text"
                        onPress={handleLoadMore}
                        loading={loadingMore}
                        disabled={loadingMore}
                        style={styles.modalSelectLoadMoreButton}
                    >
                        Load More
                    </Button>
                )}

                {/* Add padding at the bottom */}
                <View style={{ height: 20 }} />
            </View>
        );
    }, [customOption, allowCreate, handleCreateOption, hasMore, onLoadMore, handleLoadMore, loadingMore]);



    useEffect(() => {
        if (JSON.stringify(optionsRef.current) !== JSON.stringify(options)) {
            optionsRef.current = options;
            setFilteredOptions(options);
        }
    }, [options]);

    useEffect(() => {
        if (!withSearch || onSearch) {
            return;
        }

        if (searchQuery.trim() === '') {
            setFilteredOptions(optionsRef.current);
            setCustomOption(null);
            return;
        }

        const filtered = optionsRef.current.filter(option => {
            const optionLabel = typeof option === 'object' ? option.label : option;
            return optionLabel.toLowerCase().includes(searchQuery.toLowerCase());
        });

        setFilteredOptions(filtered);

        if (filtered.length === 0 && allowCreate) {
            setCustomOption(searchQuery);
        } else {
            setCustomOption(null);
        }
    }, [searchQuery, withSearch, allowCreate]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);


    return (
        <View style={styles.fieldContainer}>
            <TextInput
                label={label}
                value={displayValue}
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
                            onPress={openModal}
                            disabled={disabled || loading}
                        />
                    )
                }
                placeholder={loading ? "Loading options..." : placeholder}
                outlineColor={hasError ? adminColors.status.error : adminColors.text.light}
                activeOutlineColor={adminColors.primary}
                onPressIn={openModal}
                error={hasError}
                {...props}
            />

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}

            <Modal
                visible={modalVisible}
                onRequestClose={closeModal}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={closeModal}>
                                <Text style={styles.modalCloseButton}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {withSearch && (
                            <Searchbar
                                placeholder="Search..."
                                onChangeText={handleSearchChange}
                                value={searchQuery}
                                style={styles.modalSearchBar}
                                loading={searching}
                                iconColor={adminColors.text.primary}
                            />
                        )}

                        <Divider style={styles.modalDivider} />

                        <FlatList
                            ref={flatListRef}
                            data={filteredOptions}
                            renderItem={renderItem}
                            keyExtractor={(item, index) =>
                                (typeof item === 'object' ? item.value : item) + '-' + index
                            }
                            contentContainerStyle={styles.modalSelectList}
                            ListEmptyComponent={ListEmptyComponent}
                            ListFooterComponent={ListFooterComponent}
                            onEndReached={hasMore && onLoadMore ? handleLoadMore : null}
                            onEndReachedThreshold={0.2}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
};
