import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
});
setupListeners(store.dispatch);

export default store;