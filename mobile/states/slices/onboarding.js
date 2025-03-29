import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentStep: null,
    basicInfo: {
        first_name: '',
        last_name: '',
        contact: '',
        birthdate: null,
        avatar: null,
        isCompleted: false
    },
    addressInfo: {
        address: '',
        city: '',
        region: '',
        zip_code: '',
        isCompleted: false
    },
    isEmailVerified: false
};

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        setCurrentStep: (state, action) => {
            state.currentStep = action.payload;
        },
        setBasicInfo: (state, action) => {
            state.basicInfo = {
                ...state.basicInfo,
                ...action.payload,
                isCompleted: true
            };
        },
        setAddressInfo: (state, action) => {
            state.addressInfo = {
                ...state.addressInfo,
                ...action.payload,
                isCompleted: true
            };
        },
        setEmailVerified: (state, action) => {
            state.isEmailVerified = action.payload;
        },
        // Add a new action to reset the onboarding state
        resetOnboarding: (state) => {
            // Reset form values but keep completion status
            return {
                ...initialState,
                basicInfo: {
                    ...initialState.basicInfo,
                    isCompleted: state.basicInfo.isCompleted
                },
                addressInfo: {
                    ...initialState.addressInfo,
                    isCompleted: state.addressInfo.isCompleted
                },
                isEmailVerified: state.isEmailVerified
            };
        }
    }
});

export const {
    setCurrentStep,
    setBasicInfo,
    setAddressInfo,
    setEmailVerified,
    resetOnboarding
} = onboardingSlice.actions;

export const selectCurrentStep = (state) => state.onboarding.currentStep;
export const selectBasicInfo = (state) => state.onboarding.basicInfo;
export const selectAddressInfo = (state) => state.onboarding.addressInfo;
export const selectIsBasicCompleted = (state) => state.onboarding.basicInfo.isCompleted;
export const selectIsAddressCompleted = (state) => state.onboarding.addressInfo.isCompleted;
export const selectIsEmailVerified = (state) => state.onboarding.isEmailVerified;

export default onboardingSlice.reducer;
