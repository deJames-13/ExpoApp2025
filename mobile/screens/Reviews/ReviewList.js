import React from 'react';
import { View, FlatList, Text, StyleSheet, ActivityIndicator } from 'react-native';
import ReviewCard from './ReviewCard';

const ReviewList = ({
    reviews = [],
    loading = false,
    compact = false,
    onEndReached,
    ListHeaderComponent,
    ListFooterComponent,
    emptyText = 'No reviews yet',
    containerStyle = {}
}) => {
    const renderItem = ({ item }) => (
        <ReviewCard review={item} compact={compact} />
    );

    const renderEmptyComponent = () => {
        if (loading) {
            return (
                <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color="#2196F3" />
                    <Text style={styles.emptyText}>Loading reviews...</Text>
                </View>
            );
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{emptyText}</Text>
                <Text style={styles.emptySubtext}>Be the first to share your thoughts!</Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <FlatList
                data={reviews}
                renderItem={renderItem}
                keyExtractor={(item) => item.id || item._id || Math.random().toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={renderEmptyComponent}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={ListFooterComponent}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.3}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
        paddingBottom: 24,
        flexGrow: 1,
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#757575',
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#9E9E9E',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default ReviewList;
