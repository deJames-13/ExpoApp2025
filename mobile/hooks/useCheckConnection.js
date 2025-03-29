import { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Platform } from 'react-native';

const PRIMARY_API = process.env.EXPO_PUBLIC_API_URL;
const BACKUP_APIS = Platform.OS === 'web'
    ? ['http://localhost:3000']
    : [
        process.env.EXPO_PUBLIC_LAN_URL
    ];
const TIMEOUT = 60000

export const testConnection = async (apiUrl = PRIMARY_API) => {
    const controller = new global.AbortController();
    const timeout = global.setTimeout(() => controller.abort(), TIMEOUT);

    console.log(`Attempting to connect to: ${apiUrl}`);

    try {
        const response = await fetch(`${apiUrl}/api/v1/health`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'ngrok-skip-browser-warning': '1',
                mode: 'no-cors'
            },
            signal: controller.signal
        });

        global.clearTimeout(timeout);

        if (!response.ok) {
            throw new Error(`API connection failed with status: ${response.status}`);
        }
        console.log(`Connection success to ${apiUrl}`);

        return { success: true, message: 'API connection successful', apiUrl };
    } catch (error) {
        global.clearTimeout(timeout);

        if (error.name === 'AbortError') {
            console.error(`API connection to ${apiUrl} timed out after ${parseFloat(TIMEOUT / 1000).toFixed(2)} seconds`);
            return { success: false, error: `Connection timed out after ${parseFloat(TIMEOUT / 1000).toFixed(2)} seconds`, apiUrl };
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
