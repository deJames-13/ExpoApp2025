import { View } from 'react-native'
import { Text } from '~/components/ui';
import React from 'react'

export function Home({ navigation }) {
    return (
        <View className='flex justify-center items-center h-full'>
            <Text className='text-2xl font-bold'>Home Screen</Text>
        </View>
    )
}