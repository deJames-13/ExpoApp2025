import { productStatusOptions } from './validation';

/**
 * Get field configuration for product forms
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeImages - Whether to include image fields
 * @param {boolean} options.includeCamera - Whether to include camera field
 * @param {boolean} options.includeAdvancedFields - Whether to include advanced fields like ratings
 * @param {boolean} options.allowMultipleImages - Whether to allow multiple image selection
 * @param {boolean} options.showImagesAsCarousel - Whether to display images as a carousel
 * @param {Object} options.customFields - Custom fields to include
 * @param {Array} options.exclude - Field names to exclude
 * @param {Array} options.brandOptions - Options for brand dropdown
 * @param {Array} options.categoryOptions - Options for category dropdown
 * @param {Array} options.supplierOptions - Options for supplier dropdown
 * @returns {Array} Field configuration array
 */
export const getProductFields = (options = {}) => {
    const {
        includeImages = true,
        includeCamera = true,
        includeAdvancedFields = true,
        allowMultipleImages = false,
        showImagesAsCarousel = false,
        customFields = {},
        exclude = [],
        brandOptions = [],
        categoryOptions = [],
        supplierOptions = []
    } = options;

    // Base required fields
    const baseFields = [
        {
            type: 'text',
            field: 'name',
            label: 'Product Name'
        },
        {
            row: true,
            fields: [
                {
                    type: 'price',
                    field: 'price',
                    label: 'Price'
                },
                {
                    type: 'number-input',
                    field: 'stock',
                    label: 'Stock',
                    min: 0,
                    step: 1,
                }
            ]
        },
        {
            row: true,
            fields: [
                {
                    type: 'select',
                    field: 'brand',
                    label: 'Brand',
                    options: brandOptions,
                    containerStyle: { zIndex: 3000 }, // Ensure dropdown appears above other elements
                    dropdownStyle: { 
                        maxHeight: 300, // Further increased height to show more items
                        backgroundColor: '#ffffff', // White background
                        borderColor: '#e0e0e0', // Light gray border
                        borderWidth: 1,
                        borderRadius: 5,
                        // Use auto instead of scroll for React Native
                        overflow: 'auto',
                        // Add shadow for better visibility
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                    },
                    itemTextStyle: { color: '#000000' }, // Black text for dropdown items
                    itemContainerStyle: { 
                        backgroundColor: '#ffffff', // White background for items
                        paddingVertical: 10, // Add more padding for better tap targets
                    },
                    activeItemContainerStyle: { backgroundColor: '#f5f5f5' }, // Light gray for selected item
                    activeItemTextStyle: { color: '#000000', fontWeight: '500' }, // Black text for selected item
                    style: { minHeight: 50 },
                    scrollViewProps: {
                        nestedScrollEnabled: true, // Enable nested scrolling
                        showsVerticalScrollIndicator: true, // Show scroll indicator
                        contentContainerStyle: { flexGrow: 1 },
                        keyboardShouldPersistTaps: 'handled',
                    }
                },
                {
                    type: 'select',
                    field: 'category',
                    label: 'Category',
                    options: categoryOptions,
                    containerStyle: { zIndex: 2900 }, // Ensure dropdown appears above other elements
                    dropdownStyle: { 
                        maxHeight: 300, // Further increased height to show more items
                        backgroundColor: '#ffffff', // White background
                        borderColor: '#e0e0e0', // Light gray border
                        borderWidth: 1,
                        borderRadius: 5,
                        // Use auto instead of scroll for React Native
                        overflow: 'auto',
                        // Add shadow for better visibility
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 4,
                    },
                    itemTextStyle: { color: '#000000' }, // Black text for dropdown items
                    itemContainerStyle: { 
                        backgroundColor: '#ffffff', // White background for items
                        paddingVertical: 10, // Add more padding for better tap targets
                    },
                    activeItemContainerStyle: { backgroundColor: '#f5f5f5' }, // Light gray for selected item
                    activeItemTextStyle: { color: '#000000', fontWeight: '500' }, // Black text for selected item
                    style: { minHeight: 50 },
                    scrollViewProps: {
                        nestedScrollEnabled: true, // Enable nested scrolling
                        showsVerticalScrollIndicator: true, // Show scroll indicator
                        contentContainerStyle: { flexGrow: 1 },
                        keyboardShouldPersistTaps: 'handled',
                    }
                }
            ]
        },
        {
            type: 'select',
            field: 'supplier',
            label: 'Supplier',
            options: supplierOptions,
            containerStyle: { zIndex: 2800 }, // Ensure dropdown appears above other elements
            dropdownStyle: { 
                maxHeight: 300, // Further increased height to show more items
                backgroundColor: '#ffffff', // White background
                borderColor: '#e0e0e0', // Light gray border
                borderWidth: 1,
                borderRadius: 5,
                // Use auto instead of scroll for React Native
                overflow: 'auto',
                // Add shadow for better visibility
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 4,
            },
            itemTextStyle: { color: '#000000' }, // Black text for dropdown items
            itemContainerStyle: { 
                backgroundColor: '#ffffff', // White background for items
                paddingVertical: 10, // Add more padding for better tap targets
            },
            activeItemContainerStyle: { backgroundColor: '#f5f5f5' }, // Light gray for selected item
            activeItemTextStyle: { color: '#000000', fontWeight: '500' }, // Black text for selected item
            style: { minHeight: 50 },
            scrollViewProps: {
                nestedScrollEnabled: true, // Enable nested scrolling
                showsVerticalScrollIndicator: true, // Show scroll indicator
                contentContainerStyle: { flexGrow: 1 },
                keyboardShouldPersistTaps: 'handled',
            }
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
            multiple: allowMultipleImages,
            displayAsCarousel: showImagesAsCarousel,
            carouselHeight: 250,
            carouselWidth: '100%',
            carouselAutoplay: true,
            carouselIndicatorStyle: { backgroundColor: '#2089dc' },
            carouselActiveIndicatorStyle: { backgroundColor: '#0056b3' },
            deleteIconColor: '#ff6b6b',
            previewMaxHeight: 300,
            resizeMode: 'cover',
            renderImagePreview: true, // Ensures image previews are rendered
            debug: true // Add this temporarily to help diagnose image issues
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
