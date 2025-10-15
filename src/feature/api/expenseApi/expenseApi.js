import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
    prepareHeaders: (headers) => {
      const token = Cookies.get("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["expenseApi"],

  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (formData) => ({
        url: `expense/create`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["expenseApi"],
    }),
    getExpense: builder.query({
      query: () => ({
        url: "expense/list",
        method: "GET",
      }),
      providesTags: ["expenseApi"],
    }),
    getDetailExpense: builder.query({
      query: (id) => ({
        url: `expense/details/${id}`,
        method: "GET",
      }),
      providesTags: ["expenseApi"],
    }),
    editExpense: builder.mutation({
      query: (payload) => ({
        url: `expense/update/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["expenseApi"],
    }),
    deleteExpense: builder.mutation({
      query: (id) => ({
        url: `expense/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expenseApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {expenseApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["expenseApi"],
    // }),
  }),
});

export const {
  useGetExpenseQuery,
  useCreateExpenseMutation,
  useEditExpenseMutation,
  useDeleteExpenseMutation,
  useGetDetailExpenseQuery,
} = expenseApi;
