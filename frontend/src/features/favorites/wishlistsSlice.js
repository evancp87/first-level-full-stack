import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getGames, getGamesByDate } from "../../utils/data";

const initialState = {
  wishlists: [],
  wishlist: {},
};

// getting main list of games
export const setGames = createAsyncThunk("games/setGames", async () => {
  try {
    const response = await getGames();
    return response;
  } catch (error) {
    console.log("Error fetching games:", error);
    throw error;
  }
});

// getting upcoming games
export const setGamesByDate = createAsyncThunk(
  "games/setGamesDate",
  async ({ startDate, endDate }) => {
    try {
      const response = await getGamesByDate(startDate, endDate);

      return response;
    } catch (error) {
      console.log("Error fetching games:", error);
      throw error;
    }
  }
);

export const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    getWishlists: (state, action) => {
      state.wishlists = action.payload;
    },
    getSingleWishlist: (state, action) => {},
    gameLikes: (state, action) => {
      const indexOfLike = state.games.findIndex(
        (game) => game.id === action.payload
      );
      const updatedGame = {
        ...state.games[indexOfLike],
        liked: !state.games[indexOfLike].liked,
      };
      state.games[indexOfLike] = updatedGame;

      //   to ensure that the changes are reflected in different components
      const highest = state.games.filter((game) => game.rating >= 4.5);
      const topTen = highest.slice(0, 10);
      state.allTimeBest = topTen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setGames.fulfilled, (state, action) => {
        state.games = action.payload;
      })
      .addCase(setGamesByDate.fulfilled, (state, action) => {
        state.newlyReleasedGames = action.payload;
      });
  },
});

export const { getWishlists, getSingleWishlist } = wishlistsSlice.actions;

export default wishlistsSlice.reducer;
