import { productStatusOptions } from './validation';

/**
 * Get field configuration for product forms
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeImages - Whether to include image fields
 * @param {boolean} options.includeCamera - Whether to include camera field
 * @param {boolean} options.includeAdvancedFields - Whether to include advanced fields like ratings
 * @param {boolean} options.allowMultipleImages - Whether to allow multiple image selection
 * @param {Array} options.brandOptions - Options for brand dropdown
 * @param {Array} options.categoryOptions - Options for category dropdown
 * @param {Array} options.supplierOptions - Options for supplier dropdown
 * @param {boolean} options.fieldLoading - Whether fields are in loading state
 * @param {boolean} options.brandsLoading - Whether brands are loading
 * @param {boolean} options.categoriesLoading - Whether categories are loading
 * @param {boolean} options.suppliersLoading - Whether suppliers are loading
 * @param {boolean} options.hasMoreBrands - Whether more brands can be loaded
 * @param {boolean} options.hasMoreCategories - Whether more categories can be loaded
 * @param {boolean} options.hasMoreSuppliers - Whether more suppliers can be loaded
 * @param {Function} options.onSearchBrand - Function to search brands
 * @param {Function} options.onSearchCategory - Function to search categories
 * @param {Function} options.onSearchSupplier - Function to search suppliers
 * @param {Function} options.onLoadMoreBrands - Function to load more brands
 * @param {Function} options.onLoadMoreCategories - Function to load more categories
 * @param {Function} options.onLoadMoreSuppliers - Function to load more suppliers
 * @param {boolean} options.allowCreateBrand - Whether to allow creating new brands
 * @param {boolean} options.allowCreateCategory - Whether to allow creating new categories
 * @param {boolean} options.allowCreateSupplier - Whether to allow creating new suppliers
 * @param {Object} options.customFields - Custom fields to include
 * @param {Array} options.exclude - Field names to exclude
 * @returns {Array} Field configuration array
 */
export const getProductFields = (options = {}) => {
    const {
        includeImages = true,
        includeCamera = true,
        includeAdvancedFields = true,
        allowMultipleImages = false,
        brandOptions = [],
        categoryOptions = [],
        supplierOptions = [],
        fieldLoading = false,
        brandsLoading = false,
        categoriesLoading = false,
        suppliersLoading = false,
        hasMoreBrands = false,
        hasMoreCategories = false,
        hasMoreSuppliers = false,
        onSearchBrand = null,
        onSearchCategory = null,
        onSearchSupplier = null,
        onLoadMoreBrands = null,
        onLoadMoreCategories = null,
        onLoadMoreSuppliers = null,
        allowCreateBrand = false,
        allowCreateCategory = false,
        allowCreateSupplier = false,
        customFields = {},
        exclude = []
    } = options;

    // Base required fields
    const baseFields = [
        {
            type: 'text',
            field: 'name',
            label: 'Product Name'
        },
        {
            type: 'number-input',
            field: 'stock',
            label: 'Stock',
            min: 0,
            step: 1,
        },
        {
            type: 'price',
            field: 'price',
            label: 'Price'
        },
        {
            type: 'modal-select',
            field: 'brand',
            label: 'Brand',
            options: brandOptions,
            placeholder: brandsLoading ? 'Loading brands...' : 'Select or add brand',
            disabled: fieldLoading,
            loading: brandsLoading,
            withSearch: true,
            onSearch: onSearchBrand,
            onLoadMore: onLoadMoreBrands,
            hasMore: hasMoreBrands,
            allowCreate: allowCreateBrand,
            returnObjectValue: false
        },
        {
            type: 'modal-select',
            field: 'category',
            label: 'Category',
            options: categoryOptions,
            placeholder: categoriesLoading ? 'Loading categories...' : 'Select or add category',
            disabled: fieldLoading,
            loading: categoriesLoading,
            withSearch: true,
            onSearch: onSearchCategory,
            onLoadMore: onLoadMoreCategories,
            hasMore: hasMoreCategories,
            allowCreate: allowCreateCategory,
            returnObjectValue: false
        },
        {
            type: 'modal-select',
            field: 'supplier',
            label: 'Supplier',
            options: supplierOptions,
            placeholder: suppliersLoading ? 'Loading suppliers...' : 'Select or add supplier',
            disabled: fieldLoading,
            loading: suppliersLoading,
            withSearch: true,
            onSearch: onSearchSupplier,
            onLoadMore: onLoadMoreSuppliers,
            hasMore: hasMoreSuppliers,
            allowCreate: allowCreateSupplier,
            returnObjectValue: false
        },
        {
            type: 'radio',
            field: 'status',
            label: 'Product Status',
            options: productStatusOptions.map(status => ({
                value: status,
                label: status.charAt(0).toUpperCase() + status.slice(1)
            })),
            direction: 'horizontal'
        },
        {
            type: 'textarea',
            field: 'description',
            label: 'Description'
        }
    ];

    const imageFields = includeImages ? [
        {
            type: 'image',
            field: 'productImages',
            label: allowMultipleImages ? 'Product Images' : 'Product Image',
            placeholder: allowMultipleImages ? 'Add product images' : 'Add product image',
            width: 300,
            height: 200,
            mode: includeCamera ? 'both' : 'upload',
            aspectRatio: 4 / 3,
            quality: 0.8,
            multiple: allowMultipleImages
        }
    ] : [];

    // Advanced fields
    const advancedFields = includeAdvancedFields ? [
        {
            type: 'checkbox',
            field: 'featured',
            label: 'Featured Product'
        },
        {
            type: 'range',
            field: 'rating',
            label: 'Product Rating',
            min: 0,
            max: 5,
            step: 0.5
        }
    ] : [];

    // Combine all fields
    let allFields = [
        ...baseFields,
        ...imageFields,
        ...advancedFields
    ];

    // Add custom fields
    if (customFields && Object.keys(customFields).length > 0) {
        allFields = [
            ...allFields,
            ...Object.values(customFields)
        ];
    }

    // Filter out excluded fields
    if (exclude && exclude.length > 0) {
        allFields = allFields.filter(field => {
            // For row fields, check if any of the fields should be excluded
            if (field.row) {
                field.fields = field.fields.filter(rowField => !exclude.includes(rowField.field));
                // If there are no fields left, exclude the row
                return field.fields.length > 0;
            }
            // For regular fields, check if it should be excluded
            return !exclude.includes(field.field);
        });
    }

    return allFields;
};
