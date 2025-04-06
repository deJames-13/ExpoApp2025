import { registerRootComponent } from 'expo';
import { setupNotificationChannels } from './firebase/notificationChannels';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './App';

// Set up notification channels for Android as early as possible
setupNotificationChannels();

// Register the app
// AppRegistry.registerComponent(process.env.EXPO_APP_NAME ?? "EyeZone", () => App);
registerRootComponent(App)


