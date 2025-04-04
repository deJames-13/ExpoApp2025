import { StyleSheet } from 'react-native';
import { adminColors } from '~/styles/adminTheme';

export const styles = StyleSheet.create({
    // Base field styles
    fieldContainer: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: adminColors.text.primary,
        fontWeight: '500',
    },
    input: {
        backgroundColor: adminColors.cardBackground,
        color: adminColors.text.primary,
    },
    multilineInput: {
        height: 100,
    },
    errorText: {
        color: adminColors.status.error,
        fontSize: 12,
        marginTop: 2,
        paddingHorizontal: 4,
    },
    disabledText: {
        color: adminColors.text.light,
    },
    placeholderText: {
        color: adminColors.text.light,
        fontStyle: 'italic',
    },

    // Layout styles
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 0,
    },
    halfInputContainer: {
        width: '48%',
    },

    // Status field styles
    statusContainer: {
        marginBottom: 16,
    },
    statusViewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    statusChip: {
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    statusChipView: {
        marginLeft: 8,
    },
    statusChipText: {
        fontWeight: 'bold',
    },

    // Multiselect styles
    multiselectContainer: {
        marginBottom: 8,
    },
    multiselectInput: {
        marginTop: 8,
    },
    selectedChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
    },
    selectedChip: {
        marginRight: 8,
        marginBottom: 8,
    },
    menuContent: {
        maxHeight: 250,
        padding: 0,
    },
    menu: {
        marginTop: 5,
        // Remove width constraint here to use dynamic width
    },
    menuScrollView: {
        maxHeight: 250,
    },
    searchResultHeader: {
        padding: 8,
        backgroundColor: '#f5f5f5',
    },
    searchResultText: {
        fontStyle: 'italic',
        color: adminColors.text.secondary,
    },

    // Date field styles
    datePickerContainer: {
        position: 'relative',
    },
    dateInput: {
        backgroundColor: adminColors.cardBackground,
    },

    // Number field styles
    numberInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        color: adminColors.text.primary,
    },
    numberInput: {
        flex: 1,
        marginHorizontal: 8,
        textAlign: 'center',
        backgroundColor: adminColors.background,
        color: adminColors.text.primary,
    },
    numberButton: {
        margin: 0,
    },

    // Range field styles
    rangeHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rangeValue: {
        fontWeight: 'bold',
        color: adminColors.primary,
    },
    rangeLabelsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    rangeMinMaxLabel: {
        fontSize: 12,
        color: adminColors.text.secondary,
    },

    // Checkbox styles
    checkboxGroupContainer: {
        marginTop: 4,
    },
    checkboxGroupHorizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    checkboxContainerHorizontal: {
        marginRight: 16,
    },
    checkboxLabel: {
        marginLeft: 8,
        fontSize: 15,
        color: '#212121',
    },

    // Radio button styles
    radioGroupContainer: {
        marginTop: 4,
    },
    radioGroupHorizontal: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    radioContainerHorizontal: {
        marginRight: 16,
    },
    radioLabel: {
        marginLeft: 8,
        fontSize: 15,
        color: '#212121',
    },
    radioLabelActive: {
        fontWeight: 'bold'
    },

    // Image field styles
    imageFieldContainer: {
        alignItems: 'center',
    },
    imagePreviewContainer: {
        marginBottom: 8,
    },
    imagePreview: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    imagePickerPlaceholder: {
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#ddd',
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePickerIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    imagePickerText: {
        color: adminColors.text.secondary,
    },
    imageActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    imageButton: {
        flex: 1,
        marginHorizontal: 4,
    },

    // Custom layout container
    customLayoutContainer: {
        width: '100%',
    },

    // Modal select field styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        maxHeight: '80%',
        backgroundColor: adminColors.cardBackground,
        borderRadius: 8,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: adminColors.divider,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.text.primary,
    },
    modalCloseButton: {
        fontSize: 22,
        color: adminColors.text.primary,
    },
    modalSearchBar: {
        margin: 8,
        elevation: 0,
        backgroundColor: adminColors.background,
    },
    modalDivider: {
        backgroundColor: adminColors.divider,
    },
    modalSelectList: {
        paddingVertical: 8,
    },
    modalSelectItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: adminColors.divider,
    },
    modalSelectItemSelected: {
        backgroundColor: `${adminColors.primary}20`,
    },
    modalSelectItemText: {
        fontSize: 16,
        color: adminColors.text.primary,
    },
    modalSelectItemTextSelected: {
        color: adminColors.primary,
        fontWeight: 'bold',
    },
    modalSelectItemIcon: {
        fontSize: 18,
        color: adminColors.primary,
    },
    modalSelectEmptyContainer: {
        padding: 16,
        alignItems: 'center',
    },
    modalSelectEmptyText: {
        marginTop: 8,
        color: adminColors.text.secondary,
    },
    modalSelectCreateOption: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: adminColors.divider,
        alignItems: 'center',
    },
    modalSelectCreateOptionText: {
        color: adminColors.primary,
        fontWeight: 'bold',
    },
    modalSelectLoadMoreButton: {
        marginTop: 8,
    },
});
export { adminColors };
