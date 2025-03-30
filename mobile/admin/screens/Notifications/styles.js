import { StyleSheet } from 'react-native';
import { adminStyles, adminColors } from '~/styles/adminTheme';
import { statusColors } from '~/styles/adminThemeUtils';
export { adminStyles, adminColors }
export const styles = StyleSheet.create({
    container: {
        ...adminStyles.container,
    },
    card: {
        ...adminStyles.card,
        marginBottom: 16,
    },
    input: {
        marginBottom: 12,
        color: adminColors.text.primary
    },
    button: {
        marginTop: 20,
        marginBottom: 10,
        paddingVertical: 8,
        backgroundColor: adminColors.primary,
    },
    errorText: {
        color: statusColors.error,
        fontSize: 12,
        marginBottom: 8,
        marginTop: -8,
    },
    label: {
        ...adminStyles.cardLabel,
        marginBottom: 8,
        marginTop: 8,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    chip: {
        margin: 4,
    },
    selectedChip: {
        backgroundColor: adminColors.primary,
    },
    selectedStatusChip: {
        backgroundColor: adminColors.secondary,
    },
    selectedChipText: {
        color: 'white',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    sectionTitle: {
        ...adminStyles.sectionTitle,
        marginTop: 16,
        marginBottom: 8,
    },
    historyItem: {
        marginVertical: 8,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    historyTitle: {
        ...adminStyles.cardTitle,
        marginBottom: 0,
    },
    historyBody: {
        marginTop: 4,
        marginBottom: 4,
        color: adminColors.text.secondary,
    },
    historyDate: {
        fontSize: 12,
        color: adminColors.text.light,
        marginTop: 4,
    },
    divider: {
        marginTop: 8,
    },
    loader: {
        marginVertical: 20,
        color: adminColors.primary,
    },
    emptyText: {
        textAlign: 'center',
        marginVertical: 20,
        color: adminColors.text.light,
    },
});
