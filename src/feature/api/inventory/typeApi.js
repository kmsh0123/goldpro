import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const typeApi = createApi({
  reducerPath: "typeApi",
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
  tagTypes: ["typeApi"],
  endpoints: (builder) => ({
    getType: builder.query({
      query: (search) => ({
        // url: `/type/list?limit=${limit}&skip=${skip}`,
        url: `/type/list`,
        method: "GET",
      }),
      providesTags: ["typeApi"],
    }),
    getDetailType: builder.query({
      query: (id) => ({
        // url: `/type/list?page=${page}`,
        url: `/type/details/${id}`,
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
      query: ({ id, formData }) => ({
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

export const {
  useGetTypeQuery,
  useCreateTypeMutation,
  useUpdateTypeMutation,
  useDeleteTypeMutation,
  useGetDetailTypeQuery,
} = typeApi;
