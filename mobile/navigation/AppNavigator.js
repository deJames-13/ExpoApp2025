import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ReviewsScreen } from '../screens/Reviews';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerShown: false,
                }}
            >
                {/* Other screens */}
                <Stack.Screen
                    name="ReviewScreen"
                    component={ReviewsScreen}
                    options={{
                        headerShown: false,
                        presentation: 'modal',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;