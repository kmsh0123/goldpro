import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  goldWeight: {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  alyut: {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  payment: {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  laathk: "",
  cash: "",
  convert24K: 0,
  convert24KDetail: { kyat: 0, pae: 0, yway: 0 },
  items: [],
  payments: [],
};

// Helper Functions

const convertToKyat = (kyat, pae, yway) => {
  const totalKyat = Number(kyat) + Number(pae) / 16 + Number(yway) / (16 * 8);
  console.log(
    `[convertToKyat] kyat: ${kyat}, pae: ${pae}, yway: ${yway} => totalKyat: ${totalKyat}`
  );
  return totalKyat;
};

const to24K = (kyatValue, quality) => {
  let result = kyatValue;
  if (quality === 18) result = (kyatValue / 16) * 12;
  else if (quality === 22) result = (kyatValue / 17.5) * 16;
  else if (quality === 23) result = (kyatValue / 17) * 16;

  console.log(
    `[to24K] kyatValue: ${kyatValue}, quality: ${quality} => converted24K: ${result}`
  );
  return result;
};

const convert24KToKPY = (kyatValue) => {
  const kyat = Math.floor(kyatValue);
  const paeValue = (kyatValue - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.round((paeValue - pae) * 8);

  console.log(
    `[convert24KToKPY] kyatValue: ${kyatValue} => kyat: ${kyat}, pae: ${pae}, yway: ${yway}`
  );
  return { kyat, pae, yway };
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      // Add unique ID if not present
      const itemToAdd = {
        id: Date.now(), // Add unique ID
        ...action.payload
      };
      
      const existingItem = state.items.find(
        (item) => item.productId === itemToAdd.productId
      );
      
      if (existingItem) {
        // If item exists, update quantity
        existingItem.qty = Number(existingItem.qty || 0) + Number(itemToAdd.qty || 1);
      } else {
        // If new item, add to cart
        state.items.push(itemToAdd);
      }
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload; // This should be productId or item id
      const existingItem = state.items.find((item) => item.productId === itemId);

      if (existingItem) {
        existingItem.qty = Number(existingItem.qty || 0) - 1;

        // Update stock if it exists
        if (existingItem.stock !== undefined) {
          existingItem.stock = Number(existingItem.stock || 0) + 1;
        }

        // Remove item if quantity reaches 0
        if (existingItem.qty <= 0) {
          state.items = state.items.filter((item) => item.productId !== itemId);
        }
      }
    },

    setGoldWeight: (state, action) => {
      state.goldWeight = { ...state.goldWeight, ...action.payload };
    },
    
    setAlyut: (state, action) => {
      state.alyut = { ...state.alyut, ...action.payload };
    },
    
    setpayment: (state, action) => {
      state.payment = { ...state.payment, ...action.payload };
      console.log(state.payment);
    },
    
    addPayment: (state, action) => {
      state.payments.push({ ...action.payload });
    },

    removePayment: (state, action) => {
      state.payments = state.payments.filter(
        (_, idx) => idx !== action.payload
      );
    },
    
    resetPayments: (state) => {
      state.payments = [];
    },
    
    setCash: (state, action) => {
      state.cash = action.payload;
    },
    
    setGoldLaathk: (state, action) => {
      state.laathk = action.payload;
    },
    
    resetGoldWeight: (state) => {
      state.goldWeight = { kyat: "", pae: "", yway: "", gram: "" };
    },
    resetAlyutWeight: (state) => {
      state.alyut = { kyat: "", pae: "", yway: "", gram: "" };
    },
    
    resetpayment: (state) => {
      state.payment = { kyat: "", pae: "", yway: "", gram: "" };
    },
    
    clearCart: (state) => {
      state.items = [];
      state.goldWeight = { kyat: "", pae: "", yway: "", gram: "" };
      // Removed undefined shweChain reference
      state.payment = { kyat: "", pae: "", yway: "", gram: "" };
      state.laathk = "";
      state.cash = "";
      state.convert24K = 0;
      state.convert24KDetail = { kyat: 0, pae: 0, yway: 0 };
      state.payments = [];
      console.log("[clearCart] cart cleared");
    },
    
    updateConvert24K: (state) => {
      if (state.items.length > 0) {
        let total24K = 0;
        state.items.forEach((item) => {
          const qty = Number(item.qty || 1);
          const kyatValue = convertToKyat(item.kyat, item.pae, item.yway);
          const converted = to24K(kyatValue, Number(item.karat || 24));
          total24K += converted * qty; // Multiply by quantity
        });

        state.convert24K = total24K;
        state.convert24KDetail = convert24KToKPY(total24K);
      } else {
        state.convert24K = 0;
        state.convert24KDetail = { kyat: 0, pae: 0, yway: 0 };
      }
    },
  },
});

// Action creators
export const {
  addToCart,
  removeFromCart,
  setGoldWeight,
  setAlyut,
  setGoldLaathk,
  setCash,
  setpayment,
  clearCart,
  resetGoldWeight,
  resetpayment,
  addPayment,
  removePayment,
  resetPayments,
  resetAlyutWeight,
  updateConvert24K,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selector
export const selectCartTotals = (state) => {
  return state.cart.items.reduce(
    (totals, item) => {
      const qty = Number(item.qty || 1);
      totals.kyat += Number(item.kyat || 0) * qty;
      totals.pae += Number(item.pae || 0) * qty;
      totals.yway += Number(item.yway || 0) * qty;
      totals.gram += Number(item.gram || 0) * qty;
      totals.price += Number(item.price || 0) * qty;
      return totals;
    },
    { kyat: 0, pae: 0, yway: 0, gram: 0, price: 0 }
  );
};