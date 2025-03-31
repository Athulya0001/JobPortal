import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, 
  profileComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { clerkId, email, role, profileComplete } = action.payload;
      state.user = { clerkId, email, role };
      state.profileComplete = profileComplete || false;
    },
    logout: (state) => {
      state.user = null;
      state.profileComplete = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;