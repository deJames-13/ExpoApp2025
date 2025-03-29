import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import {
    captureImage,
    createImageObject,
    createFormDataWithImages,
    createRegisterFormData
} from '../utils/imageUpload';

/**
 * Hook to handle image upload workflows
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} Image handling methods and state
 */
export const useImageUpload = (options = {}) => {
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Take a photo using camera
    const handleTakePhoto = useCallback(async (cameraOptions = {}) => {
        try {
            setIsLoading(true);
            const imageUri = await captureImage('camera', cameraOptions);

            if (imageUri) {
                setImage(imageUri);
                return imageUri;
            }

            return null;
        } catch (error) {
            console.error('Error taking photo:', error);
            Toast.show({
                type: 'error',
                text1: 'Camera Error',
                text2: 'Failed to capture image'
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Pick image from library
    const handlePickImage = useCallback(async (pickerOptions = {}) => {
        try {
            setIsLoading(true);
            const imageUri = await captureImage('library', pickerOptions);

            if (imageUri) {
                setImage(imageUri);
                return imageUri;
            }

            return null;
        } catch (error) {
            console.error('Error picking image:', error);
            Toast.show({
                type: 'error',
                text1: 'Image Selection Error',
                text2: 'Failed to select image'
            });
            return null;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create FormData for profile update
    const createProfileFormData = useCallback((userData) => {
        if (!userData) return null;

        return createFormDataWithImages(
            userData,
            image ? { avatar: image } : {}
        );
    }, [image]);

    // Create FormData for registration
    const createUserFormData = useCallback((userData) => {
        if (!userData) return null;

        return createRegisterFormData(userData, image);
    }, [image]);

    // Reset image state
    const resetImage = useCallback(() => {
        setImage(null);
    }, []);

    return {
        image,
        setImage,
        isLoading,
        handleTakePhoto,
        handlePickImage,
        createProfileFormData,
        createUserFormData,
        resetImage
    };
};

export default useImageUpload;
