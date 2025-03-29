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
  devTools: process.env.EXPO_DEBUG ? true : false,
});

setupListeners(store.dispatch);

export default store;