import { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from '~/components/ui';
import Icon from 'react-native-vector-icons/Ionicons';
import useResource from '~/hooks/useResource.js';
import { useNavigation } from '@react-navigation/native';

export default function CategoryList({ categories = [], onSelectCategory, selectedCategory = null, horizontal = true }) {
    const resource = useResource({ resourceName: 'categories', silent: true });
    const { states: { data, loading }, actions: { fetchDatas } } = resource;
    const navigation = useNavigation();

    const handleCategoryPress = (category) => {
        // If onSelectCategory prop exists, call it
        if (onSelectCategory) {
            onSelectCategory(category);
            return;
        }

        // Navigate to CategorizedProducts with the selected category
        navigation.navigate('CategorizedProducts', {
            category,
            _t: new Date().getTime() // Add timestamp to force refresh
        });
    };

    const renderCategory = ({ item }) => {
        const isSelected = selectedCategory && selectedCategory.id === item.id;

        return (
            <TouchableOpacity
                style={[
                    styles.categoryContainer,
                    horizontal ? styles.horizontalCategory : styles.gridCategory
                ]}
                onPress={() => handleCategoryPress(item)}
            >
                <View style={[
                    styles.iconContainer,
                    isSelected ? styles.selectedIconContainer : null
                ]}>
                    <Icon
                        name={item.icon || 'grid-outline'}
                        size={28}
                        color={isSelected ? "#ffffff" : "#3b82f6"}
                    />
                </View>
                <Text style={[
                    styles.categoryName,
                    isSelected ? styles.selectedCategoryName : null
                ]}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    useEffect(() => {
        fetchDatas();
    }, []);

    const displayData = data && data.length > 0 ? data : categories;

    return (
        <View style={styles.container}>
            {!horizontal && <Text style={styles.title}>Categories</Text>}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#3b82f6" />
                </View>
            ) : displayData && displayData.length > 0 ? (
                <FlatList
                    data={displayData}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                    horizontal={horizontal}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={
                        horizontal ? styles.horizontalList : styles.gridList
                    }
                    numColumns={horizontal ? 1 : 3}
                    key={horizontal ? 'horizontal' : 'grid'}
                />
            ) : (
                <View style={styles.loadingContainer}>
                    <Text style={styles.noDataText}>No categories available</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    loadingContainer: {
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryContainer: {
        alignItems: 'center',
    },
    horizontalCategory: {
        marginHorizontal: 12,
    },
    gridCategory: {
        flex: 1 / 3,
        marginBottom: 16,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32, // Half of width/height to ensure perfect circle
        backgroundColor: '#f3f4f6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        overflow: 'hidden', // Ensures content doesn't break the perfect circle
    },
    selectedIconContainer: {
        backgroundColor: '#3b82f6',
    },
    categoryName: {
        fontSize: 14,
        textAlign: 'center',
        maxWidth: 75,
    },
    selectedCategoryName: {
        fontWeight: 'bold',
        color: '#3b82f6',
    },
    noDataText: {
        color: '#9ca3af',
    },
    horizontalList: {
        paddingHorizontal: 4,
    },
    gridList: {
        paddingHorizontal: 8,
    }
});
