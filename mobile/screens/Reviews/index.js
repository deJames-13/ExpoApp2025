import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReviewPage } from './ReviewPage';
import ReviewForm from './ReviewForm';

const Stack = createStackNavigator();

const ReviewsScreen = () => {
    return (
        <Stack.Navigator
            initialRouteName="ReviewPage"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="ReviewPage"
                component={ReviewPage}
            />
            <Stack.Screen
                name="ReviewForm"
                component={ReviewForm}
                options={{
                    presentation: 'modal',
                    animationEnabled: true,
                }}
            />
        </Stack.Navigator>
    );
};

export { ReviewsScreen };
export { default as ReviewList } from './ReviewList';
export { default as ReviewCard } from './ReviewCard';
