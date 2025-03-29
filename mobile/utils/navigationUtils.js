import { BackHandler, Alert, Platform } from 'react-native';

/**
 * Show an exit confirmation dialog and exit the app if confirmed
 * 
 * @param {string} title - Dialog title
 * @param {string} message - Dialog message
 * @returns {boolean} - Returns true to prevent default back behavior
 */
export const confirmExit = (title = 'Exit App', message = 'Are you sure you want to exit?') => {
    Alert.alert(
        title,
        message,
        [
            { text: 'Cancel', style: 'cancel', onPress: () => { } },
            { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() }
        ],
        { cancelable: false }
    );
    return true; // Prevent default back behavior
};

/**
 * Attach a back handler to a screen to prevent going back
 * 
 * @param {object} navigation - Navigation object
 * @param {function} backAction - Function to run on back press (optional)
 * @returns {function} - Cleanup function to remove the listener
 */
export const preventGoingBack = (navigation, backAction = confirmExit) => {
    // Add back button handler
    BackHandler.addEventListener('hardwareBackPress', backAction);

    // Modify navigation options to prevent back navigation
    if (navigation) {
        navigation.setOptions({
            headerLeft: () => null,
            gestureEnabled: false,
        });
    }

    // Return cleanup function
    return () => {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
};
