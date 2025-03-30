import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import ReviewRatingComponent from './ReviewRatingComponent';

const ReviewCard = ({ review, compact = false }) => {
    if (!review) return null;

    const formatDate = (dateString) => {
        const options = compact
            ? { month: 'short', day: 'numeric' }
            : { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const renderUserInfo = () => {
        if (review.user === 'Anon' || !review.user) {
            return (
                <View style={styles.userInfo}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>A</Text>
                    </View>
                    <Text style={styles.username}>Anonymous</Text>
                </View>
            );
        }

        const userInitial = review.user.full_name?.charAt(0) || review.user.username?.charAt(0) || 'U';

        return (
            <View style={styles.userInfo}>
                {review.user.avatar ? (
                    <Image source={{ uri: review.user.avatar }} style={styles.avatar} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitial}>{userInitial}</Text>
                    </View>
                )}
                <Text style={styles.username}>
                    {review.user.full_name || review.user.username || 'User'}
                </Text>
            </View>
        );
    };

    return (
        <View style={[styles.container, compact && styles.compactContainer]}>
            <View style={styles.header}>
                {renderUserInfo()}
                <Text style={styles.date}>{formatDate(review.createdAt)}</Text>
            </View>

            <View style={styles.ratingContainer}>
                <ReviewRatingComponent
                    rating={review.rating}
                    editable={false}
                    size={compact ? 18 : 24}
                    showLabel={!compact}
                    containerStyle={styles.ratingComponent}
                />
            </View>

            {review.title && !compact && (
                <Text style={styles.title}>{review.title}</Text>
            )}

            {review.description && (
                <Text style={[styles.description, compact && styles.compactDescription]}>
                    {compact && review.description.length > 100
                        ? `${review.description.substring(0, 100)}...`
                        : review.description}
                </Text>
            )}

            {review.images && review.images.length > 0 && !compact && (
                <View style={styles.imagesContainer}>
                    {review.images.map((image, index) => (
                        <Image
                            key={index}
                            source={{ uri: image.url }}
                            style={styles.reviewImage}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    compactContainer: {
        padding: 12,
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    avatarInitial: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#757575',
    },
    username: {
        fontSize: 14,
        fontWeight: '500',
    },
    date: {
        fontSize: 12,
        color: '#757575',
    },
    ratingContainer: {
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    ratingComponent: {
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#424242',
        lineHeight: 20,
    },
    compactDescription: {
        fontSize: 13,
        lineHeight: 18,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
    },
    reviewImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
        marginRight: 8,
        marginBottom: 8,
    },
});

export default ReviewCard;
