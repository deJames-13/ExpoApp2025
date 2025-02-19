import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Divider } from 'react-native-paper';
import { defaultRoutes, tabRoutes } from '../routes/default';

export function DefaultDrawerContent() {
    const [curr, setCurr] = React.useState('Home');
    const [logged, setLogged] = React.useState(true);
    const navigation = useNavigation();
    const drawerRoutes = defaultRoutes();
    const tabbedRoutes = tabRoutes();

    return (
        <SafeAreaView className='flex h-full py-8 p-4'>
            <View>
                <Text className='text-2xl font-bold'>
                    EyeZ*ne
                </Text>
            </View>

            <Divider
                className='my-4 bg-black'
            />

            <View className='flex-1 flex flex-col gap-4'>
                {/* Navigations */}
                {tabbedRoutes.map((route) => (
                    <TouchableOpacity
                        key={route.name}
                        className={`drop-shadow-md bg-base-100 text-black rounded p-4 border-gray-300 hover:bg-gray-200 ${curr === route.name ? 'bg-gray-100 border-b-2 font-bold ' : ''}`}
                        onPress={() => {
                            setCurr(route.name);
                            navigation.navigate("DefaultNav", {
                                screen: "TabsRoute",
                                params: { screen: route.name },
                            });
                        }}
                    >
                        <Text className='text-lg'>{route.name}</Text>
                    </TouchableOpacity>
                ))}

                {drawerRoutes.map((route) => (
                    <TouchableOpacity
                        key={route.name}
                        className={`drop-shadow-md bg-base-100 text-black rounded p-4 border-gray-300 hover:bg-gray-200 ${curr === route.name ? 'bg-gray-100 border-b-2 font-bold ' : ''}`}
                        onPress={() => {
                            setCurr(route.name);
                            navigation.navigate("DefaultNav", {
                                screen: "DefaultRoutes",
                                params: { screen: route.name },
                            });
                        }}
                    >
                        <Text className='text-lg'>{route.name}</Text>
                    </TouchableOpacity>
                ))}

            </View>



            <Divider
                className='my-4 bg-black'
            />
            <View>
                {
                    logged &&
                    <TouchableOpacity
                        className={`border border-red-500 rounded-lg p-4`}
                        onPress={() => {
                            setLogged(!logged);
                            navigation.navigate("GuestNav", {
                                screen: 'Login',
                            });
                        }}
                    >
                        <Text className={`text-lg font-bold text-red-400`}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                }
                {
                    !logged &&
                    <TouchableOpacity
                        className={`border border-green-500 rounded-lg p-4`}
                        onPress={() => {
                            setLogged(!logged);
                            navigation.navigate("GuestNav", {
                                screen: 'Login',
                            });
                        }}
                    >
                        <Text className={`text-lg font-bold text-green-400`}>
                            Login
                        </Text>
                    </TouchableOpacity>
                }
            </View>
        </SafeAreaView>
    );
}