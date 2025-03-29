import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, Alert, Linking, Dimensions, StatusBar } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, IconButton, ActivityIndicator, Portal } from 'react-native-paper';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as IntentLauncher from 'expo-intent-launcher';
import { Camera } from 'expo-camera';
import * as Application from 'expo-application';
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
    quality = 0.7,
    maxWidth = 1200,
    placeholder = 'Take a photo',
    previewWidth = 300,
    previewHeight = 300,
    onImageCaptured,
    ...props
}) => {
    const [permission, setPermission] = useState(null);
    const [cameraVisible, setCameraVisible] = useState(false);
    const [facing, setFacing] = useState('back');
    const [flash, setFlash] = useState('off');
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null);
    const hasError = touched[field] && errors[field];
    const isMounted = useRef(true);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        };
    }, []);

    const requestPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setPermission({ granted: status === 'granted' });
    };

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

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                { data: 'package:' + Application.applicationId }
            ).catch(() => {
                Linking.openSettings();
            });
        }
    };

    const openCamera = async () => {
        if (disabled) return;

        if (!permission?.granted) {
            await requestPermission();
            if (!permission?.granted) {
                showPermissionAlert();
                return;
            }
        }

        setCameraVisible(true);
    };

    const closeCamera = () => {
        setCameraVisible(false);
    };

    const toggleCameraFacing = () => {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlash(current => (current === 'off' ? 'on' : 'off'));
    };

    const takePicture = async () => {
        if (!cameraRef.current) {
            console.error("Camera reference is not available");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                global.setTimeout(() => reject(new Error('Camera timeout')), 10000)
            );

            // Race the camera capture against a timeout
            const photo = await Promise.race([
                cameraRef.current.takePictureAsync({ quality }),
                timeoutPromise
            ]);

            console.log("Photo captured:", photo.uri);

            // Process the image
            const manipulatedImage = await manipulateAsync(
                photo.uri,
                [{ resize: { width: maxWidth } }],
                { compress: quality, format: SaveFormat.JPEG }
            );

            console.log("Image processed:", manipulatedImage.uri);

            // Update form and UI
            setFieldValue(field, manipulatedImage.uri);

            if (onImageCaptured) {
                onImageCaptured(manipulatedImage);
            }

            // Use setTimeout to ensure state updates before camera closes
            global.setTimeout(() => {
                closeCamera();
                setLoading(false);
            }, 100);

        } catch (error) {
            console.error("Error taking picture:", error);
            Alert.alert(
                "Camera Error",
                "Failed to capture image. Please try again.",
                [{ text: "OK" }]
            );
            setLoading(false);
        }
    };

    const removeImage = () => {
        if (disabled) return;
        setFieldValue(field, null);
    };

    if (!permission) {
        return (
            <View style={formStyles.fieldContainer}>
                <Text style={formStyles.fieldLabel}>{label}</Text>
                <View style={[styles.permissionError, { width: previewWidth, height: previewHeight }]}>
                    <ActivityIndicator size="large" color={adminColors.primary} />
                    <Text style={[styles.permissionErrorText, { marginTop: 16 }]}>
                        Checking camera permissions...
                    </Text>
                </View>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={formStyles.fieldContainer}>
                <Text style={formStyles.fieldLabel}>{label}</Text>
                <View style={[styles.permissionError, { width: previewWidth, height: previewHeight }]}>
                    <Text style={styles.permissionErrorText}>
                        Camera access is required to use this feature.
                    </Text>
                    <Button
                        mode="contained"
                        onPress={requestPermission}
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

    if (cameraVisible) {
        return (
            <Portal>
                <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
                <View style={styles.fullScreenContainer}>
                    <CameraView
                        ref={cameraRef}
                        style={styles.camera}
                        facing={facing}
                        flash={flash}
                        onMountError={(error) => {
                            console.error("Camera mount error:", error);
                            Alert.alert("Camera Error", "Failed to initialize camera. Please try again.");
                            closeCamera();
                        }}
                    >
                        <View style={styles.cameraOverlay}>
                            <View style={styles.captureFrameContainer}>
                                <View style={styles.captureFrame} />
                            </View>

                            <View style={styles.controlsContainer}>
                                <IconButton
                                    icon="close"
                                    size={30}
                                    iconColor="#fff"
                                    style={styles.controlButton}
                                    onPress={closeCamera}
                                />

                                <IconButton
                                    icon={flash === 'off' ? "flash-off" : "flash"}
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
                                    onPress={toggleCameraFacing}
                                />
                            </View>

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
                    </CameraView>
                </View>
            </Portal>
        );
    }

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

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const styles = StyleSheet.create({
    fullScreenContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        zIndex: 9999,
    },
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
    captureFrameContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureFrame: {
        width: Math.min(windowWidth * 0.7, windowHeight * 0.7),
        aspectRatio: 1,
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 10,
    },
    controlsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    controlButton: {
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    captureButtonContainer: {
        alignItems: 'center',
        marginBottom: 40,
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