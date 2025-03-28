import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export const HalfField = ({ children, style }) => (
    <View style={[styles.halfInputContainer, style]}>
        {children}
    </View>
);
