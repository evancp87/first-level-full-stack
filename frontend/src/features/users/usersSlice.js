import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    uuid: "",
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    avatar: "",
} 
// export const setMedia = createAsyncThunk("show/media", async () => {
//   try {
//     const response = await getData();
//     return response;
//   } catch (error) {
//     console.log("Error fetching shows:", error);
//     throw error;
//   }
// });


export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    login: (state, action) => {
      return {
        value: {
          isAuth: true,
          uuid: action.payload,
          firstName: action.payload,
          lastName: action.payload,
          password: action.payload,
          email: action.payload,
        }
      }
    },
    logout: (state, ) => {
    return initialState;
    },
    
  },
  
});

export const {
 login,
 logout
} = usersSlice.actions;



export default usersSlice.reducer;
