import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';

const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .required('Current password is required'),
    newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Must include uppercase, lowercase, number and special character'
        )
        .required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

export function ChangePasswordModal({ visible, onDismiss, onChangePassword }) {
    const [secureTextEntry, setSecureTextEntry] = useState({
        currentPassword: true,
        newPassword: true,
        confirmPassword: true,
    });

    const toggleSecureEntry = (field) => {
        setSecureTextEntry({
            ...secureTextEntry,
            [field]: !secureTextEntry[field],
        });
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await onChangePassword({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });

            resetForm();
            onDismiss();
            Toast.show({
                type: 'success',
                text1: 'Password Changed',
                text2: 'Your password has been updated successfully',
            });
        } catch (error) {
            console.error('Password change error:', error);
            Toast.show({
                type: 'error',
                text1: 'Password Change Failed',
                text2: error.data?.message || 'Please check your current password and try again',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            onRequestClose={onDismiss}
            animationType="slide"
            transparent
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.centeredView}
            >
                <View style={styles.modalView}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Change Password</Text>
                        <TouchableOpacity onPress={onDismiss} style={styles.closeButton}>
                            <MaterialCommunityIcons name="close" size={24} color="#555" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Formik
                            initialValues={{
                                currentPassword: '',
                                newPassword: '',
                                confirmPassword: '',
                            }}
                            validationSchema={PasswordSchema}
                            onSubmit={handleSubmit}
                        >
                            {({
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                values,
                                errors,
                                touched,
                                isSubmitting,
                                isValid,
                                dirty,
                            }) => (
                                <View style={styles.form}>
                                    <TextInput
                                        label="Current Password"
                                        mode="outlined"
                                        value={values.currentPassword}
                                        onChangeText={handleChange('currentPassword')}
                                        onBlur={handleBlur('currentPassword')}
                                        secureTextEntry={secureTextEntry.currentPassword}
                                        error={touched.currentPassword && !!errors.currentPassword}
                                        right={
                                            <TextInput.Icon
                                                icon={secureTextEntry.currentPassword ? 'eye' : 'eye-off'}
                                                onPress={() => toggleSecureEntry('currentPassword')}
                                            />
                                        }
                                        style={styles.input}
                                    />
                                    {touched.currentPassword && errors.currentPassword && (
                                        <Text style={styles.errorText}>{errors.currentPassword}</Text>
                                    )}

                                    <TextInput
                                        label="New Password"
                                        mode="outlined"
                                        value={values.newPassword}
                                        onChangeText={handleChange('newPassword')}
                                        onBlur={handleBlur('newPassword')}
                                        secureTextEntry={secureTextEntry.newPassword}
                                        error={touched.newPassword && !!errors.newPassword}
                                        right={
                                            <TextInput.Icon
                                                icon={secureTextEntry.newPassword ? 'eye' : 'eye-off'}
                                                onPress={() => toggleSecureEntry('newPassword')}
                                            />
                                        }
                                        style={styles.input}
                                    />
                                    {touched.newPassword && errors.newPassword && (
                                        <Text style={styles.errorText}>{errors.newPassword}</Text>
                                    )}

                                    <TextInput
                                        label="Confirm New Password"
                                        mode="outlined"
                                        value={values.confirmPassword}
                                        onChangeText={handleChange('confirmPassword')}
                                        onBlur={handleBlur('confirmPassword')}
                                        secureTextEntry={secureTextEntry.confirmPassword}
                                        error={touched.confirmPassword && !!errors.confirmPassword}
                                        right={
                                            <TextInput.Icon
                                                icon={secureTextEntry.confirmPassword ? 'eye' : 'eye-off'}
                                                onPress={() => toggleSecureEntry('confirmPassword')}
                                            />
                                        }
                                        style={styles.input}
                                    />
                                    {touched.confirmPassword && errors.confirmPassword && (
                                        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                    )}

                                    <View style={styles.buttonContainer}>
                                        <Button
                                            mode="outlined"
                                            onPress={onDismiss}
                                            style={styles.cancelButton}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            mode="contained"
                                            onPress={handleSubmit}
                                            disabled={isSubmitting || !(isValid && dirty)}
                                            loading={isSubmitting}
                                            style={styles.saveButton}
                                        >
                                            Update Password
                                        </Button>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    closeButton: {
        padding: 5,
    },
    form: {
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginLeft: 5,
        marginTop: -5,
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
    },
});
