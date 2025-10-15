import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const categoryApi = createApi({
  reducerPath: "categoryApi",
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
  tagTypes: ["categoryApi"],
  endpoints: (builder) => ({
    getCategory: builder.query({
      query: () => ({
        url: `category/list`,
        method: "GET",
      }),
      providesTags: ["categoryApi"],
    }),
    getDetailCategory: builder.query({
      query: (id) => ({
        url: `category/details/${id}`,
        method: "GET",
      }),
      providesTags: ["categoryApi"],
    }),
    createCategory: builder.mutation({
      query: (formData) => ({
        url: "category/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["categoryApi"],
    }),
    UpdateCategory: builder.mutation({
      query: ({ id, formData }) => ({
        url: `category/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["categoryApi"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categoryApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["categoryApi"],
    // }),
  }),
});

export const {
  useGetCategoryQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetDetailCategoryQuery,
} = categoryApi;
