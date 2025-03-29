import { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Formik, Form } from 'formik';
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
    enableReinitialize = true,
    onValidationChange = () => { },
    getSubmitRef,
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

                    useEffect(() => {
                        if (getSubmitRef) {
                            getSubmitRef(formikProps.handleSubmit);
                        }
                    }, [formikProps.handleSubmit, getSubmitRef]);

                    useEffect(() => {
                        if (onValidationChange) {
                            formikProps.validateForm().then(errors => {
                                const isValid = Object.keys(errors).length === 0;
                                onValidationChange(isValid, formikProps.values);
                            });
                        }
                    }, [formikProps.values, onValidationChange]);
                    let ComponentForm;

                    // If field configuration is provided, render fields from config
                    if (fieldConfig.length > 0) {
                        ComponentForm = renderFieldsFromConfig(formProps);
                    }

                    // If renderFields function is provided, use it for custom rendering
                    if (typeof renderFields === 'function') {
                        ComponentForm = renderFields(formProps);
                    }

                    // If children is a function, pass the form props
                    if (typeof children === 'function') {
                        ComponentForm = children(formProps);
                    }

                    // Otherwise, just render the children directly
                    return (ComponentForm)
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
