import "~/global.css";

import Toast from 'react-native-toast-message';

import { Provider } from 'react-redux';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native'

import store from '~/states/store';
import MainNav from '~/components/Navigations';
import useFirebaseMessaging from "./firebase/useFirebaseMessaging";

export default function App() {
  const notif = useFirebaseMessaging();
  return (
    <Provider store={store}>
      <NavigationContainer>
        <PaperProvider>
          <MainNav />
        </PaperProvider>
      </NavigationContainer>
      <Toast />
    </Provider>
  );
}

