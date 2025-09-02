import { configureStore } from '@reduxjs/toolkit'
import { productApi } from '../api/inventory/productApi'
import { coaApi } from '../api/coaApi/coaApi'
import { typeApi } from '../api/inventory/typeApi'
import { qualityApi } from '../api/inventory/qualityApi'
import { categoryApi } from '../api/inventory/categoryApi'
import cartSlice from '../service/cartSlice'
import paymentSlice from '../service/paymentSlice'
import { subCoaApi } from '../api/subCoaApi/subCoaApi'
import { customerApi } from '../api/saleApi/customerApi'
import { posApi } from '../api/posApi/posApi'
import { supplierApi } from '../api/supplierApi/supplierApi'
import { purchaseApi } from '../api/purchaseApi/purchaseApi'

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
    [qualityApi.reducerPath]: qualityApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [coaApi.reducerPath]: coaApi.reducer,
    [subCoaApi.reducerPath]: subCoaApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [posApi.reducerPath]: posApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    cart: cartSlice,
    payment : paymentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      coaApi.middleware,
      typeApi.middleware,
      qualityApi.middleware,
      categoryApi.middleware,
      subCoaApi.middleware,
      customerApi.middleware,
      supplierApi.middleware,
      posApi.middleware,
      purchaseApi.middleware,
    ),

  })