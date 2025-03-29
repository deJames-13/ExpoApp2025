import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';

/**
 * Helper function to ensure URI is a valid string
 */
const validateUri = (uri) => {
    if (!uri) return null;
    // If uri is an object with a uri property, extract it
    if (typeof uri === 'object' && uri !== null) {
        return uri.uri || uri.path || null;
    }
    // Ensure uri is a string
    return typeof uri === 'string' ? uri : null;
};

/**
 * Component for displaying image previews with action buttons
 */
export const ImagePreviewer = ({
    uri,
    width = 300,
    height = 200,
    disabled = false,
    onChangePress,
    onRetakePress,
    onRemovePress,
    showCamera = false,
    style,
}) => {
    // Validate and normalize the URI
    const validUri = validateUri(uri);

    if (!validUri) {
        return (
            <View style={styles.previewContainer}>
                <View style={[styles.noImageContainer, { width, height }]}>
                    <Text>Invalid image source</Text>
                </View>
                {!disabled && onChangePress && (
                    <View style={styles.actionButtons}>
                        <Button
                            mode="contained"
                            onPress={onChangePress}
                            style={styles.button}
                            icon="upload"
                        >
                            Select Image
                        </Button>
                    </View>
                )}
            </View>
        );
    }

    return (
        <View style={styles.previewContainer}>
            <Image
                source={{ uri: validUri }}
                style={[
                    styles.imagePreview,
                    { width, height },
                    style
                ]}
                resizeMode="cover"
            />

            {!disabled && (
                <View style={styles.actionButtons}>
                    {showCamera && onRetakePress && (
                        <Button
                            mode="contained"
                            onPress={onRetakePress}
                            style={styles.button}
                            icon="camera"
                        >
                            Retake
                        </Button>
                    )}

                    {onChangePress && (
                        <Button
                            mode="contained"
                            onPress={onChangePress}
                            style={styles.button}
                            icon={showCamera ? "upload" : "camera"}
                        >
                            {showCamera ? "Upload" : "Change"}
                        </Button>
                    )}

                    {onRemovePress && (
                        <Button
                            mode="outlined"
                            onPress={onRemovePress}
                            style={styles.button}
                            icon="delete"
                            textColor={adminColors.status.error}
                        >
                            Remove
                        </Button>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    previewContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    imagePreview: {
        borderRadius: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    button: {
        marginHorizontal: 5,
        marginVertical: 5,
    },
    noImageContainer: {
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderStyle: 'dashed',
    },
});
