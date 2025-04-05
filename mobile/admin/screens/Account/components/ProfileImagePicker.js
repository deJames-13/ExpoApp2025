import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { takePhoto, pickImage, isRemoteUrl } from '~/utils/imageUpload';
import { adminColors } from '~/styles/adminTheme';

export function ProfileImagePicker({ value, onChange, style }) {
    const handleImageSelection = () => {
        Alert.alert(
            "Profile Picture",
            "Choose a profile picture",
            [
                {
                    text: "Take Photo",
                    onPress: () => captureImage('camera'),
                },
                {
                    text: "Choose from Gallery",
                    onPress: () => captureImage('gallery'),
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const captureImage = async (source) => {
        try {
            let imageUri;
            
            if (source === 'camera') {
                imageUri = await takePhoto({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            } else {
                imageUri = await pickImage({
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8,
                });
            }

            if (imageUri) {
                onChange(imageUri);
            }
        } catch (error) {
            console.error('Error selecting image:', error);
            Alert.alert('Error', 'Failed to select image');
        }
    };

    const handleRemoveImage = () => {
        Alert.alert(
            "Remove Image",
            "Are you sure you want to remove your profile picture?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Remove",
                    onPress: () => onChange(null),
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <View style={[styles.container, style]}>
            {value ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: value }}
                        style={styles.image}
                    />
                    <View style={styles.imageActions}>
                        <Button
                            mode="outlined"
                            icon="camera"
                            onPress={handleImageSelection}
                            style={styles.actionButton}
                        >
                            Change
                        </Button>
                        <Button
                            mode="outlined"
                            icon="delete"
                            onPress={handleRemoveImage}
                            style={[styles.actionButton, styles.removeButton]}
                            textColor={adminColors.status.error}
                        >
                            Remove
                        </Button>
                    </View>
                </View>
            ) : (
                <TouchableOpacity 
                    style={styles.placeholder} 
                    onPress={handleImageSelection}
                >
                    <MaterialCommunityIcons
                        name="camera-plus"
                        size={40}
                        color={adminColors.text.light}
                    />
                    <Text style={styles.placeholderText}>
                        Add Profile Picture
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginVertical: 20,
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 3,
        borderColor: adminColors.primary,
    },
    placeholder: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: adminColors.background,
        borderWidth: 2,
        borderColor: adminColors.border,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        marginTop: 8,
        color: adminColors.text.light,
        textAlign: 'center',
    },
    imageActions: {
        flexDirection: 'row',
        marginTop: 12,
    },
    actionButton: {
        marginHorizontal: 6,
    },
    removeButton: {
        borderColor: adminColors.status.error,
    },
});
