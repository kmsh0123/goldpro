import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  payments: [], // add to payment items
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    addToPayment: (state, action) => {
      state.payments.push(action.payload);
    },
    removeFromPayment: (state, action) => {
      state.payments = state.payments.filter(p => p.id !== action.payload);
    },
    clearPayment: (state) => {
      state.payments = [];
    }
  }
});

export const { addToPayment, removeFromPayment, clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
