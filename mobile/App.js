import "~/global.css";
import { useEffect } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'

import store from '~/states/store';
import MainNav from '~/components/Navigations';
import { FirebaseAuthProvider } from '~/firebase/FirebaseAuthContext';

const checkEnvironmentConfig = () => {
  const googleClientIds = {
    web: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
  };

  console.log('Environment check - Google Client IDs available:',
    Object.keys(googleClientIds).filter(key => !!googleClientIds[key]));

  if (!googleClientIds.web && !googleClientIds.android && !googleClientIds.ios) {
    console.error('No Google client IDs configured. Google sign-in will not work.');
  }
};

export default function App() {
  useEffect(() => {
    checkEnvironmentConfig();
  }, []);

  return (
    <Provider store={store}>
      <FirebaseAuthProvider>
        <NavigationContainer>
          <PaperProvider>
            <MainNav />
          </PaperProvider>
        </NavigationContainer>
        <Toast />
      </FirebaseAuthProvider>
    </Provider>
  );
}

