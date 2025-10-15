import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const stockApi = createApi({
  reducerPath: "stockApi",
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
  tagTypes: ["stockApi"],
  endpoints: (builder) => ({
    getStock: builder.query({
      query: () => ({
        url: `stock/list`,
        method: "GET",
      }),
      providesTags: ["stockApi"],
    }),
    // createCustomer: builder.mutation({
    //   query: (formData) => ({
    //     url: "customer/create",
    //     method: "POST",
    //     body: formData,
    //   }),
    //   invalidatesTags: ["stockApi"],
    // }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["stockApi"],
    // }),
  }),
});

export const { useGetStockQuery } = stockApi;
