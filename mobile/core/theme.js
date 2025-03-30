import { DefaultTheme } from 'react-native-paper';
import { colors } from '../theme/colors';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#600EE6',
    secondary: '#414757',
    error: '#f13a59',
    background: colors.background,
    surface: colors.cardBackground, // Set surface color to match card background
    text: colors.text.primary,      // Ensure main text color has good contrast
    onBackground: colors.text.primary,   // Text on background should be visible
    onSurface: colors.text.primary,      // Text on surfaces should be visible
  },
};