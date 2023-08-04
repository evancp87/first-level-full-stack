import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// The base URL
const BASE_API_URL = "http://localhost:6001/";

export const wishlistApi = createApi({
  reducerPath: "wishlist",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
  }),
  endpoints: (builder) => ({
    getWishlists: builder.query({
      query: () => "wishlist",
    }),
    getSingleWishlist: builder.query({
      query: (id) => `wishlist/${id}`,
    }),
    createWishlist: builder.mutation({
      query: (wishlist) => ({
        url: "wishlist",
        method: "POST",
        body: wishlist,
      }),
    }),
    addGameToWishlist: builder.mutation({
      query: (game) => ({
        url: "wishlist/add",
        method: "POST",
        body: game,
      }),
    }),
    updateWishlist: builder.mutation({
      query: (wishlist) => ({
        url: "media/add",
        method: "PATCH",
        body: wishlist,
      }),
    }),
    deleteWishlist: builder.mutation({
      query: (wishlist) => ({
        url: "media/add",
        method: "PATCH",
        body: wishlist,
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
} = wishlistApi;
