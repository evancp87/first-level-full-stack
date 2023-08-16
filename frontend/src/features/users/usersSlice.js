import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { register, loginUser, logout } from "../../utils/data";

// For sessions persistence, gets session from localStorage if they have store saved there, otherwise initial state is saved
// note that the localStorage is cleared on logging out in utils/data.js
const storedRedux = localStorage.getItem("reduxStore");

const initialState = storedRedux
  ? JSON.parse(storedRedux)
  : {
      loading: false,
      isAuth: false,
      userInfo: null,
      error: null,
      token: null,
    };

export const loggedInUser = createAsyncThunk(
  "users/login",
  async (credentials) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error) {
      throw new Error("There was an error logging in, please try again");
    }
  }
);

export const setUser = createAsyncThunk(
  "users/setUser",
  async (credentials) => {
    try {
      const response = await register(credentials);
      return response;
    } catch (error) {
      // console.log("There was an error:", error);
      throw new Error("Registration failed, please try again");
    }
  }
);

export const logoutUser = createAsyncThunk("users/logout", async () => {
  try {
    const response = await logout();
    return response;
  } catch (error) {
    // console.log("There was an error:", error);
    throw new Error("Registration failed, please try again");
  }
});

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loggedInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.token = null;
        state.userInfo = null;
      })
      .addCase(loggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuth = true;
        state.userInfo = action.payload.userInfo || null;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(setUser.pending, (state, action) => {
        console.log(action.payload);
        state.loading = true;
        state.error = null;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.token = null;
        state.userInfo = null;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        console.log(action.payload);
        const { userInfo, token } = action.payload || {};
        state.isAuth = true;
        state.userInfo = userInfo;
        state.token = token;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("reduxStore");
        (state.isAuth = false),
          (state.loading = false),
          (state.isAuth = false),
          (state.userInfo = {}),
          (state.error = null),
          (state.token = null);
      });
  },
});

export const selectLoggedInState = (state) => state.users;

export default usersSlice.reducer;
