import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  wishlists,
  singleWishlist,
  createWishlist,
  deleteWishlist,
  updateWishlist,
  addGamesOnWishlist,
  deleteSingleGameFromWishlist,
  listOfGamesWishlist,
} from "../../utils/data";

const initialState = {
  wishlists: [],
  wishlist: {},
  gamesOnWishlist: [],
  searchInput: "",
};

export const setWishlists = createAsyncThunk(
  "wishlist/setWishlists",
  async (userId) => {
    try {
      const response = await wishlists(userId);
      return response;
    } catch (error) {
      console.log("There was an error", error);
      throw new Error(error);
    }
  }
);

export const getGamesFromWishlist = createAsyncThunk(
  "wishlist/getGamesFromWishlist",
  async (wishlistIdentifier) => {
    try {
      const response = await listOfGamesWishlist(wishlistIdentifier);
      return response;
    } catch (error) {
      console.log("There was an error", error);
      throw new Error(error);
    }
  }
);

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (wishlistDetails) => {
    try {
      const response = await singleWishlist(wishlistDetails);
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
  async ({ id, token, userId }) => {
    try {
      const response = await deleteWishlist({ id, token, userId });
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
  async (gameToAdd) => {
    try {
      const response = await addGamesOnWishlist(gameToAdd);
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }
);

export const deleteGame = createAsyncThunk(
  "wishlist/deleteGame",
  async (gameToDelete) => {
    try {
      const response = await deleteSingleGameFromWishlist(gameToDelete);
      return response;
    } catch (error) {
      console.log("There was an error", error);
    }
  }
);

const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    search: (state, action) => {
      state.searchInput = action.payload;
    },
    reset: (state) => {
      state.searchInput = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setWishlists.fulfilled, (state, action) => {
        state.wishlists = action.payload;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(addWishlist.fulfilled, (state, action) => {
        const { wishlist } = action.payload.data;
        state.wishlists = [...state.wishlists, wishlist];
      })
      .addCase(removeWishlist.fulfilled, (state, action) => {
        const index = state.wishlists.findIndex(
          (wishlist) => wishlist.id === action.payload.data.id
        );

        const updatedList = [...state.wishlists];
        updatedList.splice(index, 1);
        state.wishlists = updatedList;
      })
      .addCase(update.fulfilled, (state, action) => {
        state.wishlists = action.payload;
      })
      .addCase(addGamesToWishlist.fulfilled, (state, action) => {
        state.gamesOnWishlist = [...state.gamesOnWishlist, action.payload];
      })
      .addCase(getGamesFromWishlist.fulfilled, (state, action) => {
        if (action.payload.length > 0) {
          state.gamesOnWishlist = action.payload;
        } else {
          state.gamesOnWishlist = [];
        }
      })

      .addCase(deleteGame.fulfilled, (state, action) => {
        const index = state.gamesOnWishlist.findIndex(
          (game) => game.id === action.payload.id
        );

        const updatedList = [...state.gamesOnWishlist];
        updatedList.splice(index, 1);
        state.gamesOnWishlist = updatedList;
      });
  },
});

export const { search, reset } = wishlistsSlice.actions;
export const selectWishlists = (state) => state.wishlists.wishlists;
export const selectGamesOnWishlist = (state) => state.wishlists.gamesOnWishlist;
export const selectSingleWishlist = (state) => state.wishlists.wishlist;
export const selectSearch = (state) => state.wishlists.searchInput;

export default wishlistsSlice.reducer;
