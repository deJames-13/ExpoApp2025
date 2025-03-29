import { createNavigationContainerRef } from '@react-navigation/native';

export const NavigationRef = createNavigationContainerRef();

/**
 * Navigate to a screen from outside of a component
 * @param {string} name Route name
 * @param {object} params Route params
 */
export function navigate(name, params) {
    if (NavigationRef.isReady()) {
        NavigationRef.navigate(name, params);
    } else {
        console.error('Navigation is not ready for', name);
    }
}

/**
 * Reset the navigation state
 * @param {object} state New navigation state
 */
export function reset(state) {
    if (NavigationRef.isReady()) {
        NavigationRef.reset(state);
    } else {
        console.error('Navigation is not ready for reset');
    }
}
