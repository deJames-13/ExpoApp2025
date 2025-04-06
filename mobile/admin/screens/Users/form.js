import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { ResourceForm } from '~/components/ResourceForm';
import { getUserValidationSchema, initialUserValues } from './validation';
import { getUserFields } from './form-config';
import { updateUserRole } from './data';
// Import auth selectors and hooks (same as products form)
import { useSelector } from 'react-redux';
import { selectToken } from '~/states/slices/auth'; // Adjust path as needed

/**
 * Helper function to ensure URI is a valid string or an object with URI properties
 */
const validateUri = (uri) => {
    if (!uri) return null;
    
    // If it's an object with url/secure_url from Cloudinary
    if (typeof uri === 'object' && uri !== null) {
        // Check for Cloudinary format first (with secure_url)
        if (uri.secure_url) {
            return uri.secure_url;
        }
        // Then check for regular URI format
        if (uri.uri || uri.path) {
            return uri.uri || uri.path;
        }
        // If it has url property
        if (uri.url) {
            return uri.url;
        }
    }
    
    return typeof uri === 'string' ? uri : null;
};

// Improved function to convert nested fields to flat fields for display
const flattenFields = (fieldConfig) => {
    return fieldConfig.map(field => {
        // Handle row fields
        if (field.row && field.fields) {
            return {
                ...field,
                fields: field.fields.map(rowField => {
                    if (rowField.field && rowField.field.includes('.')) {
                        const flatField = rowField.field.replace('.', '_');
                        console.log(`Flattening row field ${rowField.field} to ${flatField}`);
                        return { ...rowField, originalField: rowField.field, field: flatField };
                    }
                    return rowField;
                })
            };
        }
        
        // Handle regular fields
        if (field.field && field.field.includes('.')) {
            const flatField = field.field.replace('.', '_');
            console.log(`Flattening field ${field.field} to ${flatField}`);
            return { ...field, originalField: field.field, field: flatField };
        }
        return field;
    });
};

// Helper function to flatten nested data for use with flattened fields
const flattenData = (userData) => {
    if (!userData) return null;
    
    const flatData = { ...userData };
    
    // Extract and flatten nested info properties
    if (userData.info && typeof userData.info === 'object') {
        Object.keys(userData.info).forEach(key => {
            const flatKey = `info_${key}`;
            flatData[flatKey] = userData.info[key];
            console.log(`Flattened data: ${flatKey} = `, flatData[flatKey]);
        });
    }
    
    return flatData;
};

// Helper to unflatten data back to original structure when submitting
const unflattenData = (flatData) => {
    if (!flatData) return {};
    
    const result = { ...flatData };
    const info = { ...(result.info || {}) };
    
    // Find all flattened info keys and move them back to the info object
    Object.keys(flatData).forEach(key => {
        if (key.startsWith('info_')) {
            const originalKey = key.replace('info_', '');
            info[originalKey] = flatData[key];
            delete result[key];
        }
    });
    
    result.info = info;
    return result;
};

export function UserForm({ user, mode = 'create', onSubmit, formRef }) {
    const [validationSchema, setValidationSchema] = useState(getUserValidationSchema());
    const [fieldConfig, setFieldConfig] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flattenedFields, setFlattenedFields] = useState([]);
    
    // Get auth token from Redux store (same pattern as products form)
    const authToken = useSelector(selectToken);
    
    // Force form recalculation
    const formKey = useMemo(() => `user-form-${user?._id || 'new'}-${Date.now()}`, [user]);

    // Add debugging for props
    useEffect(() => {
        console.log(`Form mode: ${mode}`);
        if (user) {
            console.log("User prop received with ID:", user._id || user.id);
            
            if (user.info) {
                // Debug specific fields we're having trouble with
                console.log("First name:", user.info.first_name);
                console.log("Last name:", user.info.last_name);
                console.log("City:", user.info.city);
                console.log("Region:", user.info.region);
            }
        }
    }, [user, mode]);

    const handleSubmit = (values) => {
        // Convert flat data back to nested structure
        const processedData = unflattenData(values);
        
        // If we're in edit mode and the role is changing, handle role update
        if (mode === 'edit' && user && user.role !== processedData.role) {
            const userId = user._id || user.id;
            const normalizedRole = processedData.role.toLowerCase();
            
            console.log(`Initiating role update: ${user.role} → ${normalizedRole}`);
            
            // First submission triggers role update only
            updateUserRole(userId, normalizedRole, authToken)
                .then(response => {
                    console.log("Role update completed successfully");
                    
                    // Show success message
                    alert(`User role updated to ${processedData.role}`);
                    
                    // Submit the full form data (without waiting for user to dismiss alert)
                    onSubmit({
                        ...processedData,
                        role: normalizedRole // Ensure role is updated in form data
                    });
                })
                .catch(error => {
                    console.error("Role update failed:", error);
                    alert(`Error updating role: ${error.message}`);
                    
                    // Continue with form submission anyway, with original role
                    if (confirm("Would you like to submit the form without changing the role?")) {
                        onSubmit({
                            ...processedData,
                            role: user.role // Revert to original role
                        });
                    }
                });
        } else {
            // Regular submission for non-role updates or new users
            onSubmit(processedData);
        }
    };

    // Generate field configuration
    useEffect(() => {
        const fieldsOptions = {
            includeAvatar: true,
            includePassword: mode === 'create', // Only include password field in create mode
            includeAdvancedFields: mode === 'edit' || mode === 'view'
        };

        // Configure validation based on mode
        const validationOptions = {
            requireUsername: true,
            requireEmail: true,
            requirePassword: mode === 'create', // Password only required in create mode
            requireFirstName: true,
            requireLastName: true,
            requireContact: true,
            requireRole: true
        };

        // Get the field config
        const config = getUserFields(fieldsOptions);
        console.log("Generated field config with", config.length, "fields");
        
        // Flatten field configuration to avoid nesting issues
        const flatConfig = flattenFields(config);
        setFlattenedFields(flatConfig);
        
        // For debugging, inspect fields with specific names
        flatConfig.forEach(field => {
            if (field.field && ['info_first_name', 'info_last_name', 'info_city', 'info_region'].includes(field.field)) {
                console.log(`Field ${field.field} config:`, field);
            } else if (field.row && field.fields) {
                field.fields.forEach(rowField => {
                    if (rowField.field && ['info_first_name', 'info_last_name', 'info_city', 'info_region'].includes(rowField.field)) {
                        console.log(`Row field ${rowField.field} config:`, rowField);
                    }
                });
            }
        });
        
        // Set dynamic configuration
        setFieldConfig(flatConfig);
        setValidationSchema(getUserValidationSchema(validationOptions));
        setLoading(false);
    }, [mode, user]);

    // Process avatar from user
    const getInitialAvatar = () => {
        if (!user || !user.info) return null;

        // Handle Cloudinary avatar from user info
        if (user.info.avatar) {
            const validUri = validateUri(user.info.avatar);
            return validUri ? validUri : null;
        }

        // Try photoUrl as fallback
        if (user.info.photoUrl) {
            return user.info.photoUrl;
        }

        return null;
    };

    // Prepare initial form values with careful handling of nested properties
    const initialValues = useMemo(() => {
        if (!user) return initialUserValues;
        
        console.log("Form: Preparing initial values from user data");

        // Make sure info exists with all required fields
        let userInfo = {};
        
        // Handle various info object scenarios
        if (user.info) {
            // If info is an object with properties
            if (typeof user.info === 'object' && !Array.isArray(user.info)) {
                userInfo = { ...user.info };
                
                // Debug each expected info property again
                console.log("UserForm: Info fields raw values:");
                ['first_name', 'last_name', 'contact', 'address', 'city', 'region', 'zip_code', 'birthdate']
                    .forEach(field => {
                        console.log(`- info.${field}: ${JSON.stringify(userInfo[field])}`);
                    });
            }
            // If info is just a string ID (shouldn't happen after our data.js changes)
            else if (typeof user.info === 'string') {
                userInfo = { _id: user.info };
                console.log("UserForm: Info is just a string ID:", user.info);
            }
        }
        
        // Format dates properly
        const emailVerifiedAt = user.emailVerifiedAt ? 
            new Date(user.emailVerifiedAt) : null;
            
        const birthdate = userInfo.birthdate ? 
            new Date(userInfo.birthdate) : null;
            
        // Build the complete initial values object
        const values = {
            ...initialUserValues,
            ...user,
            emailVerifiedAt,
            // Ensure we properly structure the info object
            info: {
                ...initialUserValues.info,
                ...userInfo,
                avatar: getInitialAvatar(),
                birthdate: birthdate
            }
        };
        
        // Flatten the values to match our flattened field config
        const flatValues = flattenData(values);
        
        // Explicitly check and assign values for problematic fields
        console.log("UserForm: Flattened values for problematic fields:");
        console.log("- info_first_name:", flatValues.info_first_name);
        console.log("- info_last_name:", flatValues.info_last_name);
        console.log("- info_city:", flatValues.info_city);
        console.log("- info_region:", flatValues.info_region);
        
        return flatValues;
    }, [user]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading form data...</Text>
            </View>
        );
    }

    // Return a debug view if we're having issues
    if (!user && mode !== 'create') {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No user data provided</Text>
            </View>
        );
    }

    return (
        <ResourceForm
            key={formKey}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            mode={mode}
            formRef={formRef}
            layoutProps={{ style: styles.customFormLayout }}
            fieldConfig={fieldConfig}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            enableReinitialize={true}
        />
    );
}

const styles = StyleSheet.create({
    customFormLayout: {
        width: '100%',
        paddingBottom: 20,
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
    loadingContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#4B5563',
    }
});
