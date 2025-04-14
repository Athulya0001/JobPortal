import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  jobs: [],        // recruiter-specific jobs
  allJobs: [],     // all jobs for guest/candidate view
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    addJob: (state, action) => {
      state.jobs.push(action.payload);
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(job => job._id === action.payload._id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    removeJob: (state, action) => {
      state.jobs = state.jobs.filter(job => job._id !== action.payload);
    },
    clearJobs: (state) => {
      state.jobs = [];
      state.allJobs = [];
    },
  },
});

export const { setJobs, setAllJobs, addJob, updateJob, removeJob, clearJobs } = jobSlice.actions;
export default jobSlice.reducer;
