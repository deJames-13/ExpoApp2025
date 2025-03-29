import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Button, Text, IconButton } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';

const { width: windowWidth } = Dimensions.get('window');

/**
 * Helper function to ensure URI is a valid string
 */
const validateUri = (uri) => {
    if (!uri) return null;
    // If uri is an object with a uri property, extract it
    if (typeof uri === 'object' && uri !== null) {
        return uri.uri || uri.path || null;
    }
    // Ensure uri is a string
    return typeof uri === 'string' ? uri : null;
};

/**
 * Component for displaying multiple image previews with navigation and action buttons
 */
export const MultiImagePreviewer = ({
    uris = [],
    width = 300,
    height = 200,
    disabled = false,
    onAddMorePress,
    onCameraPress,
    onRemovePress,
    showCamera = false,
    style,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollViewRef = React.useRef(null);

    // Filter out invalid URIs and normalize them
    const validUris = uris
        .map(validateUri)
        .filter(uri => uri !== null);

    // Update activeIndex if it's out of bounds after filtering
    if (validUris.length <= activeIndex && validUris.length > 0) {
        setActiveIndex(validUris.length - 1);
    }

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        if (currentIndex !== activeIndex) {
            setActiveIndex(currentIndex);
        }
    };

    const scrollToImage = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: index * width,
                animated: true
            });
        }
    };

    // If no valid URIs, show a placeholder
    if (validUris.length === 0) {
        return (
            <View style={styles.previewContainer}>
                <View style={[styles.noImageContainer, { width, height }]}>
                    <Text>No valid images found</Text>
                    {!disabled && (
                        <View style={styles.actionButtons}>
                            {onAddMorePress && (
                                <Button
                                    mode="contained"
                                    onPress={onAddMorePress}
                                    style={styles.button}
                                    icon="image-multiple"
                                >
                                    Add Images
                                </Button>
                            )}
                        </View>
                    )}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.previewContainer}>
            <View style={[styles.carouselContainer, { width, height }]}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={{ width, height }}
                    contentContainerStyle={{ width: width * validUris.length }}
                >
                    {validUris.map((uri, index) => (
                        <View key={`image-${index}`} style={{ width, height }}>
                            <Image
                                source={{ uri }}
                                style={[styles.imagePreview, { width, height }]}
                                resizeMode="cover"
                            />
                            {!disabled && (
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => onRemovePress(index)}
                                >
                                    <IconButton
                                        icon="close-circle"
                                        size={24}
                                        iconColor="#fff"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}
                </ScrollView>

                {validUris.length > 1 && (
                    <View style={styles.pagination}>
                        {validUris.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    activeIndex === index && styles.paginationDotActive
                                ]}
                                onPress={() => scrollToImage(index)}
                            />
                        ))}
                    </View>
                )}
            </View>

            <Text style={styles.imageCounter}>
                {activeIndex + 1} of {validUris.length} images
            </Text>

            {!disabled && (
                <View style={styles.actionButtons}>
                    {onAddMorePress && (
                        <Button
                            mode="contained"
                            onPress={onAddMorePress}
                            style={styles.button}
                            icon="image-multiple"
                        >
                            Add More
                        </Button>
                    )}

                    {showCamera && onCameraPress && (
                        <Button
                            mode="contained"
                            onPress={onCameraPress}
                            style={styles.button}
                            icon="camera"
                        >
                            Camera
                        </Button>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    carouselContainer: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 8,
    },
    imagePreview: {
        borderRadius: 8,
    },
    pagination: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        margin: 3,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    imageCounter: {
        marginTop: 5,
        fontSize: 12,
        color: '#666',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    button: {
        marginHorizontal: 5,
        marginVertical: 5,
    },
    removeButton: {
        position: 'absolute',
        top: 0,
        right: 0,
        zIndex: 10,
    },
    noImageContainer: {
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
});
