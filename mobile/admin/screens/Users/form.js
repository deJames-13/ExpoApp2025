import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getUserValidationSchema,
    initialUserValues,
} from './validation';
import { getUserFields } from './form-config';

/**
 * Helper function to ensure URI is a valid string
 */
const validateUri = (uri) => {
    if (!uri) return null;
    if (typeof uri === 'object' && uri !== null) {
        return uri.uri || uri.path || null;
    }
    return typeof uri === 'string' ? uri : null;
};

export function UserForm({ user, mode = 'create', onSubmit, formRef }) {
    const [validationSchema, setValidationSchema] = useState(getUserValidationSchema());
    const [fieldConfig, setFieldConfig] = useState([]);

    const handleSubmit = (values) => {
        // Process any data transformations if needed
        const processedData = {
            ...values,
        };
        onSubmit(processedData);
    };

    useEffect(() => {
        const fieldsOptions = {
            includeAvatar: true,
            includePassword: mode === 'create', // Only include password field in create mode
            includeAdvancedFields: mode === 'edit' || mode === 'view'
        };

        // Configure validation based on mode
        const validationOptions = {
            requireUsername: true,
            requireEmail: true,
            requirePassword: mode === 'create', // Password only required in create mode
            requireFirstName: true,
            requireLastName: true,
            requireContact: true,
            requireRole: true
        };

        // Set dynamic configuration
        setFieldConfig(getUserFields(fieldsOptions));
        setValidationSchema(getUserValidationSchema(validationOptions));
    }, [mode, user]);

    // Process avatar from user
    const getInitialAvatar = () => {
        if (!user || !user.info) return null;

        // Handle avatar from user info
        if (user.info.avatar) {
            const validUri = validateUri(user.info.avatar);
            return validUri ? validUri : null;
        }

        // Try photoUrl as fallback
        if (user.info.photoUrl) {
            return user.info.photoUrl;
        }

        return null;
    };

    // Prepare initial form values
    const getInitialValues = () => {
        if (!user) return initialUserValues;

        // Make sure info exists with all required fields
        const userInfo = user.info || {};

        return {
            ...initialUserValues,
            ...user,
            info: {
                ...initialUserValues.info,
                ...userInfo,
                avatar: getInitialAvatar()
            }
        };
    };

    return (
        <ResourceForm
            initialValues={getInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            mode={mode}
            formRef={formRef}
            layoutProps={{ style: styles.customFormLayout }}
            fieldConfig={fieldConfig}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            enableReinitialize={true}
        />
    );
}

const styles = StyleSheet.create({
    customFormLayout: {
        width: '100%',
        paddingBottom: 20,
    }
});
