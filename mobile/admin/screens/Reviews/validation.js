import * as Yup from 'yup';

// Initial values for review form
export const initialReviewValues = {
    title: '',
    rating: 5,
    description: '',
    user: null,
    order: null,
    isAnonymous: false,
    images: []
};

/**
 * Generate a dynamic Yup validation schema for reviews
 * 
 * @param {Object} options - Validation options
 * @param {boolean} options.requireRating - Whether rating is required
 * @param {boolean} options.requireUser - Whether user is required
 * @param {boolean} options.requireOrder - Whether order is required
 * @param {Object} options.customValidations - Custom validation rules
 * @returns {Object} Yup validation schema
 */
export const getReviewValidationSchema = (options = {}) => {
    const {
        requireRating = true,
        requireUser = true,
        requireOrder = true,
        customValidations = {}
    } = options;

    // Build rating validation
    let ratingValidation = Yup.number()
        .integer('Rating must be a whole number')
        .min(1, 'Rating must be at least 1')
        .max(10, 'Rating cannot exceed 10');
    if (requireRating) {
        ratingValidation = ratingValidation.required('Rating is required');
    }

    // Build user validation
    let userValidation = Yup.mixed();
    if (requireUser) {
        userValidation = userValidation.required('User is required');
    }

    // Build order validation
    let orderValidation = Yup.mixed();
    if (requireOrder) {
        orderValidation = orderValidation.required('Order is required');
    }

    // Base schema
    const baseSchema = {
        title: Yup.string().max(100, 'Title cannot exceed 100 characters'),
        rating: ratingValidation,
        description: Yup.string().max(1000, 'Description cannot exceed 1000 characters'),
        user: userValidation,
        order: orderValidation,
        isAnonymous: Yup.boolean().default(false),
        images: Yup.array().of(Yup.mixed()).nullable()
    };

    // Merge with custom validations
    const mergedSchema = {
        ...baseSchema,
        ...customValidations
    };

    return Yup.object().shape(mergedSchema);
};

// Default validation schema using the generator function
export const ReviewValidationSchema = getReviewValidationSchema();
