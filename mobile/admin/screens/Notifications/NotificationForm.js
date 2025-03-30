import React, { useState, useRef } from 'react';
import { Alert, View } from 'react-native';
import { Button } from 'react-native-paper';
import * as Yup from 'yup';
import { ResourceForm } from '~/components/ResourceForm';
import {
    useSendBatchNotificationsMutation,
    useBroadcastNotificationMutation,
} from '~/states/api/notification';
import { styles, adminColors } from './styles.js';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    body: Yup.string().required('Message body is required'),
    type: Yup.string().required('Type is required'),
    customType: Yup.string().when('useCustomType', {
        is: true,
        then: Yup.string().required('Custom type is required'),
    }),
    status: Yup.string().required('Status is required'),
    userIds: Yup.string().when('isBroadcast', {
        is: false,
        then: Yup.string().required('At least one user ID is required')
    }),
    data: Yup.string().test(
        'is-valid-json',
        'Please enter valid JSON or leave empty',
        value => {
            if (!value || value.trim() === '') return true;
            try {
                JSON.parse(value);
                return true;
            } catch (error) {
                return false;
            }
        }
    ),
    filter: Yup.string().test(
        'is-valid-json',
        'Please enter valid JSON or leave empty',
        value => {
            if (!value || value.trim() === '') return true;
            try {
                JSON.parse(value);
                return true;
            } catch (error) {
                return false;
            }
        }
    ),
});

const NotificationForm = () => {
    const [sendBatchNotifications, { isLoading: isBatchLoading }] = useSendBatchNotificationsMutation();
    const [broadcastNotification, { isLoading: isBroadcastLoading }] = useBroadcastNotificationMutation();
    const [isFormValid, setIsFormValid] = useState(false);
    const submitRef = useRef(null);

    const isLoading = isBatchLoading || isBroadcastLoading;

    const initialValues = {
        title: '',
        body: '',
        type: 'info',
        customType: '',
        useCustomType: false,
        status: 'active',
        userIds: '',
        filter: '',
        data: '',
        isBroadcast: true,
        sendPush: true
    };

    const handleSendNotification = async (values) => {
        try {
            const notificationType = values.useCustomType ? values.customType : values.type;

            const payload = {
                title: values.title,
                body: values.body,
                type: notificationType,
                status: values.status,
                data: values.data && values.data.trim() !== '' ? JSON.parse(values.data) : {},
                sendPush: values.sendPush
            };

            let result;
            if (values.isBroadcast) {
                result = await broadcastNotification({
                    ...payload,
                    filter: values.filter && values.filter.trim() !== '' ? JSON.parse(values.filter) : {}
                }).unwrap();
            } else {
                const userIds = values.userIds
                    .split(',')
                    .map(id => id.trim())
                    .filter(Boolean);

                result = await sendBatchNotifications({
                    ...payload,
                    userIds
                }).unwrap();
            }

            Alert.alert(
                'Success',
                `Notification sent to ${result.data?.count || 'all'} users`,
                [{ text: 'OK' }]
            );
        } catch (error) {
            console.error('Error sending notification:', error);
            let errorMessage = 'Failed to send notification';

            if (error.message && error.message.includes('JSON Parse error')) {
                errorMessage = 'Invalid JSON format. Please check your data and filter fields.';
            } else if (error.data?.message) {
                errorMessage = error.data.message;
            }

            Alert.alert(
                'Error',
                errorMessage,
                [{ text: 'OK' }]
            );
        }
    };

    // Field configuration for ResourceForm
    const fieldConfig = [
        {
            type: 'status',
            field: 'type',
            label: 'Notification Type',
            options: ['info', 'alert', 'warning', 'success', 'promotion']
        },
        {
            type: 'checkbox',
            field: 'useCustomType',
            label: 'Use Custom Type',
        },
        {
            type: 'text',
            field: 'customType',
            label: 'Custom Type',
            // Only show this field when useCustomType is true
            conditional: (values) => values.useCustomType === true
        },
        {
            type: 'status',
            field: 'status',
            label: 'Status',
            options: ['active', 'inactive', 'archived']
        },
        {
            type: 'text',
            field: 'title',
            label: 'Notification Title *'
        },
        {
            type: 'textarea',
            field: 'body',
            label: 'Notification Message *',
            numberOfLines: 4
        },
        {
            type: 'textarea',
            field: 'data',
            label: 'Extra Data (JSON format, optional)',
            placeholder: '{"key": "value"}',
            numberOfLines: 2
        },
        {
            type: 'checkbox',
            field: 'isBroadcast',
            label: 'Broadcast to All Users'
        },
        {
            type: 'checkbox',
            field: 'sendPush',
            label: 'Send Push Notification'
        },
        {
            type: 'textarea',
            field: 'filter',
            label: 'Filter (JSON format, optional)',
            placeholder: '{"role": "customer"}',
            // Only show this field when isBroadcast is true
            conditional: (values) => values.isBroadcast === true
        },
        {
            type: 'text',
            field: 'userIds',
            label: 'User IDs (comma separated) *',
            placeholder: 'userId1, userId2, userId3',
            // Only show this field when isBroadcast is false
            conditional: (values) => values.isBroadcast === false
        }
    ];

    return (
        <View >
            <ResourceForm
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSendNotification}
                fieldConfig={fieldConfig}
                onValidationChange={(isValid) => setIsFormValid(isValid)}
                getSubmitRef={(submitFn) => { submitRef.current = submitFn; }}
            />

            <Button
                mode="contained"
                onPress={() => submitRef.current && submitRef.current()}
                loading={isLoading}
                style={styles.button}
                textColor={adminColors.background}
            >
                {initialValues.isBroadcast ? 'Broadcast Notification' : 'Send Batch Notification'}
            </Button>
        </View>
    );
};

export default NotificationForm;
