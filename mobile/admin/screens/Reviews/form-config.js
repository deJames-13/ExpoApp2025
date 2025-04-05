/**
 * Get field configuration for review forms
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeImages - Whether to include image fields
 * @param {boolean} options.includeUser - Whether to include user selection field
 * @param {boolean} options.includeOrder - Whether to include order selection field
 * @param {Object} options.customFields - Custom fields to include
 * @param {Array} options.exclude - Field names to exclude
 * @returns {Array} Field configuration array
 */
export const getReviewFields = (options = {}) => {
    const {
        includeImages = true,
        includeUser = true,
        includeOrder = true,
        customFields = {},
        exclude = []
    } = options;

    // Base required fields
    const baseFields = [
        {
            type: 'text',
            field: 'title',
            label: 'Review Title',
        },
        {
            type: 'range',
            field: 'rating',
            label: 'Rating',
            min: 1,
            max: 10,
            step: 1,
        },
        {
            type: 'textarea',
            field: 'description',
            label: 'Review Description',
        },
        {
            type: 'checkbox',
            field: 'isAnonymous',
            label: 'Post Anonymously',
        }
    ];

    // Optional user and order fields
    const userFields = includeUser ? [
        {
            type: 'text',
            field: 'user.username',
            label: 'Username',
            disabled: true
        }
    ] : [];

    const orderFields = includeOrder ? [
        {
            type: 'text',
            field: 'order',
            label: 'Order ID',
            disabled: true
        }
    ] : [];

    // Image fields
    const imageFields = includeImages ? [
        {
            type: 'image',
            field: 'images',
            label: 'Review Photos',
            placeholder: 'Add photos to your review',
            width: 300,
            height: 200,
            mode: 'both', // Allow both camera and gallery uploads
            aspectRatio: 4 / 3,
            quality: 0.8,
            multiple: true // Allow multiple images
        }
    ] : [];

    // Combine all fields
    let allFields = [
        ...baseFields,
        ...userFields,
        ...orderFields,
        ...imageFields
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
        allFields = allFields.filter(field => !exclude.includes(field.field));
    }

    return allFields;
};
