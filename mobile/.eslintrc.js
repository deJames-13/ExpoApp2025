// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: 'expo',
  ignorePatterns: [
    '**/dist/*',
    '**/node_modules/*',
    '**/build/*',
    '**/.cache/*',
    '**/_examples/*',
  ],
  globals: {
    // Add globals for timer functions
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    // Add React hooks as globals
    useState: 'readonly',
    useEffect: 'readonly',
    useContext: 'readonly',
    // Add Expo namespace globals
    expo: 'readonly',
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        moduleDirectory: ['node_modules', '.']
      }
    }
  },
  rules: {
    // Keep critical errors only
    'no-undef': 'error',
    'import/no-unresolved': 'error',

    // Disable warnings
    'no-unused-vars': 'off',
    'no-console': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'import/export': 'off',
    'import/named': 'off',
    'no-unused-expressions': 'off',
    // Relaxing namespace rules for Expo
    'import/namespace': 'warn'
  }
};
