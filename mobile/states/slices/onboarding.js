import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Basic Information
    basic: {
        first_name: '',
        last_name: '',
        contact: '',
        birthdate: null,
        avatar: null,
        isCompleted: false,
    },
    // Address Information
    address: {
        address: '',
        city: '',
        region: '',
        zip_code: '',
        isCompleted: false,
    },
    // Email verification status
    email: {
        isCompleted: false,
    },
    // Current step in onboarding
    currentStep: 'BasicInformation',
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setBasicInfo: (state, action) => {
            state.basic = {
                ...state.basic,
                ...action.payload,
                isCompleted: true,
            };
        },
        setAddressInfo: (state, action) => {
            state.address = {
                ...state.address,
                ...action.payload,
                isCompleted: true,
            };
        },
        setEmailVerified: (state, action) => {
            state.email.isCompleted = action.payload;
        },
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        resetOnboarding: () => initialState,
    },
});

export const {
    setBasicInfo,
    setAddressInfo,
    setEmailVerified,
    setCurrentStep,
    resetOnboarding,
} = onboardingSlice.actions;

// Selectors
export const selectBasicInfo = (state) => state.onboarding.basic;
export const selectAddressInfo = (state) => state.onboarding.address;
export const selectEmailVerification = (state) => state.onboarding.email;
export const selectCurrentStep = (state) => state.onboarding.currentStep;
export const selectIsBasicCompleted = (state) => state.onboarding.basic.isCompleted;
export const selectIsAddressCompleted = (state) => state.onboarding.address.isCompleted;
export const selectIsEmailVerified = (state) => state.onboarding.email.isCompleted;

export default onboardingSlice.reducer;
