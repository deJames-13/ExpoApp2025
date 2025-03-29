import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { adminColors } from '~/styles/adminTheme';

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
    return (
        <View style={styles.previewContainer}>
            <Image
                source={{ uri }}
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
    }
});
