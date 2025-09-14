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
  discount: {
    kyat: "",
    pae: "",
    yway: "",
    gram: "",
  },
  laathk: "",
  cash: "",
  discountcash : "",
  convert24K: 0,
  convert24KDetail: { kyat: 0, pae: 0, yway: 0, gram: 0 },
  items: [],
  payments: [],
  discountPayments: [],
};

// Helper Functions

const convertToKyat = (kyat, pae, yway) => {
  const totalKyat = Number(kyat) + Number(pae) / 16 + Number(yway) / (16 * 8);
  // console.log(
  //   `[convertToKyat] kyat: ${kyat}, pae: ${pae}, yway: ${yway} => totalKyat: ${totalKyat}`
  // );
  return totalKyat;
};

const to24K = (kyatValue, quality) => {
  let result = kyatValue;
  if (quality === 18) result = (kyatValue * 16) / 12;
  else if (quality === 22) result = (kyatValue * 17.5) / 16;
  else if (quality === 23) result = (kyatValue * 17) / 16;
  else if (quality === 24) result = kyatValue * 1;

  console.log(
    `[to24K] kyatValue: ${kyatValue}, quality: ${quality} => converted24K: ${result}`
  );
  return result;
};

const convert24KToKPY = (kyatValue) => {
  const kyat = Math.floor(kyatValue);
  const paeValue = (kyatValue - kyat) * 16;
  const pae = Math.floor(paeValue);
  const yway = Math.floor((paeValue - pae) * 8);
  const gram = (kyatValue * 16.67).toFixed(2); // 1 kyat = 16.67 grams (more precise)

  console.log(
    `[convert24KToKPY] kyatValue: ${kyatValue} => kyat: ${kyat}, pae: ${pae}, yway: ${yway}, gram: ${gram}`
  );
  return { kyat, pae, yway, gram: parseFloat(gram) }; // Parse gram back to number
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemToAdd = {
        id: Date.now(),
        ...action.payload,
      };
      state.items.push(itemToAdd);
    },

     removeCart: (state, action) => {
      state.items.splice(action.payload, 1)
    },

    // (optional) remove by id
    removeCartById: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      const existingItem = state.items.find((item) => item.id === itemId);

      if (existingItem) {
        existingItem.qty = Number(existingItem.qty || 0) - 1;

        if (existingItem.stock !== undefined) {
          existingItem.stock = Number(existingItem.stock || 0) + 1;
        }

        if (existingItem.qty <= 0) {
          state.items = state.items.filter((item) => item.id !== itemId);
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
    
    
    setDiscount: (state, action) => {
      state.discount = { ...state.discount, ...action.payload };
      console.log(state.discount);
    },

    // Add discount payment actions
    addDiscountPayment: (state, action) => {
      state.discountPayments.push({ ...action.payload, id: Date.now() });
    },

    removeDiscountPayment: (state, action) => {
      state.discountPayments = state.discountPayments.filter(
        (payment) => payment.id !== action.payload
      );
    },
    
    // updateDiscountPayment: (state, action) => {
    //   const { id, ...updates } = action.payload;
    //   const payment = state.discountPayments.find((p) => p.id === id);
    //   if (payment) {
    //     Object.assign(payment, updates);
    //   }
    // },
    
    resetDiscountPayments: (state) => {
      state.discountPayments = [];
    },
    
    
    addPayment: (state, action) => {
      state.payments.push({ ...action.payload });
    },

    removePayment: (state, action) => {
     state.items.splice(action.payload, 1)
    },
    
    resetPayments: (state) => {
      state.payments = [];
    },
    
    setCash: (state, action) => {
      state.cash = action.payload;
    },

    setDiscountCash: (state, action) => {
      state.discountcash = action.payload;
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
    
    resetDiscount: (state) => {
      state.discount = { kyat: "", pae: "", yway: "", gram: "" };
    },
    
    clearCart: (state) => {
      state.items = [];
      state.goldWeight = { kyat: "", pae: "", yway: "", gram: "" };
      state.payment = { kyat: "", pae: "", yway: "", gram: "" };
      state.discount = { kyat: "", pae: "", yway: "", gram: "" };
      state.laathk = "";
      state.cash = "";
      state.convert24K = 0;
      state.convert24KDetail = { kyat: 0, pae: 0, yway: 0, gram: 0 };
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
        state.convert24KDetail = { kyat: 0, pae: 0, yway: 0, gram: 0 };
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
  setDiscountCash,
  setpayment,
  setDiscount,
  clearCart,
  resetGoldWeight,
  resetpayment,
  resetDiscount,
  addDiscountPayment,
  removeDiscountPayment,
  resetDiscountPayments,
  // updateDiscountPayment,
  addPayment,
  removePayment,
  resetPayments,
  resetAlyutWeight,
  updateConvert24K,
  removeCart,
  removeCartById,
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