import { productStatusOptions } from './validation';

/**
 * Get field configuration for product forms
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeImages - Whether to include image fields
 * @param {boolean} options.includeAdvancedFields - Whether to include advanced fields like ratings
 * @param {Object} options.customFields - Custom fields to include
 * @param {Array} options.exclude - Field names to exclude
 * @returns {Array} Field configuration array
 */
export const getProductFields = (options = {}) => {
    const {
        includeImages = true,
        includeAdvancedFields = true,
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
                    type: 'object',
                    field: 'brand',
                    label: 'Brand'
                },
                {
                    type: 'object',
                    field: 'category',
                    label: 'Category'
                }
            ]
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

    // Image fields
    const imageFields = includeImages ? [
        {
            type: 'image',
            field: 'image',
            label: 'Product Image',
            placeholder: 'Upload product image',
            width: 300,
            height: 200
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
