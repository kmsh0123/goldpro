import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const cashierApi = createApi({
  reducerPath: "cashierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      headers.set("Content-Type", "application/json"); // ✅ json only
      return headers;
    },
  }),
  tagTypes: ["cashierApi"],
  endpoints: (builder) => ({
    getCashier: builder.query({
      query: () => ({
        url: `cashier/list`,
        method: "GET",
      }),
      providesTags: ["cashierApi"],
    }),
    getDetailCashier: builder.query({
      query: (id) => ({
        url: `cashier/details/${id}`,
        method: "GET",
      }),
      providesTags: ["cashierApi"],
    }),
    createCashier: builder.mutation({
      query: (formData) => ({
        url: "cashier/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["cashierApi"],
    }),
    editCashier: builder.mutation({
      query: ({ formData, id }) => ({
        url: `cashier/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["cashierApi"],
    }),
    deleteCashier: builder.mutation({
      query: (id) => ({
        url: `cashier/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cashierApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["cashierApi"],
    // }),
  }),
});

export const {
  useGetCashierQuery,
  useCreateCashierMutation,
  useDeleteCashierMutation,
  useEditCashierMutation,
  useGetDetailCashierQuery,
} = cashierApi;
