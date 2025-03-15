import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export const navigationStyles = StyleSheet.create({
    drawerContainer: {
        flex: 1,
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    drawerHeader: {
        marginBottom: 16,
    },
    drawerLogo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    drawerItemsContainer: {
        flex: 1,
        marginTop: 8,
        marginBottom: 8,
    },
    drawerItem: {
        backgroundColor: colors.cardBackground,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    drawerItemActive: {
        backgroundColor: colors.cardBackground,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },
    drawerItemText: {
        fontSize: 16,
        color: colors.text.primary,
    },
    drawerItemTextActive: {
        fontWeight: 'bold',
        color: colors.primary,
    },
    drawerFooter: {
        marginTop: 16,
    },
    logoutButton: {
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    loginButton: {
        borderWidth: 1,
        borderColor: colors.success || colors.primary,
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
    },
    logoutText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.error,
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.success || colors.primary,
    },
});

export default navigationStyles;
