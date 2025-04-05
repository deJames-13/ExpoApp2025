import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';
import { fetchBrands, fetchCategories, fetchSuppliers } from './data';

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
    const [brandOptions, setBrandOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [supplierOptions, setSupplierOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch dropdown data
    useEffect(() => {
        const loadDropdownData = async () => {
            setIsLoading(true);
            try {
                const [brands, categories, suppliers] = await Promise.all([
                    fetchBrands(),
                    fetchCategories(),
                    fetchSuppliers()
                ]);
                
                setBrandOptions(brands);
                setCategoryOptions(categories);
                setSupplierOptions(suppliers);
            } catch (error) {
                console.error('Error loading form dropdown data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDropdownData();
    }, []);

    const handleSubmit = (values) => {
        const processedData = {
            ...values,
            price: parseFloat(values.price) || 0,
            stock: parseInt(values.stock) || 0,
            // Convert string IDs back to object format if needed by the API
            brand: values.brand ? { _id: values.brand } : null,
            category: values.category ? { _id: values.category } : null,
            supplier: values.supplier ? { _id: values.supplier } : null
        };
        onSubmit(processedData);
    };

    useEffect(() => {
        if (isLoading) return;

        const fieldsOptions = {
            includeAdvancedFields: mode !== 'create',
            includeImages: true,
            includeCamera: true,
            allowMultipleImages: true,
            brandOptions: brandOptions,
            categoryOptions: categoryOptions,
            supplierOptions: supplierOptions
        };

        // Configure validation based on mode
        const validationOptions = {
            requireName: true,
            requirePrice: true,
            requireStock: mode !== 'view',
            requireBrand: true,
            requireCategory: true,
            requireSupplier: true,
            requireStatus: true
        };

        // Set dynamic configuration
        setFieldConfig(getProductFields(fieldsOptions));
        setValidationSchema(getProductValidationSchema(validationOptions));
    }, [mode, product, isLoading, brandOptions, categoryOptions, supplierOptions]);

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

    // Prepare initial values with correct ID formats for dropdowns
    const getInitialValues = () => {
        if (!product) return initialProductValues;
        
        // Extract the correct ID values for dropdowns
        let brandId = '';
        let categoryId = '';
        let supplierId = '';
        
        // Handle different formats of brand data
        if (product.brand) {
            if (typeof product.brand === 'string') {
                brandId = product.brand;
            } else if (typeof product.brand === 'object' && product.brand._id) {
                brandId = product.brand._id;
            }
        }
        
        // Handle different formats of category data
        if (product.category) {
            if (typeof product.category === 'string') {
                categoryId = product.category;
            } else if (typeof product.category === 'object' && product.category._id) {
                categoryId = product.category._id;
            }
        }
        
        // Handle different formats of supplier data
        if (product.supplier) {
            if (typeof product.supplier === 'string') {
                supplierId = product.supplier;
            } else if (typeof product.supplier === 'object' && product.supplier._id) {
                supplierId = product.supplier._id;
            }
        }
        
        return {
            ...initialProductValues,
            ...product,
            // Use extracted ID values for dropdowns
            brand: brandId,
            category: categoryId,
            supplier: supplierId,
            productImages: getInitialImages(),
            featured: product?.featured || false,
            rating: product?.rating || 0
        };
    };

    if (isLoading) {
        return null; // or a loading indicator
    }

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