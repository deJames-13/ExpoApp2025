import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';

/**
 * Helper function to ensure each URI is a valid string
 */
const validateUri = (uri) => {
    if (!uri) return null;
    if (typeof uri === 'object' && uri !== null) {
        return uri.uri || uri.path || null;
    }
    return typeof uri === 'string' ? uri : null;
};

export function ProductForm({ product, mode = 'create', onSubmit, formRef }) {
    const [validationSchema, setValidationSchema] = useState(getProductValidationSchema());
    const [fieldConfig, setFieldConfig] = useState([]);

    const handleSubmit = (values) => {
        const processedData = {
            ...values,
            price: parseFloat(values.price) || 0,
            stock: parseInt(values.stock) || 0,
        };
        onSubmit(processedData);
    };

    useEffect(() => {
        const fieldsOptions = {
            includeAdvancedFields: mode !== 'create',
            includeImages: true,
            includeCamera: true,
            allowMultipleImages: true
        };

        // Configure validation based on mode
        const validationOptions = {
            requireName: true,
            requirePrice: true,
            requireStock: mode !== 'view',
            requireBrand: true,
            requireCategory: true,
            requireStatus: true
        };

        // Set dynamic configuration
        setFieldConfig(getProductFields(fieldsOptions));
        setValidationSchema(getProductValidationSchema(validationOptions));
    }, [mode, product]);

    // Process images from product
    const getInitialImages = () => {
        if (!product) return null;

        // Handle existing single image or array of images
        if (product.images && Array.isArray(product.images)) {
            // Filter and validate each URI in the array
            const validImages = product.images
                .map(validateUri)
                .filter(uri => uri !== null);
            return validImages.length > 0 ? validImages : null;
        } else if (product.image) {
            const validUri = validateUri(product.image);
            return validUri ? [validUri] : null;
        } else if (product.productImage) {
            if (typeof product.productImage === 'string') {
                return [product.productImage];
            } else if (Array.isArray(product.productImage)) {
                // Filter and validate each URI in the array
                const validImages = product.productImage
                    .map(validateUri)
                    .filter(uri => uri !== null);
                return validImages.length > 0 ? validImages : null;
            } else {
                const validUri = validateUri(product.productImage);
                return validUri ? [validUri] : null;
            }
        } else if (product.cameraImage) {
            const validUri = validateUri(product.cameraImage);
            return validUri ? [validUri] : null;
        }
        return null;
    };

    return (
        <ResourceForm
            initialValues={{
                ...initialProductValues,
                ...(product || {}),
                productImages: getInitialImages(),
                featured: product?.featured || false,
                rating: product?.rating || 0
            }}
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