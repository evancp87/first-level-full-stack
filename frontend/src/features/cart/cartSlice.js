import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { sumItems } from "../../utils/helpers";
import {
  getCartItems,
  addGameToCart,
  clearCart,
  removeItem,
} from "../../utils/data";
const initialState = {
  items: {
    results: [],
    finalTotal: {
      total: 0,
    },
  },
  count: 1,
  ...sumItems([]),
  total: 0,
};

// async thunks for cart actions
export const getItems = createAsyncThunk(
  "cart/getItems",
  async (customerId) => {
    try {
      const response = await getCartItems(customerId);
      return response;
    } catch (error) {
      console.log("There was an error:", error);
      throw error;
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ customerId, gameId, price }) => {
    try {
      const response = await addGameToCart({ customerId, gameId, price });
      if (response.message === "This game is not yet available for purchase") {
        throw new Error(response.message);
      }
      return response;
    } catch (error) {
      console.log("There was an error:", error);
      throw new Error("Game not yet available for purchase");
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ gameId, customerId, price, cartId, quantity }) => {
    try {
      const response = await removeItem({
        gameId,
        customerId,
        price,
        cartId,
        quantity,
      });
      return response;
    } catch (error) {
      console.log("There was an error:", error);
      throw error;
    }
  }
);
export const clear = createAsyncThunk("cart/clear", async (customerId) => {
  try {
    const response = await clearCart(customerId);
    return response;
  } catch (error) {
    console.log("There was an error:", error);
    throw error;
  }
});

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getItems.fulfilled, (state, action) => {
        state.items.results = action.payload.results;
        state.items.finalTotal.total = action.payload.finalTotal.total;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { gameId } = action.payload.gameDetails[0];

        // if existing item in basket and added again, increment the item quantity

        const itemsArray = current(state.items.results);

        const existingItem = Array.from(itemsArray).findIndex(
          (item) => item.gameId === gameId
        );

        if (existingItem >= 0) {
          // Create a new array with the updated item
          state.items.results = itemsArray.map((item, index) => {
            if (index !== existingItem) {
              return item;
            }

            return {
              ...item,
              quantity: item.quantity + 1,
            };
          });
        } else {
          const { gameDetails } = action.payload;

          state.items?.results?.push({
            ...gameDetails[0],
            quantity: 1,
          });
        }
        state.items.finalTotal.total = action.payload.total;
        state.count = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        const indexOf = state.items.results.findIndex(
          (item) => item.id === action.payload
        );
        state.items.results.splice(indexOf, 1);
        state.count -= 1;
        state.items.finalTotal.total = action.payload.total;
      })
      .addCase(clear.fulfilled, () => {
        return { ...initialState };
      });
  },
});

export const selectEmpty = (state) => state.cart.empty;
export const selectItems = (state) => state.cart.items;
export const selectCount = (state) => state.cart.count;
export const selectTotal = (state) => state.cart.total;

export default cartSlice.reducer;
