import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, BackHandler, Platform } from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ResourceForm } from '~/components/ResourceForm';
import Toast from 'react-native-toast-message';
import { selectCurrentUser } from '~/states/slices/auth';
import { useUpdateProfileMutation } from '~/states/api/auth';
import {
    selectBasicInfo,
    selectAddressInfo,
    selectIsEmailVerified,
    setAddressInfo,
    setCurrentStep
} from '~/states/slices/onboarding';
import { adminColors } from '~/styles/adminTheme';
import { createHybridFormData } from '~/utils/imageUpload';

const AddressInformationSchema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    zip_code: Yup.string().required('Zip/Postal code is required'),
});

export default function AddressInformation() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const basicInfo = useSelector(selectBasicInfo);
    const addressInfo = useSelector(selectAddressInfo);
    const isEmailVerified = useSelector(selectIsEmailVerified);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const [formValues, setFormValues] = useState({});
    const [submitForm, setSubmitForm] = useState(null);

    // Modified redirect logic - only check if basic info is completed
    useEffect(() => {
        if (!basicInfo.isCompleted) {
            navigation.navigate('BasicInformation');
            return;
        }
        dispatch(setCurrentStep('AddressInformation'));
    }, [basicInfo.isCompleted, navigation, dispatch]);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('BasicInformation');
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            navigation.setOptions({
                headerLeft: () => (
                    <Button
                        onPress={() => navigation.navigate('BasicInformation')}
                        mode="text"
                        compact
                        style={{ marginLeft: 8 }}
                    >
                        Back
                    </Button>
                ),
            });

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );

    // Ensure address info is saved even when navigating back
    useFocusEffect(
        React.useCallback(() => {
            return () => {
                // When leaving this screen, save form values to Redux
                if (formValues && Object.keys(formValues).length > 0) {
                    dispatch(setAddressInfo({
                        ...formValues,
                        isCompleted: false
                    }));
                }
            };
        }, [formValues, dispatch])
    );

    const initialValues = {
        address: addressInfo.address || '',
        city: addressInfo.city || '',
        region: addressInfo.region || '',
        zip_code: addressInfo.zip_code || '',
    };

    const fieldConfig = [
        {
            type: 'text',
            field: 'address',
            label: 'Street Address',
            multiline: true,
            numberOfLines: 3,
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
            label: 'ZIP/Postal Code',
            keyboardType: 'number-pad',
        },
    ];

    const handleFieldChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (values) => {
        try {
            // Combine basic and address info
            const userInfo = {
                id: currentUser.id,
                first_name: basicInfo.first_name,
                last_name: basicInfo.last_name,
                contact: basicInfo.contact,
                birthdate: basicInfo.birthdate,
                address: values.address,
                city: values.city,
                region: values.region,
                zip_code: values.zip_code,
            };

            console.log('Preparing profile update with avatar:', basicInfo.avatar ? 'Present' : 'Not present');

            // Create hybrid FormData with both 'info' field and file
            // Using base64 encoding to avoid issues with remote servers - this is crucial for fixing boundary issues
            const formData = await createHybridFormData(
                userInfo,
                basicInfo.avatar ? { avatar: basicInfo.avatar } : {},
                true // Explicitly use base64 encoding for local files
            );

            console.log('User ID:', currentUser.id);
            console.log('Sending profile update request...');

            // Update profile
            const result = await updateProfile(formData).unwrap();
            console.log('Profile update success:', result);

            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your profile information has been saved.',
            });

            // Save address info to redux store
            dispatch(setAddressInfo(values));

            // Navigate to email verification
            navigation.navigate('EmailVerification');
        } catch (error) {
            // Enhanced error handling
            let errorMessage = 'Failed to update your information.';
            console.error('Profile update error details:', error);

            // Specific error for multipart boundary issues
            if (error?.data?.message?.includes('Boundary not found')) {
                errorMessage = 'There was an issue uploading your profile image. Please try again.';
            }
            // Handle other specific error status codes
            else if (error.status === 400) {
                errorMessage = error.data?.message || 'Invalid data provided.';
            } else if (error.status === 422) {
                errorMessage = error.data?.message || 'Please check the provided information.';
                if (error.data?.errors?.details && error.data.errors.details.length > 0) {
                    const firstError = error.data.errors.details[0];
                    errorMessage = `${firstError.path}: ${firstError.msg}`;
                }
            } else if (error.status === 401 || error.status === 403) {
                errorMessage = 'Please log in again to continue.';
            } else if (error.status === 500) {
                errorMessage = 'A server error occurred. Please try again later.';
            } else if (error.status === 'FETCH_ERROR') {
                errorMessage = 'Network connection error. Please check your internet connection.';
            }

            // Show error message to the user
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: errorMessage,
                visibilityTime: 4000, // Show for 4 seconds
                autoHide: true,
                position: 'bottom'
            });
        }
    };

    // This function gets the submit function from the form
    const getFormSubmitRef = (submitFn) => {
        setSubmitForm(() => submitFn);
    };

    // Function to validate and submit the form
    const validateAndContinue = async () => {
        try {
            if (submitForm && !isLoading) {
                await submitForm();
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Please complete all required fields correctly.',
            });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Complete Your Profile</Text>
                    <Text style={styles.subtitle}>Step 2 of 3: Address Information</Text>
                    <ProgressBar progress={0.66} color={adminColors.primary} style={styles.progressBar} />
                </View>

                <ResourceForm
                    initialValues={initialValues}
                    validationSchema={AddressInformationSchema}
                    onSubmit={handleSubmit}
                    fieldConfig={fieldConfig}
                    getSubmitRef={getFormSubmitRef}
                    onFieldChange={handleFieldChange}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.navigate('BasicInformation')}
                        style={styles.backButton}
                    >
                        Back
                    </Button>
                    <Button
                        mode="contained"
                        onPress={validateAndContinue}
                        style={styles.skipButton}
                        loading={isLoading}
                        disabled={isLoading}
                        textColor={adminColors.background}
                    >
                        Continue
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
    },
    buttonContainer: {
        marginTop: 24,
        marginBottom: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        flex: 1,
        marginRight: 8,
        borderColor: adminColors.primary,
    },
    skipButton: {
        flex: 1,
        marginLeft: 8,
        backgroundColor: adminColors.primary,
    },
});
