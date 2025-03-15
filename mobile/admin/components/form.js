import React from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

/**
 * A reusable CRUD form component for admin interfaces
 * 
 * @param {Object} props
 * @param {Object} props.initialValues - Initial values for the form
 * @param {Object} props.validationSchema - Yup validation schema
 * @param {Array} props.fields - Field configurations
 * @param {Function} props.onSubmit - Submit handler function
 * @param {Boolean} props.isLoading - Loading state
 * @param {String} props.submitButtonText - Custom submit button text
 * @param {Object} props.style - Additional styles for the form container
 * @param {Function} props.onCancel - Cancel handler function
 */
const FormComponent = ({
    initialValues = {},
    validationSchema,
    fields = [],
    onSubmit,
    isLoading = false,
    submitButtonText = 'Save',
    style = {},
    onCancel,
}) => {
    return (
        <ScrollView
            style={[styles.container, style]}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="handled"
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, actions) => {
                    onSubmit(values, actions);
                }}
                enableReinitialize
            >
                {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    values,
                    errors,
                    touched,
                    isValid,
                    dirty,
                }) => (
                    <View style={styles.formContainer}>
                        {fields.map((field, index) => {
                            const errorMessage = touched[field.name] && errors[field.name];

                            // Handle different field types
                            switch (field.type) {
                                case 'select':
                                    return (
                                        <View key={index} style={styles.fieldContainer}>
                                            <Text style={styles.label}>{field.label}</Text>
                                            <View style={styles.selectContainer}>
                                                {field.options.map((option) => (
                                                    <TouchableOpacity
                                                        key={option.value}
                                                        style={[
                                                            styles.selectOption,
                                                            values[field.name] === option.value && styles.selectedOption,
                                                        ]}
                                                        onPress={() => setFieldValue(field.name, option.value)}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.selectText,
                                                                values[field.name] === option.value && styles.selectedText,
                                                            ]}
                                                        >
                                                            {option.label}
                                                        </Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </View>
                                            {errorMessage ? (
                                                <Text style={styles.errorText}>{errorMessage}</Text>
                                            ) : null}
                                        </View>
                                    );

                                case 'textarea':
                                    return (
                                        <View key={index} style={styles.fieldContainer}>
                                            <Text style={styles.label}>{field.label}</Text>
                                            <TextInput
                                                style={[styles.input, styles.textArea]}
                                                onChangeText={handleChange(field.name)}
                                                onBlur={handleBlur(field.name)}
                                                value={values[field.name]}
                                                placeholder={field.placeholder || ''}
                                                multiline
                                                numberOfLines={4}
                                                textAlignVertical="top"
                                                {...field.inputProps}
                                            />
                                            {errorMessage ? (
                                                <Text style={styles.errorText}>{errorMessage}</Text>
                                            ) : null}
                                        </View>
                                    );

                                case 'checkbox':
                                    return (
                                        <View key={index} style={[styles.fieldContainer, styles.checkboxContainer]}>
                                            <TouchableOpacity
                                                style={styles.checkbox}
                                                onPress={() => setFieldValue(field.name, !values[field.name])}
                                            >
                                                <View style={[
                                                    styles.checkboxBox,
                                                    values[field.name] ? styles.checkboxChecked : {}
                                                ]} />
                                            </TouchableOpacity>
                                            <Text
                                                style={styles.checkboxLabel}
                                                onPress={() => setFieldValue(field.name, !values[field.name])}
                                            >
                                                {field.label}
                                            </Text>
                                            {errorMessage ? (
                                                <Text style={styles.errorText}>{errorMessage}</Text>
                                            ) : null}
                                        </View>
                                    );

                                case 'hidden':
                                    return null;

                                case 'text':
                                default:
                                    return (
                                        <View key={index} style={styles.fieldContainer}>
                                            <Text style={styles.label}>{field.label}</Text>
                                            <TextInput
                                                style={styles.input}
                                                onChangeText={handleChange(field.name)}
                                                onBlur={handleBlur(field.name)}
                                                value={values[field.name]}
                                                placeholder={field.placeholder || ''}
                                                keyboardType={field.keyboardType || 'default'}
                                                secureTextEntry={field.secureTextEntry || false}
                                                autoCapitalize={field.autoCapitalize || 'none'}
                                                autoCorrect={field.autoCorrect || false}
                                                {...field.inputProps}
                                            />
                                            {errorMessage ? (
                                                <Text style={styles.errorText}>{errorMessage}</Text>
                                            ) : null}
                                        </View>
                                    );
                            }
                        })}

                        <View style={styles.buttonContainer}>
                            {onCancel && (
                                <TouchableOpacity
                                    style={[styles.button, styles.cancelButton]}
                                    onPress={onCancel}
                                    disabled={isLoading}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.submitButton,
                                    (!isValid || !dirty) && styles.disabledButton
                                ]}
                                onPress={handleSubmit}
                                disabled={isLoading || !isValid || !dirty}
                            >
                                <Text style={styles.submitButtonText}>
                                    {isLoading ? 'Loading...' : submitButtonText}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    formContainer: {
        width: '100%',
    },
    fieldContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    errorText: {
        color: '#ff3b30',
        fontSize: 14,
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 4,
        minWidth: 100,
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#007aff',
    },
    disabledButton: {
        backgroundColor: '#a0a0a0',
        opacity: 0.7,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        marginRight: 12,
    },
    cancelButtonText: {
        color: '#007aff',
        fontSize: 16,
        fontWeight: '500',
    },
    selectContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    selectOption: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: '#f9f9f9',
    },
    selectedOption: {
        borderColor: '#007aff',
        backgroundColor: '#e3f2fd',
    },
    selectText: {
        color: '#333',
    },
    selectedText: {
        color: '#007aff',
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: 10,
    },
    checkboxBox: {
        width: 20,
        height: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
    },
    checkboxChecked: {
        backgroundColor: '#007aff',
        borderColor: '#007aff',
    },
    checkboxLabel: {
        fontSize: 16,
        color: '#333',
    },
});

export default FormComponent;