import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const supplierApi = createApi({
  reducerPath: "supplierApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,

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

export const {useGetSupplierQuery,useCreateSupplierMutation} = supplierApi;