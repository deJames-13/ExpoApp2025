import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Text } from 'react-native';

const CustomHeader = ({ title, showBackButton = false }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.header}>
            <View style={styles.leftContainer}>
                {showBackButton && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                )}
            </View>

            <View style={styles.centerContainer}>
                <Image
                    source={require('~/assets/icon.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                {title && <Text style={styles.title}>{title}</Text>}
            </View>

            <View style={styles.rightContainer} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    leftContainer: {
        width: 40,
    },
    centerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    rightContainer: {
        width: 40,
    },
    backButton: {
        padding: 8,
    },
    logo: {
        height: 100,
        width: 100,
        marginRight: 8,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    }
});

export default CustomHeader;
