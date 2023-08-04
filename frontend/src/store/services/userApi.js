import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API_URL = "http://localhost:6001/";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
  }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
      query: ({ firstName, lastName, email, password }) => ({
        url: "users/register",
        method: "POST",
        body: { firstName, lastName, email, password },
      }),
    }),
    loginUser: builder.mutation({
      query: ({ email, password }) => ({
        url: "users/login",
        method: "POST",
        body: { email, password },
      }),
    }),
  }),
});

export const { useCreateUserMutation, useLoginUserMutation } = userApi;
