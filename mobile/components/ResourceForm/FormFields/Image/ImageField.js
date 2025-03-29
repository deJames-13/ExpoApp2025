import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import { adminColors } from '~/styles/adminTheme';
import { ImagePreviewer } from './ImagePreviewer';
import { MultiImagePreviewer } from './MultiImagePreviewer';
import { CameraCapture } from './CameraCapture';

/**
 * Helper function to ensure URI is a valid string
 */
const validateUri = (uri) => {
    if (!uri) return null;
    if (typeof uri === 'object' && uri !== null) {
        return uri.uri || uri.path || null;
    }
    return typeof uri === 'string' ? uri : null;
};

/**
 * Unified ImageField component that supports both upload and camera capture
 */
export const ImageField = ({
    field,
    label,
    value,
    setFieldValue,
    errors,
    touched,
    disabled = false,
    placeholder = 'Select an image',
    width = 300,
    height = 200,
    mode = 'upload', // 'upload', 'camera', or 'both'
    quality = 0.7,
    maxWidth = 1200,
    aspectRatio = 4 / 3,
    onImageChanged,
    multiple = false,
    ...props
}) => {
    const [loading, setLoading] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const hasError = touched[field] && errors[field];

    // Handle image upload via gallery
    const handleImageUpload = async () => {
        if (disabled) return;

        try {
            // Request permission to access the photo library
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissionResult.granted) {
                Alert.alert(
                    "Permission Required",
                    "You need to grant access to your photo library to upload images.",
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Open Settings",
                            onPress: () => {
                                Platform.OS === 'ios'
                                    ? Linking.openURL('app-settings:')
                                    : Linking.openSettings();
                            }
                        }
                    ]
                );
                return;
            }

            setLoading(true);

            // Launch the image picker with multiple selection if enabled
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: !multiple,
                aspect: [aspectRatio === 1 ? 1 : 4, aspectRatio === 1 ? 1 : 3],
                quality: quality,
                allowsMultipleSelection: multiple,
            });

            if (!result.canceled) {
                if (multiple) {
                    // Process multiple images
                    const processedImages = await Promise.all(
                        result.assets.map(async (asset) => {
                            if (maxWidth && asset.width > maxWidth) {
                                const manipResult = await manipulateAsync(
                                    asset.uri,
                                    [{ resize: { width: maxWidth } }],
                                    { compress: quality, format: SaveFormat.JPEG }
                                );

                                // Check file size and compress if needed
                                const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
                                if (fileInfo.size > 5 * 1024 * 1024) {
                                    const compressedResult = await manipulateAsync(
                                        manipResult.uri,
                                        [],
                                        { compress: 0.5, format: SaveFormat.JPEG }
                                    );
                                    return compressedResult.uri;
                                }
                                return manipResult.uri;
                            }
                            return asset.uri;
                        })
                    );

                    // Update with the new array of image URIs
                    const currentImages = Array.isArray(value) ? value : (value ? [value] : []);
                    const updatedImages = [...currentImages, ...processedImages];
                    setFieldValue(field, updatedImages);
                    if (onImageChanged) onImageChanged(updatedImages);
                } else {
                    // Original single image process
                    const selectedAsset = result.assets[0];

                    // Process the image - resize if too large
                    if (maxWidth && selectedAsset.width > maxWidth) {
                        const manipResult = await manipulateAsync(
                            selectedAsset.uri,
                            [{ resize: { width: maxWidth } }],
                            { compress: quality, format: SaveFormat.JPEG }
                        );

                        // Check file size - if over 5MB, compress further
                        const fileInfo = await FileSystem.getInfoAsync(manipResult.uri);
                        if (fileInfo.size > 5 * 1024 * 1024) {
                            // Further compress if large
                            const compressedResult = await manipulateAsync(
                                manipResult.uri,
                                [],
                                { compress: 0.5, format: SaveFormat.JPEG }
                            );
                            setFieldValue(field, compressedResult.uri);
                            if (onImageChanged) onImageChanged(compressedResult.uri);
                        } else {
                            setFieldValue(field, manipResult.uri);
                            if (onImageChanged) onImageChanged(manipResult.uri);
                        }
                    } else {
                        // Use original if small enough
                        setFieldValue(field, selectedAsset.uri);
                        if (onImageChanged) onImageChanged(selectedAsset.uri);
                    }
                }
            }

            setLoading(false);
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert("Error", "Failed to select image. Please try again.");
            setLoading(false);
        }
    };

    // Handle image capture via camera
    const handleOpenCamera = () => {
        setCameraVisible(true);
    };

    const handleCloseCamera = () => {
        setCameraVisible(false);
    };

    const handleCaptureImage = (imageUri) => {
        const validUri = validateUri(imageUri);
        if (!validUri) {
            console.error("Invalid image URI captured");
            return;
        }

        if (multiple) {
            // Add captured image to the existing array
            const currentImages = Array.isArray(value) ? value : (value ? [value] : []);
            // Validate existing images
            const validCurrentImages = currentImages
                .map(validateUri)
                .filter(uri => uri !== null);

            const updatedImages = [...validCurrentImages, validUri];
            setFieldValue(field, updatedImages);
            if (onImageChanged) onImageChanged(updatedImages);
        } else {
            setFieldValue(field, validUri);
            if (onImageChanged) onImageChanged(validUri);
        }
        setCameraVisible(false);
    };

    const handleRemoveImage = (index) => {
        if (disabled) return;

        if (multiple && Array.isArray(value)) {
            // Remove specific image from array
            const updatedImages = value.filter((_, i) => i !== index);
            setFieldValue(field, updatedImages.length > 0 ? updatedImages : null);
            if (onImageChanged) onImageChanged(updatedImages.length > 0 ? updatedImages : null);
        } else {
            // Clear single image
            setFieldValue(field, null);
            if (onImageChanged) onImageChanged(null);
        }
    };

    // Determine which actions to show based on mode
    const showUploadOption = mode === 'upload' || mode === 'both';
    const showCameraOption = mode === 'camera' || mode === 'both';

    const hasImages = multiple ?
        (Array.isArray(value) && value.length > 0 && value.some(uri => validateUri(uri) !== null)) :
        !!validateUri(value);

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            {hasImages ? (
                // Show appropriate previewer based on multiple flag
                multiple ? (
                    <MultiImagePreviewer
                        uris={Array.isArray(value) ? value : [value]}
                        width={width}
                        height={height}
                        disabled={disabled}
                        onAddMorePress={handleImageUpload}
                        onCameraPress={showCameraOption ? handleOpenCamera : undefined}
                        onRemovePress={handleRemoveImage}
                        showCamera={showCameraOption}
                    />
                ) : (
                    <ImagePreviewer
                        uri={value}
                        width={width}
                        height={height}
                        disabled={disabled}
                        onChangePress={showUploadOption ? handleImageUpload : undefined}
                        onRetakePress={showCameraOption ? handleOpenCamera : undefined}
                        onRemovePress={() => handleRemoveImage(0)}
                        showCamera={showCameraOption}
                    />
                )
            ) : (
                // When we don't have images, show the options (upload/camera)
                <View style={styles.optionsContainer}>
                    {showUploadOption && (
                        <TouchableOpacity
                            onPress={handleImageUpload}
                            disabled={disabled || loading}
                            style={[
                                styles.imagePlaceholder,
                                {
                                    width,
                                    height: showCameraOption ? height / 2 - 5 : height
                                }
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator size="large" color={adminColors.primary} />
                            ) : (
                                <>
                                    <Text style={styles.placeholderIcon}>📤</Text>
                                    <Text style={styles.placeholderText}>
                                        {multiple ? "Upload Images" : "Upload Image"}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    )}

                    {showCameraOption && (
                        <TouchableOpacity
                            onPress={handleOpenCamera}
                            disabled={disabled}
                            style={[
                                styles.imagePlaceholder,
                                {
                                    width,
                                    height: showUploadOption ? height / 2 - 5 : height
                                }
                            ]}
                        >
                            <Text style={styles.placeholderIcon}>📷</Text>
                            <Text style={styles.placeholderText}>Take Photo</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}

            {/* Show camera UI when cameraVisible is true */}
            {cameraVisible && (
                <CameraCapture
                    onCapture={handleCaptureImage}
                    onClose={handleCloseCamera}
                    quality={quality}
                    maxWidth={maxWidth}
                    aspectRatio={aspectRatio}
                />
            )}

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    imagePlaceholder: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
        marginBottom: 10,
    },
    placeholderIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    placeholderText: {
        fontSize: 14,
        color: '#666',
    },
    errorText: {
        color: adminColors.status.error,
        fontSize: 12,
        marginTop: 4,
    },
});
