import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs, setJobs } from '../Redux/Reducers/jobSlice';
import {toast} from 'react-toastify' 
import { updateCandidateSavedJobs } from '../Redux/Reducers/authSlice';


export const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();
  const recruiterId = useSelector((state) => state.auth.recruiterProfile?._id)
  const candidate = useSelector(state => state.auth.candidateProfile);

  // save jobs
  const handleToggleSave = async (jobId) => {
    if (!user || user.role !== 'candidate') return;
  
    try {
      const res = await axios.post(`http://localhost:4000/api/candidate/save-job/${jobId}`, {
        candidateId: candidate._id,
      });
  
      if (res.data.success) {
        dispatch(updateCandidateSavedJobs(res.data.savedJobs));
  
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message || "Failed to update saved jobs.");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast.error("Error saving job.");
    }
  };

  // fetch all jobs
  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:4000/api/job`);
      if (res.data.success) {
        dispatch(setAllJobs(res.data.jobs));
        const recruiterJob = res.data.jobs.filter((job) => recruiterId === job.createdBy)
        dispatch(setJobs(recruiterJob))
      }
    } catch (err) {
      setError('Error fetching all jobs');
      console.error("Error fetching all jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobContext.Provider value={{ fetchAllJobs, handleToggleSave, loading, error }}>
      {children}
    </JobContext.Provider>
  );
};
