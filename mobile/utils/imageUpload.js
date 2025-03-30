import { Platform } from 'react-native';
import mime from 'mime';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const isValidUri = (uri) => {
    if (!uri) return false;

    // Check if the URI is a string
    if (typeof uri !== 'string') return false;

    // Check if URI has proper format
    // Validates common image URI patterns:
    // - file:///path/to/file (normalized format)
    // - content://... (Android content URIs)
    // - assets-library://... (iOS photo library)
    // - ph://... (iOS photos framework)
    const validUriPattern = /^(file|content|assets-library|ph):\/\/\/?/;
    return validUriPattern.test(uri);
}

/**
 * Checks if a URI is a remote URL (http/https)
 * 
 * @param {string} uri - The URI to check
 * @returns {boolean} - True if the URI is a remote URL
 */
export const isRemoteUrl = (uri) => {
    if (!uri || typeof uri !== 'string') return false;

    return uri.startsWith('http://') || uri.startsWith('https://');
}

/**
 * Checks if a URI is a Cloudinary URL
 * 
 * @param {string} uri - The URI to check
 * @returns {boolean} - True if the URI is a Cloudinary URL
 */
export const isCloudinaryUrl = (uri) => {
    if (!uri || typeof uri !== 'string') return false;

    // Check for common Cloudinary URL patterns
    return uri.includes('cloudinary.com') ||
        uri.includes('res.cloudinary');
}

/**
 * Normalizes image URI for cross-platform compatibility
 * 
 * @param {string} uri - The image URI to normalize
 * @returns {string} - Normalized URI or null if invalid
 */
export const normalizeImageUri = (uri) => {
    if (!uri) return null;

    // Skip normalization for remote URLs
    if (isRemoteUrl(uri)) {
        return uri;
    }

    // Fix Android-specific issue with file:/ vs file:///
    // Convert all URIs to the format file:///path/to/file
    // If URI is already valid, return it as is
    if (isValidUri(uri)) {
        return uri;
    }
    return "file:///" + uri.split("file:/").join("");
};

/**
 * Gets file name from URI path
 * 
 * @param {string} uri - The image URI
 * @returns {string} - File name or default if none found
 */
export const getFileName = (uri) => {
    if (!uri) return 'image.jpg';
    return uri.split('/').pop() || 'image.jpg';
};

/**
 * Determines MIME type from file extension
 * 
 * @param {string} uri - The image URI
 * @returns {string} - MIME type
 */
export const getMimeType = (uri) => {
    if (!uri) return 'image/jpeg';

    try {
        // Use mime package to get the proper MIME type
        const mimeType = mime.getType(uri);
        return mimeType || 'image/jpeg';
    } catch (e) {
        // Fallback: extract extension and determine MIME type
        const extension = uri.split('.').pop()?.toLowerCase() || 'jpg';
        return `image/${extension === 'jpg' ? 'jpeg' : extension}`;
    }
};

/**
 * Creates image object for FormData
 * 
 * @param {string} uri - Original image URI
 * @param {string} customFileName - Optional custom file name
 * @returns {Object} - Image object to append to FormData or null if URI is invalid
 */
export const createImageObject = (uri, customFileName = null) => {
    if (!uri) return null;

    // For remote URLs, we don't need to create a file object
    // The server should access these directly via the URL
    if (isRemoteUrl(uri)) {
        // If it's already a remote URL (like a Cloudinary URL), return null
        // to skip adding it to FormData as a file
        return null;
    }

    const normalizedUri = normalizeImageUri(uri);
    if (!normalizedUri) return null;

    return {
        uri: normalizedUri,
        name: customFileName || normalizedUri.split("/").pop() || 'image.jpg',
        type: getMimeType(normalizedUri),
    };
};

/**
 * Appends image to FormData
 * 
 * @param {FormData} formData - FormData instance
 * @param {string} fieldName - Name of the field in the form
 * @param {string} imageUri - Image URI
 * @param {string} customFileName - Optional custom file name
 * @returns {FormData} - FormData with image appended
 */
export const appendImageToFormData = (formData, fieldName, imageUri, customFileName = null) => {
    if (!formData || !imageUri) return formData;

    // For remote URLs, just add the URL string directly
    if (isRemoteUrl(imageUri)) {
        console.log(`Remote URL detected for ${fieldName}, adding URL directly`);
        formData.append(fieldName, imageUri);
        return formData;
    }

    const imageObject = createImageObject(imageUri, customFileName);

    if (imageObject) {
        formData.append(fieldName, imageObject);
        console.log(`Image appended to FormData as ${fieldName}:`, {
            uri: imageObject.uri,
            name: imageObject.name,
            type: imageObject.type
        });
    }

    return formData;
};

/**
 * Creates a complete FormData object with JSON data and images
 * 
 * @param {Object} jsonData - JSON data to include in FormData
 * @param {Object} images - Object mapping field names to image URIs
 * @returns {FormData} - Complete FormData object ready for submission
 */
export const createFormDataWithImages = (jsonData = {}, images = {}) => {
    const formData = new FormData();

    // Add JSON data
    if (jsonData && Object.keys(jsonData).length > 0) {
        formData.append('info', JSON.stringify(jsonData));
    }

    // Add images
    if (images && typeof images === 'object') {
        Object.entries(images).forEach(([fieldName, uri]) => {
            if (uri) {
                appendImageToFormData(formData, fieldName, uri);
            }
        });
    }

    return formData;
};

/**
 * Creates a flat FormData object with all fields at the root level
 * Use this when API expects all fields directly in the form data
 * 
 * @param {Object} jsonData - JSON data to include in FormData
 * @param {Object} images - Object mapping field names to image URIs
 * @returns {FormData} - Complete FormData object ready for submission
 */
export const createFlatFormData = (jsonData = {}, images = {}) => {
    const formData = new FormData();

    // Add JSON data fields directly
    if (jsonData && typeof jsonData === 'object') {
        for (const [key, value] of Object.entries(jsonData)) {
            if (value !== null && value !== undefined) {
                // Convert dates or objects to appropriate string representation
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        }
    }

    // Add images
    if (images && typeof images === 'object') {
        Object.entries(images).forEach(([fieldName, uri]) => {
            if (uri) {
                appendImageToFormData(formData, fieldName, uri);
            }
        });
    }

    return formData;
};

/**
 * Converts an image file to base64 string
 * @param {string} uri - Image URI
 * @returns {Promise<string|null>} - Base64 string or null if conversion fails
 */
export const imageToBase64 = async (uri) => {
    if (!uri) return null;

    // Skip conversion for remote URLs
    if (isRemoteUrl(uri)) {
        return uri;
    }

    try {
        // Normalize URI first
        const normalizedUri = normalizeImageUri(uri);
        if (!normalizedUri) return null;

        // Read the file as base64
        const base64 = await FileSystem.readAsStringAsync(normalizedUri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Get the MIME type
        const type = getMimeType(normalizedUri);

        // Return the complete data URL
        return `data:${type};base64,${base64}`;
    } catch (error) {
        console.error('Error converting image to base64:', error);
        return null;
    }
};

/**
 * Creates a hybrid FormData object with both root-level fields and 'info' JSON
 * This ensures compatibility with server endpoints that expect an 'info' field
 * 
 * @param {Object} jsonData - JSON data to include in FormData
 * @param {Object} images - Object mapping field names to image URIs
 * @param {boolean} useBase64 - Whether to convert local images to base64
 * @returns {FormData} - Complete FormData object ready for submission
 */
export const createHybridFormData = async (jsonData = {}, images = {}, useBase64 = true) => {
    const formData = new FormData();

    // Add JSON data as an 'info' field for server compatibility
    if (jsonData && Object.keys(jsonData).length > 0) {
        formData.append('info', JSON.stringify(jsonData));

        // Also add individual fields directly to the form
        for (const [key, value] of Object.entries(jsonData)) {
            if (value !== null && value !== undefined) {
                // Convert dates or objects to appropriate string representation
                if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else if (typeof value === 'object' && !Array.isArray(value)) {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            }
        }
    }

    // Add images
    if (images && typeof images === 'object') {
        for (const [fieldName, uri] of Object.entries(images)) {
            if (!uri) continue;

            // For remote URLs, just pass the URL as a string
            if (isRemoteUrl(uri)) {
                console.log(`Remote URL detected for ${fieldName}, adding URL directly`);
                formData.append(fieldName, uri);
                continue;
            }

            // For local files, convert to base64 if requested
            if (useBase64) {
                const base64Data = await imageToBase64(uri);
                if (base64Data) {
                    console.log(`Converted ${fieldName} to base64`);
                    formData.append(fieldName, base64Data);
                }
            } else {
                // Fall back to the old method if base64 is not requested
                appendImageToFormData(formData, fieldName, uri);
            }
        }
    }

    return formData;
};

/**
 * Capture an image using the device camera
 * 
 * @param {Object} options - Camera options
 * @returns {Promise<string>} - Image URI or null if canceled
 */
export const takePhoto = async (options = {}) => {
    try {
        // Request camera permissions
        const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

        if (cameraPermission.status !== 'granted') {
            console.log('Camera permission denied');
            return null;
        }

        // Launch camera
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: options.allowsEditing || true,
            aspect: options.aspect || [4, 3],
            quality: options.quality || 0.8,
            ...options
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0].uri;
    } catch (error) {
        console.error('Error taking photo:', error);
        return null;
    }
};

/**
 * Pick an image from the device library
 * 
 * @param {Object} options - Image picker options
 * @returns {Promise<string>} - Image URI or null if canceled
 */
export const pickImage = async (options = {}) => {
    try {
        // Request media library permissions
        const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (libraryPermission.status !== 'granted') {
            console.log('Media library permission denied');
            return null;
        }

        // Launch image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: options.allowsEditing || true,
            aspect: options.aspect || [4, 3],
            quality: options.quality || 0.8,
            ...options
        });

        if (result.canceled) {
            return null;
        }

        return result.assets[0].uri;
    } catch (error) {
        console.error('Error picking image:', error);
        return null;
    }
};

/**
 * Create a FormData object from user registration data and image
 * 
 * @param {Object} userData - User data like name, email, etc.
 * @param {string} imageUri - Image URI
 * @returns {FormData} FormData object ready for API submission
 */
export const createRegisterFormData = (userData, imageUri) => {
    const formData = new FormData();

    // Add user data
    Object.entries(userData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            formData.append(key, value);
        }
    });

    // Add image if provided
    if (imageUri) {
        const imageObject = createImageObject(imageUri);
        if (imageObject) {
            formData.append('image', imageObject);
        }
    }

    return formData;
};

/**
 * Complete image capture or selection workflow
 * 
 * @param {('camera'|'library')} source - Source of the image
 * @param {Object} options - Options for the image picker
 * @returns {Promise<string>} - Image URI
 */
export const captureImage = async (source = 'camera', options = {}) => {
    try {
        let imageUri = null;

        if (source === 'camera') {
            imageUri = await takePhoto(options);
        } else {
            imageUri = await pickImage(options);
        }

        return imageUri;
    } catch (error) {
        console.error('Error capturing image:', error);
        return null;
    }
};
