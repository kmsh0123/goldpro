import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const expenseCategoryApi = createApi({
  reducerPath: "expenseCategoryApi",
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
}

  }),
  tagTypes: ["expenseCategoryApi"],

  endpoints: (builder) => ({
    createExpenseCategory: builder.mutation({
      query: (formData) => ({
        url: `expense/category/create`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["expenseCategoryApi"],
    }),
    getExpenseCategory: builder.query({
      query: () => ({
        url: "expense/category/list",
        method: "GET",
      }),
      providesTags: ["expenseCategoryApi"],
    }),
     getDetailExpenseCategory: builder.query({
      query: (id) => ({
        url: `expense/category/details/${id}`,
        method: "GET",
      }),
      providesTags: ["expenseCategoryApi"],
    }),
    editExpenseCategory: builder.mutation({
      query: ({formData,id}) => ({
        url: `expense/category/update/${id}`,
        method: "PUT",
        body : formData,
      }),
      invalidatesTags: ["expenseCategoryApi"],
    }),
    deleteExpenseCategory: builder.mutation({
      query: (id) => ({
        url: `expense/category/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["expenseCategoryApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {expenseApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["expenseCategoryApi"],
    // }),
  }),
});


export const {useCreateExpenseCategoryMutation,useGetExpenseCategoryQuery,useEditExpenseCategoryMutation,useDeleteExpenseCategoryMutation,useGetDetailExpenseCategoryQuery} = expenseCategoryApi;