import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const incomeApi = createApi({
  reducerPath: "incomeApi",
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
  tagTypes: ["incomeApi"],

  endpoints: (builder) => ({
    createIncome: builder.mutation({
      query: (formData) => ({
        url: `income/create`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["incomeApi"],
    }),
    getIncome: builder.query({
      query: () => ({
        url: "income/list",
        method: "GET",
      }),
      providesTags: ["incomeApi"],
    }),
    editIncome: builder.mutation({
      query: (payload) => ({
        url: `income/update/${payload?.id}`,
        method: "PUT",
        body : payload,
      }),
      invalidatesTags: ["incomeApi"],
    }),
    deleteIncome: builder.mutation({
      query: (id) => ({
        url: `income/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["incomeApi"],
    }),
    getDetailIncome: builder.query({
      query: (id) => ({
        url: `income/details/${id}`,
        method: "GET",
      }),
      providesTags: ["incomeApi"],
    }),
  }),
});


export const {useCreateIncomeMutation,useGetDetailIncomeQuery,useGetIncomeQuery,useDeleteIncomeMutation,useEditIncomeMutation} = incomeApi;