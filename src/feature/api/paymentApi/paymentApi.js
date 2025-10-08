import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
  }),
  tagTypes: ["paymentApi"],


  endpoints: (builder) => ({
    createPayment: builder.mutation({
      query: (formData) => ({
        url: `payment/create`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["paymentApi"],
    }),
    getPayment: builder.query({
      query: () => ({
        url: "payment/list",
        method: "GET",
      }),
      providesTags: ["paymentApi"],
    }),
    getDetailPayment: builder.query({
      query: (id) => ({
        url: `payment/details/${id}`,
        method: "GET",
      }),
      providesTags: ["paymentApi"],
    }),
    editPayment: builder.mutation({
      query: ({formData,id}) => ({
        url: `payment/update/${id}`,
        method: "PUT",
        body : formData,
      }),
      invalidatesTags: ["paymentApi"],
    }),
    deletePayment: builder.mutation({
      query: (id) => ({
        url: `payment/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["paymentApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {paymentApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["paymentApi"],
    // }),
  }),
});


export const {useCreatePaymentMutation,useGetPaymentQuery,useEditPaymentMutation,useDeletePaymentMutation,useGetDetailPaymentQuery} = paymentApi;