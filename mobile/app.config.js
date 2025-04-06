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
            },
            googleServicesFile: "./GoogleService-Info.plist"
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
            "expo-dev-client",
            [
                "expo-build-properties",
                {
                    "android": {
                    "extraMavenRepos": [
                    "../../node_modules/@notifee/react-native/android/libs"
                    ]
                    }
                }
            ],
            "expo-secure-store",
            [
                "@react-native-google-signin/google-signin",
                {
                    "iosUrlScheme": "com.googleusercontent.apps.30159689923-smgoi9h65q5q63jqh5ju7rbf1c51erdk",
                }
            ],
            [
                "expo-camera",
                {
                    "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera."
                }
            ],
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos to let you share them."
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
