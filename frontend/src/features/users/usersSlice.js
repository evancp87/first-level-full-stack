import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { register, loginUser, logout } from "../../utils/data";

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

// TODO: make async
export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // login: (state, action) => {
    //   const loggedInUser = {
    //     isLoggedIn: true,
    //     firstName: action.payload,
    //     lastName: action.payload,
    //     password: action.payload,
    //     email: action.payload,
    //   };
    //   state.value = loggedInUser;
    // },
    // logout: (state) => {
    //   return initialState;
    // },
    // register: (state, action) => {
    //   const newUser = {
    //     isLoggedIn: true,
    //     firstName: action.payload,
    //     lastName: action.payload,
    //     password: action.payload,
    //     email: action.payload,
    //   };
    //   state.value = newUser;
    // },
  },
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
        // state.token = token;
        state.token = action.payload.token;
      })
      .addCase(loggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setUser.pending, (state, action) => {
        // const { firstName, lastName, email, token } = action.payload;

        // const newUser = {
        //   isLoggedIn: true,
        //   firstName,
        //   lastName,
        //   token: token,
        //   email,
        // };

        // state.value = newUser;

        state.loading = false;
        state.error = null;
      })
      .addCase(setUser.rejected, (state, action) => {
        // const { firstName, lastName, email, token } = action.payload;

        // const newUser = {
        //   isLoggedIn: true,
        //   firstName,
        //   lastName,
        //   token,
        //   email,
        // };

        // state.value = newUser;

        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setUser.fulfilled, (state, action) => {
        // const { firstName, lastName, email, token } = action.payload;

        // const newUser = {
        //   isLoggedIn: true,
        //   firstName,
        //   lastName,
        //   token,
        //   email,
        // };

        // state.value = newUser;
        state.isAuth = true;
        state.userInfo = action.payload.userInfo;
        state.token = action.payload.token;
        state.loading = false;
      })
      .addCase(logoutUser.fulfilled, () => {
        return initialState;
      });
  },
});

// export const { login, logout } = usersSlice.actions;

export const selectLoggedInState = (state) => state.users;

export default usersSlice.reducer;
