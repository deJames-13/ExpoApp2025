import React from 'react';
import "~/global.css";
import Toast from 'react-native-toast-message';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'

import store from '~/states/store';
import MainNav from '~/components/Navigations';
import { FirebaseAuthProvider } from '~/firebase/FirebaseAuthContext';

const App = () => {
  return (
    <Provider store={store}>
      <FirebaseAuthProvider>
        <NavigationContainer>
          <PaperProvider>
            <MainNav />
          </PaperProvider>
        </NavigationContainer>
      </FirebaseAuthProvider>
      <Toast />
    </Provider>
  );
};

export default App;

