import { StyleSheet } from 'react-native';
import { adminColors } from './adminTheme';

export const accountStyles = StyleSheet.create({
    scrollContent: {
        padding: 16,
        paddingBottom: 24,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    avatar: {
        marginRight: 20,
    },
    profileInfo: {
        flex: 1,
    },
    nameText: {
        color: adminColors.text.primary,
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 6,
    },
    roleText: {
        color: adminColors.text.secondary,
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 6,
    },
    emailText: {
        color: adminColors.text.light,
        fontSize: 15,
    },
    infoContainer: {
        paddingTop: 8,
        paddingBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    infoLabel: {
        fontWeight: 'bold',
        width: 120,
        color: adminColors.text.primary,
        fontSize: 15,
    },
    infoValue: {
        flex: 1,
        color: adminColors.text.secondary,
        fontSize: 15,
    },
    actionButtons: {
        justifyContent: 'flex-start',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    primaryButton: {
        marginRight: 12,
        // Enhancing button contrast
        backgroundColor: adminColors.primary,
    },
    secondaryButton: {
        borderColor: adminColors.primary,
        borderWidth: 1.5, // Increased border width for better visibility
    },
    cardTitle: {
        fontSize: 18,
        color: adminColors.text.primary,
        fontWeight: '600',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    lastSettingRow: {
        borderBottomWidth: 0,
    },
    settingLabel: {
        color: adminColors.text.primary,
        fontSize: 15,
        fontWeight: '500',
    },
    settingButton: {
        marginRight: -8,
    },
    // Button text styles for better readability
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    secondaryButtonText: {
        color: adminColors.primary,
        fontWeight: 'bold',
    }
});

export default accountStyles;
