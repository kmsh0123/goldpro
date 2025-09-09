import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,

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
      query: (formData) => ({
        url: "product/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["productApi"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `product/delete/${id}`,
        method: "DELETE",
        // headers: {productApiorization : `Bearer ${token}`}
      }),
      invalidatesTags: ["productApi"],
    }),
     ProductDetail: builder.query({
      query: (id) => ({
        url: `product/details/${id}`,
        method: "GET",
        // headers: {productApiorization : `Bearer ${token}`}
      }),
      providesTags: ["productApi"],
    }),
  }),
});

export const {useGetProductQuery,useCreateProductMutation,useDeleteProductMutation,useProductDetailQuery} = productApi;