import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// The base URL
const BASE_API_URL = "http://localhost:6001/";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
  }),
  endpoints: (builder) => ({
    getCartItems: builder.query({
      query: () => "media",
    }),
    createCart: builder.mutation({
      query: (newMedia) => ({
        url: "cart/",
        method: "POST",
        body: newMedia,
      }),
    }),
    addToCart: builder.mutation({
      query: (id) => ({
        url: "cart/",
        method: "POST",
        body: id,
      }),
    }),
    clearCart: builder.mutation({
      query: ({ cartId }) => ({
        url: `cart/${cartId}`,
        method: "DELETE",
      }),
    }),
    removeFromCart: builder.mutation({
      query: ({ gameId, cartId }) => ({
        url: `cart/${gameId}/${cartId}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Exporting the generated hooks for usage in components
export const {
  useGetCartItemsQuery,
  useCreateCartMutation,
  useAddToCartMutation,
  useClearCartMutation,
  useRemoveFromCartMutation,
} = mediaApi;
