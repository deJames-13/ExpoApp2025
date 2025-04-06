import admin from './firebase/utils.js';

// Run this file with Node to check if Firebase Admin SDK is properly initialized
console.log('Checking Firebase Admin SDK initialization...');

try {
    // Check if admin is initialized correctly
    if (admin && admin.messaging) {
        console.log('✅ Firebase Admin SDK is initialized correctly');
        console.log('Available services:', Object.keys(admin));

        // Try to get a list of FCM topics to verify messaging service works
        admin.messaging().getTopics()
            .then(response => {
                console.log('✅ Firebase Cloud Messaging is working properly');
            })
            .catch(error => {
                console.error('❌ Error with FCM:', error);
                console.log('This might be due to missing permissions or an invalid credential file');
            });
    } else {
        console.error('❌ Firebase Admin SDK is not properly initialized');
        console.log('Available properties:', Object.keys(admin || {}));
    }
} catch (error) {
    console.error('❌ Error checking Firebase Admin SDK:', error);
}
