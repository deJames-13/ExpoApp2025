import { combineReducers } from 'redux';
import themeReducer from './slices/theme';
import authReducer from './slices/auth';
import firebaseReducer from './slices/firebase';
import apiSlice from "./api/"


const rootReducer = combineReducers({
    theme: themeReducer,
    auth: authReducer,
    firebase: firebaseReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
});

export default rootReducer;
