import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlices";

//* Create a Redux store with the auth slice reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
