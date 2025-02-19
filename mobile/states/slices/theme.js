import { createSlice } from '@reduxjs/toolkit';

// TODO:  USE ASYNC STORAGE FOR MOBILE 


const initialState = {
    theme: 'light', // default theme
    loading: false,
    activeRequests: 0,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setLightTheme: (state) => {
            state.theme = 'light';
        },
        setDarkTheme: (state) => {
            state.theme = 'dark';
        },
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
        startLoading: (state) => {
            state.activeRequests++;
            state.loading = true;
        },
        stopLoading: (state) => {
            state.activeRequests--;
            if (state.activeRequests === 0) {
                state.loading = false;
            }
        },
    },
});

export const {
    setLightTheme,
    setDarkTheme,
    toggleTheme,
    startLoading,
    stopLoading,

} = themeSlice.actions;

export default themeSlice.reducer;
