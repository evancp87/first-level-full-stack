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
      userInfo: {},
      error: null,
      token: null,
    };

export const loggedInUser = createAsyncThunk(
  "users/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await loginUser(credentials);
      return response;
    } catch (error) {
      console.log("There was an error:", error);
      return thunkAPI.rejectWithValue(error);
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
      throw Error("Registration failed, please try again");
    }
  }
);

export const logoutUser = createAsyncThunk("users/logout", async () => {
  try {
    const response = await logout();
    return response;
  } catch (error) {
    console.log("There was an error:", error);
    throw Error("Registration failed, please try again");
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
        console.log(action.error.message);
        state.loading = false;

        state.error = action.payload;
        state.token = null;
        state.userInfo = null;
      })
      .addCase(loggedInUser.fulfilled, (state, action) => {
        console.log(action.payload);
        state.loading = false;
        state.isAuth = true;
        state.userInfo = action.payload.userInfo;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(setUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        console.log(action.payload);
        const { userInfo, token } = action.payload.data;
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
