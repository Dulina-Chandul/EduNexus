import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if(typeof window !== "undefined" && window.localStorage){
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "light";
  }

  return "light"
}

const initialState = {
  mode: getInitialTheme(),
};
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.mode === "light" ? "dark" : "light";
      state.mode = newTheme;
    if(typeof window !== "undefined" && window.localStorage){
      localStorage.setItem("theme", newTheme);
    }
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      if(typeof window !== "undefined" && window.localStorage){
        localStorage.setItem("theme", action.payload);
      }
    },
  },
});
export const { toggleTheme, setTheme } = themeSlice.actions;
const themeReducer = themeSlice.reducer;
export default themeReducer;
