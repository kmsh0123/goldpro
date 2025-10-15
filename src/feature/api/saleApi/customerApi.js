import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const customerApi = createApi({
  reducerPath: "customerApi",
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
  tagTypes: ["customerApi"],
  endpoints: (builder) => ({
    getCustomer: builder.query({
      query: () => ({
        url: `customer/list`,
        method: "GET",
      }),
      providesTags: ["customerApi"],
    }),
    getDetailCustomer: builder.query({
      query: (id) => ({
        url: `customer/details/${id}`,
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
    editCustomer: builder.mutation({
      query: ({ formDataWithGold, id }) => ({
        url: `customer/update/${id}`,
        method: "PUT",
        body: formDataWithGold,
      }),
      invalidatesTags: ["customerApi"],
    }),
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `customer/delete/${id}`,
        method: "DELETE",
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

export const {
  useGetCustomerQuery,
  useCreateCustomerMutation,
  useDeleteCustomerMutation,
  useEditCustomerMutation,
  useGetDetailCustomerQuery,
} = customerApi;
