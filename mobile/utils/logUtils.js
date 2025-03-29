/**
 * Utility functions for enhanced console logging
 */

/**
 * Log user profile information in a nicely formatted way
 * 
 * @param {Object} currentUser - The user object
 * @param {boolean} hasBasicInfo - Whether user has completed basic info
 * @param {boolean} hasAddressInfo - Whether user has completed address info
 * @param {boolean} isEmailVerified - Whether user's email is verified
 * @param {boolean} isPendingVerification - Whether verification is pending
 */
export const logUserProfile = (
    currentUser,
    hasBasicInfo,
    hasAddressInfo,
    isEmailVerified,
    isPendingVerification
) => {
    if (!currentUser) return;

    console.group('%c User Profile Information', 'color: #4CAF50; font-weight: bold; font-size: 12px;');
    console.log('%c User ID: %c' + currentUser.id, 'font-weight: bold', 'color: #2196F3');
    console.log('%c Username: %c' + currentUser.username, 'font-weight: bold', 'color: #2196F3');
    console.log('%c Email: %c' + currentUser.email, 'font-weight: bold', 'color: #2196F3');
    console.log('%c Email Verified: %c' + (currentUser.emailVerifiedAt ? 'Yes' : 'No'),
        'font-weight: bold', currentUser.emailVerifiedAt ? 'color: #4CAF50' : 'color: #F44336');

    if (currentUser.info) {
        console.group('%c Profile Information', 'color: #FF9800; font-weight: bold');
        console.log('%c First Name: %c' + (currentUser.info.first_name || 'Not set'),
            'font-weight: bold', 'color: #2196F3');
        console.log('%c Last Name: %c' + (currentUser.info.last_name || 'Not set'),
            'font-weight: bold', 'color: #2196F3');
        console.log('%c Contact: %c' + (currentUser.info.contact || 'Not set'),
            'font-weight: bold', 'color: #2196F3');
        console.log('%c Address: %c' + (currentUser.info.address || 'Not set'),
            'font-weight: bold', 'color: #2196F3');
        console.log('%c City: %c' + (currentUser.info.city || 'Not set'),
            'font-weight: bold', 'color: #2196F3');
        console.log('%c Region: %c' + (currentUser.info.region || 'Not set'),
            'font-weight: bold', 'color: #2196F3');
        console.log('%c Has Avatar: %c' + (currentUser.info.avatar ? 'Yes' : 'No'),
            'font-weight: bold', currentUser.info.avatar ? 'color: #4CAF50' : 'color: #F44336');
        console.groupEnd();
    } else {
        console.log('%c Profile Information: %c Not available', 'font-weight: bold', 'color: #F44336');
    }

    console.log('%c Onboarding Status:', 'font-weight: bold');
    console.log('  - %c Basic Info Completed: %c' + (hasBasicInfo ? 'Yes' : 'No'),
        'font-weight: bold', hasBasicInfo ? 'color: #4CAF50' : 'color: #F44336');
    console.log('  - %c Address Info Completed: %c' + (hasAddressInfo ? 'Yes' : 'No'),
        'font-weight: bold', hasAddressInfo ? 'color: #4CAF50' : 'color: #F44336');
    console.log('  - %c Email Verified: %c' + (isEmailVerified ? 'Yes' : 'No'),
        'font-weight: bold', isEmailVerified ? 'color: #4CAF50' : 'color: #F44336');
    console.log('  - %c Pending Verification: %c' + (isPendingVerification ? 'Yes' : 'No'),
        'font-weight: bold', isPendingVerification ? 'color: #FF9800' : 'color: #4CAF50');
    console.groupEnd();
};

/**
 * Log debugging information for protected layouts
 * 
 * @param {Object} currentUser - The user object
 * @param {boolean} userHasCompletedProfile - Whether user has a completed profile
 * @param {boolean} userHasVerifiedEmail - Whether user's email is verified
 * @param {boolean} isPendingVerification - Whether verification is pending
 */
export const logProtectedLayoutStatus = (
    currentUser,
    userHasCompletedProfile,
    userHasVerifiedEmail,
    isPendingVerification
) => {
    if (!currentUser) return;

    console.group('%c Protected Layout - User Status', 'color: #9C27B0; font-weight: bold; font-size: 12px;');
    console.log('%c User: %c' + currentUser.username, 'font-weight: bold', 'color: #2196F3');
    console.log('%c Email Verified: %c' + (userHasVerifiedEmail ? 'Yes' : 'No'),
        'font-weight: bold', userHasVerifiedEmail ? 'color: #4CAF50' : 'color: #F44336');
    console.log('%c Profile Completed: %c' + (userHasCompletedProfile ? 'Yes' : 'No'),
        'font-weight: bold', userHasCompletedProfile ? 'color: #4CAF50' : 'color: #F44336');
    console.log('%c Redirects Required: %c Basic=%c' + (!userHasCompletedProfile) +
        '%c, Email=%c' + (!userHasVerifiedEmail && !isPendingVerification),
        'font-weight: bold',
        'font-weight: normal', !userHasCompletedProfile ? 'color: #F44336' : 'color: #4CAF50',
        'font-weight: normal', (!userHasVerifiedEmail && !isPendingVerification) ? 'color: #F44336' : 'color: #4CAF50');
    console.groupEnd();
};
