import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState = {
    items: [],
    total: 0,
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const item = action.payload;
            const index = state.items.findIndex(i => i.id === item.id);
            if (index !== -1) {
                state.items[index].quantity += item.quantity;
            } else {
                state.items.push(item);
            }
            state.total += item.price * item.quantity;
        },
        removeItem: (state, action) => {
            const item = action.payload;
            const index = state.items.findIndex(i => i.id === item.id);
            if (index !== -1) {
                state.total -= state.items[index].price * state.items[index].quantity;
                state.items.splice(index, 1);
            }
        },
        clearCart: (state) => {
            state.items = [];
            state.total = 0;
        },
    },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

