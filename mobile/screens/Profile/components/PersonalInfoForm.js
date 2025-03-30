import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useFormikContext } from 'formik';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '~/utils/formatters';

export function PersonalInfoForm() {
    const { values, handleChange, handleBlur, errors, touched, setFieldValue } = useFormikContext();
    const [showDatePicker, setShowDatePicker] = useState(false);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setFieldValue('birthdate', selectedDate);
        }
    };

    return (
        <View>
            <View style={styles.fieldRow}>
                <View style={styles.fieldColumn}>
                    <TextInput
                        label="First Name"
                        mode="outlined"
                        value={values.first_name}
                        onChangeText={handleChange('first_name')}
                        onBlur={handleBlur('first_name')}
                        error={touched.first_name && !!errors.first_name}
                        style={styles.input}
                    />
                    {touched.first_name && errors.first_name && (
                        <Text style={styles.errorText}>{errors.first_name}</Text>
                    )}
                </View>

                <View style={styles.fieldColumn}>
                    <TextInput
                        label="Last Name"
                        mode="outlined"
                        value={values.last_name}
                        onChangeText={handleChange('last_name')}
                        onBlur={handleBlur('last_name')}
                        error={touched.last_name && !!errors.last_name}
                        style={styles.input}
                    />
                    {touched.last_name && errors.last_name && (
                        <Text style={styles.errorText}>{errors.last_name}</Text>
                    )}
                </View>
            </View>

            <TextInput
                label="Phone Number"
                mode="outlined"
                value={values.contact}
                onChangeText={handleChange('contact')}
                onBlur={handleBlur('contact')}
                error={touched.contact && !!errors.contact}
                keyboardType="phone-pad"
                style={styles.input}
            />
            {touched.contact && errors.contact && (
                <Text style={styles.errorText}>{errors.contact}</Text>
            )}

            <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={styles.datePickerButton}
            >
                <View style={styles.datePickerContainer}>
                    <Text style={styles.datePickerLabel}>Birth Date</Text>
                    <View style={styles.datePickerValue}>
                        <Text>
                            {values.birthdate
                                ? formatDate(values.birthdate)
                                : 'Select date'}
                        </Text>
                        <MaterialCommunityIcons name="calendar" size={24} color="#666" />
                    </View>
                </View>
            </TouchableOpacity>

            {showDatePicker && (
                <DateTimePicker
                    value={values.birthdate ? new Date(values.birthdate) : new Date()}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    maximumDate={new Date()}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    fieldRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldColumn: {
        flex: 1,
        marginRight: 8,
    },
    fieldColumn: {
        flex: 1,
    },
    fieldColumn: {
        flex: 1,
    },
    input: {
        marginBottom: 12,
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginLeft: 5,
        marginTop: -8,
        marginBottom: 12,
    },
    datePickerButton: {
        marginBottom: 12,
    },
    datePickerContainer: {
        borderWidth: 1,
        borderColor: '#8e8e8e',
        borderRadius: 4,
        padding: 12,
    },
    datePickerLabel: {
        position: 'absolute',
        top: -10,
        left: 10,
        backgroundColor: 'white',
        paddingHorizontal: 5,
        fontSize: 12,
        color: '#666',
    },
    datePickerValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
