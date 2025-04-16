import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setAllJobs, setJobs } from '../Redux/Reducers/jobSlice';

export const JobContext = createContext();

export const JobProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const recruiterId = useSelector((state) => state.auth.recruiterProfile?._id)

    const fetchAllJobs = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`http://localhost:4000/api/job`);
          if (res.data.success) {
            dispatch(setAllJobs(res.data.jobs));
            const recruiterJob = res.data.jobs.filter((job)=>recruiterId===job.createdBy)
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
        <JobContext.Provider value={{ fetchAllJobs, loading, error }}>
            {children}
        </JobContext.Provider>
    );
};
