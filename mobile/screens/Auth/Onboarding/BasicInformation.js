import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, BackHandler, Alert } from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { ResourceForm } from '~/components/ResourceForm';
import Toast from 'react-native-toast-message';
import { selectCurrentUser } from '~/states/slices/auth';
import {
    selectBasicInfo,
    setBasicInfo,
    selectIsAddressCompleted,
    selectIsEmailVerified,
    setCurrentStep
} from '~/states/slices/onboarding';
import { adminColors } from '~/styles/adminTheme';

const BasicInformationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    contact: Yup.string()
        .required('Contact number is required')
        .matches(/^[0-9]{10}$/, 'Contact must be 10 digits'),
    birthdate: Yup.date().nullable(),
    avatar: Yup.mixed().nullable(),
});

export default function BasicInformation() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const basicInfo = useSelector(selectBasicInfo);
    const isAddressCompleted = useSelector(selectIsAddressCompleted);
    const isEmailVerified = useSelector(selectIsEmailVerified);
    const [formValues, setFormValues] = useState({});
    const [submitForm, setSubmitForm] = useState(null);

    // Replace the redirect logic to only set the current step without redirecting
    useEffect(() => {
        dispatch(setCurrentStep('BasicInformation'));
    }, [dispatch]);

    // Handle back button to exit app instead of navigating back
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Exit App',
                    'Are you sure you want to exit?',
                    [
                        { text: 'Cancel', style: 'cancel', onPress: () => { } },
                        { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
                    ],
                    { cancelable: false }
                );
                return true; // Prevent default behavior
            };

            // Add event listener for hardware back button
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // Set up navigation options to prevent going back
            navigation.setOptions({
                headerLeft: () => null, // Remove back button
                gestureEnabled: false, // Disable swipe back gesture
            });

            return () => {
                // Clean up event listener on unmount
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );

    // Make sure form values are saved to Redux even without explicitly submitting
    useFocusEffect(
        React.useCallback(() => {
            // Whenever we return to this screen, make sure we're using the latest Redux data
            if (formValues && Object.keys(formValues).length > 0) {
                // If we have local form values, update Redux with them
                dispatch(setBasicInfo(formValues));
            }

            return () => {
                // When leaving this screen, save current form values to Redux if they exist
                if (formValues && Object.keys(formValues).length > 0) {
                    dispatch(setBasicInfo(formValues));
                }
            };
        }, [formValues, dispatch])
    );

    const initialValues = {
        first_name: basicInfo.first_name || '',
        last_name: basicInfo.last_name || '',
        contact: basicInfo.contact || '',
        birthdate: basicInfo.birthdate || null,
        avatar: basicInfo.avatar || null,
    };

    const fieldConfig = [
        {
            type: 'image',
            field: 'avatar',
            label: 'Profile Picture',
            placeholder: 'Add your profile picture',
            width: 200,
            height: 200,
            mode: 'both',
            multiple: false,
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
            label: 'Contact Number',
            keyboardType: 'phone-pad',
        },
        {
            type: 'date',
            field: 'birthdate',
            label: 'Date of Birth',
            mode: 'date',
        },
    ];

    const handleSubmit = (values) => {
        // Store values in local state
        setFormValues(values);

        // Save to Redux store
        dispatch(setBasicInfo(values));

        // Navigate to the next step
        navigation.navigate('AddressInformation');
    };

    // Update formValues whenever form fields change
    const handleFieldChange = (field, value) => {
        setFormValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getFormSubmitRef = (submitFn) => {
        setSubmitForm(() => submitFn);
    };

    const validateAndContinue = async () => {
        try {
            if (submitForm) {
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
                    <Text style={styles.subtitle}>Step 1 of 3: Basic Information</Text>
                    <ProgressBar progress={0.33} color={adminColors.primary} style={styles.progressBar} />
                </View>

                <ResourceForm
                    initialValues={initialValues}
                    validationSchema={BasicInformationSchema}
                    onSubmit={handleSubmit}
                    fieldConfig={fieldConfig}
                    getSubmitRef={getFormSubmitRef}
                    onFieldChange={handleFieldChange}
                />

                <View style={styles.buttonContainer}>
                    <Button
                        mode="text"
                        onPress={() => {
                            Alert.alert(
                                'Exit App',
                                'Are you sure you want to exit?',
                                [
                                    { text: 'Cancel', style: 'cancel' },
                                    { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
                                ],
                                { cancelable: true }
                            );
                        }}
                        style={styles.exitButton}
                    >
                        Exit App
                    </Button>

                    <Button
                        mode="contained"
                        onPress={validateAndContinue}
                        style={styles.continueButton}
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
    exitButton: {
        flex: 1,
        marginRight: 8,
    },
    continueButton: {
        flex: 2,
        backgroundColor: adminColors.primary,
    },
});
