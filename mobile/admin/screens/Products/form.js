import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';
import { fetchBrands, fetchCategories, fetchSuppliers, formatProductId, testProductEndpoint, debugProductId } from './data';
import api from '~/axios.config';
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

/**
 * Extracts image URL from various image object formats
 */
const extractImageUrl = (imageObj) => {
    if (!imageObj) return null;
    
    // Handle string URLs directly
    if (typeof imageObj === 'string') {
        return imageObj;
    }
    
    // Handle image objects from API with url or secure_url properties
    if (typeof imageObj === 'object') {
        // Prefer secure URL if available
        if (imageObj.secure_url) {
            return imageObj.secure_url;
        }
        // Fall back to regular URL
        if (imageObj.url) {
            return imageObj.url;
        }
        // Handle local image objects
        if (imageObj.uri || imageObj.path) {
            return imageObj.uri || imageObj.path;
        }
    }
    
    return null;
};

/**
 * Normalizes server image URLs to ensure they have a proper domain prefix if needed
 */
const normalizeImageUrl = (url) => {
    if (!url) return null;
    
    // If the URL already has http/https, return it as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    
    // If it's a relative URL, prepend the API base URL
    if (url.startsWith('/')) {
        // Extract the base URL from your API configuration
        const apiBaseUrl = api.defaults.baseURL || '';
        return apiBaseUrl + url;
    }
    
    return url;
};

/**
 * Helper function to properly extract a product ID
 */
const getProductId = (product) => {
    if (!product) return null;
    
    // The API response shows the ID is in the 'id' field
    // In edit mode, prioritize this field over others
    if (product.id) {
        return product.id;
    }
    
    // Check other possible ID formats if 'id' is not available
    const possibleIds = [
        product._id,
        product.resource?._id,
        product.resource?.id
    ];
    
    // Log all possible IDs to help diagnose the issue
    console.log('Possible product IDs:', possibleIds);
    
    // Find the first non-empty ID
    const validId = possibleIds.find(id => id && typeof id === 'string');
    
    if (!validId) {
        console.error('Could not find a valid ID in product:', product);
        return null;
    }
    
    return validId;
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

    // Log the product object when it changes to see its structure
    useEffect(() => {
        if (product) {
            console.log('Product object received:', JSON.stringify(product));
            
            // Try to identify the ID
            const productId = getProductId(product);
            console.log('Extracted product ID:', productId);
        }
    }, [product]);

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

    // Add this new useEffect to handle populating dropdown options with product values
    useEffect(() => {
        if (!product || mode !== 'edit' || isLoading || 
            !brandOptions.length || !categoryOptions.length || !supplierOptions.length) {
            return;
        }

        console.log("Ensuring product values exist in dropdowns:", {
            brand: product.brand,
            category: product.category,
            supplier: product.supplier
        });

        let updatedBrandOptions = [...brandOptions];
        let updatedCategoryOptions = [...categoryOptions];
        let updatedSupplierOptions = [...supplierOptions];
        let madeChanges = false;

        // Handle brand
        if (product.brand) {
            const brandName = typeof product.brand === 'string' 
                ? product.brand 
                : (product.brand.name || '');
            
            const brandExists = brandOptions.some(opt => 
                opt.value === brandName || opt.label === brandName
            );
            
            if (!brandExists && brandName) {
                console.log(`Adding brand option: ${brandName}`);
                updatedBrandOptions.push({
                    value: brandName,
                    label: brandName
                });
                madeChanges = true;
            }
        }
        
        // Handle category
        if (product.category) {
            const categoryName = typeof product.category === 'string' 
                ? product.category 
                : (product.category.name || '');
            
            const categoryExists = categoryOptions.some(opt => 
                opt.value === categoryName || opt.label === categoryName
            );
            
            if (!categoryExists && categoryName) {
                console.log(`Adding category option: ${categoryName}`);
                updatedCategoryOptions.push({
                    value: categoryName,
                    label: categoryName
                });
                madeChanges = true;
            }
        }
        
        // Handle supplier
        if (product.supplier) {
            const supplierName = typeof product.supplier === 'string' 
                ? product.supplier 
                : (product.supplier.name || '');
            
            const supplierExists = supplierOptions.some(opt => 
                opt.value === supplierName || opt.label === supplierName
            );
            
            if (!supplierExists && supplierName) {
                console.log(`Adding supplier option: ${supplierName}`);
                updatedSupplierOptions.push({
                    value: supplierName,
                    label: supplierName
                });
                madeChanges = true;
            }
        }
        
        // Only update state if we made changes to avoid infinite renders
        if (madeChanges) {
            setBrandOptions(updatedBrandOptions);
            setCategoryOptions(updatedCategoryOptions);
            setSupplierOptions(updatedSupplierOptions);
        }
    }, [product, mode, isLoading, brandOptions, categoryOptions, supplierOptions]);

    const tryUpdateProduct = async (product, data, options) => {
        try {
          // First check if updateProduct is imported
          if (typeof updateProduct === 'function') {
            return await updateProduct(product, data, options);
          }
          
          // If not imported, use inline implementation that matches the one in data.js
          const productId = formatProductId(product);
          if (!productId) throw new Error('Invalid product ID for update');
          
          const config = {
            headers: {
              'Content-Type': options.formData ? 'multipart/form-data' : 'application/json',
              'Authorization': authToken ? `Bearer ${authToken}` : ''
            }
          };
          
          // Try multiple endpoints
          const endpoints = [
            `/api/v1/products/${productId}`,
            `/api/products/${productId}`,
            `/products/${productId}`
          ];
          
          let response = null;
          let error = null;
          
          for (const endpoint of endpoints) {
            try {
              console.log(`Trying endpoint: ${endpoint}`);
              response = await api.patch(
                endpoint,
                options.formData || data,
                config
              );
              if (response && response.data) {
                console.log(`Success with endpoint: ${endpoint}`);
                return response.data;
              }
            } catch (err) {
              error = err;
              console.warn(`Failed with endpoint ${endpoint}:`, err.message);
            }
          }
          
          throw error || new Error('All update endpoints failed');
        } catch (error) {
          console.error('Error in tryUpdateProduct:', error);
          throw error;
        }
      };

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
        
        // Find the corresponding name for each selected ID or value
        // Reviewing your controller code, we need to make sure these values are handled correctly
        if (values.brand) {
            // Find the brand by value (could be ID or name)
            const selectedBrand = brandOptions.find(option => option.value === values.brand);
            if (selectedBrand) {
                // Pass the brand name as that's what your backend expects
                productData.brand = selectedBrand.label;
            } else {
                // If we don't find a match, use the value directly
                productData.brand = values.brand;
            }
        }
        
        if (values.category) {
            // Find the category by value (could be ID or name)
            const selectedCategory = categoryOptions.find(option => option.value === values.category);
            if (selectedCategory) {
                // Pass the category name as that's what your backend expects
                productData.category = selectedCategory.label;
            } else {
                // If we don't find a match, use the value directly
                productData.category = values.category;
            }
        }
        
        if (values.supplier) {
            // Find the supplier by value (could be ID or name)
            const selectedSupplier = supplierOptions.find(option => option.value === values.supplier);
            if (selectedSupplier) {
                // Pass the supplier name as that's what your backend expects
                productData.supplier = selectedSupplier.label;
            } else {
                // If we don't find a match, use the value directly
                productData.supplier = values.supplier;
            }
        }
        
        console.log('Formatted data for brand, category, supplier:', {
            brand: productData.brand,
            category: productData.category,
            supplier: productData.supplier
        });
        
        // Handle featured and rating if they exist
        if (values.featured !== undefined) {
            productData.featured = values.featured;
        }
        
        if (values.rating !== undefined) {
            productData.averageRating = parseFloat(values.rating);
        }

        console.log('Submitting product data:', productData);
        console.log('Product ID for update:', getProductId(product));
        
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
        
        // Create a separate function to track which original images were removed
        const getRemovedImages = () => {
            // If there are no images in the product, or no values.productImages, there's nothing to compare
            if (!product?.images || !product.images.length || !values.productImages) {
                return [];
            }
            
            // Extract URLs from the original product images
            const originalImageUrls = product.images
                .map(img => extractImageUrl(img))
                .filter(url => url !== null);
            
            // Extract URLs from the current values.productImages
            const currentImageUrls = values.productImages
                .filter(img => typeof img === 'string' && (
                    img.startsWith('http://') || 
                    img.startsWith('https://') ||
                    img.includes('cloudinary.com')
                ));
            
            console.log('Original images:', originalImageUrls);
            console.log('Current images after edit:', currentImageUrls);
            
            // Find URLs that are in originalImageUrls but not in currentImageUrls
            const removedImages = originalImageUrls.filter(url => !currentImageUrls.includes(url));
            console.log('Removed images:', removedImages);
            
            return removedImages;
        };
        
        // If we have images or if we're in edit mode, use FormData
        if ((values.productImages && values.productImages.length > 0) || mode === 'edit') {
            formData = new FormData();
            
            // Add all regular fields to FormData
            Object.keys(productData).forEach(key => {
                // Convert boolean values to strings for FormData
                if (typeof productData[key] === 'boolean') {
                    formData.append(key, productData[key].toString());
                } else {
                    formData.append(key, productData[key]);
                }
            });
            
            // Track which existing images to keep
            let existingImageUrls = [];
            let hasNewImages = false;
            
            // Process and add images if there are any
            if (values.productImages && values.productImages.length > 0) {
                values.productImages.forEach((image, index) => {
                    // If this is a URL from an existing server image
                    if (typeof image === 'string' && (
                        image.startsWith('http://') || 
                        image.startsWith('https://') ||
                        image.includes('cloudinary.com')
                    )) {
                        // Keep track of this existing image URL
                        existingImageUrls.push(image);
                    } else if (typeof image === 'string' && image.startsWith('data:image')) {
                        // Base64 images
                        formData.append('base64Files', image);
                        hasNewImages = true;
                    } else {
                        // New file URIs
                        const fileType = 'image/jpeg';
                        const fileName = `product_image_${index}.jpg`;
                        
                        const imageFile = {
                            uri: image,
                            type: fileType,
                            name: fileName
                        };
                        
                        formData.append('image', imageFile);
                        hasNewImages = true;
                    }
                });
                
                // Add existing image URLs as a JSON string if there are any
                if (existingImageUrls.length > 0) {
                    console.log('Existing images to keep:', existingImageUrls);
                    formData.append('existingImages', JSON.stringify(existingImageUrls));
                } else if (mode === 'edit') {
                    // If we're in edit mode and there are no existing images to keep,
                    // send an empty array to indicate we want to remove all existing images
                    console.log('Removing all existing images');
                    formData.append('existingImages', JSON.stringify([]));
                }
            } else if (mode === 'edit') {
                // If no images were selected at all in edit mode,
                // explicitly send an empty array to clear all images
                console.log('No images selected, removing all existing images');
                formData.append('existingImages', JSON.stringify([]));
            }
            
            // Get list of removed images to help with debugging
            const removedImages = getRemovedImages();
            if (removedImages.length > 0) {
                console.log(`User removed ${removedImages.length} images:`, removedImages);
                // You can also add these to formData if your controller has specific handling for them
                formData.append('removedImages', JSON.stringify(removedImages));
            }
            
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
        } else if (mode === 'edit') {
            // Get the product ID correctly from the product object
            const productId = product.id || getProductId(product);
            
            console.log('Product object for update:', product);
            console.log('Extracted product ID for update:', productId);
            
            if (!productId) {
                throw new Error('Missing or invalid product ID for update. Please reload and try again.');
            }
            
            // Use the correct endpoint format for updating
            const endpoint = `/api/v1/products/edit/${productId}`;
            console.log(`Using endpoint: ${endpoint} for product update`);
            
            try {
                // Send the update request
                console.log("Sending update with form data:", 
                    formData ? 'FormData with images' : 'JSON data without images');
                
                // Use PATCH method to match your backend routes
                response = await api.patch(
                    endpoint,
                    formData || productData,
                    config
                );
                
                console.log('Update response:', response.data);
            } catch (updateError) {
                console.error('Update failed:', updateError.message);
                
                if (updateError.response?.status === 500) {
                    // Log detailed server error
                    console.error('Server error details:', updateError.response.data);
                    
                    // Try an alternative approach - rebuild the form data with simpler structure
                    try {
                        console.log("Trying alternative format for update...");
                        
                        // Create a new FormData instance to ensure clean data
                        const alternativeFormData = new FormData();
                        
                        // Add core fields
                        alternativeFormData.append('name', productData.name);
                        alternativeFormData.append('description', productData.description);
                        alternativeFormData.append('price', productData.price.toString());
                        alternativeFormData.append('stock', productData.stock.toString());
                        alternativeFormData.append('status', productData.status);
                        
                        // Add category, brand, supplier as strings (not objects)
                        if (productData.category) {
                            alternativeFormData.append('category', productData.category);
                        }
                        
                        if (productData.brand) {
                            alternativeFormData.append('brand', productData.brand);
                        }
                        
                        if (productData.supplier) {
                            alternativeFormData.append('supplier', productData.supplier);
                        }
                        
                        // Handle boolean values
                        if (productData.featured !== undefined) {
                            alternativeFormData.append('featured', productData.featured.toString());
                        }
                        
                        // Handle rating/averageRating
                        if (productData.averageRating !== undefined) {
                            alternativeFormData.append('averageRating', productData.averageRating.toString());
                        }
                        
                        // Handle existing images
                        if (product.images && product.images.length > 0) {
                            const existingImageUrls = product.images
                                .map(img => extractImageUrl(img))
                                .filter(url => url !== null);
                            
                            if (existingImageUrls.length > 0) {
                                console.log('Preserving existing product images:', existingImageUrls);
                                alternativeFormData.append('existingImages', JSON.stringify(existingImageUrls));
                                alternativeFormData.append('keepExistingImages', 'true');
                            }
                        }
                        
                        // Re-add new images if we had them
                        if (values.productImages && values.productImages.length > 0) {
                            let existingImageUrls = [];
                            
                            values.productImages.forEach((image, index) => {
                                if (typeof image === 'string' && (
                                    image.startsWith('http://') || 
                                    image.startsWith('https://') ||
                                    image.includes('cloudinary.com')
                                )) {
                                    existingImageUrls.push(image);
                                } else if (typeof image === 'string' && image.startsWith('data:image')) {
                                    alternativeFormData.append('base64Files', image);
                                } else {
                                    const imageFile = {
                                        uri: image,
                                        type: 'image/jpeg',
                                        name: `product_image_${index}.jpg`
                                    };
                                    alternativeFormData.append('image', imageFile);
                                }
                            });
                            
                            if (existingImageUrls.length > 0) {
                                alternativeFormData.append('existingImages', JSON.stringify(existingImageUrls));
                            }
                        } else {
                            // If no images are selected, explicitly set empty array
                            console.log('No images selected in alternative approach - removing all images');
                            alternativeFormData.append('existingImages', JSON.stringify([]));
                        }
                        
                        // Add removed images information
                        const removedImages = getRemovedImages();
                        if (removedImages.length > 0) {
                            console.log('Alternative approach: removed images:', removedImages);
                            alternativeFormData.append('removedImages', JSON.stringify(removedImages));
                        }
                        
                        // Send the alternative format request
                        console.log("Sending alternative format...");
                        response = await api.patch(
                            endpoint,
                            alternativeFormData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                    'Authorization': authToken ? `Bearer ${authToken}` : ''
                                }
                            }
                        );
                        
                        console.log('Alternative format update succeeded');
                    } catch (alternativeError) {
                        console.error('Alternative format failed:', alternativeError.message);
                        throw updateError; // Throw the original error
                    }
                } else {
                    throw updateError; // Rethrow if not a 500 error
                }
            }
        } else {
            throw new Error('Invalid form mode');
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
            
            if (error.response.status === 404) {
                errorMessage = 'Product not found. The API endpoint may be incorrect or the product ID is invalid.';
            } else if (error.response.status === 401) {
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
            showImagesAsCarousel: true,
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

        console.log("Processing product images:", JSON.stringify(product.images || []));
        
        // Handle the specific structure from the API response
        if (product.images && Array.isArray(product.images)) {
            // Map each image object to its URL
            const validImages = product.images
                .map(img => extractImageUrl(img))
                .filter(url => url !== null);
            
            console.log("Extracted image URLs:", validImages);
            return validImages.length > 0 ? validImages : null;
        }
        
        // Handle fallback cases
        if (product.image) {
            const validUri = extractImageUrl(product.image);
            return validUri ? [validUri] : null;
        }

        // Handle different image formats that might come from the server
        if (product.images && Array.isArray(product.images)) {
            // Filter and validate each URI in the array
            const validImages = product.images
                .map(img => normalizeImageUrl(validateUri(img)))
                .filter(uri => uri !== null);
            return validImages.length > 0 ? validImages : null;
        } else if (product.image) {
            const validUri = normalizeImageUrl(validateUri(product.image));
            return validUri ? [validUri] : null;
        } else if (product.productImages) {
            if (typeof product.productImages === 'string') {
                return [normalizeImageUrl(product.productImages)];
            } else if (Array.isArray(product.productImages)) {
                // Filter and validate each URI in the array
                const validImages = product.productImages
                    .map(img => normalizeImageUrl(validateUri(img)))
                    .filter(uri => uri !== null);
                return validImages.length > 0 ? validImages : null;
            } else {
                const validUri = normalizeImageUrl(validateUri(product.productImages));
                return validUri ? [validUri] : null;
            }
        } else if (product.productImage) {
            if (typeof product.productImage === 'string') {
                return [normalizeImageUrl(product.productImage)];
            } else if (Array.isArray(product.productImage)) {
                // Filter and validate each URI in the array
                const validImages = product.productImage
                    .map(img => normalizeImageUrl(validateUri(img)))
                    .filter(uri => uri !== null);
                return validImages.length > 0 ? validImages : null;
            } else {
                const validUri = normalizeImageUrl(validateUri(product.productImage));
                return validUri ? [validUri] : null;
            }
        } else if (product.cameraImage) {
            const validUri = normalizeImageUrl(validateUri(product.cameraImage));
            return validUri ? [validUri] : null;
        }
        return null;
    };

    // Prepare initial values with correct ID formats for dropdowns
    const getInitialValues = () => {
        if (!product) return initialProductValues;
        
        console.log("Preparing initial values for product:", product.name);
        
        // Extract the correct values for dropdowns based on the product data
        let brandValue = '';
        let categoryValue = '';
        let supplierValue = '';
        
        // Handle brand
        if (product.brand) {
            const brandName = typeof product.brand === 'string' 
                ? product.brand 
                : (product.brand.name || '');
            
            // Find matching brand in options
            const matchingBrand = brandOptions.find(b => 
                b.label === brandName || b.value === brandName
            );
            
            brandValue = matchingBrand ? matchingBrand.value : brandName;
            console.log(`Brand: ${brandName} -> Selected value: ${brandValue}`);
        }
        
        // Handle category
        if (product.category) {
            const categoryName = typeof product.category === 'string' 
                ? product.category 
                : (product.category.name || '');
            
            // Find matching category in options
            const matchingCategory = categoryOptions.find(c => 
                c.label === categoryName || c.value === categoryName
            );
            
            categoryValue = matchingCategory ? matchingCategory.value : categoryName;
            console.log(`Category: ${categoryName} -> Selected value: ${categoryValue}`);
        }
        
        // Handle supplier
        if (product.supplier) {
            const supplierName = typeof product.supplier === 'string' 
                ? product.supplier 
                : (product.supplier.name || '');
            
            // Find matching supplier in options
            const matchingSupplier = supplierOptions.find(s => 
                s.label === supplierName || s.value === supplierName
            );
            
            supplierValue = matchingSupplier ? matchingSupplier.value : supplierName;
            console.log(`Supplier: ${supplierName} -> Selected value: ${supplierValue}`);
        }
        
        return {
            ...initialProductValues,
            ...product,
            // Use extracted values for dropdowns that will match our options
            brand: brandValue,
            category: categoryValue,
            supplier: supplierValue,
            productImages: getInitialImages(),
            featured: product?.featured || false,
            rating: product?.rating || product?.averageRating || 0
        };
    };

    // In the main component, add a debug log to see the product object
    useEffect(() => {
        if (product && mode === 'edit') {
            console.log('Product for editing:', {
                id: product.id,
                _id: product._id,
                name: product.name,
                fullObject: product
            });
        }
    }, [product, mode]);

    if (isLoading) {
        return null; // or a loading indicator
    }

    console.log("Current dropdown options count:", {
        brands: brandOptions.length,
        categories: categoryOptions.length,
        suppliers: supplierOptions.length
    });

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

// Add this utility function to help with image debugging
const logImageDetails = (images, label) => {
    console.log(`${label || 'Images'} count: ${images?.length || 0}`);
    
    if (images && images.length) {
        images.forEach((img, idx) => {
            if (typeof img === 'string') {
                console.log(`  Image ${idx + 1}: ${img.substring(0, 30)}...`);
            } else if (typeof img === 'object') {
                const url = img.secure_url || img.url || img.uri || 'unknown';
                console.log(`  Image ${idx + 1} (object): ${url.substring(0, 30)}...`);
            } else {
                console.log(`  Image ${idx + 1}: Unknown format - ${typeof img}`);
            }
        });
    }
};

const styles = StyleSheet.create({
    customFormLayout: {
        width: '100%',
        paddingBottom: 20,
    }
});