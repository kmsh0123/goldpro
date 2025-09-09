import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const typeApi = createApi({
  reducerPath: "typeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_ENDPOINT,

  }),
  tagTypes: ["typeApi"],
  endpoints: (builder) => ({
    getType: builder.query({
      query: () => ({
        // url: `/type/list?page=${page}`,
        url: `/type/list`,
        method: "GET",
      }),
      providesTags: ["typeApi"],
    }),
    createType: builder.mutation({
      query: (formData) => ({
        url: "type/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["typeApi"],
    }),
    updateType: builder.mutation({
      query: ({id,formData}) => ({
        url: `type/update/${id}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["typeApi"],
    }),

    deleteType: builder.mutation({
      query: (id) => ({
        url: `type/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["typeApi"],
    }),

    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {productApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["typeApi"],
    // }),
  }),
});

export const {useGetTypeQuery,useCreateTypeMutation,useUpdateTypeMutation,useDeleteTypeMutation} = typeApi;

