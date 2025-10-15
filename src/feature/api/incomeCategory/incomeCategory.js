import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const incomeCategoryApi = createApi({
  reducerPath: "incomeCategoryApi",
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
  tagTypes: ["incomeCategoryApi"],

  endpoints: (builder) => ({
    createIncomeCategory: builder.mutation({
      query: (formData) => ({
        url: `income/category/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["incomeCategoryApi"],
    }),
    getIncomeCateory: builder.query({
      query: () => ({
        url: "income/category/list",
        method: "GET",
      }),
      providesTags: ["incomeCategoryApi"],
    }),
    getDetailIncomeCateory: builder.query({
      query: (id) => ({
        url: `income/category/details/${id}`,
        method: "GET",
      }),
      providesTags: ["incomeCategoryApi"],
    }),
    editIncomeCategory: builder.mutation({
      query: ({ formData, id }) => ({
        url: `income/category/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["incomeCategoryApi"],
    }),
    deleteIncomeCateory: builder.mutation({
      query: (id) => ({
        url: `income/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["incomeCategoryApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {incomeCategoryApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["incomeCategoryApi"],
    // }),
  }),
});

export const {
  useCreateIncomeCategoryMutation,
  useGetIncomeCateoryQuery,
  useEditIncomeCategoryMutation,
  useDeleteIncomeCateoryMutation,
  useGetDetailIncomeCateoryQuery,
} = incomeCategoryApi;
