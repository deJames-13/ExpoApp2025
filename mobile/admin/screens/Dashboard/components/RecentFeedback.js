import React from 'react';
import { View, Text } from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { adminStyles, adminColors } from '~/styles/adminTheme';

const RecentFeedback = ({ newFeedbackCount, loading, onReviewPress }) => {
    return (
        <Card style={adminStyles.card}>
            <Card.Title titleStyle={{ color: adminColors.text.primary, fontWeight: 'bold' }} title="Recent Feedback" />
            <Card.Content>
                {loading ? (
                    <View style={{ alignItems: 'center', padding: 16 }}>
                        <ActivityIndicator size="small" color={adminColors.primary} />
                        <Text style={{ marginTop: 10, color: adminColors.text.secondary }}>Loading feedback data...</Text>
                    </View>
                ) : (
                        <View style={{ alignItems: 'center', padding: 16 }}>
                            <Text style={{ fontSize: 16, color: adminColors.text.primary, marginBottom: 12 }}>
                                You have <Text style={{ fontWeight: 'bold', color: adminColors.primary }}>{newFeedbackCount}</Text> new customer feedbacks
                            </Text>
                            <Button
                                mode="contained"
                                color={adminColors.primary}
                                onPress={onReviewPress}
                                style={adminStyles.actionButton}
                                labelStyle={adminStyles.actionButtonText}
                            >
                                Review Feedback
                            </Button>
                        </View>
                )}
            </Card.Content>
        </Card>
    );
};

export default RecentFeedback;
