
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createStackNavigator } from '@react-navigation/stack';
import { DefaultDrawerContent } from '../drawers/default-content';
import { defaultOptions } from './_options';
import { defaultRoutes, tabRoutes } from './_routes';

const USER_DEFAULT = 'Home';
const Tabs = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


const DefaultTabs = ({ initialRouteName = USER_DEFAULT }) => {
    const routes = tabRoutes();

    return (
        <>
            <Tabs.Navigator
                initialRouteName={initialRouteName || routes.length > 0 && routes[0]?.name || 'Home'}
                screenOptions={defaultOptions}
            >
                {routes.map((route) => route?.isTab && (
                    <Tabs.Screen
                        key={route.name}
                        name={route.name}
                        component={route.component}
                        options={route.options}
                    />
                ))}
            </Tabs.Navigator>

        </>
    )
}

export function DefaultRoutes() {
    return (
        <Stack.Navigator
            screenOptions={defaultOptions}
        >
            {defaultRoutes().map((route) => (
                <Stack.Screen
                    key={route.name}
                    name={route.name}
                    component={route.component}
                    options={route.options}
                />
            ))}
        </Stack.Navigator>
    );
}

export function DefaultNav() {
    return (
        <Drawer.Navigator
            drawerContent={props => <DefaultDrawerContent {...props} />}
            screenOptions={{
                title: '',
            }}
        >
            <Drawer.Screen
                name="TabsRoute"
                component={DefaultTabs}
            />

            <Drawer.Screen
                name="DefaultRoutes"
                component={DefaultRoutes}
            />

        </Drawer.Navigator>

    );
}
