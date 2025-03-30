import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    selectedItems: {}, // Track selected items with an object for O(1) lookup
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleItemSelection: (state, action) => {
            const itemId = action.payload;

            // If the item is already selected, unselect it
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
        // Add new function to remove selected items after checkout
        removeSelectedItems: (state) => {
            // This function performs a hard reset of the selected items
            // Different from deselectAllItems as it's specifically meant for post-checkout cleanup
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

