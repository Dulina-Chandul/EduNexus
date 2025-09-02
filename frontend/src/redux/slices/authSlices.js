import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userAuth: null,
    role: "guest",
  },
  reducers: {
    isAuthenticated: (state, action) => {
      state.userAuth = action.payload;
    },
    logoutUser: (state) => {
      state.userAuth = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { isAuthenticated, logoutUser, setRole } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
