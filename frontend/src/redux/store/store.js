import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlices";
import themeReducer from "../slices/themeSlices";

//* Create a Redux store with the auth slice reducer
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
  },
});
