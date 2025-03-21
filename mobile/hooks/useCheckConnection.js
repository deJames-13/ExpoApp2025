import { useEffect } from 'react';
import Toast from 'react-native-toast-message';

const API = process.env.EXPO_PUBLIC_API_URL;

export const testConnection = async () => {
    // Create an AbortController with a timeout of 10 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
        const response = await fetch(`${API}/api/v1/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            signal: controller.signal, // Add the abort signal
        });

        // Clear the timeout since the request completed
        clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`API connection failed with status: ${response.status}`);
        }
        console.log('Connection success...')

        return { success: true, message: 'API connection successful' };
    } catch (error) {
        // Clear the timeout on error too
        clearTimeout(timeout);

        // Check if the error was due to the timeout
        if (error.name === 'AbortError') {
            console.error('API connection test timed out after 10 seconds');
            return { success: false, error: 'Connection timed out after 10 seconds' };
        }

        console.error('API connection test failed:', error);
        return { success: false, error: error.message };
    }
};

export default function useCheckConnection() {
    useEffect(() => {
        const checkAPIConnection = async () => {
            const result = await testConnection();
            if (!result.success) {
                Toast.show({
                    type: 'error',
                    text1: 'Server Connection Failed',
                    text2: result.error || 'Could not connect to the server',
                    position: 'bottom',
                    visibilityTime: 4000,
                });
                return
            }
            console.log('Connection established on ' + API)
        };

        checkAPIConnection();
    }, []);
}