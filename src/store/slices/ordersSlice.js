import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.history.push(action.payload);
    },
    clearOrders: (state) => {
      state.history = [];
    },
  },
});

export const { addOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;