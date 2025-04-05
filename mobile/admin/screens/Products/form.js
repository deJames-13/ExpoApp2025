import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';
import { fetchBrands, fetchCategories, fetchSuppliers } from './data';
import api from "~/screens/Home/api";
import { getAuthToken, getAuthHeaders } from '~/utils/auth';
import { useSelector } from 'react-redux'; // Import useSelector from Redux

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get the auth token from Redux store
    const authToken = useSelector(state => state.auth?.token);

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

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            
            // Format product data according to product model expectations
            const productData = {
                name: values.name,
                description: values.description || '',
                price: parseFloat(values.price) || 0,
                stock: parseInt(values.stock) || 0,
                status: values.status || 'active',
            };
            
            // Find the corresponding name for each selected ID
            if (values.brand) {
                // Find the brand name from the options based on the selected ID
                const selectedBrand = brandOptions.find(option => option.value === values.brand);
                if (selectedBrand) {
                    productData.brand = selectedBrand.label; // Pass the brand name, not ID
                }
            }
            
            if (values.category) {
                // Find the category name from the options based on the selected ID
                const selectedCategory = categoryOptions.find(option => option.value === values.category);
                if (selectedCategory) {
                    productData.category = selectedCategory.label; // Pass the category name, not ID
                }
            }
            
            if (values.supplier) {
                // Find the supplier name from the options based on the selected ID
                const selectedSupplier = supplierOptions.find(option => option.value === values.supplier);
                if (selectedSupplier) {
                    productData.supplier = selectedSupplier.label; // Pass the supplier name, not ID
                }
            }
            
            // Handle featured and rating if they exist
            if (values.featured !== undefined) {
                productData.featured = values.featured;
            }
            
            if (values.rating !== undefined) {
                productData.averageRating = parseFloat(values.rating);
            }

            console.log('Submitting product data:', productData);
            
            // Use token directly from Redux
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authToken ? `Bearer ${authToken}` : ''
                }
            };
            
            console.log('Using auth token:', authToken ? 'Yes' : 'No');
            
            // Create FormData to handle file uploads properly
            let formData = null;
            let response;
            
            // If we have images, use FormData to send the request
            if (values.productImages && values.productImages.length > 0) {
                formData = new FormData();
                
                // Add all regular fields to FormData
                Object.keys(productData).forEach(key => {
                    formData.append(key, productData[key]);
                });
                
                // Process and add images - use the correct field name expected by the server
                // Looking at the controller code, it expects 'image' field for single file
                // and likely expects 'images' or just 'image' for multiple files
                values.productImages.forEach((image, index) => {
                    if (typeof image === 'string' && image.startsWith('data:image')) {
                        // Base64 images should be sent as base64Files
                        formData.append('base64Files', image);
                    } else {
                        // File URIs - use the field name 'image' as expected by multer config on server
                        const fileType = 'image/jpeg';
                        const fileName = `product_image_${index}.jpg`;
                        
                        const imageFile = {
                            uri: image,
                            type: fileType,
                            name: fileName
                        };
                        
                        // Use 'image' as the field name instead of 'files'
                        formData.append('image', imageFile);
                    }
                });
                
                // Update config for multipart form data
                config.headers['Content-Type'] = 'multipart/form-data';
            }
            
            if (mode === 'create') {
                // Create new product with auth header
                response = await api.post(
                    '/api/v1/products', 
                    formData || productData, 
                    config
                );
            } else if (mode === 'edit' && product?._id) {
                // Update existing product with auth header
                response = await api.put(
                    `/api/v1/products/${product._id}`, 
                    formData || productData, 
                    config
                );
            } else {
                throw new Error('Invalid form mode or missing product ID');
            }
            
            console.log('API Response:', response.data);
            
            if (response.data && response.data.resource) {
                // Success - pass the complete response resource to the parent component
                onSubmit(response.data.resource);
                Alert.alert(
                    "Success",
                    mode === 'create' ? "Product created successfully!" : "Product updated successfully!"
                );
            } else {
                // Response format is unexpected
                throw new Error('Unexpected API response format');
            }
        } catch (error) {
            console.error('Error submitting product:', error);
            
            // Enhanced error handling
            let errorMessage = 'An error occurred while saving the product.';
            
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                
                if (error.response.status === 401) {
                    errorMessage = 'Authentication failed. Please log in again.';
                } else if (error.response.data && error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = `Server error: ${error.response.status}`;
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Error request:', error.request);
                errorMessage = 'No response received from server. Please check your connection.';
            } else {
                // Something happened in setting up the request
                console.error('Error message:', error.message);
                errorMessage = error.message;
            }
            
            Alert.alert(
                "Error",
                errorMessage
            );
            
            // You might want to handle the error differently based on your app's needs
            // For example, you might want to pass the error to the parent component
            if (onSubmit) {
                onSubmit(null, error);
            }
        } finally {
            setIsSubmitting(false);
        }
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
            isSubmitting={isSubmitting}
        />
    );
}

const styles = StyleSheet.create({
    customFormLayout: {
        width: '100%',
        paddingBottom: 20,
    }
});