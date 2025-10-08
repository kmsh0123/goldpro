import { configureStore } from '@reduxjs/toolkit'
import { productApi } from '../api/inventory/productApi'
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
import { stockApi } from '../api/stockApi/stockApi'
import { expenseApi } from '../api/expenseApi/expenseApi'
import { expenseCategoryApi } from '../api/expenseCategory/expenseCategory'
import { incomeApi } from '../api/incomeApi/incomeApi'
import { incomeCategoryApi } from '../api/incomeCategory/incomeCategory'
import { paymentCategoryApi } from '../api/paymentCategory/paymentCategory'
import { paymentApi } from '../api/paymentApi/paymentApi'

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [typeApi.reducerPath]: typeApi.reducer,
    [qualityApi.reducerPath]: qualityApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [subCoaApi.reducerPath]: subCoaApi.reducer,
    [customerApi.reducerPath]: customerApi.reducer,
    [stockApi.reducerPath]: stockApi.reducer,
    [supplierApi.reducerPath]: supplierApi.reducer,
    [posApi.reducerPath]: posApi.reducer,
    [purchaseApi.reducerPath]: purchaseApi.reducer,
    [expenseApi.reducerPath]: expenseApi.reducer,
    [expenseCategoryApi.reducerPath]: expenseCategoryApi.reducer,
    [incomeApi.reducerPath]: incomeApi.reducer,
    [incomeCategoryApi.reducerPath]: incomeCategoryApi.reducer,
    [paymentCategoryApi.reducerPath]: paymentCategoryApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    cart: cartSlice,
    payment : paymentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      productApi.middleware,
      typeApi.middleware,
      qualityApi.middleware,
      categoryApi.middleware,
      subCoaApi.middleware,
      customerApi.middleware,
      stockApi.middleware,
      supplierApi.middleware,
      posApi.middleware,
      purchaseApi.middleware,
      expenseApi.middleware,
      expenseCategoryApi.middleware,
      incomeApi.middleware,
      incomeCategoryApi.middleware,
      paymentCategoryApi.middleware,
      paymentApi.middleware,
    ),

  })