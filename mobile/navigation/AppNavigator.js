import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// Import your screens
import HomeScreen from '~/screens/Home';
// Import other screens...

const Stack = createStackNavigator();

function AppNavigator() {
  // Enhanced console log to verify screen registration with proper names
  console.log('AppNavigator initialized with screens: Home, IndivProduct');
  
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;
