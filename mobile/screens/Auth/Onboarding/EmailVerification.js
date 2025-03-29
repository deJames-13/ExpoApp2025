import React, { useState, useEffect } from 'react';
import { View, SafeAreaView, StyleSheet, ScrollView, TextInput as RNTextInput, BackHandler } from 'react-native';
import { Button, Text, ProgressBar, Card } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { selectCurrentUser, selectAccessToken, selectIsEmailVerified as selectAuthEmailVerified } from '~/states/slices/auth';
import {
    selectBasicInfo,
    selectAddressInfo,
    selectIsEmailVerified,
    setEmailVerified,
    setCurrentStep,
    resetOnboarding
} from '~/states/slices/onboarding';
import { adminColors } from '~/styles/adminTheme';
import { useSendVerificationEmailMutation, useVerifyEmailMutation } from '~/states/api/auth';

export default function EmailVerification() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const token = useSelector(selectAccessToken);
    const isAuthEmailVerified = useSelector(selectAuthEmailVerified);
    const basicInfo = useSelector(selectBasicInfo);
    const addressInfo = useSelector(selectAddressInfo);
    const isOnboardingEmailVerified = useSelector(selectIsEmailVerified);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(0);
    const [otpSent, setOtpSent] = useState(false);

    const [sendVerificationEmail, { isLoading: isSending }] = useSendVerificationEmailMutation();
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

    const otpInputRefs = Array(6).fill(0).map(() => React.createRef());

    // Check if previous steps are completed
    useEffect(() => {
        if (!basicInfo.isCompleted) {
            navigation.navigate('BasicInformation');
            return;
        }

        if (!addressInfo.isCompleted) {
            navigation.navigate('AddressInformation');
            return;
        }

        dispatch(setCurrentStep('EmailVerification'));
    }, [basicInfo.isCompleted, addressInfo.isCompleted, navigation]);

    // Handle back button to navigate to AddressInformation
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                navigation.navigate('AddressInformation');
                return true; // Prevent default behavior
            };

            // Add event listener for hardware back button
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            // Set up navigation options
            navigation.setOptions({
                headerLeft: () => (
                    <Button
                        onPress={() => navigation.navigate('AddressInformation')}
                        mode="text"
                        compact
                        style={{ marginLeft: 8 }}
                    >
                        Back
                    </Button>
                ),
            });

            return () => {
                // Clean up event listener on unmount
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
            };
        }, [navigation])
    );

    // If user is already verified, redirect to main app
    useEffect(() => {
        if (isAuthEmailVerified) {
            // Update onboarding state
            dispatch(setEmailVerified(true));

            // Clear the pending verification flag
            AsyncStorage.removeItem('pendingEmailVerification');

            navigation.reset({
                index: 0,
                routes: [{ name: 'DefaultNav' }],
            });
        }
    }, [isAuthEmailVerified, navigation]);

    useEffect(() => {
        // Countdown timer for resend button
        let timer = null;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendVerificationCode = async () => {
        try {
            await sendVerificationEmail(currentUser.id).unwrap();

            setOtpSent(true);
            setCountdown(60); // 60 seconds countdown for resend button

            Toast.show({
                type: 'success',
                text1: 'Verification Code Sent',
                text2: `We've sent a verification code to ${currentUser?.email}`,
            });
        } catch (error) {
            console.error('Error sending verification code:', error);
            Toast.show({
                type: 'error',
                text1: 'Failed to Send Code',
                text2: error.data?.message || 'Please try again later.',
            });
        }
    };

    const handleVerifyEmail = async () => {
        try {
            const otpValue = otp.join('');

            if (otpValue.length !== 6) {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Code',
                    text2: 'Please enter the complete 6-digit code.',
                });
                return;
            }

            const result = await verifyEmail({
                userId: currentUser.id,
                otp: otpValue,
                token
            }).unwrap();

            // Update onboarding state
            dispatch(setEmailVerified(true));

            // Clear onboarding state
            dispatch(resetOnboarding());

            // Clear the pending verification flag
            AsyncStorage.removeItem('pendingEmailVerification');

            Toast.show({
                type: 'success',
                text1: 'Email Verified',
                text2: 'Your email has been successfully verified!',
            });

            // Navigation will happen automatically due to the useEffect that watches isEmailVerified
            navigation.reset({
                index: 0,
                routes: [{ name: 'DefaultNav' }],
            });
        } catch (error) {
            console.error('Error verifying email:', error);
            Toast.show({
                type: 'error',
                text1: 'Verification Failed',
                text2: error.data?.message || 'Invalid verification code.',
            });
        }
    };

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus to next input field
        if (text && index < 5) {
            otpInputRefs[index + 1].current.focus();
        }
    };

    const handleOtpKeyPress = (e, index) => {
        // Move to previous input on backspace
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            otpInputRefs[index - 1].current.focus();
        }
    };

    const skipVerification = async () => {
        // Mark that email verification is pending
        await AsyncStorage.setItem('pendingEmailVerification', 'true');

        // Skip verification and go to main app
        navigation.reset({
            index: 0,
            routes: [{ name: 'DefaultNav' }],
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <Text style={styles.title}>Verify Your Email</Text>
                    <Text style={styles.subtitle}>Step 3 of 3: Email Verification</Text>
                    <ProgressBar progress={1} color={adminColors.primary} style={styles.progressBar} />
                </View>

                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.emailText}>
                            To complete your registration, we need to verify your email address:
                        </Text>
                        <Text style={styles.emailHighlight}>{currentUser?.email}</Text>

                        {!otpSent ? (
                            <Button
                                mode="contained"
                                onPress={handleSendVerificationCode}
                                style={styles.sendButton}
                                loading={isSending}
                                disabled={isSending}
                                textColor={adminColors.background}
                            >
                                Send Verification Code
                            </Button>
                        ) : (
                            <>
                                <Text style={styles.otpInstructions}>
                                    Enter the 6-digit code sent to your email:
                                </Text>

                                <View style={styles.otpContainer}>
                                    {otp.map((digit, index) => (
                                        <RNTextInput
                                            key={index}
                                            ref={otpInputRefs[index]}
                                            style={styles.otpInput}
                                            value={digit}
                                            onChangeText={(text) => handleOtpChange(text.replace(/[^0-9]/g, ''), index)}
                                            onKeyPress={(e) => handleOtpKeyPress(e, index)}
                                            keyboardType="numeric"
                                            textColor={adminColors.background}
                                            color={adminColors.background}
                                            maxLength={1}
                                            selectTextOnFocus
                                        />
                                    ))}
                                </View>

                                {countdown > 0 ? (
                                    <Text style={styles.resendText}>
                                        Resend code in {countdown} seconds
                                    </Text>
                                ) : (
                                    <Button
                                        mode="text"
                                        onPress={handleSendVerificationCode}
                                        loading={isSending}
                                        disabled={isSending}
                                        style={styles.resendButton}
                                    >
                                        Resend Code
                                    </Button>
                                )}

                                <Button
                                    mode="contained"
                                    onPress={handleVerifyEmail}
                                    style={styles.verifyButton}
                                    loading={isLoading}
                                    disabled={isLoading || otp.join('').length !== 6}
                                    textColor={adminColors.background}
                                >
                                    Verify Email
                                </Button>
                            </>
                        )}
                    </Card.Content>
                </Card>

                <View style={styles.buttonContainer}>
                    <Button
                        mode="outlined"
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        Back
                    </Button>
                    <Button
                        mode="text"
                        onPress={skipVerification}
                        style={styles.skipButton}
                    >
                        Verify Later
                    </Button>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        borderRadius: 3,
    },
    card: {
        marginTop: 16,
        marginBottom: 24,
        elevation: 2,
    },
    emailText: {
        fontSize: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emailHighlight: {
        fontSize: 18,
        fontWeight: 'bold',
        color: adminColors.background,
        marginBottom: 24,
        textAlign: 'center',
    },
    sendButton: {
        marginTop: 16,
        backgroundColor: adminColors.primary,
    },
    otpInstructions: {
        fontSize: 16,
        marginBottom: 16,
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    otpInput: {
        width: 40,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#ccc',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    resendText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    resendButton: {
        marginBottom: 16,
    },
    verifyButton: {
        backgroundColor: adminColors.primary,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        marginBottom: 40,
        paddingHorizontal: 16,
    },
    backButton: {
        flex: 1,
        marginRight: 8,
        borderColor: adminColors.primary,
    },
    skipButton: {
        flex: 1,
        marginLeft: 8,
    },
});
