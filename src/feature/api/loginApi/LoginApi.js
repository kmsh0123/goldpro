import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const LoginApi = createApi({
    reducerPath:"LoginApi",
    baseQuery:fetchBaseQuery({baseUrl:
        import.meta.env.VITE_API_ENDPOINT
    }),
    tagTypes:["LoginApi"],

    endpoints:(builder) => ({
        // register:builder.mutation({
        //     query:(data) => ({
        //         url : "register",
        //         method : "POST",
        //         body : data
        //     }),
        //     invalidatesTags:["LoginApi"],
        // }),
        login:builder.mutation({
            query:(formData) => ({
                url : "login",
                method : "POST",
                body : formData
            }),
            invalidatesTags:["LoginApi"],
        }),
        logout:builder.mutation({
            query:(token) => ({
                url : "logout",
                method : "POST",
                headers : {authorization : `Bearer ${token}`}
            }),
            invalidatesTags:["LoginApi"]
        }),
        // changePassword:builder.mutation({
        //     query:({token,formData}) => ({
        //         url : "auth/change-password",
        //         method : "POST",
        //         body : formData,
        //         headers : {authorization : `Bearer ${token}`}
        //     }),
        //     invalidatesTags:["LoginApi"]
        // }),

    
    })
})
export const {useLoginMutation,useLogoutMutation} = LoginApi;