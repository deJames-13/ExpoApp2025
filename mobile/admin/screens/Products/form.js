import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';  
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';

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
            includeImages: true
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

    return (
        <ResourceForm
            initialValues={{
                ...initialProductValues,
                ...(product || {}),
                image: product?.image || null,
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