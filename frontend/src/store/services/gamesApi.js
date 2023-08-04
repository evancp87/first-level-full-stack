import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// The base URL
const BASE_API_URL = "http://localhost:6001/";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API_URL,
  }),
  endpoints: (builder) => ({
    getAllGames: builder.query({
      query: () => "games",
    }),
    getPlatforms: builder.query({
      query: () => "games/platforms",
    }),
    getGenres: builder.query({
      query: () => "games/genres",
    }),
    getScreenshots: builder.query({
      query: (game_pk) => `games/screenshots/${game_pk}`,
    }),
    getSingleGame: builder.query({
      query: (slug) => `games/${slug}`,
    }),
    getTrailers: builder.query({
      query: (slug) => `games/trailers/${slug}`,
    }),
    getLatestGames: builder.query({
      query: () => `games/byDate`,
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
