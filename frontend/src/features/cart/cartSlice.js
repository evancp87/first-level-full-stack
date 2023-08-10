import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sumItems } from "../../utils/helpers";
import {
  getCartItems,
  // addToCart,
  clearCart,
  // removeFromCart,
} from "../../utils/data";
const initialState = {
  items: [],
  count: 1,
  ...sumItems([]),
  total: 0,
};

// export const getItems = createAsyncThunk("cart/getItems", async () => {
//   try {
//     const response = await getCartItems();
//     return response;
//   } catch (error) {
//     console.log("There was an error:", error);
//   }
// });

// export const add = createAsyncThunk("cart/addToCart", async () => {
//   try {
//     const response = await addToCart();
//     return response;
//   } catch (error) {
//     console.log("There was an error:", error);
//   }
// });

// export const remove = createAsyncThunk("cart/remove", async () => {
//   try {
//     const response = await removeFromCart();
//     return response;
//   } catch (error) {
//     console.log("There was an error:", error);
//   }
// });
// export const clear = createAsyncThunk("cart/clear", async () => {
//   try {
//     const response = await clearCart();
//     return response;
//   } catch (error) {
//     console.log("There was an error:", error);
//   }
// });

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { id } = action.payload;
      // if existing item in basket and added again, increment the item quantity
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }

      state.total = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      state.count = state.items.reduce((total, item) => total + item.price, 0);
    },

    removeFromCart: (state, action) => {
      const indexOf = state.items.findIndex(
        (item) => item.id === action.payload
      );
      state.items.splice(indexOf, 1);
      state.count -= 1;
    },

    clear: () => {
      return { ...initialState };
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase().addCase().addCase();
  // },
});

export const { removeFromCart, addToCart, clear } = cartSlice.actions;

export const selectEmpty = (state) => state.cart.empty;
export const selectItems = (state) => state.cart.items;
export const selectCount = (state) => state.cart.count;
export const selectTotal = (state) => state.cart.total;

export default cartSlice.reducer;
