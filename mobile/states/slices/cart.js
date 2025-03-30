import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    cartItems: {},
    selectedItems: {},
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleItemSelection: (state, action) => {
            const itemId = action.payload;
            if (state.selectedItems[itemId]) {
                const newSelectedItems = { ...state.selectedItems };
                delete newSelectedItems[itemId];
                state.selectedItems = newSelectedItems;
            } else {
                // Otherwise, select it
                state.selectedItems = {
                    ...state.selectedItems,
                    [itemId]: true
                };
            }
        },
        selectAllItems: (state, action) => {
            const items = action.payload || [];
            const selectedItems = {};

            items.forEach(item => {
                if (item && item.id) {
                    selectedItems[item.id] = true;
                }
            });

            state.selectedItems = selectedItems;
        },
        deselectAllItems: (state) => {
            state.selectedItems = {};
        },
        removeSelectedItems: (state) => {
            state.selectedItems = {};
        },
    },
});

export const {
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    removeSelectedItems
} = cartSlice.actions;

// Add the missing selector
export const selectSelectedItems = (state) => state.cart.selectedItems;

export default cartSlice.reducer;

