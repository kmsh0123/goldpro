import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const productReturnApi = createApi({
  reducerPath: "productReturnApi",
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
  tagTypes: ["productReturnApi"],
  endpoints: (builder) => ({
    getProductReturn: builder.query({
      query: () => ({
        url: `product/return/list`,
        method: "GET",
      }),
      providesTags: ["productReturnApi"],
    }),
    createProductReturn: builder.mutation({
      query: (formData) => ({
        url: "product/return/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["productReturnApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {dammageApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["productReturnApi"],
    // }),
  }),
});

export const { useGetProductReturnQuery, useCreateProductReturnMutation } = productReturnApi;
