import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const paymentCategoryApi = createApi({
  reducerPath: "paymentCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: ["paymentCategoryApi"],

  endpoints: (builder) => ({
    createPaymentCategory: builder.mutation({
      query: (formData) => ({
        url: `payment/category/create`,
        method: "POST",
        body: formData,
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
      query: ({ id, formData }) => ({
        url: `payment/category/update/${id}`,
        method: "PUT",
        body: formData,
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

export const {
  useCreatePaymentCategoryMutation,
  useGetPaymentCategoryQuery,
  useEditPaymentCategoryMutation,
  useDeletePaymentCategoryMutation,
  useGetDetailPaymentCategoryQuery,
} = paymentCategoryApi;
