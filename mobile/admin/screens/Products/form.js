import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';
import useResource from '~/hooks/useResource';

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
    const [loading, setLoading] = useState(false);

    // Fetch related data (brands, categories, suppliers) using RTK Query
    const brandResource = useResource({ resourceName: 'brands', silent: true });
    const categoryResource = useResource({ resourceName: 'categories', silent: true });
    const supplierResource = useResource({ resourceName: 'suppliers', silent: true });

    // Track loading states more specifically
    const [brandsLoading, setBrandsLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [suppliersLoading, setSuppliersLoading] = useState(false);

    useEffect(() => {
        // Fetch related data for dropdowns
        const fetchRelatedData = async () => {
            setLoading(true);
            setBrandsLoading(true);
            setCategoriesLoading(true);
            setSuppliersLoading(true);

            try {
                const brandPromise = brandResource.actions.fetchDatas()
                    .finally(() => setBrandsLoading(false));

                const categoryPromise = categoryResource.actions.fetchDatas()
                    .finally(() => setCategoriesLoading(false));

                const supplierPromise = supplierResource.actions.fetchDatas()
                    .finally(() => { setSuppliersLoading(false) });

                await Promise.all([
                    brandPromise,
                    categoryPromise,
                    supplierPromise
                ]);
            } catch (error) {
                console.error('Error fetching related data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedData();
    }, []);

    useEffect(() => {
        // Get brand, category, and supplier options for form fields
        const brands = brandResource.states.data?.map(brand => ({
            label: brand.name,
            value: brand._id || brand.id,
            item: brand
        })) || [];

        const categories = categoryResource.states.data?.map(category => ({
            label: category.name,
            value: category._id || category.id,
            item: category
        })) || [];

        const suppliers = supplierResource.states.data?.map(supplier => ({
            label: supplier.name,
            value: supplier._id || supplier.id,
            item: supplier
        })) || [];

        const fieldsOptions = {
            includeAdvancedFields: mode !== 'create',
            includeImages: true,
            includeCamera: true,
            allowMultipleImages: true,
            brandOptions: brands,
            categoryOptions: categories,
            supplierOptions: suppliers,
            fieldLoading: loading,
            brandsLoading: brandsLoading,
            categoriesLoading: categoriesLoading,
            suppliersLoading: suppliersLoading,
            returnObjectValue: true // Add this to ensure brand and category are returned as objects
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
    }, [mode, product,
        brandResource.states.data,
        categoryResource.states.data,
        supplierResource.states.data,
        loading, brandsLoading, categoriesLoading, suppliersLoading]);

    // Process images from product
    const getInitialImages = useCallback(() => {
        if (!product) return null;

        // Handle existing single image or array of images
        if (product.images && Array.isArray(product.images)) {
            // Filter and validate each URI in the array
            const validImages = product.images
                .map(img => img.url || img.uri || img)
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
    }, [product]);

    // Format current brand and category for form display
    const formatInitialValues = useCallback(() => {
        if (!product) return initialProductValues;

        return {
            ...initialProductValues,
            ...product,
            brand: product.brand || '',
            category: product.category || '',
            supplier: product.supplier || '',
            productImages: getInitialImages(),
            featured: product.featured || false,
            rating: product.rating || product.averageRating || 0
        };
    }, [product, getInitialImages]);

    // Process form submission with proper data structure for backend
    const handleSubmit = useCallback((values) => {
        const processedData = {
            ...values,
            price: parseFloat(values.price) || 0,
            stock: parseInt(values.stock) || 0,
            category: typeof values.category === 'object' ? values.category.name : values.category,
            brand: typeof values.brand === 'object' ? values.brand.name : values.brand,
            supplier: typeof values.supplier === 'object' ? values.supplier.name : values.supplier,
            images: values.productImages || values.images || []
        };

        // Log the request payload
        console.log(`[ProductForm] ${mode.toUpperCase()} Request Payload:`, {
            id: product?._id || product?.id,
            ...processedData
        });

        // Create a wrapped onSubmit function to log the response
        const submitWithLogging = async (data) => {
            try {
                const response = await onSubmit(data);
                // Log successful response
                console.log(`[ProductForm] ${mode.toUpperCase()} Response:`, response);
                return response;
            } catch (error) {
                // Log error response
                console.error(`[ProductForm] ${mode.toUpperCase()} Error:`, error);
                throw error;
            }
        };

        // Execute the wrapped function
        return submitWithLogging(processedData);
    }, [onSubmit, product, mode]);

    return (
        <ResourceForm
            initialValues={formatInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            mode={mode}
            formRef={formRef}
            layoutProps={{ style: styles.customFormLayout }}
            fieldConfig={fieldConfig}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            enableReinitialize={true}
            isLoading={loading}
        />
    );
}

const styles = StyleSheet.create({
    customFormLayout: {
        width: '100%',
        paddingBottom: 20,
    }
});