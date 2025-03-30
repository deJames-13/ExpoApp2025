import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Alert, Platform, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/states/slices/auth';
import { useUpdateProfileMutation } from '~/states/api/auth';
import useResource from '~/hooks/useResource';
import { useFocusEffect } from '@react-navigation/native';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import LoadingScreen from '../LoadingScreen';
import { ResourceForm } from '~/components/ResourceForm';
import * as Yup from 'yup';
import { createHybridFormData, isRemoteUrl } from '~/utils/imageUpload';

// Form validation schema
const ProfileSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    contact: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits')
        .required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    zip_code: Yup.string(),
});

export function EditProfile() {
    const navigation = useNavigation();
    const currentUser = useSelector(selectCurrentUser);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const { toast } = useResource({ resourceName: 'users', silent: false });
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const formRef = useRef(null);

    // Field configuration for ResourceForm
    const fieldConfig = [
        {
            type: 'image',
            field: 'avatar',
            label: 'Profile Picture',
            width: 150,
            height: 150,
            mode: 'both', // Allow both camera and gallery selection
        },
        {
            row: true,
            fields: [
                {
                    type: 'text',
                    field: 'first_name',
                    label: 'First Name',
                },
                {
                    type: 'text',
                    field: 'last_name',
                    label: 'Last Name',
                },
            ],
        },
        {
            type: 'text',
            field: 'contact',
            label: 'Phone Number',
            keyboardType: 'numeric',
        },
        {
            type: 'date',
            field: 'birthdate',
            label: 'Birth Date',
            maximumDate: new Date(),
        },
        {
            type: 'text',
            field: 'address',
            label: 'Address',
            multiline: true,
            numberOfLines: 2,
        },
        {
            row: true,
            fields: [
                {
                    type: 'text',
                    field: 'city',
                    label: 'City',
                },
                {
                    type: 'text',
                    field: 'region',
                    label: 'Region/State',
                },
            ],
        },
        {
            type: 'text',
            field: 'zip_code',
            label: 'Zip Code',
            keyboardType: 'numeric',
        },
    ];

    useEffect(() => {
        navigation.setOptions({
            title: 'Edit Profile',
            headerRight: () => (
                <Button
                    onPress={() => setPasswordModalVisible(true)}
                    mode="text"
                    compact
                >
                    Change Password
                </Button>
            ),
        });
    }, [navigation]);

    // Pop back if backbutton pressed while submitting
    useFocusEffect(
        useCallback(() => {
            const unsubscribe = navigation.addListener('beforeRemove', (e) => {
                if (submitting) {
                    e.preventDefault();
                    Alert.alert(
                        'Discard changes?',
                        'You have unsaved changes. Are you sure you want to discard them?',
                        [
                            { text: "Don't leave", style: 'cancel', onPress: () => { } },
                            {
                                text: 'Discard',
                                style: 'destructive',
                                onPress: () => navigation.dispatch(e.data.action),
                            },
                        ]
                    );
                }
            });

            return unsubscribe;
        }, [navigation, submitting])
    );

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            // Create the user info object
            const userInfo = {
                id: currentUser?.id || '',
                first_name: values.first_name,
                last_name: values.last_name,
                contact: values.contact,
                birthdate: values.birthdate,
                address: values.address,
                city: values.city,
                region: values.region,
                zip_code: values.zip_code,
            };

            // Handle avatar value - only include if it's changed from the original
            const originalAvatar = currentUser?.info?.avatar?.url || currentUser?.info?.photoUrl || null;
            const avatarChanged = values.avatar !== originalAvatar;

            // Create hybrid FormData with both 'info' field and file
            // Using base64 encoding to avoid issues with remote servers
            const formData = await createHybridFormData(
                userInfo,
                avatarChanged ? { avatar: values.avatar } : {},
                true // Use base64 encoding for local files
            );

            // Update the profile
            await updateProfile(formData).unwrap();
            toast.showSuccess(
                'Profile Updated',
                'Your profile information has been successfully updated.'
            );
            navigation.goBack();
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.showError(
                'Update Failed',
                error.data?.message || 'There was a problem updating your profile.'
            );
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordChange = async (passwordData) => {
        try {
            // Create a hybrid form data with password info
            const formData = new FormData();
            formData.append('currentPassword', passwordData.currentPassword);
            formData.append('newPassword', passwordData.newPassword);

            // Call the API to update password
            await updateProfile(formData).unwrap();
            return true;
        } catch (error) {
            console.error('Password change error:', error);
            throw error;
        }
    };

    // Extract initial values from the user object
    const getInitialValues = () => {
        const userInfo = currentUser?.info || {};
        return {
            first_name: userInfo.first_name || '',
            last_name: userInfo.last_name || '',
            contact: userInfo.contact || '',
            birthdate: userInfo.birthdate || null,
            address: userInfo.address || '',
            city: userInfo.city || '',
            region: userInfo.region || '',
            zip_code: userInfo.zip_code || '',
            avatar: userInfo.avatar?.url || userInfo.photoUrl || null,
        };
    };

    // Show loading screen while initializing
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ResourceForm
                initialValues={getInitialValues()}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
                formRef={formRef}
                fieldConfig={fieldConfig}
                scrollViewProps={false} // Set to false as we'll handle scrolling in renderFields
                containerStyle={styles.formContainer}
                enableReinitialize={true}
                layoutProps={{
                    style: {
                        padding: 16,
                        flex: 1,
                    },
                }}
                renderFields={(formProps) => (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        <ResourceForm.RenderFields
                            formProps={formProps}
                            fieldConfig={fieldConfig}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                mode="outlined"
                                onPress={() => navigation.goBack()}
                                style={styles.cancelButton}
                            >
                                Cancel
                            </Button>
                            <Button
                                mode="contained"
                                onPress={formProps.handleSubmit}
                                loading={submitting}
                                style={styles.saveButton}
                                textColor='white'
                            >
                                Save Changes
                            </Button>
                        </View>
                    </ScrollView>
                )}
            />
            <ChangePasswordModal
                visible={passwordModalVisible}
                onDismiss={() => setPasswordModalVisible(false)}
                onChangePassword={handlePasswordChange}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    formContainer: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    saveButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: '#3b82f6',
    },
});
