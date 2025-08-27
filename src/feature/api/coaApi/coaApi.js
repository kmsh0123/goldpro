import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const coaApi = createApi({
  reducerPath: "coaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
  }),
  tagTypes: ["coaApi"],

  endpoints: (builder) => ({
    createCoa: builder.mutation({
      query: (formData) => ({
        url: `chart_of_accounts/create`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["coaApi"],
    }),
    getCoa: builder.query({
      query: () => ({
        url: "chart_of_accounts/list",
        method: "GET",
      }),
      providesTags: ["coaApi"],
    }),
    editCoa: builder.mutation({
      query: (formData) => ({
        url: `chart_of_accounts/update/${id}`,
        method: "PUT",
        body : formData,
      }),
      invalidatesTags: ["coaApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {coaApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["coaApi"],
    // }),
  }),
});


export const {useCreateCoaMutation,useGetCoaQuery,useEditCoaMutation} = coaApi;