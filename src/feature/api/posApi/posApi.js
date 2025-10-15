import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const posApi = createApi({
  reducerPath: "posApi",
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
  tagTypes: ["posApi"],
  endpoints: (builder) => ({
    getOrder: builder.query({
      query: () => ({
        url: `order/orderList`,
        method: "GET",
      }),
      providesTags: ["posApi"],
    }),
    getOrderListDetail: builder.query({
      query: (id) => ({
        url: `/order/orderItemList/${id}`,
        method: "GET",
      }),
      providesTags: ["posApi"],
    }),
    createOrder: builder.mutation({
      query: (formData) => ({
        url: "order/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["posApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {posApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["posApi"],
    // }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderQuery,
  useGetOrderListDetailQuery,
} = posApi;
