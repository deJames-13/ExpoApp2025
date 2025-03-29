import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, Linking } from 'react-native';
import { Camera } from 'expo-camera';
import { Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as IntentLauncher from 'expo-intent-launcher';
import { adminColors } from '~/styles/adminTheme';
import { styles as formStyles } from './styles';

export const CameraField = ({
    field,
    label,
    value,
    setFieldValue,
    errors,
    touched,
    disabled = false,
    aspectRatio = 1,
    quality = 0.7, // Image quality (0 to 1)
    maxWidth = 1200, // Max width for resizing
    placeholder = 'Take a photo',
    previewWidth = 300,
    previewHeight = 300,
    onImageCaptured,
    ...props
}) => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null);
    const hasError = touched[field] && errors[field];

    // Request camera permissions
    const requestPermissions = async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');

            if (status !== 'granted') {
                showPermissionAlert();
            }
        } catch (error) {
            console.error("Error requesting camera permissions:", error);
            setHasPermission(false);
        }
    };

    useEffect(() => {
        requestPermissions();
    }, []);

    // Show alert when permission is denied
    const showPermissionAlert = () => {
        Alert.alert(
            "Camera Permission Required",
            "This feature needs camera access to take photos. Please enable camera permissions in your device settings.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Open Settings",
                    onPress: openSettings
                }
            ]
        );
    };

    // Open device settings to enable permissions
    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            // For Android
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                { data: 'package:' + expo.applicationId }
            ).catch(() => {
                // If the above fails, try this as fallback
                Linking.openSettings();
            });
        }
    };

    const openCamera = () => {
        if (disabled) return;

        if (hasPermission === null) {
            // If permission state is unknown, re-request
            requestPermissions();
            return;
        }

        if (hasPermission === false) {
            showPermissionAlert();
            return;
        }

        setCameraVisible(true);
    };

    const closeCamera = () => {
        setCameraVisible(false);
    };

    const toggleCameraType = () => {
        setType(
            type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
        );
    };

    const toggleFlash = () => {
        setFlash(
            flash === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
        );
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                setLoading(true);
                const photo = await cameraRef.current.takePictureAsync({
                    quality,
                    skipProcessing: true, // Skip additional processing for speed
                });

                // Resize and compress image
                const manipulatedImage = await manipulateAsync(
                    photo.uri,
                    [{ resize: { width: maxWidth } }],
                    { compress: quality, format: SaveFormat.JPEG }
                );

                // Set the field value with the image URI
                setFieldValue(field, manipulatedImage.uri);

                // Call optional callback with the full image object
                if (onImageCaptured) {
                    onImageCaptured(manipulatedImage);
                }

                // Close the camera view
                closeCamera();
                setLoading(false);
            } catch (error) {
                console.error("Error taking picture:", error);
                setLoading(false);
            }
        }
    };

    const removeImage = () => {
        if (disabled) return;
        setFieldValue(field, null);
    };

    // Return permission error message if camera permission not granted
    if (hasPermission === false) {
        return (
            <View style={formStyles.fieldContainer}>
                <Text style={formStyles.fieldLabel}>{label}</Text>
                <View style={[styles.permissionError, { width: previewWidth, height: previewHeight }]}>
                    <Text style={styles.permissionErrorText}>
                        Camera access is required to use this feature.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={requestPermissions}
                        style={styles.permissionButton}
                    >
                        Request Permission
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={openSettings}
                        style={[styles.permissionButton, { marginTop: 10 }]}
                    >
                        Open Settings
                    </Button>
                </View>
                {hasError && (
                    <Text style={formStyles.errorText}>{errors[field]}</Text>
                )}
            </View>
        );
    }

    // Camera view when active
    if (cameraVisible) {
        return (
            <View style={styles.cameraContainer}>
                {hasPermission === null ? (
                    <ActivityIndicator size="large" color={adminColors.primary} />
                ) : (
                    <>
                        <Camera
                            ref={cameraRef}
                            style={styles.camera}
                            type={type}
                            flashMode={flash}
                            ratio={aspectRatio === 1 ? "1:1" : "4:3"}
                        >
                            <View style={styles.cameraOverlay}>
                                {/* Transparent capture frame */}
                                <View style={styles.captureFrame} />

                                {/* Camera controls */}
                                <View style={styles.controlsContainer}>
                                    <IconButton
                                        icon="close"
                                        size={30}
                                        iconColor="#fff"
                                        style={styles.controlButton}
                                        onPress={closeCamera}
                                    />

                                    <IconButton
                                        icon={flash === Camera.Constants.FlashMode.off ? "flash-off" : "flash"}
                                        size={30}
                                        iconColor="#fff"
                                        style={styles.controlButton}
                                        onPress={toggleFlash}
                                    />

                                    <IconButton
                                        icon="camera-flip"
                                        size={30}
                                        iconColor="#fff"
                                        style={styles.controlButton}
                                        onPress={toggleCameraType}
                                    />
                                </View>

                                {/* Capture button */}
                                <View style={styles.captureButtonContainer}>
                                    <TouchableOpacity
                                        style={styles.captureButton}
                                        onPress={takePicture}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator size="small" color="#fff" />
                                        ) : (
                                            <View style={styles.captureButtonInner} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Camera>
                    </>
                )}
            </View>
        );
    }

    // Regular field view with preview or placeholder
    return (
        <View style={formStyles.fieldContainer}>
            <Text style={formStyles.fieldLabel}>{label}</Text>

            <View style={formStyles.imageFieldContainer}>
                {value ? (
                    <View style={formStyles.imagePreviewContainer}>
                        <Image
                            source={{ uri: value }}
                            style={[
                                formStyles.imagePreview,
                                { width: previewWidth, height: previewHeight }
                            ]}
                            resizeMode="cover"
                        />

                        {!disabled && (
                            <View style={formStyles.imageActions}>
                                <Button
                                    mode="contained"
                                    onPress={openCamera}
                                    style={formStyles.imageButton}
                                    icon="camera"
                                >
                                    Retake
                                </Button>

                                <Button
                                    mode="outlined"
                                    onPress={removeImage}
                                    style={formStyles.imageButton}
                                    icon="delete"
                                    textColor={adminColors.status.error}
                                >
                                    Remove
                                </Button>
                            </View>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={openCamera}
                        disabled={disabled}
                        style={[
                            formStyles.imagePickerPlaceholder,
                            { width: previewWidth, height: previewHeight }
                        ]}
                    >
                        <Text style={formStyles.imagePickerIcon}>📷</Text>
                        <Text style={formStyles.imagePickerText}>{placeholder}</Text>
                    </TouchableOpacity>
                )}
            </View>

            {hasError && (
                <Text style={formStyles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: '#000',
    },
    camera: {
        flex: 1,
    },
    cameraOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'space-between',
    },
    captureFrame: {
        width: '70%',
        aspectRatio: 1,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: '25%',
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    captureButtonContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButtonInner: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
    },
    permissionError: {
        backgroundColor: '#f8d7da',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionErrorText: {
        color: '#721c24',
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 16,
    },
    permissionButton: {
        width: '80%',
    },
});