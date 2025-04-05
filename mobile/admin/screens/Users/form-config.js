import { userRolesOptions } from './validation';

/**
 * Get field configuration for user forms
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.includeAvatar - Whether to include avatar field
 * @param {boolean} options.includePassword - Whether to include password field
 * @param {boolean} options.includeAdvancedFields - Whether to include advanced fields
 * @param {Object} options.customFields - Custom fields to include
 * @param {Array} options.exclude - Field names to exclude
 * @returns {Array} Field configuration array
 */
export const getUserFields = (options = {}) => {
    const {
        includeAvatar = true,
        includePassword = true,
        includeAdvancedFields = false,
        customFields = {},
        exclude = []
    } = options;

    console.log(`getUserFields called with options:`, options);

    // Base account fields
    const accountFields = [
        {
            type: 'text',
            field: 'username',
            label: 'Username'
        },
        {
            type: 'text', // Using standard text field with email keyboard type
            field: 'email',
            label: 'Email Address',
            keyboardType: 'email-address',
            autoCapitalize: 'none'
        },
        includePassword ? {
            type: 'text', // Using standard text with secure text entry
            field: 'password',
            label: 'Password',
            secureTextEntry: true
        } : null,
        {
            type: 'radio',
            field: 'role',
            label: 'User Role',
            options: userRolesOptions.map(role => ({
                value: role,
                label: role.charAt(0).toUpperCase() + role.slice(1)
            })),
            direction: 'horizontal'
        }
    ].filter(Boolean);

    // Personal information fields - using dot notation for now, will be flattened later
    const personalInfoFields = [
        {
            row: true,
            fields: [
                {
                    type: 'text',
                    field: 'info.first_name',
                    label: 'First Name'
                },
                {
                    type: 'text',
                    field: 'info.last_name',
                    label: 'Last Name'
                }
            ]
        },
        {
            type: 'text', // Changed from 'phone' to 'text'
            field: 'info.contact',
            label: 'Contact Number',
            keyboardType: 'phone-pad'
        },
        {
            type: 'date',
            field: 'info.birthdate',
            label: 'Date of Birth',
            mode: 'date'
        }
    ];

    // Address fields
    const addressFields = [
        {
            type: 'textarea',
            field: 'info.address',
            label: 'Address'
        },
        {
            row: true,
            fields: [
                {
                    type: 'text',
                    field: 'info.city',
                    label: 'City'
                },
                {
                    type: 'text',
                    field: 'info.region',
                    label: 'Region/State'
                }
            ]
        },
        {
            type: 'text',
            field: 'info.zip_code',
            label: 'Zip/Postal Code'
        }
    ];

    // Avatar field
    const avatarFields = includeAvatar ? [
        {
            type: 'image',
            field: 'info.avatar',
            label: 'Profile Picture',
            placeholder: 'Add profile picture',
            width: 150,
            height: 150,
            mode: 'both',
            aspectRatio: 1,
            quality: 0.8,
            multiple: false,
            circular: true
        }
    ] : [];

    // Advanced fields
    const advancedFields = includeAdvancedFields ? [
        {
            type: 'checkbox', // Changed from 'switch' to 'checkbox' since there's no switch field
            field: 'emailVerifiedAt',
            label: 'Email Verified',
            description: 'Is this user\'s email verified?'
        },
        {
            type: 'text',
            field: 'provider',
            label: 'Authentication Provider',
            disabled: true // Changed from editable: false to disabled: true
        }
    ] : [];

    // Combine all fields
    let allFields = [
        ...avatarFields,
        ...accountFields,
        ...personalInfoFields,
        ...addressFields,
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

    console.log(`Field configuration generated: ${allFields.length} fields`);
    return allFields;
};
