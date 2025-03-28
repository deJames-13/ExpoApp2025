import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export const CustomLayout = ({ children, style }) => (
    <View style={[styles.customLayoutContainer, style]}>
        {children}
    </View>
);
