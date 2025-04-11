import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  recruiterProfile: null,
  candidateProfile: null,
  profileComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, clerkId, email, role, profileImage, name, profileComplete, profile } = action.payload;

      state.user = { _id, clerkId, email, role, profileImage, name };

      if (role === "recruiter") {
        state.recruiterProfile = profile;
      } else if (role === "candidate") {
        state.candidateProfile = profile;
      }

      state.profileComplete = profileComplete || false;
    },
    logout: (state) => {
      state.user = null;
      state.profileComplete = false;
      state.recruiterProfile = null;
      state.candidateProfile = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
