import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   goldWeight: {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  items: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items.push(action.payload);
    },
     setGoldWeight: (state, action) => {
      state.goldWeight = { ...state.goldWeight, ...action.payload };
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToCart,setGoldWeight  } = cartSlice.actions

export default cartSlice.reducer