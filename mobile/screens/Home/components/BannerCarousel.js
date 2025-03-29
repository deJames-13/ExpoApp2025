import React, { useState, useRef, useEffect } from 'react';
import { View, Image, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function BannerCarousel({ banners = [] }) {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const bannerRef = useRef(null);
    const itemWidth = width - 32; // Width of each banner item

    useEffect(() => {
        const interval = global.setInterval(() => {
            if (banners.length > 0) {
                const nextIndex = (currentBannerIndex + 1) % banners.length;
                setCurrentBannerIndex(nextIndex);

                bannerRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true,
                });
            }
        }, 3000);

        return () => global.clearInterval(interval);
    }, [currentBannerIndex, banners.length]);

    const renderBannerItem = ({ item }) => (
        <Image
            source={{ uri: item.image }}
            className="rounded-lg overflow-hidden"
            style={{ width: itemWidth, height: 150 }}
            resizeMode="cover"
        />
    );

    return (
        <View className="px-4 mb-6">
            <FlatList
                ref={bannerRef}
                data={banners}
                renderItem={renderBannerItem}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={(data, index) => ({
                    length: itemWidth,
                    offset: itemWidth * index,
                    index,
                })}
                onMomentumScrollEnd={(event) => {
                    const slideIndex = Math.floor(event.nativeEvent.contentOffset.x / itemWidth);
                    setCurrentBannerIndex(slideIndex);
                }}
            />

            {/* Banner Pagination Dots */}
            <View className="flex-row justify-center mt-2">
                {banners.map((_, index) => (
                    <View
                        key={index}
                        className={`h-2 w-2 rounded-full mx-1 ${currentBannerIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                    />
                ))}
            </View>
        </View>
    );
}
