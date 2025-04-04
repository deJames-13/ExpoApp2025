import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ResourceForm } from '~/components/ResourceForm';
import {
    getProductValidationSchema,
    initialProductValues,
} from './validation';
import { getProductFields } from './form-config';
import useResource from '~/hooks/useResource';
import { createHybridFormData, isRemoteUrl, normalizeImageUri } from '~/utils/imageUpload';
const VERBOSE = true;
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

    const isMounted = useRef(true);
    const initialLoadComplete = useRef(false);
    const lastOptionsUpdate = useRef(null);

    const brandResource = useResource({ resourceName: 'brands', silent: true });
    const categoryResource = useResource({ resourceName: 'categories', silent: true });
    const supplierResource = useResource({ resourceName: 'suppliers', silent: true });

    const brands = useMemo(() => brandResource.states.data || [], [brandResource.states.data]);
    const categories = useMemo(() => categoryResource.states.data || [], [categoryResource.states.data]);
    const suppliers = useMemo(() => supplierResource.states.data || [], [supplierResource.states.data]);

    const brandsLoading = useMemo(() => brandResource.states.loading, [brandResource.states.loading]);
    const categoriesLoading = useMemo(() => categoryResource.states.loading, [categoryResource.states.loading]);
    const suppliersLoading = useMemo(() => supplierResource.states.loading, [supplierResource.states.loading]);

    const hasMoreFlags = useMemo(() => ({
        brands: !!(brandResource.states.meta && brandResource.states.meta.hasMore),
        categories: !!(categoryResource.states.meta && categoryResource.states.meta.hasMore),
        suppliers: !!(supplierResource.states.meta && supplierResource.states.meta.hasMore),
    }), [
        brandResource.states.meta,
        categoryResource.states.meta,
        supplierResource.states.meta
    ]);

    const optionMappings = useMemo(() => ({
        brandOptions: brands.map(brand => ({
            label: brand.name,
            value: brand._id || brand.id,
            item: brand
        })),
        categoryOptions: categories.map(category => ({
            label: category.name,
            value: category._id || category.id,
            item: category
        })),
        supplierOptions: suppliers.map(supplier => ({
            label: supplier.name,
            value: supplier._id || supplier.id,
            item: supplier
        }))
    }), [brands, categories, suppliers]);

    const getInitialImages = useCallback(() => {
        if (!product) return null;
        const processImageUrl = (url) => {
            const validUri = validateUri(url);
            if (!validUri) return null;
            return isRemoteUrl(validUri) ? validUri : normalizeImageUri(validUri);
        };

        if (product.images && Array.isArray(product.images)) {
            const validImages = product.images
                .map(img => {
                    if (typeof img === 'string') return processImageUrl(img);
                    return processImageUrl(img.url || img.uri || img);
                })
                .filter(uri => uri !== null);

            return validImages.length > 0 ? validImages : null;
        } else if (product.image) {
            const validUri = processImageUrl(product.image);
            return validUri ? [validUri] : null;
        } else if (product.productImage) {
            if (typeof product.productImage === 'string') {
                return [processImageUrl(product.productImage)].filter(Boolean);
            } else if (Array.isArray(product.productImage)) {
                const validImages = product.productImage
                    .map(processImageUrl)
                    .filter(uri => uri !== null);
                return validImages.length > 0 ? validImages : null;
            } else {
                const validUri = processImageUrl(product.productImage);
                return validUri ? [validUri] : null;
            }
        } else if (product.cameraImage) {
            const validUri = processImageUrl(product.cameraImage);
            return validUri ? [validUri] : null;
        }
        return null;
    }, [product]);

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

    const handleSubmit = useCallback(async (values) => {
        try {
            const { productImages, images, ...productInfo } = values;
            const uploadImages = productImages || images || [];
            const processedData = {
                ...productInfo,
                price: parseFloat(productInfo.price) || 0,
                stock: parseInt(productInfo.stock) || 0,
                category: typeof productInfo.category === 'object' ? productInfo.category.name : productInfo.category,
                brand: typeof productInfo.brand === 'object' ? productInfo.brand.name : productInfo.brand,
                supplier: typeof productInfo.supplier === 'object' ? productInfo.supplier.name : productInfo.supplier,
            };
            VERBOSE && console.log(`[ProductForm] ${mode.toUpperCase()} Request Payload:`, {
                id: product?._id || product?.id,
                ...processedData,
                hasImages: uploadImages.length > 0
            });

            // Return raw data instead of creating FormData
            const rawSubmitData = {
                productData: processedData,
                images: uploadImages,
                productId: product?._id || product?.id
            };

            const response = await onSubmit(rawSubmitData);
            VERBOSE && console.log(`[ProductForm] ${mode.toUpperCase()} Response:`, response);
            return response;
        } catch (error) {
            VERBOSE && console.error(`[ProductForm] ${mode.toUpperCase()} Error:`, error);
            throw error;
        }
    }, [onSubmit, product, mode]);

    const handleSearchBrand = useCallback((query) => {
        return brandResource.actions.fetchDatas({ qStr: `?search=${query}` });
    }, [brandResource.actions]);

    const handleSearchCategory = useCallback((query) => {
        return categoryResource.actions.fetchDatas({ qStr: `?search=${query}` });
    }, [categoryResource.actions]);

    const handleSearchSupplier = useCallback((query) => {
        return supplierResource.actions.fetchDatas({ qStr: `?search=${query}` });
    }, [supplierResource.actions]);

    const handleLoadMoreBrands = useCallback(() => {
        const page = brandResource.states.meta?.currentPage || 1;
        return brandResource.actions.fetchDatas({
            qStr: `?page=${page + 1}`,
            verbose: false
        });
    }, [brandResource.actions, brandResource.states.meta]);

    const handleLoadMoreCategories = useCallback(() => {
        const page = categoryResource.states.meta?.currentPage || 1;
        return categoryResource.actions.fetchDatas({
            qStr: `?page=${page + 1}`,
            verbose: false
        });
    }, [categoryResource.actions, categoryResource.states.meta]);

    const handleLoadMoreSuppliers = useCallback(() => {
        const page = supplierResource.states.meta?.currentPage || 1;
        return supplierResource.actions.fetchDatas({
            qStr: `?page=${page + 1}`,
            verbose: false
        });
    }, [supplierResource.actions, supplierResource.states.meta]);

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            try {
                await Promise.all([
                    brandResource.actions.fetchDatas(),
                    categoryResource.actions.fetchDatas(),
                    supplierResource.actions.fetchDatas()
                ]);
            } catch (error) {
                console.error('Error loading product form data:', error);
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                    initialLoadComplete.current = true;
                }
            }
        };

        if (!initialLoadComplete.current) {
            loadInitialData();
        }

        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        const currentState = JSON.stringify({
            brands: optionMappings.brandOptions.length,
            categories: optionMappings.categoryOptions.length,
            suppliers: optionMappings.supplierOptions.length,
            loading,
            brandsLoading,
            categoriesLoading,
            suppliersLoading,
            hasMoreBrands: hasMoreFlags.brands,
            hasMoreCategories: hasMoreFlags.categories,
            hasMoreSuppliers: hasMoreFlags.suppliers
        });

        if (lastOptionsUpdate.current !== currentState) {
            lastOptionsUpdate.current = currentState;

            const config = getProductFields({
                includeImages: true,
                includeCamera: true,
                includeAdvancedFields: true,
                allowMultipleImages: true,
                brandOptions: optionMappings.brandOptions,
                categoryOptions: optionMappings.categoryOptions,
                supplierOptions: optionMappings.supplierOptions,
                fieldLoading: loading,
                brandsLoading,
                categoriesLoading,
                suppliersLoading,
                hasMoreBrands: hasMoreFlags.brands,
                hasMoreCategories: hasMoreFlags.categories,
                hasMoreSuppliers: hasMoreFlags.suppliers,
                onSearchBrand: handleSearchBrand,
                onSearchCategory: handleSearchCategory,
                onSearchSupplier: handleSearchSupplier,
                onLoadMoreBrands: handleLoadMoreBrands,
                onLoadMoreCategories: handleLoadMoreCategories,
                onLoadMoreSuppliers: handleLoadMoreSuppliers,
                allowCreateBrand: true,
                allowCreateCategory: true,
                allowCreateSupplier: true
            });

            setFieldConfig(config);
        }
    }, []);

    useEffect(() => {
        return () => {
            initialLoadComplete.current = false;
        };
    }, []);

    return (
        <ResourceForm
            initialValues={formatInitialValues()}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            mode={mode}
            formRef={formRef}
            fieldConfig={fieldConfig}
            enableReinitialize={true}
            wrapWithScrollView={true}
            scrollViewProps={{
                showsVerticalScrollIndicator: false,
                contentContainerStyle: { padding: 16 }
            }}
        />
    );
}

