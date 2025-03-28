import React from 'react';
import { View } from 'react-native';
import { styles } from './styles';

export const FormRow = ({ children, style }) => (
    <View style={[styles.row, style]}>
        {children}
    </View>
);
