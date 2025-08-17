import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qualityApi = createApi({
  reducerPath: "qualityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,

  }),
  tagTypes: ["qualityApi"],
  endpoints: (builder) => ({
    getQuality: builder.query({
      query: () => ({
        url: `quality/list`,
        method: "GET",
      }),
      providesTags: ["qualityApi"],
    }),
    createQuality: builder.mutation({
      query: (formData) => ({
        url: "quality/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["qualityApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["qualityApi"],
    // }),
  }),
});

export const {useGetQualityQuery,useCreateQualityMutation} = qualityApi;