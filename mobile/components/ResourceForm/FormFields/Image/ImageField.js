import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { ImagePreviewer } from './ImagePreviewer';
import { CameraCapture } from './CameraCapture';

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
    ...props
}) => {
    const [loading, setLoading] = useState(false);
    const [cameraVisible, setCameraVisible] = useState(false);
    const hasError = touched[field] && errors[field];

    // Handle image upload via gallery
    const handleImageUpload = async () => {
        if (disabled) return;

        try {
            setLoading(true);

            // Placeholder for image selection logic
            // This would typically use expo-image-picker or react-native-image-picker
            console.log('Image selection would happen here');

            // Simulate a selection with a demo URL (replace with actual selection logic)
            setTimeout(() => {
                const imageUri = 'https://picsum.photos/200';
                setFieldValue(field, imageUri);
                if (onImageChanged) onImageChanged(imageUri);
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error selecting image:', error);
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
        setFieldValue(field, imageUri);
        if (onImageChanged) onImageChanged(imageUri);
        setCameraVisible(false);
    };

    const handleRemoveImage = () => {
        if (disabled) return;
        setFieldValue(field, null);
        if (onImageChanged) onImageChanged(null);
    };

    // Determine which actions to show based on mode
    const showUploadOption = mode === 'upload' || mode === 'both';
    const showCameraOption = mode === 'camera' || mode === 'both';

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            {value ? (
                // When we have an image, show the ImagePreviewer with appropriate buttons
                <ImagePreviewer
                    uri={value}
                    width={width}
                    height={height}
                    disabled={disabled}
                    onChangePress={showUploadOption ? handleImageUpload : undefined}
                    onRetakePress={showCameraOption ? handleOpenCamera : undefined}
                    onRemovePress={handleRemoveImage}
                    showCamera={showCameraOption}
                />
            ) : (
                // When we don't have an image, show the options (upload/camera)
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
                                    <Text style={styles.placeholderText}>Upload Image</Text>
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
