import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { useFormikContext } from 'formik';

export function AddressInfoForm() {
    const { values, handleChange, handleBlur, errors, touched } = useFormikContext();

    return (
        <View>
            <TextInput
                label="Street Address"
                mode="outlined"
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                error={touched.address && !!errors.address}
                multiline
                numberOfLines={3}
                style={styles.input}
            />
            {touched.address && errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
            )}

            <View style={styles.fieldRow}>
                <View style={styles.fieldColumn}>
                    <TextInput
                        label="City"
                        mode="outlined"
                        value={values.city}
                        onChangeText={handleChange('city')}
                        onBlur={handleBlur('city')}
                        error={touched.city && !!errors.city}
                        style={styles.input}
                    />
                    {touched.city && errors.city && (
                        <Text style={styles.errorText}>{errors.city}</Text>
                    )}
                </View>

                <View style={styles.fieldColumn}>
                    <TextInput
                        label="Region/State"
                        mode="outlined"
                        value={values.region}
                        onChangeText={handleChange('region')}
                        onBlur={handleBlur('region')}
                        error={touched.region && !!errors.region}
                        style={styles.input}
                    />
                    {touched.region && errors.region && (
                        <Text style={styles.errorText}>{errors.region}</Text>
                    )}
                </View>
            </View>

            <TextInput
                label="ZIP/Postal Code"
                mode="outlined"
                value={values.zip_code}
                onChangeText={handleChange('zip_code')}
                onBlur={handleBlur('zip_code')}
                error={touched.zip_code && !!errors.zip_code}
                keyboardType="numeric"
                style={styles.input}
            />
            {touched.zip_code && errors.zip_code && (
                <Text style={styles.errorText}>{errors.zip_code}</Text>
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
});
