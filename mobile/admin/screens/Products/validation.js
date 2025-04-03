import * as Yup from 'yup';

// Status options that can be selected for a product
export const productStatusOptions = ['active', 'inactive', 'out of stock', 'pending'];

// Base initial values for product form
export const initialProductValues = {
    name: '',
    price: '',
    description: '',
    stock: '',
    category: '',  // Changed from object to string
    brand: '',     // Changed from object to string
    status: 'active',
    image: null,
    featured: false,
    rating: 0
};

/**
 * Generate a dynamic Yup validation schema for products
 * 
 * @param {Object} options - Validation options
 * @param {boolean} options.requireName - Whether name is required
 * @param {boolean} options.requirePrice - Whether price is required
 * @param {boolean} options.requireStock - Whether stock is required
 * @param {boolean} options.requireBrand - Whether brand is required
 * @param {boolean} options.requireCategory - Whether category is required
 * @param {boolean} options.requireStatus - Whether status is required
 * @param {Object} options.customValidations - Custom validation rules
 * @returns {Object} Yup validation schema
 */
export const getProductValidationSchema = (options = {}) => {
    const {
        requireName = true,
        requirePrice = true,
        requireStock = true,
        requireBrand = true,
        requireCategory = true,
        requireStatus = true,
        customValidations = {}
    } = options;

    // Build name validation
    let nameValidation = Yup.string().max(100, 'Product name cannot exceed 100 characters');
    if (requireName) {
        nameValidation = nameValidation.required('Product name is required');
    }

    // Build price validation
    let priceValidation = Yup.number()
        .typeError('Price must be a number')
        .min(0, 'Price must be greater than or equal to 0');
    if (requirePrice) {
        priceValidation = priceValidation.required('Price is required');
    }

    // Build stock validation
    let stockValidation = Yup.number()
        .typeError('Stock must be a number')
        .integer('Stock must be a whole number')
        .min(0, 'Stock cannot be negative');
    if (requireStock) {
        stockValidation = stockValidation.required('Stock is required');
    }

    // Build brand validation - changed to string
    let brandValidation = Yup.string();
    if (requireBrand) {
        brandValidation = brandValidation.required('Brand is required');
    }

    // Build category validation - changed to string
    let categoryValidation = Yup.string();
    if (requireCategory) {
        categoryValidation = categoryValidation.required('Category is required');
    }

    // Build status validation
    let statusValidation = Yup.string();
    if (requireStatus) {
        statusValidation = statusValidation
            .required('Status is required')
            .oneOf(productStatusOptions, 'Invalid status selected');
    }

    // Base schema
    const baseSchema = {
        name: nameValidation,
        price: priceValidation,
        stock: stockValidation,
        description: Yup.string().max(1000, 'Description cannot exceed 1000 characters'),
        status: statusValidation,
        brand: brandValidation,
        category: categoryValidation,
        image: Yup.string().nullable(),
        featured: Yup.boolean().default(false),
        rating: Yup.number()
            .min(0, 'Rating cannot be negative')
            .max(5, 'Rating cannot exceed 5')
            .default(0)
    };

    // Merge with custom validations
    const mergedSchema = {
        ...baseSchema,
        ...customValidations
    };

    return Yup.object().shape(mergedSchema);
};

// Default validation schema using the generator function
export const ProductValidationSchema = getProductValidationSchema();
