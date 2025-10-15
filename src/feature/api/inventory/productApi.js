import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      // headers.set("Content-Type", "application/json"); // ✅ json only
      return headers;
    },
  }),
  tagTypes: ["productApi"],
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: () => ({
        url: `product/list`,
        method: "GET",
      }),
      providesTags: ["productApi"],
    }),
    createProduct: builder.mutation({
      query: (fd) => ({
        url: "product/create",
        method: "POST",
        body: fd,
      }),
      invalidatesTags: ["productApi"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, fd }) => ({
        url: `product/update/${id}`,
        method: "POST",
        body: fd,
      }),
      invalidatesTags: ["productApi"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `product/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["productApi"],
    }),
    ProductDetail: builder.query({
      query: (id) => ({
        url: `product/details/${id}`,
        method: "GET",
      }),
      providesTags: ["productApi"],
    }),
  }),
});

export const {
  useGetProductQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useProductDetailQuery,
  useUpdateProductMutation,
} = productApi;
