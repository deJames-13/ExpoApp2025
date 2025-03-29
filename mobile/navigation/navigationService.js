import { createNavigationContainerRef } from '@react-navigation/native';

// Create a navigation reference that can be accessed anywhere
export const navigationRef = createNavigationContainerRef();

// Navigate to a specific route
export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    } else {
        // You can save navigation requests to execute once ready
        console.log('Navigation attempted before navigator was ready:', name, params);
    }
}

// Reset the navigation state
export function reset(state) {
    if (navigationRef.isReady()) {
        navigationRef.reset(state);
    }
}

// Go back to the previous screen
export function goBack() {
    if (navigationRef.isReady()) {
        navigationRef.goBack();
    }
}

// Get the current route name
export function getCurrentRoute() {
    if (navigationRef.isReady()) {
        return navigationRef.getCurrentRoute().name;
    }
    return null;
}
