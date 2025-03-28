import "dotenv/config";
module.exports = {
    expo: {
        name: "EyeZone",
        slug: "eyezone-mobile",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/icon.png",
        userInterfaceStyle: "light",
        newArchEnabled: true,
        splash: {
            image: "./assets/splash-icon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.eyezone.app",
            infoPlist: {
                NSCameraUsageDescription: "Allow $(PRODUCT_NAME) to access your camera."
            }
        },
        android: {
            package: "com.eyezone.app",
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#ffffff"
            },
            permissions: [
                "INTERNET",
                "CAMERA"
            ],
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        experiments: {
            tsconfigPaths: true
        },
        plugins: [
            [
                "@react-native-google-signin/google-signin",
                {
                    "iosUrlScheme": "com.googleusercontent.apps._some_id",
                }
            ],
            [
                "expo-camera",
                {
                    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
                }
            ]
        ],
        extra: {
            eas: {
                projectId: "851484ac-a9f8-4217-89af-b45f771a3953",
            }
        }
    }
};
