import React from 'react';
import { View, Text, Image } from 'react-native';
import { Card, Avatar, Divider } from 'react-native-paper';
import { userStyles as styles } from './styles';
import { adminColors } from '~/styles/adminTheme';

const UserInfoCard = ({ user, isAdmin }) => {
    if (!user) return null;

    // Extract user info from nested structure if available
    const userInfo = user.info || {};

    // Get user's first and last name from the correct fields
    const firstName = userInfo.first_name || user.firstName || '';
    const lastName = userInfo.last_name || user.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();

    // Get initials for the avatar
    const initials = (firstName?.[0] || '') + (lastName?.[0] || '');

    // Get avatar image URL
    const avatarUri = userInfo.photoUrl || userInfo.avatar?.url || user.avatar;

    // Get contact number from the correct field
    const contactNumber = userInfo.contact || user.phone || 'N/A';

    // Get address details if available
    const hasAddress = userInfo.address || userInfo.city || userInfo.region;
    const addressLine = [userInfo.address, userInfo.city, userInfo.region, userInfo.zip_code]
        .filter(Boolean)
        .join(', ');

    return (
        <Card style={styles.container}>
            <Card.Content>
                <Text style={styles.sectionTitle}>Customer Information</Text>
                <View style={styles.userInfoContainer}>
                    {avatarUri ? (
                        <Avatar.Image
                            size={50}
                            source={{ uri: avatarUri }}
                        />
                    ) : (
                        <Avatar.Text
                            size={50}
                            label={initials}
                            backgroundColor={adminColors.primary}
                            color="#fff"
                        />
                    )}

                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>
                            {fullName || user.username || 'Unknown User'}
                        </Text>
                        <Text style={styles.userEmail}>{user.email || 'No Email'}</Text>
                        {contactNumber !== 'N/A' && (
                            <Text style={styles.userPhone}>{contactNumber}</Text>
                        )}
                    </View>
                </View>

                {hasAddress && (
                    <View style={styles.addressContainer}>
                        <Text style={styles.addressLabel}>Address:</Text>
                        <Text style={styles.addressText}>{addressLine}</Text>
                    </View>
                )}

                {isAdmin && (
                    <>
                        <Divider style={styles.divider} />
                        <View style={styles.userMetaContainer}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Customer Since</Text>
                                <Text style={styles.metaValue}>
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Orders</Text>
                                <Text style={styles.metaValue}>{user.orderCount || 'N/A'}</Text>
                            </View>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>Status</Text>
                                <Text style={[
                                    styles.metaValue,
                                    { color: user.emailVerifiedAt ? adminColors.status.success : adminColors.status.warning }
                                ]}>
                                    {user.emailVerifiedAt ? 'Verified' : 'Unverified'}
                                </Text>
                            </View>
                        </View>
                    </>
                )}
            </Card.Content>
        </Card>
    );
};

export default UserInfoCard;
