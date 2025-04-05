import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adminColors } from '~/styles/adminTheme';
import { accountStyles } from '~/admin/styles/accountStyles';

export function ProfileHeader({ user }) {
    // Generate initials for the avatar if no image is available
    const getInitials = () => {
        if (!user.name) return 'AU';
        
        const names = user.name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
                {user.avatar ? (
                    <Avatar.Image
                        source={{ uri: user.avatar }}
                        size={80}
                        style={styles.avatar}
                    />
                ) : (
                    <Avatar.Text
                        size={80}
                        label={getInitials()}
                        style={styles.avatar}
                    />
                )}

                <View style={styles.profileInfo}>
                    <Text style={accountStyles.nameText}>{user.name}</Text>
                    <Text style={accountStyles.roleText}>{user.role}</Text>
                    <Text style={accountStyles.emailText}>{user.email}</Text>
                </View>
            </View>

            {user.location && user.location !== 'Location not set' && (
                <View style={styles.locationContainer}>
                    <MaterialCommunityIcons
                        name="map-marker"
                        size={18}
                        color={adminColors.text.secondary}
                    />
                    <Text style={styles.locationText}>{user.location}</Text>
                </View>
            )}
        </Card>
    );
}

const styles = StyleSheet.create({
    profileCard: {
        padding: 16,
        marginBottom: 16,
        backgroundColor: adminColors.cardBackground,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 16,
        backgroundColor: adminColors.primary,
    },
    profileInfo: {
        flex: 1,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    locationText: {
        marginLeft: 8,
        fontSize: 14,
        color: adminColors.text.secondary,
    },
});
