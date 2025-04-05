import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';
import { ResourceModal } from '~/components/ResourceModal';
import { ReviewForm } from './form';
import { adminColors } from '~/styles/adminTheme';

export function ReviewModal({ visible, onDismiss, review, onSave, mode = 'create' }) {
    const formRef = useRef(null);

    // Determine title based on mode
    const getTitle = () => {
        switch (mode) {
            case 'create': return 'Add New Review';
            case 'edit': return 'Edit Review';
            case 'view': return 'Review Details';
            default: return 'Review';
        }
    };

    // Handle form submission
    const handleSave = (values) => {
        onSave(values);
    };

    // Trigger form submission from modal buttons
    const handleFormSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    // Determine footer actions based on mode
    const getFooterActions = () => {
        const actions = [
            {
                label: 'Close',
                onPress: onDismiss,
                mode: 'text',
                textColor: adminColors.text.secondary
            }
        ];

        if (mode !== 'view') {
            actions.push({
                label: mode === 'create' ? 'Create' : 'Update',
                onPress: handleFormSubmit,
                mode: 'contained',
                style: styles.primaryButton,
                textColor: adminColors.background
            });
        }

        return actions;
    };

    return (
        <ResourceModal
            visible={visible}
            onDismiss={onDismiss}
            title={getTitle()}
            footerActions={getFooterActions()}
            verticalAlign="center"
            containerStyle={styles.modalContainer}
            headerStyle={styles.modalHeader}
            bodyStyle={styles.modalBody}
        >
            <ReviewForm
                review={review}
                mode={mode}
                onSubmit={handleSave}
                formRef={formRef}
            />
        </ResourceModal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalHeader: {
        backgroundColor: adminColors.cardBackground,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    modalBody: {
        backgroundColor: adminColors.cardBackground,
        paddingVertical: 12,
    },
    primaryButton: {
        backgroundColor: adminColors.primary,
    },
});
