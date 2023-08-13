import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { register, loginUser, logout } from "../../utils/data";

// gets jwt from localStorage on logging in
const token = localStorage.getItem("token")
  ? localStorage.getItem("token")
  : null;

const initialState = {
  loading: false,
  isAuth: false,
  userInfo: {},
  error: null,
  token,
};

export const loggedInUser = createAsyncThunk(
  "users/login",
  async (credentials) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error) {
      console.log("There was an error:", error);
      throw Error;
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
      console.log("There was an error:", error);
      throw Error;
    }
  }
);

export const logoutUser = createAsyncThunk("users/logout", async () => {
  try {
    const response = await logout();
    return response;
  } catch (error) {
    console.log("There was an error:", error);
    throw Error;
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
      .addCase(loggedInUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.isAuth = true;
        state.userInfo = action.payload.userInfo;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.token = null;
        state.userInfo = null;
      })
      .addCase(setUser.pending, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.userInfo = action.payload.userInfo;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, () => {
        localStorage.removeItem("token");
        return initialState;
      });
  },
});

export const selectLoggedInState = (state) => state.users;

export default usersSlice.reducer;
