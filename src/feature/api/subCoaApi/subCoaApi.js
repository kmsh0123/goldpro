import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subCoaApi = createApi({
  reducerPath: "subCoaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,
  }),
  tagTypes: ["subCoaApi"],

  endpoints: (builder) => ({
    createSubCoa: builder.mutation({
      query: (formData) => ({
        url: `sub_coas/create`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["subCoaApi"],
    }),
    getSubCoa: builder.query({
      query: () => ({
        url: "sub_coas/list",
        method: "GET",
      }),
      providesTags: ["subCoaApi"],
    }),
    EditSubCoa: builder.mutation({
      query: (formData) => ({
        url: `sub_coas/edit`,
        method: "POST",
        body : formData,
      }),
      invalidatesTags: ["subCoaApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {subCoaApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["subCoaApi"],
    // }),
  }),
});


export const {useCreateSubCoaMutation,useGetSubCoaQuery} = subCoaApi;