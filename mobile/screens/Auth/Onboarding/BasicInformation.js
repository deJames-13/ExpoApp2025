import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ResourceForm } from '~/components/ResourceForm';
import Toast from 'react-native-toast-message';
import { selectCurrentUser, selectAccessToken } from '~/states/slices/auth';
import { useUpdateProfileMutation } from '~/states/api/auth';
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
    const currentUser = useSelector(selectCurrentUser);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const initialValues = {
        first_name: '',
        last_name: '',
        contact: '',
        birthdate: null,
        avatar: null,
    };

    const fieldConfig = [
        {
            type: 'image',
            field: 'avatar',
            label: 'Profile Picture',
            placeholder: 'Add your profile picture',
            width: 200,
            height: 200,
            mode: 'both', // Allow both upload and camera
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

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            
            // Add basic info as stringified JSON
            const userInfo = {
                first_name: values.first_name,
                last_name: values.last_name,
                contact: values.contact,
                birthdate: values.birthdate,
            };
            
            formData.append('info', JSON.stringify(userInfo));
            
            // Add avatar if it exists
            if (values.avatar) {
                const uri = values.avatar;
                const uriParts = uri.split('.');
                const fileType = uriParts[uriParts.length - 1];
                
                formData.append('avatar', {
                    uri,
                    name: `avatar.${fileType}`,
                    type: `image/${fileType}`,
                });
            }
            
            // Update profile
            await updateProfile(formData).unwrap();
            
            Toast.show({
                type: 'success',
                text1: 'Profile Updated',
                text2: 'Your basic information has been saved.',
            });
            
            // Navigate to address information step
            navigation.navigate('AddressInformation');
        } catch (error) {
            console.error('Error updating profile:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.data?.message || 'Failed to update your information.',
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
                />
                
                <View style={styles.buttonContainer}>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('AddressInformation')}
                        style={styles.skipButton}
                        loading={isLoading}
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
        paddingHorizontal: 16,
    },
    skipButton: {
        marginTop: 16,
        backgroundColor: adminColors.primary,
    },
});
