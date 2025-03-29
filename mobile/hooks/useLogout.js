import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '~/states/slices/auth';
import { useLogoutMutation } from '~/states/api/auth';

export default function useLogout() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [logoutApi, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        try {
            // Call the logout API endpoint
            await logoutApi().unwrap();

            // Update the Redux state
            dispatch(logout());

            // Navigate to login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'GuestNav', params: { screen: 'Login' } }],
            });
        } catch (error) {
            console.error('Logout failed:', error);

            // Even if the API call fails, we should still clear local state
            dispatch(logout());

            // Navigate to login screen
            navigation.reset({
                index: 0,
                routes: [{ name: 'GuestNav', params: { screen: 'Login' } }],
            });
        }
    };

    return {
        logout: handleLogout,
        isLoading
    };
}
