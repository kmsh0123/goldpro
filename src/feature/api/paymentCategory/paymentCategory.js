import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentCategoryApi = createApi({
  reducerPath: "paymentCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
  }),
  tagTypes: ["paymentCategoryApi"],

  endpoints: (builder) => ({
    createPaymentCategory: builder.mutation({
      query: (formData) => ({
        url: `payment/category/create`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["paymentCategoryApi"],
    }),
    getPaymentCategory: builder.query({
      query: () => ({
        url: "payment/category/list",
        method: "GET",
      }),
      providesTags: ["paymentCategoryApi"],
    }),
    getDetailPaymentCategory: builder.query({
      query: (id) => ({
        url: `payment/category/details/${id}`,
        method: "GET",
      }),
      providesTags: ["paymentCategoryApi"],
    }),
    editPaymentCategory: builder.mutation({
      query: ({id,formData}) => ({
        url: `payment/category/update/${id}`,
        method: "PUT",
        body : formData,
      }),
      invalidatesTags: ["paymentCategoryApi"],
    }),
    deletePaymentCategory: builder.mutation({
      query: (id) => ({
        url: `payment/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paymentCategoryApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {paymentCategoryApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["paymentCategoryApi"],
    // }),
  }),
});


export const {useCreatePaymentCategoryMutation,useGetPaymentCategoryQuery,useEditPaymentCategoryMutation,useDeletePaymentCategoryMutation,useGetDetailPaymentCategoryQuery} = paymentCategoryApi;