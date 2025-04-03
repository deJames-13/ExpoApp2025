import React, { useState, useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity
} from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width - 32; // Full width minus padding

export const ProductImageGallery = ({ images = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    // If no images, show placeholder
    if (!images || images.length === 0) {
        return (
            <View style={styles.placeholderContainer}>
                <Text style={styles.placeholderText}>No images available</Text>
            </View>
        );
    }

    // Normalize image URLs to handle different formats
    const normalizedImages = images.map(image => {
        if (typeof image === 'string') {
            return { url: image };
        } else if (image && image.url) {
            return image;
        } else if (image && image.uri) {
            return { url: image.uri };
        }
        return { url: null };
    });

    // Handle image errors
    const handleImageError = (index) => {
        console.log(`Failed to load image at index ${index}`);
    };

    // Render each image item
    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.imageContainer}>
                {item.url ? (
                    <Image
                        source={{ uri: item.url }}
                        style={styles.image}
                        resizeMode="contain"
                        onError={() => handleImageError(index)}
                        // Show loading indicator while image loads
                        loadingIndicatorSource={() => (
                            <ActivityIndicator animating={true} color={adminColors.primary} />
                        )}
                    />
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Image not available</Text>
                    </View>
                )}
            </View>
        );
    };

    // Handle pagination dot press
    const scrollToIndex = (index) => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
                index,
                animated: true,
            });
            setActiveIndex(index);
        }
    };

    // Create pagination dots
    const renderPaginationDots = () => {
        return (
            <View style={styles.paginationContainer}>
                {normalizedImages.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeIndex && styles.paginationDotActive
                        ]}
                        onPress={() => scrollToIndex(index)}
                    />
                ))}
            </View>
        );
    };

    // Handle scroll events to update active index
    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / ITEM_WIDTH);
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={normalizedImages}
                renderItem={renderItem}
                keyExtractor={(_, index) => `image-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="center"
                decelerationRate="fast"
            />
            {normalizedImages.length > 1 && renderPaginationDots()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    imageContainer: {
        width: ITEM_WIDTH,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#BBBBBB',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: adminColors.primary,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    placeholderContainer: {
        width: '100%',
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        marginBottom: 16,
    },
    placeholderText: {
        color: '#999',
        fontSize: 16,
    },
    errorContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        color: '#999',
        fontSize: 14,
    },
});
