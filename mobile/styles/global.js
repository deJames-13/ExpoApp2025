import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colors } from '../theme/colors';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    scrollViewContainer: {
        flexGrow: 1,
        backgroundColor: colors.background,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        justifyContent: 'space-between',
    },

    // Card styles
    card: {
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // Text styles
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 16,
    },
    subheading: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 8,
    },
    bodyText: {
        fontSize: 16,
        color: colors.text.secondary,
        lineHeight: 24,
    },
    smallText: {
        fontSize: 14,
        color: colors.text.light,
    },
    errorText: {
        fontSize: 14,
        color: colors.error,
        marginTop: 4,
    },

    // Button styles
    primaryButton: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.cardBackground,
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Input styles
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: colors.cardBackground,
        color: colors.text.primary,
        marginBottom: 12,
    },

    // Spacing utilities
    mt8: { marginTop: 8 },
    mt16: { marginTop: 16 },
    mt24: { marginTop: 24 },
    mb8: { marginBottom: 8 },
    mb16: { marginBottom: 16 },
    mb24: { marginBottom: 24 },
    mv8: { marginVertical: 8 },
    mv16: { marginVertical: 16 },
    mh16: { marginHorizontal: 16 },
    p16: { padding: 16 },

    // Other common styles
    divider: {
        height: 1,
        backgroundColor: colors.border,
        width: '100%',
        marginVertical: 16,
    },
    badge: {
        backgroundColor: colors.secondary,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        minWidth: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: colors.cardBackground,
        fontSize: 12,
        fontWeight: 'bold',
    },

    // Responsive styles
    responsiveImage: {
        width: width * 0.9,
        height: width * 0.6,
        resizeMode: 'cover',
    },

    // Platform specific styles
    shadow: Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        android: {
            elevation: 4,
        },
    }),
});

export default globalStyles;
