import UpdateQuality from "@/pages/dashboard/inventory/Quality/UpdateQuality";
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
    getDetailQuality: builder.query({
      query: (id) => ({
        url: `quality/details/${id}`,
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
    UpdateQuality: builder.mutation({
      query: ({id,formData}) => ({
        url: `quality/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["qualityApi"],
    }),

    deleteQuality: builder.mutation({
      query: (id) => ({
        url: `quality/delete/${id}`,
        method: "DELETE",
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

export const {
  useGetQualityQuery,
  useCreateQualityMutation,
  useUpdateQualityMutation,
  useDeleteQualityMutation,
  useGetDetailQualityQuery
} = qualityApi;
