import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { List, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { adminColors } from '~/styles/adminTheme';
import { accountStyles } from '~/admin/styles/accountStyles';

export function ProfileMenuItem({ 
    title, 
    icon = "chevron-right", 
    onPress, 
    showBadge = false, 
    badgeCount = 0 
}) {
    // Render the badge if showBadge is true and badgeCount > 0
    const renderBadge = () => {
        if (showBadge && badgeCount > 0) {
            return (
                <Badge
                    style={styles.badge}
                    size={22}
                >
                    {badgeCount > 99 ? '99+' : badgeCount}
                </Badge>
            );
        }
        return null;
    };

    return (
        <TouchableOpacity onPress={onPress}>
            <List.Item
                title={title}
                left={props => (
                    <List.Icon
                        {...props}
                        icon={({ size, color }) => (
                            <MaterialCommunityIcons
                                name={icon}
                                size={size}
                                color={adminColors.primary}
                            />
                        )}
                    />
                )}
                right={props => renderBadge() ? renderBadge() : <List.Icon {...props} icon="chevron-right" />}
                style={styles.menuItem}
                titleStyle={styles.menuItemTitle}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        paddingVertical: 8,
        backgroundColor: adminColors.cardBackground,
        marginBottom: 1,
        borderRadius: 8,
    },
    menuItemTitle: {
        color: adminColors.text.primary,
        fontSize: 16,
    },
    badge: {
        backgroundColor: adminColors.status.warning,
        color: '#fff',
        alignSelf: 'center',
        marginRight: 10,
    },
});
