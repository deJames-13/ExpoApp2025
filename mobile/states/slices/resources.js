import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a slice for resource management
const resourcesSlice = createSlice({
    name: 'resources',
    initialState: {
        list: {},
        detail: {},
        refresh: false
    },
    reducers: {
        setResource: (state, action) => {
            const { resource, data, type } = action.payload;
            if (type === 'list') {
                state.list[resource] = data;
            } else if (type === 'detail') {
                state.detail[resource] = data;
            }
        },
        toggleRefresh: (state, action) => {
            state.refresh = action.payload !== undefined ? action.payload : !state.refresh;
        }
    }
});

export const { setResource, toggleRefresh } = resourcesSlice.actions;

export default resourcesSlice.reducer;
