import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getReviewValidationSchema,
    initialReviewValues,
} from './validation';
import { getReviewFields } from './form-config';

/**
 * Helper function to ensure a valid URI
 */
const validateUri = (uri) => {
    if (!uri) return null;
    if (typeof uri === 'object' && uri !== null) {
        return uri.uri || uri.path || uri.url || null;
    }
    return typeof uri === 'string' ? uri : null;
};

/**
 * Helper function to process images from the review
 */
const processImages = (images) => {
    if (!images) return [];
    if (!Array.isArray(images)) return [validateUri(images)].filter(Boolean);
    return images.map(validateUri).filter(Boolean);
};

export function ReviewForm({ review, mode = 'create', onSubmit, formRef }) {
    const [validationSchema, setValidationSchema] = useState(getReviewValidationSchema());
    const [fieldConfig, setFieldConfig] = useState([]);

    const handleSubmit = (values) => {
        // Process any data transformations if needed
        const processedData = {
            ...values,
            rating: parseInt(values.rating) || 5,
        };
        onSubmit(processedData);
    };

    useEffect(() => {
        // Configure fields based on mode
        const fieldsOptions = {
            includeImages: true,
            includeUser: mode !== 'create',
            includeOrder: mode !== 'create',
        };

        // Configure validation based on mode
        const validationOptions = {
            requireRating: true,
            requireUser: mode !== 'create',
            requireOrder: mode !== 'create',
        };

        // Set dynamic configuration
        setFieldConfig(getReviewFields(fieldsOptions));
        setValidationSchema(getReviewValidationSchema(validationOptions));
    }, [mode, review]);

    // Prepare initial form values
    const getInitialValues = () => {
        if (!review) return initialReviewValues;

        return {
            ...initialReviewValues,
            ...review,
            images: processImages(review.images),
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
