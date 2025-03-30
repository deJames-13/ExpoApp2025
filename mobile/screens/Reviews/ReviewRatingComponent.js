import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReviewRatingComponent = ({
    rating = 0,
    setRating,
    editable = true,
    size = 30,
    showLabel = true,
    containerStyle = {},
    labelStyle = {}
}) => {
    // Convert backend rating (1-10) to frontend stars (1-5)
    const displayRating = Math.round(rating / 2);

    const handlePress = (selectedRating) => {
        if (!editable) return;

        // Convert 5-star UI scale to 1-10 backend scale
        const backendRating = selectedRating * 2;
        setRating(backendRating);
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const name = i <= displayRating ? 'star' : 'star-outline';
            stars.push(
                <TouchableOpacity
                    key={i}
                    onPress={() => handlePress(i)}
                    disabled={!editable}
                    style={{ padding: 2 }}
                >
                    <Ionicons
                        name={name}
                        size={size}
                        color={i <= displayRating ? '#FFD700' : '#CCCCCC'}
                    />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const getRatingText = () => {
        if (rating === 0) return 'Rate this product';
        if (rating <= 2) return 'Poor';
        if (rating <= 4) return 'Below Average';
        if (rating <= 6) return 'Average';
        if (rating <= 8) return 'Good';
        return 'Excellent';
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <View style={styles.starsContainer}>
                {renderStars()}
            </View>
            {showLabel && (
                <Text style={[styles.ratingText, labelStyle]}>
                    {getRatingText()}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    starsContainer: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    ratingText: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
});

export default ReviewRatingComponent;
