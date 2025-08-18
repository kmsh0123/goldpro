import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   goldWeight: {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  alyaut : {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  laathk : "",
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
     setGoldAlyaut: (state, action) => {
      state.alyaut = { ...state.alyaut, ...action.payload };
    },
     setGoldLaathk: (state, action) => {
      state.laathk = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { addToCart,setGoldWeight,setGoldAlyaut,setGoldLaathk  } = cartSlice.actions

export default cartSlice.reducer