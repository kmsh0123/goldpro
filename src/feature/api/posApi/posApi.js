import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const posApi = createApi({
  reducerPath: "posApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,

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

export const {useCreateOrderMutation,useGetOrderQuery,useGetOrderListDetailQuery} = posApi;