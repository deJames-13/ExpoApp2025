import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { useFormikContext } from 'formik';
import { ProfileImagePicker } from './ProfileImagePicker';
import { adminColors } from '~/styles/adminTheme';

export function PersonalInfoForm() {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = useFormikContext();

    return (
        <View style={styles.container}>
            {/* Image Picker */}
            <ProfileImagePicker
                value={values.avatar}
                onChange={(value) => setFieldValue('avatar', value)}
                style={styles.imagePicker}
            />

            {/* Personal Information Fields */}
            <View style={styles.fieldsContainer}>
                <View style={styles.row}>
                    <TextInput
                        label="First Name"
                        value={values.first_name}
                        onChangeText={handleChange('first_name')}
                        onBlur={handleBlur('first_name')}
                        error={touched.first_name && !!errors.first_name}
                        style={[styles.input, styles.halfInput]}
                        mode="outlined"
                    />
                    <TextInput
                        label="Last Name"
                        value={values.last_name}
                        onChangeText={handleChange('last_name')}
                        onBlur={handleBlur('last_name')}
                        error={touched.last_name && !!errors.last_name}
                        style={[styles.input, styles.halfInput]}
                        mode="outlined"
                    />
                </View>

                <TextInput
                    label="Phone Number"
                    value={values.contact}
                    onChangeText={handleChange('contact')}
                    onBlur={handleBlur('contact')}
                    error={touched.contact && !!errors.contact}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="phone-pad"
                />

                <TextInput
                    label="Address"
                    value={values.address}
                    onChangeText={handleChange('address')}
                    onBlur={handleBlur('address')}
                    error={touched.address && !!errors.address}
                    style={styles.input}
                    mode="outlined"
                    multiline
                />

                <View style={styles.row}>
                    <TextInput
                        label="City"
                        value={values.city}
                        onChangeText={handleChange('city')}
                        onBlur={handleBlur('city')}
                        error={touched.city && !!errors.city}
                        style={[styles.input, styles.halfInput]}
                        mode="outlined"
                    />
                    <TextInput
                        label="Region"
                        value={values.region}
                        onChangeText={handleChange('region')}
                        onBlur={handleBlur('region')}
                        error={touched.region && !!errors.region}
                        style={[styles.input, styles.halfInput]}
                        mode="outlined"
                    />
                </View>

                <TextInput
                    label="Zip Code"
                    value={values.zip_code}
                    onChangeText={handleChange('zip_code')}
                    onBlur={handleBlur('zip_code')}
                    error={touched.zip_code && !!errors.zip_code}
                    style={styles.input}
                    mode="outlined"
                    keyboardType="number-pad"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    imagePicker: {
        alignItems: 'center',
        marginBottom: 24,
    },
    fieldsContainer: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    input: {
        marginBottom: 16,
        backgroundColor: adminColors.cardBackground,
    },
    halfInput: {
        width: '48%',
    },
});
