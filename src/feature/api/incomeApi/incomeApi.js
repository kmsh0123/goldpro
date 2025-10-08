import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const incomeApi = createApi({
  reducerPath: "incomeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
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
         headers: {
          Accept: "application/json",
        },
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