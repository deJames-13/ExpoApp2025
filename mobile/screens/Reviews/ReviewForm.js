import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Switch,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';
import * as ImagePicker from 'expo-image-picker';
import useResource from '~/hooks/useResource';
import ReviewRatingComponent from './ReviewRatingComponent';

const ReviewForm = ({ route, navigation }) => {
    const { order } = route.params || {};
    const user = useSelector(selectCurrentUser);

    // Form state
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [images, setImages] = useState([]);

    // Initialize the review resource
    const reviewApi = useResource({ resourceName: 'reviews', silent: false });
    const { doStore } = reviewApi.actions;
    const { loading } = reviewApi.states;
    const { showSuccess, showError } = reviewApi.toast;

    // Validation state
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (rating === 0) {
            newErrors.rating = 'Please select a rating';
        }

        if (description.trim().length < 5) {
            newErrors.description = 'Review must be at least 5 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        if (!user || !user.id || !order || !order.id) {
            showError('Error', 'User or order information is missing');
            return;
        }

        try {
            const reviewData = {
                rating,
                title: title.trim() || '',
                description: description.trim(),
                isAnonymous,
                order: order.id,
                user: user.id,
                images: [] // We'll handle image upload separately later
            };

            // Create FormData for image upload
            const formData = new FormData();

            // Add review data to FormData
            Object.keys(reviewData).forEach(key => {
                if (key !== 'images') {
                    formData.append(key, reviewData[key]);
                }
            });

            // Add images to FormData if any
            if (images.length > 0) {
                images.forEach((image, index) => {
                    const fileExtension = image.uri.split('.').pop();
                    formData.append('image', {
                        uri: image.uri,
                        type: `image/${fileExtension}`,
                        name: `review_image_${index}.${fileExtension}`
                    });
                });
            }

            const response = await doStore(formData);

            if (response && !response.error) {
                showSuccess('Review Submitted', 'Thank you for your feedback!');
                navigation.goBack();
            } else {
                showError('Submission Failed', 'Please try again later');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            showError('Error', error.message || 'Failed to submit review');
        }
    };

    const pickImage = async () => {
        if (images.length >= 5) {
            Alert.alert('Limit Reached', 'You can add up to 5 images');
            return;
        }

        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need camera roll permission to upload images');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImages([...images, { uri: result.assets[0].uri }]);
        }
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    // Show a confirmation dialog when the user tries to go back
    const handleGoBack = () => {
        if (rating > 0 || title.trim() || description.trim() || images.length > 0) {
            Alert.alert(
                'Discard Review?',
                'Your review hasn\'t been submitted yet. Are you sure you want to discard it?',
                [
                    { text: 'Keep Editing', style: 'cancel' },
                    { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    if (!order) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Order information is missing</Text>
                <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.errorButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Write a Review</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                <View style={styles.orderInfo}>
                    <Text style={styles.orderTitle}>Order #{order.id?.substring(0, 8)}</Text>
                    <Text style={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </Text>

                    {/* Products summary */}
                    <View style={styles.productsSummary}>
                        <Text style={styles.productsTitle}>Products in this order:</Text>
                        {order.products?.map((product, index) => (
                            <View key={index} style={styles.productItem}>
                                <View style={styles.productImageContainer}>
                                    {product.images && product.images[0] ? (
                                        <Image
                                            source={{ uri: product.images[0]?.url }}
                                            style={styles.productImage}
                                        />
                                    ) : (
                                        <View style={styles.productImagePlaceholder} />
                                    )}
                                </View>
                                <Text style={styles.productName} numberOfLines={2}>
                                    {product.name}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Your Overall Rating</Text>
                    <View style={styles.ratingContainer}>
                        <ReviewRatingComponent
                            rating={rating}
                            setRating={setRating}
                            size={40}
                        />
                        {errors.rating && (
                            <Text style={styles.errorText}>{errors.rating}</Text>
                        )}
                    </View>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Review Title (Optional)</Text>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Summarize your experience"
                        value={title}
                        onChangeText={setTitle}
                        maxLength={100}
                    />
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Your Review</Text>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Share your experience with these products"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        textAlignVertical="top"
                        minHeight={120}
                        maxLength={500}
                    />
                    {errors.description && (
                        <Text style={styles.errorText}>{errors.description}</Text>
                    )}
                    <Text style={styles.charCount}>
                        {description.length}/500 characters
                    </Text>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
                    <View style={styles.imagesContainer}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image source={{ uri: image.uri }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        {images.length < 5 && (
                            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                                <Ionicons name="add" size={40} color="#757575" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.imageHint}>
                        You can add up to 5 images
                    </Text>
                </View>

                <View style={styles.formSection}>
                    <View style={styles.anonymousContainer}>
                        <Text style={styles.anonymousText}>Post Anonymously</Text>
                        <Switch
                            value={isAnonymous}
                            onValueChange={setIsAnonymous}
                            trackColor={{ false: '#D1D1D1', true: '#81b0ff' }}
                            thumbColor={isAnonymous ? '#2196F3' : '#f4f3f4'}
                        />
                    </View>
                    <Text style={styles.anonymousHint}>
                        When enabled, your name and photo won't be displayed with your review
                    </Text>
                </View>

                <View style={styles.submitContainer}>
                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (loading || rating === 0) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmit}
                        disabled={loading || rating === 0}
                    >
                        {loading ? (
                            <Text style={styles.submitButtonText}>Submitting...</Text>
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Review</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    orderInfo: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    orderDate: {
        fontSize: 14,
        color: '#757575',
        marginTop: 4,
    },
    productsSummary: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    productsTitle: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    productItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    productImageContainer: {
        width: 40,
        height: 40,
        borderRadius: 4,
        overflow: 'hidden',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productImagePlaceholder: {
        width: '100%',
        height: '100%',
        backgroundColor: '#e0e0e0',
    },
    productName: {
        flex: 1,
        fontSize: 14,
    },
    formSection: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    ratingContainer: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    titleInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
    },
    descriptionInput: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        height: 150,
    },
    charCount: {
        fontSize: 12,
        color: '#757575',
        textAlign: 'right',
        marginTop: 4,
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 8,
        overflow: 'hidden',
        marginRight: 8,
        marginBottom: 8,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 2,
        right: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
    },
    addImageButton: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
    },
    imageHint: {
        fontSize: 12,
        color: '#757575',
        marginTop: 8,
    },
    anonymousContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    anonymousText: {
        fontSize: 16,
        fontWeight: '500',
    },
    anonymousHint: {
        fontSize: 12,
        color: '#757575',
        marginTop: 8,
    },
    submitContainer: {
        marginTop: 16,
    },
    submitButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#B0BEC5',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#F44336',
        fontSize: 12,
        marginTop: 4,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    errorButton: {
        marginTop: 16,
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    errorButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ReviewForm;
