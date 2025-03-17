import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: colors.background,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        width: 200,
        height: 100,
    },
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 20,
        padding: 24,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        marginBottom: 8,
        color: colors.text.primary,
        fontSize: 26,
    },
    subtitle: {
        marginBottom: 24,
        color: colors.text.light,
        fontSize: 16,
    },
    input: {
        width: '100%',
        marginBottom: 16,
        backgroundColor: colors.cardBackground,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: colors.primary,
        fontSize: 14,
    },
    button: {
        width: '100%',
        padding: 16,
        backgroundColor: colors.primary,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        marginTop: 8,
    },
    buttonText: {
        color: colors.cardBackground,
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    loginContainer: {
        flexDirection: 'row',
        marginTop: 30,
        padding: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 30,
        padding: 16,
    },
    accountText: {
        color: colors.text.secondary,
        fontSize: 15,
    },
    noAccountText: {
        color: colors.text.secondary,
        fontSize: 15,
    },
    loginText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: colors.primary,
        fontSize: 15,
    },
    registerText: {
        marginLeft: 8,
        fontWeight: 'bold',
        color: colors.primary,
        fontSize: 15,
    },
    errorText: {
        color: '#B00020',
        fontSize: 12,
        marginLeft: 10,
        marginTop: -5,
        marginBottom: 5,
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#E0E0E0',
    },
    separatorText: {
        marginHorizontal: 10,
        color: '#757575',
    },
    googleButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
    },
    googleButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    googleIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    googleButtonText: {
        color: '#757575',
        fontWeight: 'bold',
    }
});

export default styles;