import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';

const PRIMARY_API = process.env.EXPO_PUBLIC_API_URL;
// Backup options if the primary fails (try both localhost and IP variants)
const BACKUP_APIS = Platform.OS === 'web'
    ? ['http://localhost:3000']
    : ['http://10.0.2.2:3000']; // 10.0.2.2 is localhost for Android emulator

export const testConnection = async (apiUrl = PRIMARY_API) => {
    // Create an AbortController with a timeout of 10 seconds
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    console.log(`Attempting to connect to: ${apiUrl}`);

    try {
        const response = await fetch(`${apiUrl}/api/v1/health`, {
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
        console.log(`Connection success to ${apiUrl}`);

        return { success: true, message: 'API connection successful', apiUrl };
    } catch (error) {
        // Clear the timeout on error too
        clearTimeout(timeout);

        // Check if the error was due to the timeout
        if (error.name === 'AbortError') {
            console.error(`API connection to ${apiUrl} timed out after 10 seconds`);
            return { success: false, error: 'Connection timed out after 10 seconds', apiUrl };
        }

        console.error(`API connection test to ${apiUrl} failed:`, error);
        return { success: false, error: error.message, apiUrl };
    }
};

export default function useCheckConnection() {
    const [connectionStatus, setConnectionStatus] = useState({
        connected: false,
        apiUrl: null,
        error: null
    });

    useEffect(() => {
        const checkAPIConnection = async () => {
            // Try primary API first
            console.log(`Checking primary API: ${PRIMARY_API}`);
            const primaryResult = await testConnection(PRIMARY_API);

            if (primaryResult.success) {
                setConnectionStatus({
                    connected: true,
                    apiUrl: PRIMARY_API,
                    error: null
                });
                console.log('Connection established on ' + PRIMARY_API);
                return;
            }

            // If primary fails, try backup APIs
            console.log('Primary API failed, trying backup options...');
            for (const backupApi of BACKUP_APIS) {
                const backupResult = await testConnection(backupApi);
                if (backupResult.success) {
                    setConnectionStatus({
                        connected: true,
                        apiUrl: backupApi,
                        error: null
                    });
                    console.log('Connection established on backup: ' + backupApi);
                    return;
                }
            }

            // If all attempts fail, show error
            setConnectionStatus({
                connected: false,
                apiUrl: null,
                error: primaryResult.error
            });

            Toast.show({
                type: 'error',
                text1: 'Server Connection Failed',
                text2: `Could not connect to any server. Tried ${[PRIMARY_API, ...BACKUP_APIS].join(', ')}`,
                position: 'bottom',
                visibilityTime: 4000,
            });
        };

        checkAPIConnection();
    }, []);

    return connectionStatus;
}