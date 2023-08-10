import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import wishlistsSlice from "../favorites/wishlistsSlice";
import {
  wishlists,
  singleWishlist,
  createWishlist,
  deleteWishlist,
  updateWishlist,
  addGamesOnWishlist,
} from "../../utils/data";

const initialState = {
  wishlists: [],
  wishlist: {},
  gamesOnWishlist: [],
};

export const setWishlists = createAsyncThunk(
  "wishlist/setWishlists",
  async (userId) => {
    try {
      const response = await wishlists(userId);
      console.log(
        "the wishlist responses are:",
        response,
        "and the id is",
        userId
      );
      return response;
    } catch (error) {
      console.log("There was an error", error);
      throw new Error(error);
    }
  }
);

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async () => {
    try {
      const response = await singleWishlist();
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }
);

export const addWishlist = createAsyncThunk(
  "wishlist/addWishlist",
  async (credentials) => {
    console.log(credentials);
    try {
      const response = await createWishlist(credentials);
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }
);

export const removeWishlist = createAsyncThunk(
  "wishlist/removeWishlist",
  async () => {
    try {
      const response = await deleteWishlist();
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }
);

export const update = createAsyncThunk("wishlist/update", async () => {
  try {
    const response = await updateWishlist();
    return response;
  } catch (error) {
    console.log("There was an error", error);
  }
});

export const addGamesToWishlist = createAsyncThunk(
  "wishlist/addGame",
  async (
    // token, wishlistId, gameSlug, userId
    gameToAdd
  ) => {
    try {
      const response = await addGamesOnWishlist(
        // token,
        // wishlistId,
        // gameSlug,
        // userId
        gameToAdd
      );
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }
);

const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setWishlists.fulfilled, (state, action) => {
        state.wishlists = action.payload;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(addWishlist.fulfilled, (state, action) => {
        console.log("Doing some checks", action.payload, action.payload.data);
        state.wishlists = [...state.wishlists, action.payload.data];
      })
      .addCase(removeWishlist.fulfilled, (state, action) => {
        // const index = state.wishlists.indexOf(action.payload);
        // const wishlistToRemove = state.wishlists[index];
        // const updatedList = state.wishlists.splice(wishlistToRemove, 1);
        // state.wishlists = updatedList;

        state.wishlists = state.wishlists.filter(
          (wishlist) => wishlist.id !== action.payload.id
        );
      })
      .addCase(update.fulfilled, (state, action) => {
        state.wishlists = action.payload;
      })
      .addCase(addGamesToWishlist.fulfilled, (state, action) => {
        state.gamesOnWishlist = [...state.gamesOnWishlist, action.payload];
      });
  },
});

export const selectWishlists = (state) => state.wishlists.wishlists;
export const selectGamesOnWishlist = (state) => state.gamesOnWishlist;

export default wishlistsSlice.reducer;
