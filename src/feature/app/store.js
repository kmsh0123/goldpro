import { configureStore } from '@reduxjs/toolkit'
import { productApi } from '../api/inventory/productApi'
import { coaApi } from '../api/coaApi/coaApi'
import { typeApi } from '../api/inventory/typeApi'
import { qualityApi } from '../api/inventory/qualityApi'
import { categoryApi } from '../api/inventory/categoryApi'
import cartSlice from '../service/cartSlice'

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
    [qualityApi.reducerPath]: qualityApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [coaApi.reducerPath]: coaApi.reducer,
    cart: cartSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      coaApi.middleware,
      typeApi.middleware,
      qualityApi.middleware,
      categoryApi.middleware,
    ),
})