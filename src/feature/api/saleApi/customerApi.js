import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const customerApi = createApi({
  reducerPath: "customerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,

  }),
  tagTypes: ["customerApi"],
  endpoints: (builder) => ({
    getCustomer: builder.query({
      query: () => ({
        url: `customer/list`,
        method: "GET",
      }),
      providesTags: ["customerApi"],
    }),
    createCustomer: builder.mutation({
      query: (formData) => ({
        url: "customer/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["customerApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["customerApi"],
    // }),
  }),
});

export const {useGetCustomerQuery,useCreateCustomerMutation} = customerApi;