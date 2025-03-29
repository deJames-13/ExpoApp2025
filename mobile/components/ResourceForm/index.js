import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik } from 'formik';
import { FieldMapper, FormRow, HalfField, CustomLayout } from './FormFields';

export function ResourceForm({
    initialValues,
    validationSchema,
    onSubmit,
    children,
    mode = 'create',
    containerStyle,
    formRef,
    layoutComponent: LayoutComponent = CustomLayout,
    layoutProps = {},
    renderFields,
    fieldConfig = [],
    wrapWithScrollView = true,
    scrollViewProps = {},
    enableReinitialize = true
}) {
    // Create a function to check if fields should be disabled
    const isDisabled = mode === 'view';

    // Render fields based on configuration
    const renderFieldsFromConfig = (formProps) => {
        const content = (
            <View style={styles.formContainer}>
                {fieldConfig.map((config, index) => {
                    // If it's a row with multiple fields
                    if (config.row) {
                        return (
                            <FormRow key={`row-${index}`}>
                                {config.fields.map((fieldConfig, fieldIndex) => (
                                    <HalfField key={fieldConfig.field || `field-${fieldIndex}`}>
                                        <FieldMapper
                                            {...fieldConfig}
                                            formProps={formProps}
                                        />
                                    </HalfField>
                                ))}
                            </FormRow>
                        );
                    }

                    // Single field
                    return (
                        <FieldMapper
                            key={config.field || `field-${index}`}
                            {...config}
                            formProps={formProps}
                        />
                    );
                })}
            </View>
        );

        // Wrap with ScrollView if needed
        if (wrapWithScrollView) {
            return (
                <ScrollView {...scrollViewProps}>
                    {content}
                </ScrollView>
            );
        }

        return content;
    };

    return (
        <LayoutComponent style={[styles.container, containerStyle]} {...layoutProps}>
            <Formik
                innerRef={formRef}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
                enableReinitialize={enableReinitialize}
            >
                {(formikProps) => {
                    const formProps = { ...formikProps, isDisabled };

                    // If field configuration is provided, render fields from config
                    if (fieldConfig.length > 0) {
                        return renderFieldsFromConfig(formProps);
                    }

                    // If renderFields function is provided, use it for custom rendering
                    if (typeof renderFields === 'function') {
                        return renderFields(formProps);
                    }

                    // If children is a function, pass the form props
                    if (typeof children === 'function') {
                        return children(formProps);
                    }

                    // Otherwise, just render the children directly
                    return children;
                }}
            </Formik>
        </LayoutComponent>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    formContainer: {
        width: '100%',
    }
});
