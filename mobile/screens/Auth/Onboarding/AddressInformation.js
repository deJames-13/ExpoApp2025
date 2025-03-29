import React from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import { ResourceForm } from '~/components/ResourceForm';
import Toast from 'react-native-toast-message';
import { selectCurrentUser } from '~/states/slices/auth';
import { useUpdateProfileMutation } from '~/states/api/auth';
import { adminColors } from '~/styles/adminTheme';

const AddressInformationSchema = Yup.object().shape({
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region is required'),
    zip_code: Yup.string().required('Zip/Postal code is required'),
});

export default function AddressInformation() {
    const navigation = useNavigation();
    const currentUser = useSelector(selectCurrentUser);
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();

    const initialValues = {
        address: '',
        city: '',
        region: '',
        zip_code: '',
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

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            
            // Add address info as stringified JSON
            const userInfo = {
                address: values.address,
                city: values.city,
                region: values.region,
                zip_code: values.zip_code,
            };
            
            formData.append('info', JSON.stringify(userInfo));
            
            // Update profile
            await updateProfile(formData).unwrap();
            
            Toast.show({
                type: 'success',
                text1: 'Address Saved',
                text2: 'Your address information has been saved.',
            });
            
            // Navigate to email verification step
            navigation.navigate('EmailVerification');
        } catch (error) {
            console.error('Error updating address:', error);
            Toast.show({
                type: 'error',
                text1: 'Update Failed',
                text2: error.data?.message || 'Failed to update your address information.',
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
                />
                
                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        Back
                    </Button>
                    <Button
                        mode="contained"
                        onPress={() => navigation.navigate('EmailVerification')}
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
