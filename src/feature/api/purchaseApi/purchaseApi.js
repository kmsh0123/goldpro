import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
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
  tagTypes: ["purchaseApi"],
  endpoints: (builder) => ({
    getPurchase: builder.query({
      query: () => ({
        url: `purchase/purchaseList`,
        method: "GET",
      }),
      providesTags: ["purchaseApi"],
    }),
    createPurchase: builder.mutation({
      query: (formData) => ({
        url: "purchase/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["purchaseApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {purchaseApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["purchaseApi"],
    // }),
  }),
});

export const { useGetPurchaseQuery, useCreatePurchaseMutation } = purchaseApi;
