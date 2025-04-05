import * as Yup from 'yup';

// Export roles if they're defined here
export const userRolesOptions = ['admin', 'manager', 'employee', 'customer'];

// Make sure initialUserValues has the correct structure for info
export const initialUserValues = {
    username: '',
    email: '',
    password: '',
    role: 'customer',
    info: {
        first_name: '',
        last_name: '',
        contact: '',
        address: '',
        city: '',
        region: '',
        zip_code: '',
        birthdate: null,
        avatar: null,
        photoUrl: null
    },
    emailVerifiedAt: null,
    provider: null
};

/**
 * Generate a dynamic Yup validation schema for users
 * 
 * @param {Object} options - Validation options
 * @param {boolean} options.requireUsername - Whether username is required
 * @param {boolean} options.requireEmail - Whether email is required
 * @param {boolean} options.requirePassword - Whether password is required
 * @param {boolean} options.requireFirstName - Whether first name is required
 * @param {boolean} options.requireLastName - Whether last name is required
 * @param {boolean} options.requireContact - Whether contact is required
 * @param {boolean} options.requireRole - Whether role is required
 * @param {Object} options.customValidations - Custom validation rules
 * @returns {Object} Yup validation schema
 */
export const getUserValidationSchema = (options = {}) => {
    console.log("Getting validation schema with options:", options);
    const {
        requireUsername = true,
        requireEmail = true,
        requirePassword = false, // Not required in edit mode
        requireFirstName = true,
        requireLastName = true,
        requireContact = true,
        requireRole = true,
        customValidations = {}
    } = options;

    // Build username validation
    let usernameValidation = Yup.string().max(50, 'Username cannot exceed 50 characters');
    if (requireUsername) {
        usernameValidation = usernameValidation.required('Username is required');
    }

    // Build email validation
    let emailValidation = Yup.string().email('Invalid email format');
    if (requireEmail) {
        emailValidation = emailValidation.required('Email is required');
    }

    // Build password validation
    let passwordValidation = Yup.string()
        .min(8, 'Password must be at least 8 characters');
    if (requirePassword) {
        passwordValidation = passwordValidation.required('Password is required');
    }

    // Build user info validation
    let infoValidation = Yup.object().shape({
        first_name: requireFirstName
            ? Yup.string().required('First name is required')
            : Yup.string(),
        last_name: requireLastName
            ? Yup.string().required('Last name is required')
            : Yup.string(),
        contact: requireContact
            ? Yup.string()
                .required('Contact number is required')
                .matches(/^[0-9]{10}$/, 'Contact must be 10 digits')
            : Yup.string(),
        address: Yup.string(),
        city: Yup.string(),
        region: Yup.string(),
        zip_code: Yup.string(),
        birthdate: Yup.date().nullable(),
        avatar: Yup.mixed().nullable(),
        photoUrl: Yup.string().nullable()
    });

    // Build role validation
    let roleValidation = Yup.string();
    if (requireRole) {
        roleValidation = roleValidation
            .required('Role is required')
            .oneOf(userRolesOptions, 'Invalid role selected');
    }

    // Base schema
    const baseSchema = {
        username: usernameValidation,
        email: emailValidation,
        password: passwordValidation,
        role: roleValidation,
        info: infoValidation,
        emailVerifiedAt: Yup.date().nullable(),
        fcmToken: Yup.string().nullable(),
        provider: Yup.string().nullable()
    };

    // Merge with custom validations
    const mergedSchema = {
        ...baseSchema,
        ...customValidations
    };

    return Yup.object().shape(mergedSchema);
};

// Default validation schema using the generator function
export const UserValidationSchema = getUserValidationSchema();
