import React, { useState, useRef } from 'react';
import {
    View,
    Image,
    StyleSheet,
    Dimensions,
    FlatList,
    TouchableOpacity
} from 'react-native';

const { width } = Dimensions.get('window');

const Carousel = ({
    images = [],
    height = 250,
    defaultImage = null,
    imageResizeMode = 'contain',
    containerStyle = {}
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);

    // If no images are provided, show default image
    const displayImages = images && images.length > 0
        ? images
        : (defaultImage ? [{ secure_url: defaultImage }] : []);

    const renderItem = ({ item }) => {
        return (
            <View style={[styles.imageContainer, { width, height }]}>
                <Image
                    source={{ uri: item.secure_url }}
                    style={styles.image}
                    resizeMode={imageResizeMode}
                />
            </View>
        );
    };

    const handleDotPress = (index) => {
        setActiveIndex(index);
        flatListRef.current?.scrollToIndex({
            animated: true,
            index: index
        });
    };

    // Pagination dots
    const renderPagination = () => {
        // Only show pagination if there's more than one image
        if (displayImages.length <= 1) return null;

        return (
            <View style={styles.paginationContainer}>
                {displayImages.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.paginationDot,
                            index === activeIndex && styles.paginationDotActive
                        ]}
                        onPress={() => handleDotPress(index)}
                    />
                ))}
            </View>
        );
    };

    return (
        <View style={[styles.container, containerStyle]}>
            <FlatList
                ref={flatListRef}
                data={displayImages}
                renderItem={renderItem}
                keyExtractor={(item, index) => `carousel-item-${index}`}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const newIndex = Math.floor(event.nativeEvent.contentOffset.x / width);
                    setActiveIndex(newIndex);
                }}
            />
            {renderPagination()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        backgroundColor: '#fff',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '80%',
        height: '80%',
    },
    paginationContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#2196F3',
    },
});

export default Carousel;
