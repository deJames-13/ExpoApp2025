import React from 'react';
import { StyleSheet, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Modal, Portal, Text, Button, Surface } from 'react-native-paper';
import { adminColors } from '../../styles/adminTheme';

const { width, height } = Dimensions.get('window');

export function ResourceModal({
    visible = false,
    onDismiss,
    title,
    children,
    footer,
    showFooter = true,
    footerActions = [],
    containerStyle,
    headerStyle,
    bodyStyle,
    footerStyle,
    verticalAlign = 'center',
    dismissable = true,
    onBackdropPress
}) {
    const getContainerStyle = () => {
        switch (verticalAlign) {
            case 'top':
                return { justifyContent: 'flex-start', paddingTop: 50 };
            case 'bottom':
                return { justifyContent: 'flex-end', paddingBottom: 50 };
            case 'center':
            default:
                return { justifyContent: 'center' };
        }
    };

    const handleBackdropPress = () => {
        if (dismissable && onBackdropPress) {
            onBackdropPress();
        } else if (dismissable) {
            onDismiss();
        }
    };

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                contentContainerStyle={[styles.container, getContainerStyle(), containerStyle]}
                dismissable={dismissable}
            >
                <TouchableWithoutFeedback onPress={handleBackdropPress}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <Surface style={styles.modalContent}>
                    {/* Header */}
                    <View style={[styles.header, headerStyle]}>
                        <Text
                            variant="headlineSmall"
                            style={styles.headerText}
                        >
                            {title}
                        </Text>
                    </View>

                    {/* Body */}
                    <View style={[styles.body, bodyStyle]}>
                        {children}
                    </View>

                    {/* Footer */}
                    {showFooter && (
                        <View style={[styles.footer, footerStyle]}>
                            {footer ? (
                                footer
                            ) : (
                                <View style={styles.footerActions}>
                                    {footerActions.map((action, index) => (
                                        <Button
                                            key={index}
                                            mode={action.mode || "text"}
                                            onPress={action.onPress}
                                            style={[styles.footerButton, action.style]}
                                            textColor={action.textColor || adminColors.primary}
                                            buttonColor={action.mode === 'contained' ? adminColors.primary : undefined}
                                        >
                                            {action.label}
                                        </Button>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}
                </Surface>
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContent: {
        width: width * 0.9,
        maxHeight: height * 0.8,
        borderRadius: 12,
        elevation: 6,
        overflow: 'hidden',
        backgroundColor: adminColors.cardBackground,
        // Enhanced shadow for better visibility
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
    },
    header: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.08)',
        backgroundColor: adminColors.cardBackground,
    },
    headerText: {
        color: adminColors.text.primary,
        fontWeight: '600',
    },
    body: {
        padding: 16,
        maxHeight: height * 0.6,
        backgroundColor: adminColors.cardBackground,
    },
    footer: {
        padding: 16,
        paddingBottom: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.08)',
        backgroundColor: adminColors.cardBackground,
    },
    footerActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    footerButton: {
        marginLeft: 12,
        borderRadius: 8,
    }
});
