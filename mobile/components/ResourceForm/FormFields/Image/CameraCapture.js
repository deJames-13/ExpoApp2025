import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions, StatusBar, Alert, Platform, Linking } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { IconButton, ActivityIndicator, Portal, Text, Button } from 'react-native-paper';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as IntentLauncher from 'expo-intent-launcher';
import { adminColors } from '~/styles/adminTheme';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

/**
 * Component for capturing images using the device camera
 */
export const CameraCapture = ({
    onCapture,
    onClose,
    quality = 0.7,
    maxWidth = 1200,
    aspectRatio = 1,
}) => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [flash, setFlash] = useState('off');
    const [loading, setLoading] = useState(false);
    const cameraRef = useRef(null);

    const showPermissionAlert = () => {
        Alert.alert(
            "Camera Permission Required",
            "This feature needs camera access to take photos. Please enable camera permissions in your device settings.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Open Settings", onPress: openSettings }
            ]
        );
    };

    const openSettings = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
        } else {
            IntentLauncher.startActivityAsync(
                IntentLauncher.ActivityAction.APPLICATION_DETAILS_SETTINGS,
                { data: 'package:' + expo.applicationId }
            ).catch(() => {
                Linking.openSettings();
            });
        }
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
            return;
        }

        try {
            setLoading(true);

            // Add timeout to prevent infinite loading
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Camera timeout')), 10000)
            );

            // Race the camera capture against a timeout
            const photo = await Promise.race([
                cameraRef.current.takePictureAsync({ quality }),
                timeoutPromise
            ]);

            // Process the image
            const manipulatedImage = await manipulateAsync(
                photo.uri,
                [{ resize: { width: maxWidth } }],
                { compress: quality, format: SaveFormat.JPEG }
            );

            // Call the onCapture callback with the processed image
            onCapture(manipulatedImage.uri);
            setLoading(false);

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

    if (!permission) {
        return (
            <View style={styles.permissionContainer}>
                <ActivityIndicator size="large" color={adminColors.primary} />
                <Text style={{ marginTop: 16 }}>Checking camera permissions...</Text>
            </View>
        );
    }

    if (!permission.granted) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>
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
        );
    }

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
                        onClose();
                    }}
                >
                    <View style={styles.cameraOverlay}>
                        <View style={styles.captureFrameContainer}>
                            <View
                                style={[
                                    styles.captureFrame,
                                    { aspectRatio: aspectRatio }
                                ]}
                            />
                        </View>

                        <View style={styles.controlsContainer}>
                            <IconButton
                                icon="close"
                                size={30}
                                iconColor="#fff"
                                style={styles.controlButton}
                                onPress={onClose}
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
};

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
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    permissionText: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 16,
    },
    permissionButton: {
        width: '80%',
    },
});
