import '~/global.css';

import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
// import { Stack } from 'expo-router';
// import * as ExpoRouter from 'expo-router';

const LIGHT_THEME = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

// export {
//     ErrorBoundary, // Catch any errors thrown by the Layout component.
// } from 'expo-router';

export default function RootLayout() {
    const hasMounted = React.useRef(false);
    const { colorScheme: _colorScheme, isDarkColorScheme } = useColorScheme(); // Prefix with underscore to indicate intentionally unused
    const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

    useIsomorphicLayoutEffect(() => {
        if (hasMounted.current) {
            return;
        }

        if (Platform.OS === 'web') {
            // Adds the background color to the html element to prevent white background on overscroll.
            const handleSomeAction = () => {
                // Use React Native specific API instead of document
                // For example:
                // Linking.openURL(url);
            };
        }
        setIsColorSchemeLoaded(true);
        hasMounted.current = true;
    }, []);

    if (!isColorSchemeLoaded) {
        return null;
    }

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            {/* <Stack /> */}
        </ThemeProvider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;