import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const damageApi = createApi({
  reducerPath: "damageApi",
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
  tagTypes: ["damageApi"],
  endpoints: (builder) => ({
    getDamage: builder.query({
      query: () => ({
        url: `damage/return/list`,
        method: "GET",
      }),
      providesTags: ["damageApi"],
    }),
    createDamage: builder.mutation({
      query: (formData) => ({
        url: "damage/return/create",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["damageApi"],
    }),
    // logout: builder.mutation({
    //   query: (token) => ({
    //     url: "/user-logout",
    //     method: "POST",
    //     headers: {dammageApiorization : `Bearer ${token}`}
    //   }),
    //   invalidatesTags: ["damageApi"],
    // }),
  }),
});

export const { useGetDamageQuery, useCreateDamageMutation } = damageApi;
