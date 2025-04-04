import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import auth from '@react-native-firebase/auth';
import { 
  GoogleOneTapSignIn, 
  statusCodes, 
  isErrorWithCode,
  isSuccessResponse,
  isNoSavedCredentialFoundResponse 
} from '@react-native-google-signin/google-signin';

const FirebaseGoogleSignIn = () => {
  useEffect(() => {
    // Configure Google Sign In when component mounts
    GoogleOneTapSignIn.configure({
      webClientId: 'autoDetect', // Uses automatic detection for webClientId
    });
  }, []);
  
  const googleSignIn = async () => {
    try {
      // First check Play Services (on Android)
      await GoogleOneTapSignIn.checkPlayServices();
      
      // Try automatic sign-in first
      const response = await GoogleOneTapSignIn.signIn();
      
      if (isSuccessResponse(response)) {
        // User successfully signed in
        const { idToken } = response.data;
        
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        
        // Sign-in with credential
        return auth().signInWithCredential(googleCredential);
      } else if (isNoSavedCredentialFoundResponse(response)) {
        // No saved credentials, try to create account
        return handleCreateAccount();
      }
    } catch (error) {
      console.log('Google Sign In Error:', error);
      
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.ONE_TAP_START_FAILED:
            // Rate limiting hit, try explicit sign-in
            return handleExplicitSignIn();
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play Services not available or outdated');
            break;
          default:
            console.log('Other error with code:', error.code);
        }
      }
    }
  };
  
  const handleCreateAccount = async () => {
    try {
      const response = await GoogleOneTapSignIn.createAccount();
      
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      console.log('Create Account Error:', error);
      // Fall back to explicit sign-in as last resort
      return handleExplicitSignIn();
    }
  };
  
  const handleExplicitSignIn = async () => {
    try {
      const response = await GoogleOneTapSignIn.presentExplicitSignIn();
      
      if (isSuccessResponse(response)) {
        const { idToken } = response.data;
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
      }
    } catch (error) {
      console.log('Explicit Sign In Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={googleSignIn}>
        <Text style={styles.buttonText}>Sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#4285F4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default FirebaseGoogleSignIn;