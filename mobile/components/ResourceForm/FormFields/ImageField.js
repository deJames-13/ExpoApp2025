import React, { useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';
import { styles } from './styles';

export const ImageField = ({
    field,
    label,
    value,
    setFieldValue,
    errors,
    touched,
    disabled = false,
    placeholder = 'Select an image',
    width = 200,
    height = 200,
    ...props
}) => {
    const [loading, setLoading] = useState(false);
    const hasError = touched[field] && errors[field];

    // In a real implementation, this would use expo-image-picker or similar
    const selectImage = async () => {
        if (disabled) return;

        try {
            setLoading(true);

            // Placeholder for image selection logic
            // This would typically use expo-image-picker or react-native-image-picker
            console.log('Image selection would happen here');

            // Simulate a selection with a demo URL (replace with actual selection logic)
            setTimeout(() => {
                setFieldValue(field, 'https://picsum.photos/200');
                setLoading(false);
            }, 1000);

        } catch (error) {
            console.error('Error selecting image:', error);
            setLoading(false);
        }
    };

    const removeImage = () => {
        if (disabled) return;
        setFieldValue(field, null);
    };

    return (
        <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{label}</Text>

            <View style={styles.imageFieldContainer}>
                {value ? (
                    <View style={styles.imagePreviewContainer}>
                        <Image
                            source={{ uri: value }}
                            style={[
                                styles.imagePreview,
                                { width, height }
                            ]}
                            resizeMode="cover"
                        />

                        {!disabled && (
                            <View style={styles.imageActions}>
                                <Button
                                    mode="contained"
                                    onPress={selectImage}
                                    style={styles.imageButton}
                                    icon="camera"
                                    disabled={loading}
                                >
                                    Change
                                </Button>

                                <Button
                                    mode="outlined"
                                    onPress={removeImage}
                                    style={styles.imageButton}
                                    icon="delete"
                                    textColor={adminColors.status.error}
                                    disabled={loading}
                                >
                                    Remove
                                </Button>
                            </View>
                        )}
                    </View>
                ) : (
                    <TouchableOpacity
                        onPress={selectImage}
                        disabled={disabled || loading}
                        style={[
                            styles.imagePickerPlaceholder,
                            { width, height }
                        ]}
                    >
                        {loading ? (
                            <ActivityIndicator size="large" color={adminColors.primary} />
                        ) : (
                            <>
                                <Text style={styles.imagePickerIcon}>📷</Text>
                                <Text style={styles.imagePickerText}>{placeholder}</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {hasError && (
                <Text style={styles.errorText}>{errors[field]}</Text>
            )}
        </View>
    );
};
