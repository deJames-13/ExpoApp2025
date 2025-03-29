import { combineReducers } from 'redux';
import themeReducer from './slices/theme';
import authReducer from './slices/auth';
import firebaseReducer from './slices/firebase';
import resourcesReducer from './slices/resources';
import onboardingReducer from './slices/onboarding';
import apiSlice from "./api/"

const rootReducer = combineReducers({
    theme: themeReducer,
    auth: authReducer,
    firebase: firebaseReducer,
    resources: resourcesReducer,
    onboarding: onboardingReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
});

export default rootReducer;
