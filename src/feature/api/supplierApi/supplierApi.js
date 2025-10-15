import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
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
  tagTypes: ["supplierApi"],
  endpoints: (builder) => ({
    getSupplier: builder.query({
      query: () => ({
        url: `supplier/list`,
        method: "GET",
      }),
      providesTags: ["supplierApi"],
    }),
    createSupplier: builder.mutation({
      query: (formData) => ({
        url: "supplier/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["supplierApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["supplierApi"],
    // }),
  }),
});

export const { useGetSupplierQuery, useCreateSupplierMutation } = supplierApi;
