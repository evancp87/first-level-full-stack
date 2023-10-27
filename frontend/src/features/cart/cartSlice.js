import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sumItems } from "../../utils/helpers";
import {
  getCartItems,
  addGameToCart,
  clearCart,
  removeItem,
  // decrementItemQuantity,
  // incrementItemQuantity,
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

// To be implemented at a later date

export const getItems = createAsyncThunk(
  "cart/getItems",
  async (customerId) => {
    try {
      const response = await getCartItems(customerId);
      console.log("checking the response", response);
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
    console.log("checking details", customerId, gameId, price);
    try {
      const response = await addGameToCart({ customerId, gameId, price });
      return response;
    } catch (error) {
      console.log("There was an error:", error);
      throw error;
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async ({ gameId, customerId, price, cartId }) => {
    try {
      const response = await removeItem({
        gameId,
        customerId,
        price,
        cartId,
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
// export const increment = createAsyncThunk("cart/increment", async () => {
//   try {
//     const response = await incrementItemQuantity();
//     return response;
//   } catch (error) {
//     console.log("There was an error:", error);
//   }
// });
// export const decrement = createAsyncThunk("cart/decrement", async () => {
//   try {
//     const response = await decrementItemQuantity();
//     return response;
//   } catch (error) {
//     console.log("There was an error:", error);
//   }
// });

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // addToCart: (state, action) => {
    //   const { id } = action.payload;
    //   // if existing item in basket and added again, increment the item quantity
    //   const existingItem = state.items.find((item) => item.id === id);
    //   if (existingItem) {
    //     existingItem.quantity += 1;
    //   } else {
    //     state.items.push({
    //       ...action.payload,
    //       quantity: 1,
    //     });
    //   }
    //   state.total = action.payload;
    //   state.count = action.payload;
    // },
    // removeFromCart: (state, action) => {
    //   const indexOf = state.items.findIndex(
    //     (item) => item.id === action.payload
    //   );
    //   state.items.splice(indexOf, 1);
    //   state.count -= 1;
    // },
    // clear: () => {
    //   return { ...initialState };
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const { id } = action.payload;

        console.log("a check here", id);
        console.log("a check here", action.payload);

        // if existing item in basket and added again, increment the item quantity
        const existingItem = state.items?.results?.find(
          (item) => item.gameId === id
        );

        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          console.log("checkling the new added item", action.payload);
          const { gameDetails } = action.payload;
          console.log("checking the game details", gameDetails);
          console.log("checking the game details", gameDetails[0]);

          state.items?.results?.push({
            ...gameDetails[0],
            quantity: 1,
          });
        }
        state.items.finalTotal.total = action.payload.total;
        console.log("checking the total", action.payload.total);
        console.log("checking the payload", action.payload);

        console.log("checking the total hre", state.items.finalTotal.total);
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
    // .addCase(increment.fulfilled, (state, action) => {
    //   state.items = action.payload;
    // })
    // .addCase(decrement.fulfilled, (state, action) => {
    //   state.items = action.payload;
    // });
  },
});

// export const { removeFromCart, addToCart, clear } = cartSlice.actions;

export const selectEmpty = (state) => state.cart.empty;
export const selectItems = (state) => state.cart.items;
export const selectCount = (state) => state.cart.count;
export const selectTotal = (state) => state.cart.total;

export default cartSlice.reducer;
