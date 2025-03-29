import React from 'react';
import "~/global.css";
import Toast from 'react-native-toast-message';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';

import store from '~/states/store';
import MainNav from '~/components/Navigations';
import LoadingScreen from '~/screens/LoadingScreen';
import { FirebaseAuthProvider } from '~/firebase/FirebaseAuthContext';
import { useLoadUser } from './hooks/useAuth';
import { AuthProvider } from './contexts/AuthContext';
import { navigationRef } from './navigation/navigationService';

function AppContent() {
  const { isHydrated } = useLoadUser();

  if (!isHydrated) {
    return <LoadingScreen />;
  }

  return (
    <FirebaseAuthProvider>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          console.log('Navigation container is ready');
        }}
        fallback={<LoadingScreen />}
      >
        <PaperProvider>
          <AuthProvider>
            <MainNav />
          </AuthProvider>
        </PaperProvider>
      </NavigationContainer>
      <Toast />
    </FirebaseAuthProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;

