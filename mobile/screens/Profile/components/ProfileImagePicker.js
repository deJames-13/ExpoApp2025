import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Text } from 'react-native-paper';

export function ProfileImagePicker({ imageUri, onImageSelected }) {
    const [image, setImage] = useState(imageUri);

    const requestPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
                return false;
            }
            return true;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const selectedImage = result.assets[0];
            setImage(selectedImage.uri);
            onImageSelected(selectedImage);
        }
    };

    const takePhoto = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
                return;
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const selectedImage = result.assets[0];
            setImage(selectedImage.uri);
            onImageSelected(selectedImage);
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            'Profile Picture',
            'Choose an option',
            [
                { text: 'Take Photo', onPress: takePhoto },
                { text: 'Choose from Library', onPress: pickImage },
                { text: 'Cancel', style: 'cancel' },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={showImageOptions} style={styles.imageContainer}>
                {image ? (
                    <Image source={{ uri: image }} style={styles.image} />
                ) : (
                    <View style={styles.placeholderContainer}>
                        <MaterialCommunityIcons name="account" size={80} color="#aaa" />
                    </View>
                )}
                <View style={styles.editBadge}>
                    <MaterialCommunityIcons name="camera" size={16} color="#fff" />
                </View>
            </TouchableOpacity>
            <Text style={styles.helpText}>Tap to change profile picture</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 20,
    },
    imageContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 10,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        backgroundColor: '#f3f4f6',
    },
    placeholderContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
        backgroundColor: '#f1f1f1',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3b82f6',
        width: 34,
        height: 34,
        borderRadius: 17,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    helpText: {
        color: '#666',
        fontSize: 14,
    },
});
