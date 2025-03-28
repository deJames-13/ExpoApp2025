import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './reducers';
import apiSlice from './api';

console.log('Setting up Redux store with API middleware');

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: true, // Enable Redux DevTools
});

// Enable refetchOnFocus and other RTK Query features
setupListeners(store.dispatch);

export default store;